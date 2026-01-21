# Quick Start Guide

## Get Your Blog Running in 3 Steps

### 1. Install Dependencies

```bash
cd ~/GitHub/mt292.github.io
bundle install
```

### 2. Start the Local Server

```bash
bundle exec jekyll serve
```

### 3. View Your Blog

Open your browser and go to:
- Blog homepage: `http://localhost:4000/blog`
- Sample post: `http://localhost:4000/blog/2025/01/21/welcome-to-my-blog/`

## Create Your First Post

```bash
# Create a new post file
touch _posts/$(date +%Y-%m-%d)-my-first-post.md

# Edit the file and add:
```

```yaml
---
layout: post
title: "My First Post"
date: 2025-01-21 12:00:00 -0500
categories: [Cybersecurity]
tags: [tutorial, security]
description: "My first blog post about cybersecurity"
toc: true
---

## Introduction

Your content here...
```

## Deploy to GitHub Pages

```bash
git add .
git commit -m "Add blog to website"
git push origin main
```

Your blog will be live at `https://mtsaga.net/blog` within a few minutes!

## Key Files

- **Write posts**: `_posts/YYYY-MM-DD-title.md`
- **Blog config**: `_config.yml`
- **Blog styles**: `assets/blog.css`
- **Add images**: `assets/blog/`

## Need Help?

See [BLOG_README.md](BLOG_README.md) for detailed documentation.
