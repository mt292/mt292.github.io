---
layout: post
title: "mtsaga.net Design System"
date: 2026-02-11 10:00:00 -0500
categories: [Web Development, Design]
tags: [design-system, ui-ux, web-development, css, accessibility]
description: "A comprehensive guide to the design system powering mtsaga.net - covering brand identity, color palette, typography, components, and web development best practices."
image: terminal-preview.png
toc: true
math: false
---

## 00. Introduction

### What is a Design System?

A design system is a comprehensive library of reusable components, guidelines, and principles that ensure consistency across digital products. The mtsaga.net design system serves as the foundation for creating a cohesive, accessible, and modern web experience that reflects the intersection of cybersecurity, technology, and professional excellence.

This design system encompasses:

- **Brand Identity**: Voice, tone, and personality that defines the mtsaga.net experience
- **Color Palette**: Carefully selected colors that ensure accessibility and evoke a cybersecurity aesthetic
- **Typography**: Font families and hierarchies optimized for readability and impact
- **Components**: Reusable UI elements including terminals, cards, buttons, and navigation
- **Layout Principles**: Grid systems and responsive design patterns
- **Best Practices**: Accessibility standards, performance optimization, and semantic HTML

The design system is built on modern web standards, prioritizing performance, accessibility, and user experience. Every element is crafted to work seamlessly across devices while maintaining the professional, technical aesthetic that defines the brand.

---

## 01. Brand Identity

### Brand Narrative

mtsaga.net represents the convergence of cybersecurity expertise, technical excellence, and continuous learning. It's not just a portfolio—it's a digital laboratory where security research, technical projects, and professional experiences come to life.

The brand embodies the mindset of a security professional: curious, analytical, and always exploring the boundaries of what's possible. Every interaction should feel like stepping into a command-line interface—powerful, direct, and efficient.

While many personal sites prioritize flashy animations or excessive visual elements, mtsaga.net focuses on substance over style. The design is intentionally minimal, allowing the content—technical writeups, project showcases, competition experiences—to take center stage.

### Voice and Tone

#### Personality Traits

- **Technical**: Precise language, industry terminology, command-line aesthetic
- **Professional**: Polished presentation without sacrificing authenticity
- **Direct**: Clear communication, no unnecessary fluff
- **Innovative**: Forward-thinking approaches to security and technology
- **Accessible**: Complex topics explained clearly for diverse audiences

#### Writing Principles

**Be technical, not intimidating.**
Use proper security terminology and technical language, but provide context for readers who may be learning. Write as you would explain to a colleague—with precision and clarity.

**Be confident, not arrogant.**
Share knowledge and experiences with authority, but remain humble and open to learning. Acknowledge challenges and failures as learning opportunities.

**Be concise, not sparse.**
Every word should serve a purpose. Technical documentation requires detail, but avoid verbosity. Use code examples, diagrams, and structured content to convey information efficiently.

**Show, don't just tell.**
Use terminal outputs, code snippets, network diagrams, and visual demonstrations. Security work is hands-on; the content should reflect that.

**Maintain professionalism.**
This is a professional portfolio and knowledge-sharing platform. Keep content appropriate for recruiters, colleagues, and industry professionals while remaining authentic.

---

## 02. Design Elements

### Color Palette

The mtsaga.net color scheme draws inspiration from terminal interfaces, network monitoring tools, and cybersecurity dashboards. Colors are chosen for both aesthetic appeal and functional accessibility.

