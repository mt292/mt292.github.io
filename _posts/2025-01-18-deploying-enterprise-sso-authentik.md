---
layout: post
title: "Enterprise SSO Infrastructure: Deploying Authentik for Indiana Tech Cyber Warriors"
date: 2026-01-21 10:00:00 -0500
categories: [Infrastructure, Security]
tags: [sso, authentik, ldap, mfa, identity-management, enterprise-security]
description: "How we deployed enterprise-grade Single Sign-On with Authentik to secure Indiana Tech Cyber Warriors' infrastructure, eliminating raw LDAP authentication and implementing MFA across all internal applications."
image: sso.jpeg
toc: true
math: false
---

## Project Overview

Avery Hughes and I just completed a major security infrastructure upgrade for the Indiana Tech Cyber Warriors: deploying full Single Sign-On (SSO) across all our internal core applications using Authentik.

This wasn't just a convenience upgrade—it was a fundamental shift in how we approach authentication and access management for our cybersecurity competition team's infrastructure.

## The Problem

Before this deployment, our authentication landscape looked like this:

### Security Issues

- **Raw LDAP Authentication**: Multiple applications were directly authenticating against LDAP without proper encryption
- **Credential Sprawl**: Different credentials for different services
- **No MFA**: Zero multi-factor authentication across critical infrastructure
- **Attack Surface**: Each application implementing its own authentication logic = more vulnerabilities
- **Audit Challenges**: No centralized logging of authentication events
- **Credential Leaks**: Multiple places where credentials could be compromised

### Operational Pain Points

- New team members needed accounts created in 5+ systems
- Password resets required touching multiple services
- No consistent access control policies
- Difficult to revoke access when members left
- Scaling authentication was a nightmare

## Why Authentik?

