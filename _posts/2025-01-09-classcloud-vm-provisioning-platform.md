---
layout: post
title: "ClassCloud: Virtual Machine Provisioning Platform for Computer Science Education"
date: 2025-01-09 09:00:00 -0500
categories: [Projects, EdTech]
tags: [cloud-computing, virtualization, proxmox, full-stack, education, saas, sso]
description: "Building and launching ClassCloud - a production VM provisioning platform serving 100+ students at Indiana Tech with automated deployment, browser-based access, and enterprise SSO integration."
image: classcloud.jpeg
toc: true
math: false
---

## Project Announcement

I'm excited to announce that **ClassCloud** - a Virtual Machine Provisioning & Management Platform - is now officially live in production at Indiana Institute of Technology!

After a full semester of development alongside Avery Hughes, we've built a platform that's solving a critical challenge in Computer Science and Cybersecurity education: giving students instant, browser-based access to lab environments from anywhere.

🔗 **Learn More**: [ClassCloud Project Page](https://classcloud.mtsaga.net)

## The Problem

### Educational Challenges

Traditional computer science and cybersecurity labs face significant barriers:

**Technical Limitations**
- Students' personal laptops often can't run resource-intensive VMs
- Lab computers tie students to campus (problem for remote/evening students)
- Different OS requirements across courses
- Complex setup procedures for each course

**Operational Challenges**
- Faculty spending hours setting up lab environments
- Inconsistent configurations across student machines
- Difficulty providing 24/7 access to specialized software
- Limited resources for on-premises lab expansion

**Student Impact**
- Students falling behind because they can't practice at home
- Frustration with VM setup (especially for non-technical courses)
- Inability to continue work during travel or illness
- Limited access outside business hours

## The Solution: ClassCloud

ClassCloud provides **on-demand, browser-based access to pre-configured virtual machines** for academic courses. Think "AWS for education" but purpose-built for classroom use.

### Core Features

#### For Students

✅ **Instant Access**
- One-click VM deployment
- Browser-based console (no VPN, no special software)
- Access from any device, anywhere
- Start/stop/reboot controls

✅ **Zero Setup**
- Pre-configured with course software
- No laptop requirements
- Consistent environment for everyone
- Automatic resource allocation

#### For Faculty

✅ **Bulk Deployment**
- CSV upload for class rosters
- Mass email with login credentials
- Template-based VM creation
- Automated provisioning

✅ **Management Tools**
- Real-time analytics dashboard
- Student usage monitoring
- Resource allocation controls
- Course-specific configurations

✅ **Integration**
- Enterprise SSO (SAML 2.0, CAS, Microsoft OAuth)
- LMS integration ready
- Grade export capabilities
- API for custom integrations

## Technical Architecture

### Infrastructure Stack

```
┌─────────────────────────────────────────────┐
│         Frontend (React + TypeScript)       │
│  ├─ Student Dashboard                      │
│  ├─ Faculty Admin Panel                    │
│  └─ Analytics & Monitoring                 │
└──────────────────┬──────────────────────────┘
                   │ REST API
┌──────────────────▼──────────────────────────┐
│         Backend (Node.js + Express)         │
│  ├─ Authentication & Authorization          │
│  ├─ VM Lifecycle Management                │
│  ├─ User & Course Management                │
│  └─ Analytics & Reporting                   │
└──────────────────┬──────────────────────────┘
                   │ Proxmox API
┌──────────────────▼──────────────────────────┐
│      Proxmox VE Cluster (Virtualization)    │
│  ├─ VM Provisioning & Management            │
│  ├─ Resource Allocation                     │
│  ├─ Storage Management                      │
│  └─ Network Configuration                   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│     Database (PostgreSQL) + Redis Cache     │
└─────────────────────────────────────────────┘
```

### Technology Choices

#### Frontend

```typescript
// Stack
├── React 18 (UI framework)
├── TypeScript (type safety)
├── Vite (build tool)
├── TailwindCSS (styling)
├── React Query (data fetching)
└── Recharts (analytics)

// Key Features
├── Real-time VM status updates
├── Interactive console viewer
├── Responsive design (mobile-friendly)
└── SSO integration
```

#### Backend

```javascript
// Stack
├── Node.js 20
├── Express.js (API framework)
├── Proxmox API client
├── PostgreSQL (user data, courses, VMs)
├── Redis (session management, caching)
└── JWT (authentication tokens)

// Key Capabilities
├── Asynchronous VM provisioning
├── Queue-based job processing
├── Rate limiting & security
└── Comprehensive logging
```

#### Virtualization

```
Proxmox VE Cluster
├── 3 nodes (high availability)
├── Ceph storage (distributed, redundant)
├── Linux bridge networking
├── Template-based deployment
└── Automated backups
```

## Key Features in Detail

### 1. Automated VM Provisioning

When a student requests a VM:

```javascript
// Simplified workflow
async function provisionVM(userId, courseId) {
  // 1. Get course template
  const template = await getCourseTemplate(courseId);
  
  // 2. Select optimal node
  const node = await selectBestNode();
  
  // 3. Clone from template
  const vmid = await proxmox.cloneVM({
    template: template.id,
    node: node.name,
    name: `${userId}-${courseId}`,
    storage: 'ceph-pool'
  });
  
  // 4. Configure VM
  await proxmox.configureVM(vmid, {
    cores: template.cpu,
    memory: template.memory,
    network: assignVLAN(courseId)
  });
  
  // 5. Start VM
  await proxmox.startVM(vmid);
  
  // 6. Record in database
  await db.createVM({
    userId,
    courseId,
    vmid,
    status: 'running'
  });
  
  return vmid;
}
```

**Performance**: Average provisioning time is **~45 seconds** from click to usable VM.

### 2. Browser-Based Console

Students access VMs directly through the browser using Proxmox's noVNC implementation:

```typescript
// Console component
const VMConsole: React.FC<{vmId: number}> = ({vmId}) => {
  const [consoleUrl, setConsoleUrl] = useState('');
  
  useEffect(() => {
    // Get secure console ticket
    api.getConsoleTicket(vmId).then(ticket => {
      setConsoleUrl(
        `https://proxmox.classcloud.local/api2/json/nodes/${ticket.node}/qemu/${vmId}/vncwebsocket?port=${ticket.port}&vncticket=${ticket.ticket}`
      );
    });
  }, [vmId]);
  
  return (
    <iframe 
      src={consoleUrl}
      width="100%"
      height="600px"
      title="VM Console"
    />
  );
};
```

**No VPN or special software required** - works on any modern browser including mobile.

### 3. Bulk Deployment for Faculty

Professors can deploy VMs for entire classes via CSV upload:

```csv
email,firstName,lastName,role
student1@indianatech.edu,John,Doe,student
student2@indianatech.edu,Jane,Smith,student
```

The system automatically:
1. Creates user accounts
2. Provisions VMs from course template
3. Sends email with credentials and access instructions
4. Enables SSO access

**Result**: Professor can provision 30 VMs in under 5 minutes.

### 4. Enterprise SSO Integration

Supporting multiple authentication providers:

```typescript
// Authentication providers
const authConfig = {
  saml: {
    entryPoint: process.env.SAML_ENTRY_POINT,
    issuer: 'classcloud',
    cert: fs.readFileSync('/path/to/cert.pem', 'utf8')
  },
  oauth: {
    microsoft: {
      clientId: process.env.MS_CLIENT_ID,
      clientSecret: process.env.MS_CLIENT_SECRET,
      callbackURL: '/auth/microsoft/callback'
    }
  },
  cas: {
    casUrl: process.env.CAS_URL,
    serviceUrl: process.env.SERVICE_URL
  }
};
```

Students and faculty can use their existing Indiana Tech credentials - no new passwords to remember.

## Security & Privacy

### Security Measures

1. **Network Isolation**
   - Each course has its own VLAN
   - VMs can't communicate across courses
   - Firewall rules limit external access

2. **Access Control**
   - Role-based permissions (student, faculty, admin)
   - VM ownership verification
   - API rate limiting

3. **Data Protection**
   - Encrypted connections (TLS 1.3)
   - Hashed passwords (bcrypt)
   - Encrypted backups
   - Regular security audits

4. **Monitoring**
   - Failed login attempt tracking
   - Unusual resource usage alerts
   - Automated security scanning

### Privacy Considerations

- Minimal data collection (only what's needed)
- Compliance with FERPA regulations
- Data retention policies
- Student consent for analytics
- Transparent privacy policy

## Real-World Performance

### Current Deployment

```
Production Statistics (First Month):
├── Active Courses: 3
├── Total Students: 102
├── VMs Provisioned: 156
├── Average Session Time: 2.3 hours
├── Peak Concurrent VMs: 47
└── System Uptime: 99.8%

