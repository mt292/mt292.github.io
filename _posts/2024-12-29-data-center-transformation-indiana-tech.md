---
layout: post
title: "Data Center Transformation: Overhauling Indiana Tech's Student Infrastructure"
date: 2024-12-29 14:00:00 -0500
categories: [Infrastructure, Projects]
tags: [data-center, proxmox, networking, cable-management, infrastructure, hands-on]
description: "How a 'quick one-hour' server maintenance task turned into a 10-hour complete overhaul of Indiana Tech's student data center, transforming a messy storage room into a professional-grade infrastructure foundation."
image: datacenter.jpeg
toc: true
math: false
---

## The "Quick One-Hour Task"

You know how it goes in IT: "This should only take an hour..."

Last week, what started as a simple server maintenance task at Indiana Institute of Technology turned into a **10-hour complete overhaul** of the student data center in the Zollner Engineering building.

And honestly? It was one of the most satisfying projects I've worked on.

## The Before: A Data Center in Name Only

The space had been largely neglected, with:

- **Old, unused hardware** taking up rack space
- **Cable chaos**: Loose cabling everywhere, zero cable management
- **Rack doors that wouldn't shut** due to cables
- **Underutilized computing power**: Serious hardware just sitting idle
- **No organization**: Equipment scattered across multiple racks
- **Nearly half a petabyte of unused storage** collecting dust

The only things actively running were two Indiana Tech Cyber Warriors Proxmox nodes—and even those weren't properly configured or managed.

## The Decision: Fix It Right

Standing there looking at the mess, Avery Hughes and I had a choice:
1. Do the quick fix and leave
2. Take everything offline and do it right

We chose option 2.

## The 10-Hour Marathon

### Hour 1-2: Assessment & Planning

First, we needed to understand what we had:

```
Inventory Results:
├── Proxmox Nodes
│   ├── 2x existing Cyber Warriors nodes
│   └── 3x potential nodes (unused hardware)
├── Storage Arrays
│   ├── Total capacity: ~500TB
│   └── Currently used: <5%
├── Networking Equipment
│   ├── Multiple unmanaged switches
│   ├── 1x Cisco managed switch
│   └── 1x MikroTik router
├── Servers
│   ├── 2x production (running courses)
│   ├── 5x decommissioned (to be wiped)
│   └── 3x available for repurpose
└── Misc Hardware
    ├── UPS units (some functional)
    ├── Old monitors
    └── Cables (lots of cables)
```

**Plan:**
1. Consolidate Cyber Warriors infrastructure into one clean rack
2. Set up dedicated Proxmox infrastructure for the new Cybersecurity Club
3. Fix the production server (used in courses)
4. Organize networking gear
5. Cable management everything
6. Document it all

### Hour 3-4: Taking Everything Offline

The scary part: shutting everything down.

```bash
# Shutdown checklist
1. Notify stakeholders ✓
2. Snapshot all VMs ✓
3. Document current configurations ✓
4. Graceful shutdown of VMs ✓
5. Shutdown Proxmox nodes ✓
6. Power down networking gear ✓
7. Label EVERYTHING ✓
```

**Critical lesson**: Label cables BEFORE you unplug them. We learned this the hard way with the Cisco switch uplinks.

### Hour 5-6: Physical Infrastructure Work

#### Rack Reorganization

**Cyber Warriors Rack (Main):**
```
┌─────────────────────────────────┐
│      1U: Network Patch Panel    │
├─────────────────────────────────┤
│     2U: Cisco Switch (Mgmt)     │
├─────────────────────────────────┤
│    3-4U: MikroTik Router + UPS  │
├─────────────────────────────────┤
│    5-8U: Proxmox Node 1 (Main)  │
├─────────────────────────────────┤
│   9-12U: Proxmox Node 2 (Main)  │
├─────────────────────────────────┤
│  13-16U: Storage Array (Ceph)   │
├─────────────────────────────────┤
│  17-20U: Spare/Future Expansion │
└─────────────────────────────────┘
```

