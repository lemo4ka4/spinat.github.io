// ===== Печатающийся текст =====
const phrases = ['строю в Minecraft', 'выживаю в хардкоре', 'снимаю видео', 'прохожу челленджи', 'Spinat! ⛏️'];
const typedEl = document.getElementById('typed');
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const phrase = phrases[phraseIndex];
  typedEl.textContent = phrase.slice(0, charIndex);

  if (!deleting && charIndex < phrase.length) {
    charIndex++;
    setTimeout(type, 80);
  } else if (deleting && charIndex > 0) {
    charIndex--;
    setTimeout(type, 40);
  } else {
    if (!deleting) {
      deleting = true;
      setTimeout(type, 1500);
    } else {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 350);
    }
  }
}
type();

// ===== Мобильное меню =====
const burger = document.getElementById('burger');
const navList = document.querySelector('.nav-list');

burger.addEventListener('click', () => {
  const isOpen = navList.classList.toggle('open');
  burger.classList.toggle('active', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
});

navList.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    navList.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
  })
);

// ===== Анимация появления секций при скролле =====
const sections = document.querySelectorAll('.section');
sections.forEach(s => s.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

sections.forEach(s => observer.observe(s));

// ===== Падающие листья (фоновая анимация) =====
const leavesLayer = document.querySelector('.bg-leaves');

if (leavesLayer) {
  const LEAF_COLORS = ['#ffffff', '#bbbbbb', '#888888', '#dddddd', '#999999'];
  const LEAF_SVG = color => `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="${color}">
      <path d="M20 4C10 4 4 10 4 20c10 0 16-6 16-16z"/>
      <path d="M6 18C9 13 13 9 18 6" stroke="#000000" stroke-width="1.2" fill="none" opacity=".4"/>
    </svg>`;

  const LEAF_COUNT = 16;

  for (let i = 0; i < LEAF_COUNT; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.style.left = (Math.random() * 100) + 'vw';
    leaf.style.setProperty('--dur', (9 + Math.random() * 10) + 's');
    leaf.style.setProperty('--delay', (-Math.random() * 14) + 's');
    leaf.style.setProperty('--sway', (3 + Math.random() * 4) + 's');
    leaf.style.setProperty('--amp', (18 + Math.random() * 40) + 'px');
    leaf.innerHTML = LEAF_SVG(LEAF_COLORS[i % LEAF_COLORS.length]);
    const scale = 0.6 + Math.random() * 0.8;
    leaf.firstElementChild.style.width = (22 * scale) + 'px';
    leaf.firstElementChild.style.height = (22 * scale) + 'px';
    leavesLayer.appendChild(leaf);
  }
}

// ===== Живой чудик: убегает и прячется от курсора =====
(function () {
  // На тач-устройствах не запускаем
  if (window.matchMedia('(hover: none)').matches) return;

  const chudik = document.createElement('div');
  chudik.id = 'chudik';
  chudik.title = 'Поймай меня, если сможешь!';
  chudik.innerHTML = `
    <svg viewBox="0 0 64 64" width="54" height="54">
      <g class="chudik-body">
        <path d="M32 6c-13 0-20 10-20 24 0 10 2 16 6 16 3 0 4-4 7-4s4 4 7 4 4-4 7-4 4 4 7 4c4 0 6-6 6-16C52 16 45 6 32 6z" fill="#ffffff"/>
        <ellipse class="chudik-eye" cx="25" cy="28" rx="4.5" ry="5.5" fill="#000"/>
        <ellipse class="chudik-eye" cx="39" cy="28" rx="4.5" ry="5.5" fill="#000"/>
        <circle cx="26.5" cy="26" r="1.6" fill="#fff"/>
        <circle cx="40.5" cy="26" r="1.6" fill="#fff"/>
      </g>
    </svg>`;
  document.body.appendChild(chudik);

  let x = Math.random() * (window.innerWidth - 120) + 40;
  let y = Math.random() * (window.innerHeight - 160) + 80;
  let hiding = false;
  let fleeCooldown = 0;

  function place() {
    chudik.style.left = x + 'px';
    chudik.style.top = y + 'px';
  }
  place();

  function flee() {
    const now = Date.now();
    if (hiding || now < fleeCooldown) return;

    // Иногда чудик прячется целиком и высовывается в другом месте
    if (Math.random() < 0.35) {
      hiding = true;
      chudik.classList.add('is-hiding');
      setTimeout(() => {
        x = Math.random() * (window.innerWidth - 120) + 40;
        y = Math.random() * (window.innerHeight - 160) + 80;
        place();
        chudik.classList.remove('is-hiding');
        hiding = false;
      }, 650);
    } else {
      // Обычное убегание с перепрыгом
      x = Math.random() * (window.innerWidth - 120) + 40;
      y = Math.random() * (window.innerHeight - 160) + 80;
      place();
    }

    chudik.classList.add('is-fleeing');
    setTimeout(() => chudik.classList.remove('is-fleeing'), 450);
    fleeCooldown = now + 350;
  }

  document.addEventListener('mousemove', e => {
    const rect = chudik.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    if (dist < 110) flee();
  });

  // Если всё-таки поймали — чудик радуется
  chudik.addEventListener('click', () => {
    chudik.classList.add('is-caught');
    setTimeout(() => chudik.classList.remove('is-caught'), 900);
  });
})();

const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('ru-RU');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));
