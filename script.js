/* =============================================
   ROMANTIC PROPOSAL – script.js
   ============================================= */

// ─── State ───────────────────────────────────
const state = {
  currentPage: null,
  musicPlaying: false,
  particleCtx: null,
  particles: [],
  animFrame: null,
};

// ─── DOM Refs ────────────────────────────────
const pages      = document.querySelectorAll('.page');
const musicBtn   = document.getElementById('musicBtn');
const bgMusic    = document.getElementById('bgMusic');
const canvas     = document.getElementById('particles');

// ─── Intro overlay ───────────────────────────
function createIntroOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'introOverlay';
  overlay.innerHTML = `
    <p class="intro-title">A message for Simran… 💖</p>
    <p class="intro-sub">Tap to begin this journey</p>
    <button class="start-btn" id="startBtn">Begin ❤️</button>
  `;
  document.body.appendChild(overlay);

  document.getElementById('startBtn').addEventListener('click', () => {
    overlay.classList.add('hidden');
    setTimeout(() => overlay.remove(), 1600);
    tryPlayMusic();
    showPage('page1');
    startPage1Sequence();
  });
}

// ─── Music ───────────────────────────────────
function tryPlayMusic() {
  bgMusic.volume = 0.28;
  bgMusic.play().then(() => {
    state.musicPlaying = true;
    musicBtn.classList.add('playing');
  }).catch(() => {});
}

musicBtn.addEventListener('click', () => {
  if (state.musicPlaying) {
    bgMusic.pause();
    state.musicPlaying = false;
    musicBtn.classList.remove('playing');
    musicBtn.textContent = '♪';
  } else {
    bgMusic.play();
    state.musicPlaying = true;
    musicBtn.classList.add('playing');
    musicBtn.textContent = '♫';
  }
});

// ─── Page Transitions ────────────────────────
function showPage(id, callback) {
  const incoming = document.getElementById(id);
  const outgoing = state.currentPage;

  if (outgoing) {
    outgoing.classList.add('exiting');
    setTimeout(() => {
      outgoing.classList.remove('active', 'exiting');
    }, 1200);
  }

  setTimeout(() => {
    incoming.classList.add('active');
    state.currentPage = incoming;
    if (callback) setTimeout(callback, 300);
  }, outgoing ? 600 : 0);
}

// ─── Animate lines sequentially ──────────────
function animateLines(containerId, lines, onDone) {
  let index = 0;

  function revealNext() {
    if (index >= lines.length) {
      if (onDone) onDone();
      return;
    }
    const el = lines[index];
    el.classList.add('visible');
    index++;
    const delay = el.dataset.delay ? 0 : (index === 1 ? 600 : 900);
    setTimeout(revealNext, delay + 850);
  }
  revealNext();
}

// ─── Animate lines with data-delay attribute ─
function animateFadeLines(lines, onDone) {
  lines.forEach(line => {
    const delay = parseInt(line.dataset.delay || 0);
    setTimeout(() => {
      line.classList.add('visible');
    }, delay);
  });
  const maxDelay = Math.max(...Array.from(lines).map(l => parseInt(l.dataset.delay || 0)));
  if (onDone) setTimeout(onDone, maxDelay + 1200);
}

// ─── Scroll-reveal for long pages ────────────
function scrollReveal(seqEl) {
  const allLines = seqEl.querySelectorAll('.line, .main-question, .final-confession, .btn-group');
  let revealed = 0;
  const interval = setInterval(() => {
    if (revealed >= allLines.length) { clearInterval(interval); return; }
    allLines[revealed].classList.add('visible');
    revealed++;
  }, 900);
}

// ─── PAGE 1 ──────────────────────────────────
function startPage1Sequence() {
  generateStars();

  const lines   = document.querySelectorAll('#seq1 .fade-line');
  animateFadeLines(lines);

  // NO button
  const noBtn1  = document.getElementById('noBtn1');
  const yesBtn1 = document.getElementById('yesBtn1');
  const noMsg1  = document.getElementById('noMsg1').querySelector('.no-line');

  const noPhrases1 = [
    'Simran… think again 🥺',
    'My heart already chose you ❤️',
    "I'll wait here… just for you",
  ];
  let noCount1 = 0;

  noBtn1.addEventListener('click', () => {
    const msg = noPhrases1[Math.min(noCount1, noPhrases1.length - 1)];
    noMsg1.textContent = msg;
    noMsg1.classList.add('show');

    // Drift button away
    const angle = Math.random() * 360;
    const dist  = 80 + Math.random() * 80;
    const dx    = Math.cos(angle * Math.PI / 180) * dist;
    const dy    = Math.sin(angle * Math.PI / 180) * dist;
    noBtn1.style.transform = `translate(${dx}px, ${dy}px)`;
    noBtn1.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

    setTimeout(() => {
      noBtn1.style.transform = '';
      noBtn1.style.transition = 'transform 0.35s ease';
    }, 2000);

    noCount1++;
  });

  yesBtn1.addEventListener('click', () => {
    showPage('page2', () => {
      scrollReveal(document.getElementById('seq2'));
      setupPage2Buttons();
    });
  });
}

