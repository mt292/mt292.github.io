// Enhanced Features for Portfolio
// (c) 2025 Martin Topp

// ============= CURSOR TRAIL =============
(function initCursorTrail() {
  const trailLength = 15;
  const trails = [];
  
  // Create trail elements
  for (let i = 0; i < trailLength; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.opacity = (trailLength - i) / trailLength * 0.5;
    trail.style.width = trail.style.height = `${12 - i * 0.5}px`;
    document.body.appendChild(trail);
    trails.push({ element: trail, x: 0, y: 0 });
  }
  
  let mouseX = 0, mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animateTrails() {
    let x = mouseX;
    let y = mouseY;
    
    trails.forEach((trail, index) => {
      trail.x += (x - trail.x) * 0.3;
      trail.y += (y - trail.y) * 0.3;
      
      trail.element.style.left = trail.x + 'px';
      trail.element.style.top = trail.y + 'px';
      
      x = trail.x;
      y = trail.y;
    });
    
    requestAnimationFrame(animateTrails);
  }
  
  animateTrails();
})();

// ============= SCROLL ANIMATIONS =============
(function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Observe all sections and cards
  const animatedElements = document.querySelectorAll('.section, .service-card, .project-window');
  animatedElements.forEach(el => {
    el.classList.add('scroll-fade');
    observer.observe(el);
  });
})();

// ============= PROJECT FILTERS =============
(function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-window');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      
      projects.forEach(project => {
        const categories = project.getAttribute('data-category') || '';
        
        if (filter === 'all' || categories.includes(filter)) {
          project.style.display = 'block';
          setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'scale(1)';
          }, 10);
        } else {
          project.style.opacity = '0';
          project.style.transform = 'scale(0.9)';
          setTimeout(() => {
            project.style.display = 'none';
          }, 300);
        }
      });
    });
  });
})();

// ============= SMOOTH SCROLL FOR ANCHOR LINKS =============
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
})();

console.log('✨ Enhanced features loaded successfully');
