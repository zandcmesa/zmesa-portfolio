// Nav scroll behavior
const nav = document.querySelector('nav, .detail-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// Smooth scroll for hero scroll button
const scrollBtn = document.querySelector('.hero-scroll-arrow');
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 0.05, 0.3)}s`;
  observer.observe(el);
});
