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
  document.querySelectorAll('[data-pt-placeholder]').forEach(el => {
    const text = lang === 'pt' ? el.getAttribute('data-pt-placeholder') : el.getAttribute('data-en-placeholder');
    if (text) el.placeholder = text;
  });
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  localStorage.setItem('lang', lang);
  currentLang = lang;
}

langToggle.addEventListener('click', () => {
  applyLang(currentLang === 'pt' ? 'en' : 'pt');
});

applyLang(currentLang);

// efeito hacker: letras embaralhadas no hover dos títulos
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#01アイウエオ';

function scramble(el) {
  if (el._scrambleTimer) {
    clearInterval(el._scrambleTimer);
  } else {
    el.dataset.originalText = el.textContent;
  }
  const original = el.dataset.originalText;
  const totalFrames = 12;
  let frame = 0;

  el._scrambleTimer = setInterval(() => {
    frame++;
    el.textContent = original
      .split('')
      .map((ch, i) => {
        if (ch === ' ') return ' ';
        const revealAt = (i / original.length) * totalFrames;
        if (frame > revealAt + 3) return ch;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join('');

    if (frame >= totalFrames + 3) {
      el.textContent = original;
      clearInterval(el._scrambleTimer);
    }
  }, 35);
}

document.querySelectorAll('.scramble').forEach(el => {
  el.addEventListener('mouseenter', () => scramble(el));
});

// chatbot simulado (FAQ) — unica interacao possivel e clicar nas sugestoes
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotMessages = document.getElementById('chatbotMessages');

const CHATBOT_FAQ = [
  {
    pt: 'Quais suas principais skills?',
    en: 'What are your main skills?',
    aPt: 'Sou especialista em Playwright e Cypress para automação E2E, com forte atuação em testes de API (Postman/Newman), performance (K6) e integração de IA (MCP, RAG, GitHub Copilot PRO) em fluxos de QA.',
    aEn: "I'm a specialist in Playwright and Cypress for E2E automation, with strong experience in API testing (Postman/Newman), performance (K6) and AI integration (MCP, RAG, GitHub Copilot PRO) in QA workflows."
  },
  {
    pt: 'Qual sua experiência atual?',
    en: "What's your current role?",
    aPt: 'Sou Analista QA Sênior III na Webjump desde 2022, liderando automação E2E com Playwright em projetos Salesforce e iniciativas de IA aplicada a QA.',
    aEn: "I'm a Senior QA Analyst III at Webjump since 2022, leading E2E automation with Playwright on Salesforce projects and AI initiatives applied to QA."
  },
  {
    pt: 'Você trabalha com Inteligência Artificial?',
    en: 'Do you work with AI?',
    aPt: 'Sim! Sou pioneiro na integração de IA e LLMs em fluxos de QA — expandi 20 para 180 cenários automatizados em 1 mês usando GitHub Copilot PRO.',
    aEn: 'Yes! I pioneer AI and LLM integration into QA workflows — I scaled 20 to 180 automated scenarios in 1 month using GitHub Copilot PRO.'
  },
  {
    pt: 'Quais suas certificações?',
    en: 'What certifications do you have?',
    aPt: 'Tenho certificações em Playwright, Cypress, Postman/Newman, K6, LangChain, MCP e GitHub Copilot, entre outras. Dá uma olhada na seção Certificações! 👆',
    aEn: 'I hold certifications in Playwright, Cypress, Postman/Newman, K6, LangChain, MCP and GitHub Copilot, among others. Check the Certifications section! 👆'
  },
  {
    pt: 'Você está disponível para novas oportunidades?',
    en: 'Are you open to new opportunities?',
    aPt: 'Sim, estou aberto a oportunidades em Quality Assurance! Bora conversar? 🚀',
    aEn: "Yes, I'm open to Quality Assurance opportunities! Let's talk? 🚀"
  },
  {
    pt: 'Como posso entrar em contato?',
    en: 'How can I contact you?',
    aPt: 'Manda um e-mail pra luisfernandosilveira23@gmail.com ou me chama no LinkedIn — os links estão na seção Contato!',
    aEn: 'Send an email to luisfernandosilveira23@gmail.com or reach out on LinkedIn — the links are in the Contact section!'
  }
];

let chatbotAsked = new Set();
let chatbotOpen = false;

function chatbotAddMessage(text, sender) {
  const div = document.createElement('div');
  div.className = 'chatbot-msg chatbot-msg--' + sender;
  div.textContent = text;
  chatbotMessages.appendChild(div);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return div;
}

function chatbotRenderSuggestions() {
  const old = chatbotMessages.querySelector('.chatbot-suggestions');
  if (old) old.remove();

  const remaining = CHATBOT_FAQ.map((_, i) => i).filter(i => !chatbotAsked.has(i));
  const wrap = document.createElement('div');
  wrap.className = 'chatbot-suggestions';

  if (remaining.length === 0) {
    chatbotAddMessage(
      currentLang === 'pt'
        ? 'Isso é tudo que eu sei responder por aqui! 👋 Bora trocar uma ideia de verdade? Me chama no e-mail ou LinkedIn.'
        : "That's everything I can answer here! 👋 Want to talk for real? Reach me by email or LinkedIn.",
      'bot'
    );
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'chatbot-suggestion';
    resetBtn.textContent = currentLang === 'pt' ? '↺ Reiniciar conversa' : '↺ Restart conversation';
    resetBtn.addEventListener('click', chatbotReset);
    wrap.appendChild(resetBtn);
    chatbotMessages.appendChild(wrap);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return;
  }

  remaining.forEach(i => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chatbot-suggestion';
    btn.textContent = currentLang === 'pt' ? CHATBOT_FAQ[i].pt : CHATBOT_FAQ[i].en;
    btn.addEventListener('click', () => chatbotAsk(i));
    wrap.appendChild(btn);
  });
  chatbotMessages.appendChild(wrap);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function chatbotAsk(i) {
  if (chatbotAsked.has(i)) return;
  chatbotAsked.add(i);

  const old = chatbotMessages.querySelector('.chatbot-suggestions');
  if (old) old.remove();

  const q = currentLang === 'pt' ? CHATBOT_FAQ[i].pt : CHATBOT_FAQ[i].en;
  const a = currentLang === 'pt' ? CHATBOT_FAQ[i].aPt : CHATBOT_FAQ[i].aEn;
  chatbotAddMessage(q, 'user');

  const typing = document.createElement('div');
  typing.className = 'chatbot-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  chatbotMessages.appendChild(typing);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

  setTimeout(() => {
    typing.remove();
    chatbotAddMessage(a, 'bot');
    chatbotRenderSuggestions();
  }, 600 + Math.random() * 400);
}

function chatbotReset() {
  chatbotAsked.clear();
  chatbotMessages.innerHTML = '';
  chatbotAddMessage(
    currentLang === 'pt'
      ? 'Oi! 👋 Sou o assistente virtual do Luís. Escolhe uma pergunta aí embaixo:'
      : "Hi! 👋 I'm Luís's virtual assistant. Pick a question below:",
    'bot'
  );
  chatbotRenderSuggestions();
}

chatbotToggle.addEventListener('click', () => {
  chatbotOpen = !chatbotOpen;
  chatbotToggle.classList.toggle('open', chatbotOpen);
  chatbotPanel.classList.toggle('open', chatbotOpen);
  document.body.classList.toggle('chatbot-open', chatbotOpen);
  if (chatbotOpen && !chatbotMessages.children.length) {
    chatbotReset();
  }
});