// ─── PAGE 2 ──────────────────────────────────
function setupPage2Buttons() {
  const noBtn2  = document.getElementById('noBtn2');
  const yesBtn2 = document.getElementById('yesBtn2');
  const noMsg2  = document.getElementById('noMsg2').querySelector('.no-line');

  const noPhrases2 = [
    'This love is too real to walk away from 💔',
    'Try again… my heart is serious about you ❤️',
    'Simran… I meant every single word 🥺',
  ];
  let noCount2 = 0;

  noBtn2.addEventListener('click', () => {
    noMsg2.textContent = noPhrases2[Math.min(noCount2, noPhrases2.length - 1)];
    noMsg2.classList.add('show');
    shakeButton(noBtn2);
    noCount2++;
  });

  yesBtn2.addEventListener('click', () => {
    showPage('page3', () => {
      generateShootingStars();
      scrollReveal(document.getElementById('seq3'));
      setupPage3Button();
    });
  });
}

// ─── PAGE 3 ──────────────────────────────────
function setupPage3Button() {
  const continueBtn = document.getElementById('continueBtn3');
  continueBtn.addEventListener('click', () => {
    showPage('page4', () => {
      const lines = document.querySelectorAll('#seq4 .fade-line');
      animateFadeLines(lines);
      setupPage4Buttons();
    });
  });
}

// ─── PAGE 4 ──────────────────────────────────
function setupPage4Buttons() {
  const noBtn4  = document.getElementById('noBtn4');
  const yesBtn4 = document.getElementById('yesBtn4');
  const noMsg4  = document.getElementById('noMsg4').querySelector('.no-line');

  const noPhrases4 = [
    "Simran… this can't be the ending 🥺",
    'Try again… our forever is waiting ❤️',
    'I promise I will make you the happiest… 💍',
  ];
  let noCount4 = 0;

  noBtn4.addEventListener('click', () => {
    noMsg4.textContent = noPhrases4[Math.min(noCount4, noPhrases4.length - 1)];
    noMsg4.classList.add('show');
    shakeButton(noBtn4);

    // Grow yes button
    yesBtn4.style.transform = `scale(${1 + noCount4 * 0.12})`;
    noBtn4.style.transform  = `scale(${Math.max(0.6, 1 - noCount4 * 0.12)})`;

    noCount4++;
  });

  yesBtn4.addEventListener('click', () => {
    showPage('pageFinal', () => {
      launchHeartsExplosion();
    });
  });
}

// ─── Helper: shake button ────────────────────
function shakeButton(btn) {
  btn.style.animation = 'none';
  btn.style.transform = 'translateX(-8px)';
  setTimeout(() => { btn.style.transform = 'translateX(8px)'; }, 80);
  setTimeout(() => { btn.style.transform = 'translateX(-5px)'; }, 160);
  setTimeout(() => { btn.style.transform = 'translateX(0)'; }, 240);
}