#### Core Colors

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0;">
  <div style="background: #161B33; padding: 2rem; border-radius: 8px; border-left: 4px solid #161B33;">
    <strong style="color: #e4e6eb; font-family: 'Courier New', monospace;">Dark Background</strong><br>
    <span style="color: #8a9bb8; font-size: 0.9em;">RGB: 22, 27, 51</span><br>
    <span style="color: #00aaff; font-size: 0.9em; font-family: monospace;">HEX: #161B33</span>
    <p style="color: #8a9bb8; font-size: 0.85em; margin-top: 0.5rem;">Primary background color. Rich, deep blue-black that's easier on the eyes than pure black while maintaining professionalism.</p>
  </div>
  
  <div style="background: #1c2948; padding: 2rem; border-radius: 8px; border-left: 4px solid #1c2948;">
    <strong style="color: #e4e6eb; font-family: 'Courier New', monospace;">Section Background</strong><br>
    <span style="color: #8a9bb8; font-size: 0.9em;">RGB: 28, 41, 72</span><br>
    <span style="color: #00aaff; font-size: 0.9em; font-family: monospace;">HEX: #1C2948</span>
    <p style="color: #8a9bb8; font-size: 0.85em; margin-top: 0.5rem;">Secondary background for sectioned content. Provides subtle contrast without disrupting visual hierarchy.</p>
  </div>
  
  <div style="background: #22305a; padding: 2rem; border-radius: 8px; border-left: 4px solid #22305a;">
    <strong style="color: #e4e6eb; font-family: 'Courier New', monospace;">Card Background</strong><br>
    <span style="color: #8a9bb8; font-size: 0.9em;">RGB: 34, 48, 90</span><br>
    <span style="color: #00aaff; font-size: 0.9em; font-family: monospace;">HEX: #22305A</span>
    <p style="color: #8a9bb8; font-size: 0.85em; margin-top: 0.5rem;">Tertiary background for elevated content like cards and modals. Creates depth in the interface.</p>
  </div>
</div>

#### Accent Colors

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0;">
  <div style="background: #00aaff; padding: 2rem; border-radius: 8px; border-left: 4px solid #00aaff;">
    <strong style="color: #161B33; font-family: 'Courier New', monospace;">Cyan Accent</strong><br>
    <span style="color: #161B33; font-size: 0.9em;">RGB: 0, 170, 255</span><br>
    <span style="color: #161B33; font-size: 0.9em; font-family: monospace;">HEX: #00AAFF</span>
    <p style="color: #161B33; font-size: 0.85em; margin-top: 0.5rem;">Primary accent color. Used for interactive elements, links, headings, and the logo. Evokes terminal prompts and network interfaces.</p>
  </div>
  
  <div style="background: #e4e6eb; padding: 2rem; border-radius: 8px; border-left: 4px solid #e4e6eb;">
    <strong style="color: #161B33; font-family: 'Courier New', monospace;">Foreground Text</strong><br>
    <span style="color: #161B33; font-size: 0.9em;">RGB: 228, 230, 235</span><br>
    <span style="color: #161B33; font-size: 0.9em; font-family: monospace;">HEX: #E4E6EB</span>
    <p style="color: #161B33; font-size: 0.85em; margin-top: 0.5rem;">Primary text color. High contrast against dark backgrounds for optimal readability.</p>
  </div>
  
  <div style="background: #8a9bb8; padding: 2rem; border-radius: 8px; border-left: 4px solid #8a9bb8;">
    <strong style="color: #161B33; font-family: 'Courier New', monospace;">Muted Text</strong><br>
    <span style="color: #161B33; font-size: 0.9em;">RGB: 138, 155, 184</span><br>
    <span style="color: #161B33; font-size: 0.9em; font-family: monospace;">HEX: #8A9BB8</span>
    <p style="color: #161B33; font-size: 0.85em; margin-top: 0.5rem;">Secondary text for metadata, captions, and less prominent content. Maintains hierarchy without loss of legibility.</p>
  </div>
  
  <div style="background: #0f1724; padding: 2rem; border-radius: 8px; border-left: 4px solid #0f1724;">
    <strong style="color: #e4e6eb; font-family: 'Courier New', monospace;">Footer Background</strong><br>
    <span style="color: #8a9bb8; font-size: 0.9em;">RGB: 15, 23, 36</span><br>
    <span style="color: #00aaff; font-size: 0.9em; font-family: monospace;">HEX: #0F1724</span>
    <p style="color: #8a9bb8; font-size: 0.85em; margin-top: 0.5rem;">Deepest background shade for footer and terminal interfaces. Creates visual grounding.</p>
  </div>
</div>

#### Accessibility Standards

All color combinations meet **WCAG 2.1 Level AA** standards:
- Normal text (< 18px): Minimum contrast ratio of **4.5:1**
- Large text (≥ 18px): Minimum contrast ratio of **3:1**
- Interactive elements: Minimum contrast ratio of **3:1**