**Cybersecurity Club Rack (New):**
```
┌─────────────────────────────────┐
│      1U: Network Switch         │
├─────────────────────────────────┤
│    2-5U: Proxmox Node (Club)    │
├─────────────────────────────────┤
│   6-9U: Storage (VM Images)     │
├─────────────────────────────────┤
│  10-11U: Lab Equipment          │
├─────────────────────────────────┤
│  12-20U: Available for Growth   │
└─────────────────────────────────┘
```

#### Cable Management

This was the most time-consuming but most satisfying part.

**Principles we followed:**
1. **Color coding**: 
   - Blue = Management network
   - Green = Production network
   - Yellow = Storage network
   - Red = Public/Internet
   
2. **Proper cable lengths**: No more 10-foot cables for 1-foot runs

3. **Velcro everything**: Cable ties damage cables; Velcro is reusable

4. **Service loops**: Leave slack for maintenance

5. **Documentation**: Label both ends of every cable

**Result**: Rack doors now close, and you can actually see what's connected to what.

### Hour 7-8: Network Configuration

#### Cisco Switch Configuration

```cisco
! Basic configuration
hostname datacenter-core-sw01
!
! Management VLAN
vlan 10
 name Management
!
! Production VLAN
vlan 20
 name Production
!
! Storage VLAN (Ceph)
vlan 30
 name Storage
!
! Uplink to Indiana Tech network
interface GigabitEthernet0/1
 description Uplink to Campus Network
 switchport mode trunk
 switchport trunk allowed vlan 10,20
!
! Proxmox Management Interfaces
interface range GigabitEthernet0/2-3
 description Proxmox Management
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast
!
! Storage Network (Ceph)
interface range GigabitEthernet0/10-12
 description Ceph Storage Network
 switchport mode access
 switchport access vlan 30
 mtu 9000
!
! Enable jumbo frames for storage
system mtu jumbo 9000
```

#### MikroTik Router Configuration

```routeros
# VLANs
/interface vlan
add interface=ether1 name=vlan10-mgmt vlan-id=10
add interface=ether1 name=vlan20-prod vlan-id=20

# IP Addressing
/ip address
add address=10.10.10.1/24 interface=vlan10-mgmt
add address=10.10.20.1/24 interface=vlan20-prod

# NAT for production network
/ip firewall nat
add action=masquerade chain=srcnat out-interface=ether1

# Firewall rules
/ip firewall filter
add chain=forward connection-state=established,related action=accept
add chain=forward connection-state=invalid action=drop
add chain=forward in-interface=vlan20-prod action=accept
```

### Hour 9: Proxmox Configuration

#### Cyber Warriors Infrastructure

**Node 1 (Primary Workloads):**
```bash
# Storage configuration
pvesm add cephfs ceph-fs --path /mnt/pve/ceph-fs \
  --content vztmpl,iso,backup \
  --nodes node1,node2

# Network bridges
cat >> /etc/network/interfaces << EOF
auto vmbr1
iface vmbr1 inet manual
    bridge-ports none
    bridge-stp off
    bridge-fd 0
    # Management network

auto vmbr2
iface vmbr2 inet manual
    bridge-ports none
    bridge-stp off
    bridge-fd 0
    # Production network
EOF

# Restart networking
systemctl restart networking
```

**Node 2 (Inject Runs):**
- Dedicated to competition inject practice
- Isolated from main infrastructure
- Snapshot capabilities for rapid reset
- Doesn't affect production workloads during competitions

#### AD & LDAP Integration

```bash
# Configure Proxmox to authenticate against AD
pveum realm add ad --type ad \
  --domain cyberwarriors.local \
  --server 10.10.10.5 \
  --secure 1

# Test authentication
pveum user list
```

This means users can log into Proxmox with their domain credentials—no separate passwords to manage.