After evaluating several SSO solutions, we chose [Authentik](https://goauthentik.io/) for several reasons:

### Technical Advantages

1. **Protocol Support**: SAML, OAuth2, OpenID Connect, LDAP, Proxy Provider
2. **Self-Hosted**: Full control over our identity infrastructure
3. **Modern Architecture**: Cloud-native, containerized deployment
4. **Extensibility**: Flow-based configuration, custom policies
5. **Active Development**: Strong community and regular updates

### Security Features

- MFA support (TOTP, WebAuthn, SMS)
- Conditional access policies
- Device trust management
- Session management and monitoring
- Password policies and breach detection
- Audit logging

## Architecture

### Infrastructure Stack

```yaml
# Docker Compose excerpt
services:
  authentik-server:
    image: ghcr.io/goauthentik/server:latest
    environment:
      AUTHENTIK_SECRET_KEY: ${SECRET_KEY}
      AUTHENTIK_ERROR_REPORTING__ENABLED: "false"
      AUTHENTIK_POSTGRESQL__HOST: postgres
      AUTHENTIK_REDIS__HOST: redis
    ports:
      - "443:9443"
      - "80:9000"
    volumes:
      - ./media:/media
      - ./custom-templates:/templates

  authentik-worker:
    image: ghcr.io/goauthentik/server:latest
    command: worker
    environment:
      AUTHENTIK_SECRET_KEY: ${SECRET_KEY}
      AUTHENTIK_ERROR_REPORTING__ENABLED: "false"
      AUTHENTIK_POSTGRESQL__HOST: postgres
      AUTHENTIK_REDIS__HOST: redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: authentik
      POSTGRES_USER: authentik
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:alpine
    volumes:
      - redis-data:/data
```

### Network Design

```
┌─────────────────────────────────────────────┐
│          Reverse Proxy (nginx)              │
│         SSL/TLS Termination                 │
└────────────────┬────────────────────────────┘
                 │
┌────────────────┴────────────────────────────┐
│          Authentik (Port 9000)              │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  OAuth2  │  │   SAML   │  │   LDAP   │ │
│  │ Provider │  │ Provider │  │ Provider │ │
│  └──────────┘  └──────────┘  └──────────┘ │
└────────────────┬────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼───┐   ┌───▼───┐   ┌───▼───┐
│ App 1 │   │ App 2 │   │ App 3 │
│(SAML) │   │(OAuth)│   │(LDAP) │
└───────┘   └───────┘   └───────┘
```

## Implementation

### Phase 1: Infrastructure Setup

1. **Deployment Environment**
   - Deployed on dedicated Proxmox VM
   - 4 CPU cores, 8GB RAM, 50GB storage
   - Separate VLAN for identity services
   - Backup automation configured

2. **SSL/TLS Configuration**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name auth.cyberwarriors.internal;

       ssl_certificate /etc/ssl/certs/auth.crt;
       ssl_certificate_key /etc/ssl/private/auth.key;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;

       location / {
           proxy_pass http://127.0.0.1:9000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Database Hardening**
   - Strong passwords (32+ characters)
   - Database encryption at rest
   - Regular backup schedule
   - Access restricted to localhost

### Phase 2: Migration Strategy

Rather than a "big bang" migration, we took an incremental approach:

1. **Week 1**: Deploy Authentik, configure LDAP backend
2. **Week 2**: Migrate non-critical services (monitoring, documentation)
3. **Week 3**: Migrate critical services (Proxmox, network gear)
4. **Week 4**: Decommission old authentication systems

### Phase 3: Application Integration

#### Example: Proxmox Integration

Proxmox supports OpenID Connect, making integration straightforward:

```bash
# Proxmox configuration
pveum realm add authentik --type openid \
  --issuer-url https://auth.cyberwarriors.internal/application/o/proxmox/ \
  --client-id proxmox \
  --client-key ${CLIENT_SECRET} \
  --username-claim preferred_username \
  --autocreate 1
```

#### Example: GitLab Integration

```ruby
# GitLab omnibus configuration
gitlab_rails['omniauth_enabled'] = true
gitlab_rails['omniauth_allow_single_sign_on'] = ['openid_connect']
gitlab_rails['omniauth_block_auto_created_users'] = false

gitlab_rails['omniauth_providers'] = [
  {
    'name' => 'openid_connect',
    'label' => 'Authentik',
    'args' => {
      'name' => 'openid_connect',
      'scope' => ['openid', 'profile', 'email'],
      'response_type' => 'code',
      'issuer' => 'https://auth.cyberwarriors.internal/application/o/gitlab/',
      'discovery' => true,
      'client_auth_method' => 'query',
      'uid_field' => 'sub',
      'client_options' => {
        'identifier' => 'gitlab',
        'secret' => ENV['GITLAB_OIDC_SECRET'],
        'redirect_uri' => 'https://gitlab.cyberwarriors.internal/users/auth/openid_connect/callback'
      }
    }
  }
]
```

## MFA Implementation

### Enforcement Policy

We implemented a tiered MFA approach:

```python
# Authentik policy example (simplified)
class MFARequiredPolicy:
    def evaluate(self, request, user):
        # Admins always require MFA
        if user.is_superuser:
            return self.require_mfa()
        
        # Production systems require MFA
        if request.application.is_production:
            return self.require_mfa()
        
        # High-risk actions require MFA
        if request.action in ['delete', 'modify_permissions']:
            return self.require_mfa()
        
        # Default: recommend but don't require
        return self.recommend_mfa()
```

### Supported MFA Methods

1. **TOTP (Time-based One-Time Password)**
   - Most common: Google Authenticator, Authy, 1Password
   - Recommended for all users

2. **WebAuthn (FIDO2)**
   - Hardware security keys (YubiKey, Titan)
   - Recommended for admins and high-privilege accounts

3. **SMS (Backup only)**
   - Available but discouraged
   - Used only for account recovery

## Results

### Security Improvements

✅ **Eliminated credential sprawl**: One identity, one password  
✅ **MFA enforcement**: 100% of admin accounts, 85% of user accounts  
✅ **Reduced attack surface**: Centralized authentication logic  
✅ **Better visibility**: Centralized audit logs and monitoring  
✅ **Faster incident response**: Ability to instantly revoke all access  

### Operational Benefits

- **Onboarding time**: Reduced from 2 hours to 15 minutes
- **Password resets**: Self-service portal = 90% reduction in support tickets
- **Access revocation**: From 30 minutes to instant
- **Compliance**: Much easier to demonstrate access control policies

### Metrics

```
Authentication Events (First Month):
├── Total logins: 12,847
├── MFA challenges: 8,234
├── Failed attempts: 342 (2.7%)
├── Password resets: 23
└── New registrations: 15

Performance:
├── Average login time: 1.2 seconds
├── 99th percentile: 3.1 seconds
└── Uptime: 99.97%
```

## Lessons Learned

### What Went Well

1. **Incremental migration**: No service disruptions
2. **User training**: Quick docs and demo session prevented support overload
3. **Backup authentication**: Kept old system available for 2 weeks
4. **Monitoring**: Set up alerts before migration

### Challenges

1. **Legacy applications**: Some older apps didn't support modern SSO protocols
   - **Solution**: Used Authentik's proxy provider for transparent authentication

2. **Initial resistance**: Users resistant to MFA
   - **Solution**: Led by example, admins enabled first, showed it wasn't painful

3. **Network complexity**: Multiple VLANs and firewall rules
   - **Solution**: Detailed network diagram and testing in isolated environment

## Security as a Foundation

As a cybersecurity student, one of the biggest lessons from this project is that **security should be built in, not bolted on**. 

We could have kept patching our old authentication system, adding MFA here, fixing LDAP there. But fundamentally, the architecture was insecure. Starting fresh with proper SSO gave us:

- A foundation we can build on
- Fewer places for security to break
- Better visibility into who's accessing what
- The ability to enforce consistent policies

This is infrastructure that will scale with our team for years to come.

## Next Steps

We're not done yet. Future improvements include:

1. **Conditional Access Policies**
   - Location-based restrictions
   - Device trust verification
   - Time-based access controls

2. **Integration Expansion**
   - VPN authentication via RADIUS
   - WiFi authentication (802.1X)
   - Physical access control systems

3. **Advanced Monitoring**
   - SIEM integration
   - Anomaly detection
   - User behavior analytics

4. **Passwordless Authentication**
   - WebAuthn as primary method
   - Biometric authentication for mobile

## Resources

- **Authentik Documentation**: [goauthentik.io/docs](https://goauthentik.io/docs)
- **OAuth 2.0 Spec**: [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)
- **SAML 2.0 Spec**: [OASIS Standard](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)
- **NIST Digital Identity Guidelines**: [SP 800-63](https://pages.nist.gov/800-63-3/)

## Conclusion

Deploying enterprise SSO for Indiana Tech Cyber Warriors was a major undertaking, but it's already paying dividends in security, efficiency, and scalability.

Big thanks to Avery Hughes for being an excellent partner on this project. Collaborative work like this is where the best learning happens.

On to the next hard problem!

---

*Note: Implementation details have been simplified for educational purposes. Always conduct thorough security reviews before deploying authentication infrastructure.*
