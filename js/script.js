// ano no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// menu mobile
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 500);
});

// scroll reveal
const revealEls = document.querySelectorAll('.section, .hero');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .7s ease, transform .7s ease';
  io.observe(el);
});
// hero visible imediatamente (acima da dobra)
requestAnimationFrame(() => {
  const hero = document.querySelector('.hero');
  hero.style.opacity = '1';
  hero.style.transform = 'translateY(0)';
});

// toggle idioma PT/EN
const langToggle = document.getElementById('langToggle');
let currentLang = localStorage.getItem('lang') || 'pt';

function applyLang(lang) {
  document.querySelectorAll('[data-pt]').forEach(el => {
    const text = lang === 'pt' ? el.getAttribute('data-pt') : el.getAttribute('data-en');
    if (text) el.textContent = text;
  });
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  localStorage.setItem('lang', lang);
  currentLang = lang;
}

langToggle.addEventListener('click', () => {
  applyLang(currentLang === 'pt' ? 'en' : 'pt');
});

applyLang(currentLang);
