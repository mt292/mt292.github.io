
document.addEventListener('DOMContentLoaded', () => {
  fetch('posts.json')
    .then(res => res.json())
    .then(posts => {
      const container = document.getElementById('blog-list');
      posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'project-window';
        card.innerHTML = `
          <div class="mac-header">
            <span class="mac-btn red"></span>
            <span class="mac-btn yellow"></span>
            <span class="mac-btn green"></span>
            <div class="project-label">${post.title}</div>
          </div>
          <div class="project-content">
            <img src="${post.thumbnail}" alt="${post.title}" />
            <p>${post.description}</p>
            <p style="color: #8a9bb8; font-size: 0.8rem;">${post.date}</p>
          </div>
          <div class="project-overlay">
            <a href="posts/${post.slug}.html" class="btn">Read Post</a>
          </div>
        `;
        container.appendChild(card);
      });
    });
});