Resource Utilization:
├── CPU Usage: 42% average
├── Memory Usage: 68% average
├── Storage: 2.4TB / 12TB used
└── Network: ~15 Mbps average
```

### User Feedback

Early feedback from students:

✅ **"Finally can work from home on lab assignments"**  
✅ **"Way easier than installing everything myself"**  
✅ **"Love being able to access from my iPad"**  
✅ **"Saved me from buying a new laptop"**

From faculty:

✅ **"Cut lab setup time from 2 hours to 10 minutes"**  
✅ **"Students are more engaged now they can practice anytime"**  
✅ **"Analytics help me see who's struggling early"**

## Development Journey

### Timeline

**September 2024**: Project kickoff, requirements gathering  
**October 2024**: Architecture design, proof of concept  
**November 2024**: Core functionality development  
**December 2024**: Testing, security hardening  
**January 2025**: Production deployment!

### Challenges Overcome

#### Challenge 1: VM Provisioning Speed

**Problem**: Initial deployments took 5+ minutes  
**Solution**: 
- Template optimization (smaller base images)
- Parallel provisioning
- Pre-warmed templates
- Ceph storage tuning

**Result**: Down to 45 seconds average

#### Challenge 2: Console Performance

**Problem**: VNC lag made typing difficult  
**Solution**:
- WebSocket compression
- Proxmox API optimization
- Direct node connections (bypassing extra proxies)
- Console resolution optimization

**Result**: Sub-100ms latency on campus network

#### Challenge 3: Resource Management

**Problem**: Running out of resources during peak hours  
**Solution**:
- Auto-shutdown idle VMs (after 2 hours)
- Resource quotas per course
- Dynamic node selection
- Usage scheduling recommendations

**Result**: 60% reduction in wasted resources

#### Challenge 4: Faculty Adoption

**Problem**: Initial hesitation to change workflow  
**Solution**:
- Comprehensive documentation
- One-on-one training sessions
- Faculty feedback sessions
- Quick-start templates

**Result**: 100% faculty adoption in pilot courses

## Technical Learnings

### Proxmox API

The Proxmox API is powerful but has quirks:

```javascript
// Common gotcha: Task completion
async function waitForTask(node, upid) {
  while (true) {
    const status = await proxmox.getTaskStatus(node, upid);
    
    if (status.status === 'stopped') {
      if (status.exitstatus === 'OK') {
        return true;
      } else {
        throw new Error(`Task failed: ${status.exitstatus}`);
      }
    }
    
    // Poll every 2 seconds
    await sleep(2000);
  }
}
```

**Lesson**: Many Proxmox operations are asynchronous. Always implement proper task tracking.

### Scalability Patterns

```typescript
// Queue-based provisioning
import Bull from 'bull';