// ─── Stars (Page 1) ──────────────────────────
function generateStars() {
  const layer = document.getElementById('starsLayer');
  layer.innerHTML = '';
  const count = 180;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random() * 100}%;
      left:${Math.random() * 100}%;
      --dur:${2 + Math.random() * 4}s;
      --delay:${Math.random() * 5}s;
      opacity:${0.2 + Math.random() * 0.8};
    `;
    layer.appendChild(star);
  }
}

// ─── Shooting Stars (Page 3) ─────────────────
function generateShootingStars() {
  const layer = document.getElementById('shootingStars');
  layer.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('div');
    s.className = 'shooting-star';
    s.style.cssText = `
      top:${Math.random() * 50}%;
      left:${Math.random() * 60}%;
      --dur:${2.5 + Math.random() * 3}s;
      --delay:${Math.random() * 8}s;
    `;
    layer.appendChild(s);
  }
}

// ─── Hearts Explosion (Final) ─────────────────
function launchHeartsExplosion() {
  const container = document.getElementById('heartsExplosion');
  const emojis = ['💖', '💕', '💗', '💓', '✨', '🌸', '💫', '💝'];
  for (let i = 0; i < 40; i++) {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    h.textContent = emoji;
    const size   = 1.2 + Math.random() * 2;
    const x      = 5 + Math.random() * 90;
    const dur    = 5 + Math.random() * 7;
    const delay  = Math.random() * 5;
    const drift  = (Math.random() - 0.5) * 120;
    const spin   = (Math.random() - 0.5) * 360;
    h.style.cssText = `
      --size:${size}rem;
      --x:${x}%;
      --dur:${dur}s;
      --delay:${delay}s;
      --drift:${drift}px;
      --spin:${spin}deg;
    `;
    container.appendChild(h);
  }
}

// ─── Canvas Particle System ───────────────────
function initParticles() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  state.particleCtx = canvas.getContext('2d');

  for (let i = 0; i < 60; i++) {
    state.particles.push(createParticle());
  }

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  loopParticles();
}

function createParticle() {
  const types   = ['heart', 'sparkle', 'dot'];
  const type    = types[Math.floor(Math.random() * types.length)];
  const colors  = [
    'rgba(244,184,193,',
    'rgba(245,215,142,',
    'rgba(212,184,224,',
    'rgba(255,255,255,',
    'rgba(232,118,138,',
  ];
  return {
    x:      Math.random() * canvas.width,
    y:      Math.random() * canvas.height,
    vx:     (Math.random() - 0.5) * 0.4,
    vy:     -(0.2 + Math.random() * 0.5),
    size:   1.5 + Math.random() * 4,
    alpha:  Math.random(),
    dalpha: 0.003 + Math.random() * 0.008,
    type,
    color:  colors[Math.floor(Math.random() * colors.length)],
    life:   0,
    maxLife: 180 + Math.floor(Math.random() * 180),
  };
}

function drawParticle(p, ctx) {
  const a = Math.sin((p.life / p.maxLife) * Math.PI) * 0.65;
  ctx.save();
  ctx.globalAlpha = Math.max(0, a);

  if (p.type === 'heart') {
    ctx.font = `${p.size * 2.5}px serif`;
    ctx.fillStyle = p.color + '1)';
    ctx.fillText('❤', p.x, p.y);

  } else if (p.type === 'sparkle') {
    ctx.strokeStyle = p.color + (a * 0.8) + ')';
    ctx.lineWidth   = 0.8;
    const s = p.size;
    ctx.beginPath();
    ctx.moveTo(p.x - s, p.y); ctx.lineTo(p.x + s, p.y);
    ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x, p.y + s);
    ctx.moveTo(p.x - s * 0.7, p.y - s * 0.7); ctx.lineTo(p.x + s * 0.7, p.y + s * 0.7);
    ctx.moveTo(p.x + s * 0.7, p.y - s * 0.7); ctx.lineTo(p.x - s * 0.7, p.y + s * 0.7);
    ctx.stroke();

  } else {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = p.color + (a * 0.7) + ')';
    ctx.fill();

    // Glow
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
    g.addColorStop(0, p.color + (a * 0.3) + ')');
    g.addColorStop(1, p.color + '0)');
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  ctx.restore();
}

function loopParticles() {
  const ctx = state.particleCtx;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  state.particles = state.particles.map(p => {
    p.x   += p.vx + Math.sin(p.life * 0.04) * 0.3;
    p.y   += p.vy;
    p.life++;

    if (p.life >= p.maxLife || p.y < -30 || p.x < -30 || p.x > canvas.width + 30) {
      return createParticle();
    }

    drawParticle(p, ctx);
    return p;
  });

  state.animFrame = requestAnimationFrame(loopParticles);
}

// ─── Mouse sparkle trail ─────────────────────
let mouseTrailTimeout;
document.addEventListener('mousemove', (e) => {
  clearTimeout(mouseTrailTimeout);
  mouseTrailTimeout = setTimeout(() => {}, 100);

  const ctx = state.particleCtx;
  if (!ctx) return;

  for (let i = 0; i < 2; i++) {
    state.particles.push({
      x:       e.clientX + (Math.random() - 0.5) * 20,
      y:       e.clientY + (Math.random() - 0.5) * 20,
      vx:      (Math.random() - 0.5) * 0.8,
      vy:      -(0.4 + Math.random() * 0.8),
      size:    1 + Math.random() * 2,
      alpha:   0.8,
      dalpha:  0.02,
      type:    Math.random() > 0.5 ? 'sparkle' : 'dot',
      color:   'rgba(245,215,142,',
      life:    0,
      maxLife: 60 + Math.floor(Math.random() * 60),
    });
  }
});

// ─── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  createIntroOverlay();
});