#### Cybersecurity Club Infrastructure

**Fresh Proxmox Installation:**
```bash
# Post-installation configuration
apt update && apt upgrade -y
apt install -y vim htop iotop tmux

# Configure storage
pvesm add dir local-vms --path /mnt/vms \
  --content images,rootdir

# Network configuration
# Connected to main network for internet
# Isolated VLAN for student VMs
```

**Template Creation:**

Created base templates for common course needs:
- Ubuntu 22.04 LTS (for Linux courses)
- Kali Linux (for security courses)
- Windows Server 2022 (for AD courses)
- pfSense (for networking courses)

Students will be able to deploy these instantly for coursework.

### Hour 10: Production Server Repair

Remember that production server used for courses? It was having issues.

**Problem**: Wouldn't boot properly, dropping into emergency mode

**Root cause**: Corrupted filesystem on data partition

**Fix**:
```bash
# Boot from rescue mode
fsck -y /dev/sda3

# Rebuild fstab
blkid # Get UUIDs
vim /etc/fstab # Update with correct UUIDs

# Test mount
mount -a

# Reboot
reboot
```

**Result**: Server back online, courses can continue Monday morning.

### Bonus: The Cyber Threat Map Monitor

Found an old monitor that wasn't being used. Had an idea:

**Mount it to the server rack door to display [Check Point's Cyber Threat Map](https://threatmap.checkpoint.com/) for students passing by.**

Setup:
```bash
# Raspberry Pi running Chromium in kiosk mode
sudo apt install -y chromium-browser unclutter

# Autostart script
cat > ~/.config/lxsession/LXDE-pi/autostart << EOF
@chromium-browser --kiosk --noerrdialogs \
  --disable-infobars --check-for-update-interval=31536000 \
  https://threatmap.checkpoint.com/
@unclutter -idle 0.1
EOF
```

Now students walking past the data center see a real-time visualization of global cyber attacks. Educational and cool.

## The After: A Functional Data Center

By the end of the day, we had:

✅ **Organized infrastructure**: Everything properly racked and labeled  
✅ **Clean cable management**: Doors close, easy to trace connections  
✅ **Segregated networks**: Proper VLANs and security boundaries  
✅ **Production-ready Proxmox**: HA cluster with Ceph storage  
✅ **Cybersecurity Club infrastructure**: Ready for student VMs  
✅ **Fixed production server**: Courses can continue  
✅ **Documentation**: Network diagrams, configurations, passwords in vault  
✅ **Future-ready**: Foundation for expansion  

## The Hidden Treasure: Unused Computing Power

The most exciting discovery: we're sitting on massive computing resources:

**Available Resources:**
```
Compute:
├── 120+ CPU cores (across unused servers)
├── 500+ GB RAM
└── Several GPUs (for ML/AI workloads)

Storage:
├── ~500TB total capacity
├── Currently using <5%
└── Ceph-ready for distributed storage

Networking:
├── 10Gbps capable switches
├── Redundant uplinks
└── VLANs already configured
```

**The Plan**: Working with faculty (Zhaojun Li and Changhao Chenli), we're planning to:

1. **Spin up additional Proxmox nodes** for student VMs
2. **Integrate with coursework**: Students get hands-on with enterprise tech
3. **Create a virtualization lab**: Real infrastructure for cybersecurity courses
4. **Support research projects**: GPU nodes for ML/AI research
5. **Host student projects**: Like ClassCloud and other capstone projects

This infrastructure will directly benefit Indiana Tech's cybersecurity program.

## Team Effort: Tavares Baker

Huge shoutout to **Tavares Baker** for grinding through wiping multiple old servers in the data center. 

Wiping old enterprise servers properly isn't glamorous work:
```bash
# Secure wipe process
shred -vfz -n 3 /dev/sda
# Wait... and wait... and wait...
# Repeat for every drive in every server
```

But it's critical for:
- Security (ensuring no old data remains)
- Repurposing hardware for courses
- Meeting data disposal regulations

Tavares put in hours of work to make these servers ready for their new life.

## Lessons Learned

### Technical Lessons

1. **Documentation is critical**: Label everything before you touch it
2. **Cable management pays off**: Saves hours in troubleshooting later
3. **Plan for growth**: Leave space, ports, and capacity for expansion
4. **Test before going live**: Verify everything works before declaring victory
5. **Monitoring from day one**: Set up alerts before problems occur

### Project Management Lessons

1. **"One hour" tasks rarely are**: Plan for 3x longer than you think
2. **Communication is key**: Keep stakeholders informed
3. **Team work makes it possible**: Couldn't have done this solo
4. **Take breaks**: 10-hour days require periodic food and caffeine
5. **Document while you work**: It's harder to remember later

### Infrastructure Lessons

1. **Physical layer matters**: Clean cabling = clean networking
2. **Security by design**: VLANs, firewalls, access control from the start
3. **Automation where possible**: Ansible, scripts, templates
4. **Backup everything**: Snapshots before major changes
5. **Plan for failure**: Redundancy, monitoring, recovery procedures

## Impact on Students

This isn't just about cleaning up a data center. It's about creating opportunities for students:

### Hands-On Experience

Students will now have access to:
- Enterprise-grade virtualization
- Proper network segmentation
- Production infrastructure
- Real troubleshooting scenarios
- Professional data center practices

### Cybersecurity Program

The new infrastructure will support:
- Cyber Warriors competition practice
- Cybersecurity Club activities
- Course lab exercises
- Student projects
- Research initiatives

### Career Preparation

Working with real enterprise equipment prepares students for:
- IT infrastructure roles
- System administration
- Network engineering
- Security operations
- Cloud architecture

## Next Steps

The data center transformation is just the beginning:

### Immediate (Next Month)

1. **Deploy student VMs**: First cohort for spring courses
2. **Set up monitoring**: Grafana + Prometheus for metrics
3. **Create documentation**: Public wiki for students
4. **Training sessions**: Teach students how to use the infrastructure

### Short-term (Next Semester)

1. **Expand Proxmox cluster**: Add 2-3 more nodes
2. **Implement backup solution**: Automated backups to external storage
3. **Network improvements**: 10Gbps uplinks, better firewall
4. **Student access portal**: Web UI for VM management

### Long-term (Next Year)

1. **Kubernetes cluster**: Container orchestration for student projects
2. **CI/CD pipeline**: GitLab runners on the infrastructure
3. **Research computing**: GPU cluster for ML/AI
4. **Regional competitions**: Host CCDC qualifiers at Indiana Tech

## Reflection

What started as "just fix this one server" turned into completely transforming Indiana Tech's student data center infrastructure.

It's moments like these that remind me why I love this field. You can **directly impact** how students learn and what opportunities they have.

The infrastructure we built today will serve students for years to come. Every Cyber Warriors competition, every Cybersecurity Club meeting, every student project—they'll all benefit from the foundation we laid this week.

From a messy storage room to a professional-grade data center. Not bad for a Saturday.

## Photos

The transformation from a messy storage room to a professional-grade data center was dramatic. Clean cable management, organized equipment, and doors that actually close made a world of difference.

## Acknowledgments

Thanks to:
- **Avery Hughes**: Partner in this adventure, made it happen
- **Tavares Baker**: Crucial help with server wiping and prep
- **Indiana Tech Cyber Warriors leadership**: Supporting the initiative
- **Faculty (Zhaojun Li, Changhao Chenli)**: Planning future course integration
- **Indiana Tech IT**: Providing access and support

---

*From chaos to order, from potential to reality. Here's to building infrastructure that empowers students to learn and grow.*

**Note**: Some technical details simplified for readability. Full configuration documentation is available in our internal wiki.