const vmQueue = new Bull('vm-provisioning', {
  redis: { host: 'localhost', port: 6379 }
});

vmQueue.process(async (job) => {
  const { userId, courseId } = job.data;
  
  try {
    const vmid = await provisionVM(userId, courseId);
    return { success: true, vmid };
  } catch (error) {
    throw error; // Bull will handle retries
  }
});

// Add job to queue
await vmQueue.add({ userId, courseId }, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 }
});
```

**Lesson**: Queueing makes the system resilient to spikes in demand.

### Database Optimization

```sql
-- Indexes for common queries
CREATE INDEX idx_vm_user ON vms(user_id);
CREATE INDEX idx_vm_course ON vms(course_id);
CREATE INDEX idx_vm_status ON vms(status);

-- Composite index for dashboard queries
CREATE INDEX idx_vm_user_status ON vms(user_id, status);
```

**Lesson**: Proper indexing makes dashboard load times <100ms.

## Future Roadmap

### Planned Features (Spring 2025)

1. **Snapshots & Rollback**
   - Students can snapshot before risky changes
   - One-click rollback if something breaks
   - Automatic snapshots before major labs

2. **Collaboration Features**
   - Shared VMs for group projects
   - Live screen sharing
   - In-browser messaging

3. **Mobile App**
   - Native iOS/Android apps
   - Optimized console for mobile
   - Push notifications

4. **AI-Powered Support**
   - Automated troubleshooting
   - Common error detection
   - Suggested fixes

### Scaling Plans

```
Current: 100 students, 3 courses
Year 1 Goal: 300+ students, 10+ courses
Year 2 Goal: 1000+ students, 30+ courses
Year 3 Goal: Multi-university deployment
```

To support this growth:
- Additional Proxmox nodes
- Geographic distribution (edge locations)
- Enhanced caching layer
- Advanced load balancing

## Business Model

### Current: Free for Indiana Tech

ClassCloud is currently provided free to Indiana Tech students and faculty as a pilot program.

### Future: Sustainability

Exploring several options:
1. **University Licensing**: Per-student annual fee
2. **Hosted SaaS**: Fully managed service for other institutions
3. **Self-Hosted**: Open-source core + paid support
4. **Freemium**: Basic free tier + premium features

## Open Source Plans

We're planning to open-source core components:

- **classcloud-core**: VM provisioning engine
- **classcloud-ui**: React frontend components
- **classcloud-api**: Backend API framework
- **classcloud-docs**: Deployment guides

Target: Q2 2025

## Impact & Metrics

### Educational Impact

- **92% of students** report ClassCloud improved their learning experience
- **0 students** fell behind due to laptop limitations
- **24/7 access** increased practice time by estimated 40%
- **Faculty time saved**: ~15 hours per course per semester

### Technical Impact

- **156 VMs** provisioned without manual intervention
- **99.8% uptime** for the platform
- **<1 minute** average provisioning time
- **Zero data loss** incidents

## Lessons Learned

### What Worked Well

1. **Starting Small**: Pilot with 3 courses let us iterate quickly
2. **Faculty Involvement**: Early feedback shaped development priorities
3. **Automation**: Bulk operations saved massive amounts of time
4. **Documentation**: Comprehensive docs reduced support burden

### What We'd Do Differently

1. **Earlier testing**: Should have had student beta testers sooner
2. **More templates**: Provide more pre-configured course templates
3. **Better monitoring**: Earlier implementation of metrics
4. **Mobile first**: Should have considered mobile UX from day one

## Acknowledgments

This project wouldn't have been possible without:

- **Avery Hughes**: Co-developer and partner throughout the project
- **Faculty Members**: For trusting us with their courses
- **Indiana Tech IT**: For infrastructure support
- **Beta Students**: For invaluable early feedback

## Conclusion

ClassCloud has been an incredible learning experience in:
- Full-stack development
- Virtualization infrastructure
- Production system deployment
- User-centered design
- Project management

But more importantly, it's solving a real problem and helping students learn. There's nothing more rewarding than building something that people actually use and benefit from.

If you're interested in ClassCloud for your institution, want to contribute to the open-source version, or just want to chat about the tech, feel free to reach out!

**Project Links:**
- 🌐 Website: [classcloud.mtsaga.net](https://classcloud.mtsaga.net)
- 📧 Contact: mt@mtsaga.net

---

*Special thanks to everyone who supported this project. Here's to making education more accessible through technology!*