**Color Usage Guidelines:**
- Primary accent (#00AAFF) provides 8.2:1 contrast on dark backgrounds
- Never use color alone to convey information—supplement with icons, text, or patterns
- Test all color combinations with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Support system-level preferences for color schemes and reduced motion

---

### Typography

Typography establishes visual hierarchy and reinforces the technical aesthetic. The font stack combines modern, highly legible typefaces with monospace fonts that evoke command-line interfaces.

#### Primary Fonts

<div style="margin: 2rem 0;">
  <div style="font-family: 'Orbitron', sans-serif; font-size: 2.5em; color: #00aaff; margin-bottom: 0.5rem;">Aa Orbitron</div>
  <p style="color: #8a9bb8; margin-bottom: 1rem;">
    <strong>Usage:</strong> Headings (H2, H3), logo, buttons, CTAs, terminal prompts<br>
    <strong>Weights:</strong> 400 (Regular), 700 (Bold), 900 (Black)<br>
    <strong>Characteristics:</strong> Geometric, futuristic, technical aesthetic. Load via Google Fonts.
  </p>
</div>

<div style="margin: 2rem 0;">
  <div style="font-family: 'Segoe UI', sans-serif; font-size: 2.5em; color: #e4e6eb; margin-bottom: 0.5rem;">Aa Segoe UI</div>
  <p style="color: #8a9bb8; margin-bottom: 1rem;">
    <strong>Usage:</strong> Body text, paragraphs, navigation, general UI elements<br>
    <strong>Weights:</strong> 400 (Regular), 600 (Semibold)<br>
    <strong>Characteristics:</strong> Clean, highly legible, cross-platform system font.
  </p>
</div>

<div style="margin: 2rem 0;">
  <div style="font-family: 'Source Code Pro', monospace; font-size: 2.5em; color: #e4e6eb; margin-bottom: 0.5rem;">Aa Source Code Pro</div>
  <p style="color: #8a9bb8; margin-bottom: 1rem;">
    <strong>Usage:</strong> Code blocks, terminal content, technical data, email addresses<br>
    <strong>Weights:</strong> 400 (Regular)<br>
    <strong>Characteristics:</strong> Monospace, optimized for code display. Fallback to 'Courier New' for compatibility.
  </p>
</div>

#### Heading Hierarchy

```css
H1: Orbitron Bold - 3rem (48px) - Line height: 1.2
H2: Orbitron Bold - 2rem (32px) - Line height: 1.3
H3: Orbitron Regular - 1.5rem (24px) - Line height: 1.4
H4: Segoe UI Semibold - 1.25rem (20px) - Line height: 1.5
H5: Segoe UI Semibold - 1rem (16px) - Line height: 1.5
H6: Segoe UI Regular - 0.875rem (14px) - Line height: 1.5
```

#### Body Text

- **Size**: 1rem (16px) base
- **Line Height**: 1.6 for optimal readability
- **Paragraph Spacing**: 1rem between paragraphs
- **Max Width**: 75ch (characters) for long-form content

#### Code Blocks

```python
# Code blocks use Source Code Pro with syntax highlighting
def secure_connection(host, port):
    """Establish secure connection with proper error handling"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((host, port))
        return sock
    except Exception as e:
        print(f"[!] Connection failed: {e}")
        return None
```

**Code Styling:**
- Background: `#000000` (pure black for terminal aesthetic)
- Border radius: `8px`
- Padding: `1rem`
- Font size: `0.9em` relative to parent

---

### Components

#### Buttons

Buttons are crucial interaction points. The design emphasizes clarity and feedback.

**Primary Button**
<div style="margin: 1rem 0;">
  <a href="#" style="display: inline-block; background: #00aaff; color: #161B33; padding: 0.6rem 1.2rem; border-radius: 4px; text-decoration: none; font-family: 'Orbitron', sans-serif; font-weight: 600; transition: opacity 0.2s;">Learn More</a>
</div>

```html
<a href="#" class="btn">Learn More</a>
```

```css
.btn {
  display: inline-block;
  background: var(--btn-bg);
  color: var(--dark-bg);
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-family: 'Orbitron', sans-serif;
  transition: opacity 0.2s;
}
.btn:hover {
  opacity: 0.8;
}
```

**Secondary Button (Outlined)**
<div style="margin: 1rem 0;">
  <a href="#" style="display: inline-block; background: transparent; color: #00aaff; padding: 0.6rem 1.2rem; border: 2px solid #00aaff; border-radius: 4px; text-decoration: none; font-family: 'Orbitron', sans-serif; font-weight: 600; transition: all 0.2s;">View Project</a>
</div>

**Button States:**
- **Default**: Full opacity, cyan background (#00AAFF)
- **Hover**: 80% opacity, subtle scale transform
- **Focus**: Outline ring for keyboard navigation
- **Disabled**: 40% opacity, cursor not-allowed

#### Cards

Service cards and project cards display content in elevated containers.

<div style="background: #22305a; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); margin: 1rem 0;">
  <div style="width: 48px; height: 48px; background: rgba(0, 170, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
    <span style="color: #00aaff; font-size: 1.5rem;">🔒</span>
  </div>
  <h3 style="color: #e4e6eb; margin-bottom: 0.5rem;">Security Analysis</h3>
  <p style="color: #8a9bb8; font-size: 0.9rem; margin-bottom: 1.5rem;">Comprehensive security assessments and penetration testing.</p>
  <a href="#" class="btn">Learn More</a>
</div>

```css
.service-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}
.service-card:hover {
  transform: translateY(-4px);
}
```

#### Terminal Windows

The signature component of mtsaga.net—terminal-style windows with macOS-inspired chrome.

<div style="background: #1c2948; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.75); overflow: hidden; margin: 2rem 0;">
  <div style="display: flex; align-items: center; padding: 8px; background: #2a3145;">
    <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff605c; margin-right: 6px;"></div>
    <div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd44; margin-right: 6px;"></div>
    <div style="width: 12px; height: 12px; border-radius: 50%; background: #00ca4e;"></div>
  </div>
  <div style="background: #000; padding: 1rem; color: #e4e6eb; font-family: 'Source Code Pro', monospace;">
    <span style="color: #00aaff;">martin@mtsaga</span>:<span style="color: #00ca4e;">~</span>$ whoami<br>
    Security Engineer | Penetration Tester | CTF Player<br>
    <span style="color: #00aaff;">martin@mtsaga</span>:<span style="color: #00ca4e;">~</span>$ cat skills.txt<br>
    • Offensive Security<br>
    • Active Directory<br>
    • Web Application Testing<br>
    • Network Security<br>
  </div>
</div>

**Terminal Window Structure:**
- **Header**: macOS-style traffic light buttons (red, yellow, green)
- **Body**: Black background with monospace content
- **Prompt**: Cyan username and hostname, green directory indicator
- **Shadow**: Deep shadow for elevation (0 6px 20px rgba(0,0,0,0.75))

#### Navigation

Sticky header navigation with glassmorphism effect.

```css
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(28, 41, 72, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 3rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 170, 255, 0.1);
}
```

**Navigation Features:**
- Sticky positioning for constant access
- Backdrop blur for depth perception
- Border accent with accent color
- Centered logo with email subtitle
- Social icons with hover effects

---

## 03. Layout & Grid

### Responsive Grid System

The layout uses CSS Grid and Flexbox for responsive, flexible designs.

#### Two-Column Hero Layout

```css
.hero {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  align-items: start;
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
  }
}
```

**Design Principles:**
- **1fr : 2fr** ratio gives prominence to content while maintaining visual balance
- Profile image on left, terminal/content on right
- Collapses to single column on mobile devices
- Maximum width of 1400px prevents excessive stretching on large screens

#### Projects Grid

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
```

#### Content Containers

- **Maximum Width**: 1200-1400px for readability
- **Padding**: 2-4rem on sections for breathing room
- **Gap**: 2rem between grid items for visual separation
- **Margin**: Centered with `margin: 0 auto`

---

## 04. Web Development Best Practices

### Performance Optimization

**1. Minimize HTTP Requests**
- Combine CSS files where possible
- Use CSS instead of images for simple shapes and effects
- Lazy load images and heavy content

**2. Optimize Assets**
```html
<!-- Use appropriate image formats -->
<img src="image.webp" alt="Description" loading="lazy">

<!-- Preload critical fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preload" as="font" type="font/woff2" crossorigin>
```

**3. CSS Optimization**
```css
/* Use CSS custom properties for easy theming */
:root {
  --dark-bg: #161B33;
  --accent: #00aaff;
}

/* Utilize transform for animations (GPU accelerated) */
.card:hover {
  transform: translateY(-4px);
}
```

### Accessibility (a11y)

**1. Semantic HTML**
```html
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/blog">Blog</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Page Title</h1>
    <!-- Content -->
  </article>
</main>

<footer>
  <!-- Footer content -->
</footer>
```

**2. Keyboard Navigation**
- All interactive elements accessible via Tab key
- Visible focus indicators on all focusable elements
- Skip navigation links for screen reader users
- Logical tab order matching visual layout

**3. ARIA Labels**
```html
<button aria-label="Open navigation menu">
  <span aria-hidden="true">☰</span>
</button>

<div role="alert" aria-live="polite">
  Form submitted successfully!
</div>
```

**4. Alt Text for Images**
```html
<!-- Decorative images -->
<img src="pattern.svg" alt="" role="presentation">

<!-- Meaningful images -->
<img src="network-diagram.png" alt="Network topology showing firewall between DMZ and internal network">
```

### Security Best Practices

**1. Content Security Policy (CSP)**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://trusted-cdn.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;">
```

**2. External Links**
```html
<!-- Add rel attributes for security -->
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>
```

**3. Form Security**
```html
<form method="POST" action="/submit">
  <!-- CSRF token -->
  <input type="hidden" name="csrf_token" value="{{ csrf_token }}">
  
  <!-- Input validation -->
  <input type="email" name="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
</form>
```

### SEO Optimization

**1. Meta Tags**
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Cybersecurity professional specializing in offensive security and penetration testing">
  <meta name="keywords" content="cybersecurity, penetration testing, security research">
  
  <!-- Open Graph for social sharing -->
  <meta property="og:title" content="Martin Topp - Security Engineer">
  <meta property="og:description" content="Cybersecurity portfolio and blog">
  <meta property="og:image" content="https://mtsaga.net/assets/og-image.png">
  <meta property="og:url" content="https://mtsaga.net">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Martin Topp - Security Engineer">
  <meta name="twitter:description" content="Cybersecurity portfolio and blog">
</head>
```

**2. Semantic Structure**
- Use proper heading hierarchy (H1 → H2 → H3)
- One H1 per page (page title)
- Descriptive URLs (e.g., `/blog/active-directory-attacks` not `/blog/post-123`)

**3. Structured Data (JSON-LD)**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Martin Topp",
  "jobTitle": "Security Engineer",
  "url": "https://mtsaga.net",
  "sameAs": [
    "https://linkedin.com/in/martin-topp",
    "https://github.com/mt292"
  ]
}
</script>
```

### Responsive Design

**1. Mobile-First Approach**
```css
/* Base styles for mobile */
.container {
  padding: 1rem;
}

/* Enhance for larger screens */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

@media (min-width: 1200px) {
  .container {
    padding: 3rem;
  }
}
```

**2. Flexible Images**
```css
img {
  max-width: 100%;
  height: auto;
}
```

**3. Viewport Units**
```css
/* Responsive typography */
h1 {
  font-size: clamp(2rem, 5vw, 3rem);
}
```

### Browser Compatibility

**1. CSS Feature Detection**
```css
/* Fallback for browsers without backdrop-filter */
.header {
  background: rgba(28, 41, 72, 0.95);
}

@supports (backdrop-filter: blur(10px)) {
  .header {
    backdrop-filter: blur(10px);
  }
}
```

**2. Vendor Prefixes (when needed)**
```css
.element {
  -webkit-transform: translateY(-4px);
  -moz-transform: translateY(-4px);
  -ms-transform: translateY(-4px);
  transform: translateY(-4px);
}
```

---

## 05. Animation & Interaction

### Transition Principles

All animations follow these guidelines:
- **Duration**: 0.2-0.3s for UI feedback, 0.5-1s for page transitions
- **Easing**: Use `ease` or `ease-in-out` for natural motion
- **Performance**: Animate `transform` and `opacity` (GPU-accelerated)

**Example: Hover Effects**
```css
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 170, 255, 0.3);
}
```

### Interactive Terminal

The hero terminal uses `xterm.js` for authentic terminal emulation:
- Typing animation for commands
- Realistic terminal output
- Scrollable viewport
- Monospace font rendering

### Respect User Preferences

```css
/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Respect color scheme preferences */
@media (prefers-color-scheme: light) {
  :root {
    /* Light theme overrides if implemented */
  }
}
```

---

## 06. Code Standards

### CSS Architecture

**1. CSS Custom Properties**
```css
:root {
  /* Color palette */
  --dark-bg: #161B33;
  --section-bg: #1c2948;
  --card-bg: #22305a;
  --fg: #e4e6eb;
  --muted: #8a9bb8;
  --accent: #00aaff;
  --footer-bg: #0f1724;
  
  /* Spacing scale */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 4rem;
}
```

**2. BEM Methodology (where applicable)**
```css
/* Block */
.card { }

/* Element */
.card__header { }
.card__body { }
.card__footer { }

/* Modifier */
.card--featured { }
.card--dark { }
```

**3. Commenting**
```css
/* ===================================
   HEADER & NAVIGATION
   =================================== */

/* Sticky header with glassmorphism effect */
.header {
  /* styles */
}
```

### HTML Best Practices

**1. DOCTYPE and Meta Tags**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title - mtsaga.net</title>
</head>
```

**2. Semantic Elements**
```html
<!-- Good -->
<article>
  <header>
    <h1>Article Title</h1>
    <time datetime="2026-02-11">February 11, 2026</time>
  </header>
  <p>Content...</p>
</article>

<!-- Avoid -->
<div class="article">
  <div class="header">
    <div class="title">Article Title</div>
  </div>
</div>
```

---

## 07. Implementation Guide

### Getting Started

**1. HTML Structure**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>mtsaga.net</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
</head>
<body>
  <header class="header">
    <!-- Navigation -->
  </header>
  
  <main>
    <!-- Page content -->
  </main>
  
  <footer class="footer">
    <!-- Footer content -->
  </footer>
</body>
</html>
```

**2. CSS Reset**
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: var(--dark-bg);
  color: var(--fg);
  line-height: 1.6;
}

a {
  text-decoration: none;
  color: inherit;
}

img {
  max-width: 100%;
  height: auto;
}
```

### Testing Checklist

- [ ] **Accessibility**: Test with screen reader (NVDA/JAWS), check color contrast
- [ ] **Performance**: Lighthouse score > 90, measure Core Web Vitals
- [ ] **Responsiveness**: Test on mobile (375px), tablet (768px), desktop (1920px)
- [ ] **Browser Testing**: Chrome, Firefox, Safari, Edge
- [ ] **Keyboard Navigation**: All functionality accessible without mouse
- [ ] **SEO**: Valid meta tags, proper heading hierarchy, sitemap.xml
- [ ] **Security**: CSP headers, HTTPS, secure external links

---

## 08. Resources & Tools

### Design Tools
- **Figma**: UI design and prototyping
- **Color Contrast Checker**: [WebAIM](https://webaim.org/resources/contrastchecker/)
- **CSS Grid Generator**: [cssgrid-generator.netlify.app](https://cssgrid-generator.netlify.app/)

### Development Tools
- **VS Code**: Primary development environment
- **Chrome DevTools**: Debugging and performance analysis
- **Lighthouse**: Performance and accessibility auditing
- **axe DevTools**: Accessibility testing

### Testing Resources
- **Can I Use**: Browser compatibility checks
- **HTML Validator**: [validator.w3.org](https://validator.w3.org/)
- **CSS Validator**: [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/)

### Documentation
- **MDN Web Docs**: Comprehensive web development reference
- **WCAG Guidelines**: Accessibility standards
- **web.dev**: Performance and best practices guides

---

## Conclusion

The mtsaga.net design system balances technical aesthetics with professional presentation, accessibility with visual appeal, and innovation with usability. Every element is purposefully designed to support the core mission: showcasing cybersecurity expertise and technical projects in an authentic, accessible manner.

This is a living document that evolves as the site grows. Design decisions are documented, best practices are followed, and user experience remains the top priority.

**Design is not just what it looks like and feels like. Design is how it works.**

For questions or suggestions about this design system, reach out at [martin@mtsaga.net](mailto:martin@mtsaga.net).

---

*Last updated: February 11, 2026*
