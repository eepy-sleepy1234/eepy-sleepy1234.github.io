
document.getElementById('year').textContent = new Date().getFullYear();

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 20
    ? 'rgba(11,11,13,0.97)'
    : 'rgba(11,11,13,0.85)';
}, { passive: true });

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const mouse = { x: -9999, y: -9999 };

  const TOKENS = [
    'const','let','return','async','await','function','export','import',
    'null','true','false','undefined','class','extends','super',
    '=>','{}','[]','()','&&','||','??','!==','===',
    '0x1F','0b10','NaN','void','typeof','new','this',
    '#root','.fn()',':root','@media','vh','rem','px',
    '<div>','</div>','aria=','href=','src=',
  ];

  const ACCENT_COLOR = [226, 255, 90];
  const BASE_COLOR   = [130, 120, 180];
  const COL_WIDTH    = 52;
  let columns = [];

  function randToken() {
    return TOKENS[Math.floor(Math.random() * TOKENS.length)];
  }

  function initColumns() {
    columns = [];
    const count = Math.ceil(W / COL_WIDTH) + 2;
    for (let i = 0; i < count; i++) {
      const x = i * COL_WIDTH - COL_WIDTH / 2;
      const stackSize = 5 + Math.floor(Math.random() * 6);
      const speed = 0.18 + Math.random() * 0.28;
      const phase = Math.random() * Math.PI * 2;
      const tokens = Array.from({ length: stackSize }, (_, k) => ({
        text:    randToken(),
        offsetY: k * (H / stackSize) * (0.8 + Math.random() * 0.4),
        opacity: 0.04 + Math.random() * 0.10,
        size:    10 + Math.floor(Math.random() * 4),
      }));
      columns.push({ x, speed, phase, tokens, t: Math.random() * 1000 });
    }
  }

  function resize() {
    const section = document.getElementById('welcome');
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
    initColumns();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const welcome = document.getElementById('welcome');
  welcome.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });
  welcome.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const g1 = ctx.createRadialGradient(W * 0.72, H * 0.4, 0, W * 0.72, H * 0.4, W * 0.55);
    g1.addColorStop(0, 'rgba(123,92,240,0.14)');
    g1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    const g2 = ctx.createRadialGradient(W * 0.18, H * 0.7, 0, W * 0.18, H * 0.7, W * 0.35);
    g2.addColorStop(0, 'rgba(226,255,90,0.06)');
    g2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);

    for (const col of columns) {
      col.t += col.speed;

      const swayX = col.x + Math.sin(col.t * 0.012 + col.phase) * 14;

      const proximity = Math.max(0, 1 - Math.abs(swayX - mouse.x) / 180);

      for (const tok of col.tokens) {
        tok.offsetY -= col.speed * (1 + proximity * 2.2);
        if (tok.offsetY < -40) {
          tok.offsetY = H + Math.random() * 80;
          tok.text    = randToken();
          tok.size    = 10 + Math.floor(Math.random() * 4);
          tok.opacity = 0.04 + Math.random() * 0.10;
        }

        const clampedOp = Math.min(tok.opacity * (1 + proximity * 3.5), 0.72);

        const r = Math.round(BASE_COLOR[0] + (ACCENT_COLOR[0] - BASE_COLOR[0]) * proximity);
        const g = Math.round(BASE_COLOR[1] + (ACCENT_COLOR[1] - BASE_COLOR[1]) * proximity);
        const b = Math.round(BASE_COLOR[2] + (ACCENT_COLOR[2] - BASE_COLOR[2]) * proximity);

        ctx.font = `${tok.size}px 'Fragment Mono', monospace`;
        ctx.fillStyle = `rgba(${r},${g},${b},${clampedOp})`;
        ctx.fillText(tok.text, swayX, tok.offsetY);
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

const revealEls = document.querySelectorAll(
  '.project-card, .social-card, .profile-text, .profile-visual, .section-header, .chip'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), entry.target.dataset.delay || 0);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el, i) => {
  el.dataset.delay = (i % 4) * 80;
  observer.observe(el);
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--accent)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spyObserver.observe(s));

const list = document.getElementById("skillList");
const items = Array.from(list.children);

const itemHeight = 40;
const totalHeight = items.length * itemHeight;

let offset = 0;
const speed = 0.3;

function animate() {
  offset += speed;

  updateStyles();

  requestAnimationFrame(animate);
}

function updateStyles() {
  const highlightY = 40;

  items.forEach((item, i) => {
    // 🔥 key change: use modulo instead of resetting offset
    const wrappedOffset = offset % totalHeight;

    let y = i * itemHeight - wrappedOffset;

    // keep within visual range smoothly
    if (y < -itemHeight) y += totalHeight;
    if (y > totalHeight - itemHeight) y -= totalHeight;

    const centerY = y + itemHeight / 2;

    const distance = centerY - highlightY;
    const abs = Math.abs(distance);

    if (abs > itemHeight * 1.5) {
      item.style.opacity = 0;
      return;
    }

    const scale = 1 - abs / 120;
    const rotate = distance / 6;

    item.style.opacity = 1 - abs / 80;

    item.style.transform = `
      scale(${scale})
      rotateX(${rotate}deg)
    `;

    item.style.zIndex = Math.round(100 - abs);
  });
}

animate();