// Lenis smooth scrolling
const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 2 });

const nav = document.querySelector('nav, .detail-nav');
const hero = document.getElementById('hero');

// Stacking card setup
const stackCards = Array.from(document.querySelectorAll('.portfolio-stack .portfolio-card'));
const navH = 72;
const cardData = stackCards.map(card => ({
  el: card,
  top: card.getBoundingClientRect().top + window.scrollY,
  height: card.offsetHeight,
}));

function updateStackingCards(scroll) {
  cardData.forEach(({ el, height }, i) => {
    if (i === cardData.length - 1) return;
    const next = cardData[i + 1];
    // Start shrinking when next card's top enters the viewport at bottom of current card
    const startScroll = next.top - height - navH;
    const progress = Math.max(0, Math.min(1, (scroll - startScroll) / height));
    if (progress > 0) {
      el.style.transform = `scale(${1 - progress * 0.15})`;
      el.style.filter = `blur(${progress * 6}px)`;
    } else {
      el.style.transform = '';
      el.style.filter = '';
    }
  });
}

lenis.on('scroll', ({ scroll }) => {
  nav?.classList.toggle('scrolled', scroll > 60);
  if (hero) {
    nav?.classList.toggle('past-hero', scroll >= hero.offsetHeight - 80);
  }
  updateStackingCards(scroll);
});

function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// Run once on load for initial state
updateStackingCards(window.scrollY);

// Hero scroll button
const scrollBtn = document.querySelector('.hero-scroll-arrow');
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => lenis.scrollTo('#work'));
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

// Footer text fitting — measures actual rendered width after fonts load
function fitFooterText() {
  const inner = document.querySelector('.footer-inner');
  const copyright = document.querySelector('.footer-copyright');
  if (!inner || !copyright) return;

  const test = document.createElement('div');
  test.style.cssText = 'position:absolute;top:-9999px;left:-9999px;white-space:nowrap;' +
    'font-family:Gloock,Georgia,serif;font-weight:400;letter-spacing:-0.02em;font-size:100px;visibility:hidden';
  test.textContent = '© — 2026';
  document.body.appendChild(test);
  const widthAt100 = test.offsetWidth;
  document.body.removeChild(test);

  if (!widthAt100) return;
  const targetSize = Math.floor((inner.clientWidth / widthAt100) * 100);
  copyright.style.fontSize = targetSize + 'px';
}

document.fonts.ready.then(fitFooterText);
window.addEventListener('resize', fitFooterText);

// Footer copyright character animation
const footerCopyright = document.querySelector('.footer-copyright');
if (footerCopyright) {
  const text = footerCopyright.textContent.trim();
  footerCopyright.innerHTML = text.split('').map((char, i) =>
    `<span class="footer-char" style="transition-delay:${i * 0.06}s">${char === ' ' ? '&nbsp;' : char}</span>`
  ).join('');

  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.footer-char').forEach(char => char.classList.add('visible'));
        footerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  footerObserver.observe(footerCopyright);
}

fitFooterText(); // immediate call — corrected again when fonts resolve

// Liquid fill animation for insight card pairs
document.querySelectorAll('.insight-card-pair').forEach(pair => {
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => pair.classList.add('liquid-animate'), 300);
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  obs.observe(pair);
});

// Word marker highlight animation
document.querySelectorAll('mark.word-marker').forEach(mark => {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.8 }).observe(mark);
});

// "View" cursor chip on portfolio cards
const chip = document.createElement('div');
chip.className = 'cursor-chip';
chip.textContent = 'View';
document.body.appendChild(chip);

document.querySelectorAll('.portfolio-card').forEach(card => {
  card.addEventListener('mouseenter', () => chip.classList.add('visible'));
  card.addEventListener('mouseleave', () => chip.classList.remove('visible'));
  card.addEventListener('mousemove', e => {
    chip.style.left = e.clientX + 'px';
    chip.style.top = e.clientY + 'px';
  });
});
