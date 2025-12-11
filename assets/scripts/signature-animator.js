// Signature SVG Animation Controller
// Fully controls the signature drawing animation via JavaScript

class SignatureAnimator {
  constructor(svgElement, options = {}) {
    // Accept SVG element directly, not a selector
    this.svg = svgElement;
    if (!this.svg) {
      console.error('SignatureAnimator: No SVG element provided');
      return;
    }

    console.log('SignatureAnimator: Initializing with SVG:', this.svg);

    // Configuration options
    this.config = {
      speed: options.speed || 1, // 1 = normal, 0.5 = half speed, 2 = double speed
      startDelay: options.startDelay || 0,
      easing: options.easing || 'ease-in-out',
      color: options.color || '#ffffff',
      ...options
    };

    this.masks = Array.from(this.svg.querySelectorAll('[id^="m"]'));
    this.groups = Array.from(this.svg.querySelectorAll('[data-order]')).sort(
      (a, b) => parseInt(a.getAttribute('data-order')) - parseInt(b.getAttribute('data-order'))
    );

    this.animationSequence = [
      { mask: 'm1', duration: 0.38, delay: 0 },
      { mask: 'm2', duration: 0.545, delay: 0.41 },
      { mask: 'm3', duration: 0.38, delay: 0.985 },
      { mask: 'm4', duration: 0.787, delay: 0.395 },
      { mask: 'm5', duration: 1.01, delay: 0.25 },
      { mask: 'm6', duration: 0.38, delay: 0.29 },
      { mask: 'm7', duration: 0.38, delay: 0.70 }
    ];

    this.init();
  }

  init() {
    console.log('SignatureAnimator: Starting animation with', this.groups.length, 'groups');
    
    // Make sure all groups are visible (masks control visibility)
    this.groups.forEach(group => {
      group.style.opacity = '1';
    });

    // Start animation after startDelay
    setTimeout(() => {
      console.log('SignatureAnimator: Beginning mask animations');
      this.animate();
    }, this.config.startDelay * 1000);
  }

  animate() {
    this.animationSequence.forEach((step, index) => {
      const delay = (step.delay * 1000) / this.config.speed;
      const duration = (step.duration * 1000) / this.config.speed;

      setTimeout(() => {
        this.animateMask(step.mask, duration);
      }, delay);
    });
  }

  animateMask(maskId, duration) {
    const mask = this.svg.querySelector(`#${maskId}`);
    if (!mask) {
      console.warn('SignatureAnimator: Mask not found:', maskId);
      return;
    }

    const rect = mask.querySelector('rect:last-of-type');
    if (!rect) {
      console.warn('SignatureAnimator: Rect not found in mask:', maskId);
      return;
    }

    // Get the target height from the rect (what it should animate to)
    const targetHeight = parseFloat(rect.getAttribute('height'));
    const currentWidth = parseFloat(rect.getAttribute('width')) || 0;

    console.log(`SignatureAnimator: Animating ${maskId} from ${currentWidth} to ${targetHeight} over ${duration}ms`);

    // Animate width on the rect inside the mask from 0 to targetHeight
    this.animateValue(
      currentWidth,
      targetHeight,
      duration,
      (value) => {
        rect.setAttribute('width', value);
      },
      () => {
        console.log(`SignatureAnimator: Completed animation for ${maskId}`);
      }
    );
  }

  animateValue(start, end, duration, onProgress, onComplete) {
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Apply easing
      const easeProgress = this.easeInOutCubic(progress);
      const currentValue = start + (end - start) * easeProgress;

      onProgress(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  setSpeed(speedMultiplier) {
    this.config.speed = speedMultiplier;
    // Restart animation with new speed
    this.init();
  }

  setColor(color) {
    this.config.color = color;
    const paths = this.svg.querySelectorAll('path, ellipse');
    paths.forEach(path => {
      path.setAttribute('fill', color);
    });
    const rects = this.svg.querySelectorAll('defs rect[fill="#fff"]');
    rects.forEach(rect => {
      rect.setAttribute('fill', color);
    });
  }

  restart() {
    // Reset all mask rects to width 0
    this.animationSequence.forEach((step) => {
      const mask = this.svg.querySelector(`#${step.mask}`);
      if (mask) {
        const rect = mask.querySelector('rect:last-of-type');
        if (rect) {
          rect.setAttribute('width', '0');
        }
      }
    });
    
    // Restart animation
    setTimeout(() => this.animate(), 100);
  }
}

// Expose globally for use by loader script
window.SignatureAnimator = SignatureAnimator;
