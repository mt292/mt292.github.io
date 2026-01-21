# Blog Setup Instructions

## Overview

This blog is built with Jekyll and uses a custom theme inspired by Chirpy, styled to match your main website design. The blog features:

- Custom dark theme with blue accents (matching your main site)
- Orbitron font for headings
- Responsive card-based layout
- Table of contents for posts
- Syntax highlighting for code
- Tags and categories
- Pagination support
- Math support (KaTeX)

## Getting Started

### 1. Install Jekyll

First, install Jekyll and Bundler:

```bash
gem install jekyll bundler
```

### 2. Install Dependencies

From your repository root, run:

```bash
bundle install
```

### 3. Serve Locally

To preview your blog locally:

```bash
bundle exec jekyll serve
```

Then visit `http://localhost:4000/blog` in your browser.

## Writing Posts

### Creating a New Post

1. Create a new file in the `_posts` directory with the format: `YYYY-MM-DD-title.md`
2. Add front matter at the top of the file:

```yaml
---
layout: post
title: "Your Post Title"
date: 2025-01-21 12:00:00 -0500
categories: [Category1, Category2]
tags: [tag1, tag2, tag3]
description: "A brief description of your post for SEO"
image: image-filename.png  # Optional, place in assets/blog/
toc: true  # Enable table of contents
math: false  # Enable math rendering with KaTeX
---
```

3. Write your content using Markdown

### Post Front Matter Options

- **layout**: Always use `post`
- **title**: Post title (required)
- **date**: Publication date and time (required)
- **categories**: List of categories (optional)
- **tags**: List of tags (optional)
- **description**: SEO description (recommended)
- **image**: Featured image filename (optional, place in `assets/blog/`)
- **toc**: Enable/disable table of contents (default: true)
- **math**: Enable/disable KaTeX math rendering (default: false)

### Markdown Features

#### Code Blocks

Use fenced code blocks with syntax highlighting:

\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`

#### Headings

Use standard Markdown headings. They'll automatically be included in the TOC:

```markdown
## Main Section
### Subsection
#### Sub-subsection
```

#### Math Equations

When `math: true` is enabled in front matter:

Inline: `$E = mc^2$`

Display: `$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$`

#### Images

```markdown
![Alt text](/assets/blog/image.png)
```

#### Tables

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

## File Structure

```
.
├── _config.yml           # Jekyll configuration
├── Gemfile              # Ruby dependencies
├── blog/
│   └── index.html       # Blog homepage
├── _layouts/
│   ├── default.html     # Base layout
│   ├── home.html        # Blog listing layout
│   └── post.html        # Individual post layout
├── _includes/
│   └── toc.html         # Table of contents generator
├── _posts/
│   └── YYYY-MM-DD-title.md  # Your blog posts
└── assets/
    ├── blog.css         # Blog-specific styles
    └── blog/            # Blog images and assets
```

## Configuration

Edit `_config.yml` to customize:

- Site title and description
- Author information
- Social media links
- Pagination settings
- Timezone
- Plugins

## Deployment

### GitHub Pages

1. Push your changes to GitHub
2. Ensure GitHub Pages is enabled in your repository settings
3. Set the source to your main branch

### Manual Build

To build the site manually:

```bash
bundle exec jekyll build
```

The built site will be in the `_site` directory.

## Adding Images

1. Place images in `assets/blog/`
2. Reference in posts: `/assets/blog/image.png`
3. Use descriptive filenames

## Tips

### Writing Tips

- Use descriptive titles and headings
- Include a clear introduction
- Add code examples where relevant
- Use images and diagrams to illustrate concepts
- Include related tags for better discoverability

### SEO Best Practices

- Write clear meta descriptions
- Use relevant tags and categories
- Include alt text for images
- Create shareable content
- Link to related posts

### Performance

- Optimize images before uploading
- Use appropriate image formats (PNG for screenshots, JPG for photos)
- Keep posts focused and reasonably sized

## Customization

### Colors

Edit CSS variables in `assets/blog.css`:

```css
:root {
  --dark-bg: #161B33;
  --section-bg: #1c2948;
  --card-bg: #22305a;
  --fg: #e4e6eb;
  --muted: #8a9bb8;
  --accent: #00aaff;
}
```

### Fonts

The blog uses:
- **Orbitron**: Headings and key text (matches main site)
- **Segoe UI**: Body text
- **Courier New**: Code blocks

## Troubleshooting

### Jekyll Not Building

- Check for errors in `_config.yml` syntax
- Ensure all front matter is valid YAML
- Verify file names follow `YYYY-MM-DD-title.md` format

### Styles Not Loading

- Clear browser cache
- Check file paths in layout files
- Ensure `style.css` and `blog.css` exist

### Posts Not Showing

- Verify post date is not in the future
- Check file name format
- Ensure front matter includes `layout: post`

## Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Kramdown Syntax](https://kramdown.gettalong.org/syntax.html)
- [Liquid Template Language](https://shopify.github.io/liquid/)
- [Chirpy Theme](https://github.com/cotes2020/jekyll-theme-chirpy)

## Support

For questions or issues:
- Email: mt@mtsaga.net
- GitHub: [github.com/mt292](https://github.com/mt292)
