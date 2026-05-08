// ═══════════════════════════════════════════════
// HERO CANVAS — Floating Math/Code Fragments
// ═══════════════════════════════════════════════
(function(){
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, tokens = [];
  const WORDS = ['tanh','grad','w1','w2','bias','loss','relu','∂L','∂w','w·x','MLP','node','chain','rule','Value','data','back','fwd','∑','f(x)','x²','slope','dy/dx','0.01','step','zero','param','net','layer','actv','MSE','pred','y_gt','δ','λ'];

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }

  function makeToken() {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const size = 10 + Math.floor(Math.random() * 5);
    const alpha = 0.055 + Math.random() * 0.09;
    return { x: Math.random() * W, y: Math.random() * H, vx: (Math.random()-.5)*0.18, vy: -0.12 - Math.random()*0.14, word, size, alpha };
  }

  function init() { resize(); tokens = Array.from({length: 45}, makeToken); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const t of tokens) {
      t.x += t.vx; t.y += t.vy;
      if (t.y < -30) Object.assign(t, makeToken(), { x: Math.random()*W, y: H+20 });
      if (t.x < -60) t.x = W+20;
      if (t.x > W+60) t.x = -20;
      ctx.font = `${t.size}px 'JetBrains Mono', monospace`;
      const mw = ctx.measureText(t.word).width;
      const pad = 5, ph = t.size + 6;
      ctx.strokeStyle = `rgba(26,31,54,${t.alpha*0.55})`;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(t.x - pad/2, t.y - ph + 3, mw + pad, ph);
      ctx.fillStyle = `rgba(26,31,54,${t.alpha})`;
      ctx.fillText(t.word, t.x, t.y);
    }
    requestAnimationFrame(draw);
  }

  init();
  requestAnimationFrame(draw);
  window.addEventListener('resize', () => { resize(); init(); });
})();

// ═══════════════════════════════════════════════
// TYPEWRITER
// ═══════════════════════════════════════════════
(function(){
  const el = document.getElementById('tw-response');
  if (!el) return;
  const messages = [
    "A neural network is a function with millions of adjustable knobs (weights). Training turns the knobs until the function's outputs match the examples it's shown.",
    "Every word GPT generates is computed by the same forward pass you'll build here — just with 405 billion weights instead of 19.",
    "Backpropagation isn't magic: it's the chain rule applied recursively. Every weight gets told exactly how much it contributed to the error.",
    "Gradient descent is just: move each weight a tiny step in the direction that reduces the loss. Repeat a billion times. That's training."
  ];
  let mi = 0, ci = 0, deleting = false;

  function type() {
    const msg = messages[mi];
    if (!deleting) {
      if (ci < msg.length) {
        el.innerHTML = msg.slice(0, ++ci) + '<span class="tw-cursor"></span>';
        setTimeout(type, 26 + Math.random()*18);
      } else {
        setTimeout(() => { deleting = true; type(); }, 3000);
      }
    } else {
      if (ci > 0) {
        el.innerHTML = msg.slice(0, --ci) + '<span class="tw-cursor"></span>';
        setTimeout(type, 11);
      } else {
        deleting = false;
        mi = (mi + 1) % messages.length;
        setTimeout(type, 400);
      }
    }
  }
  setTimeout(type, 1200);
})();

// ═══════════════════════════════════════════════
// PROGRESS BAR + SCROLL NAV
// ═══════════════════════════════════════════════
(function(){
  const bar = document.getElementById('progress-bar');
  const btns = document.querySelectorAll('.tnav-btn[data-section]');
  const sections = Array.from(btns).map(b => document.getElementById(b.dataset.section)).filter(Boolean);

  function onScroll() {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';

    let active = sections[0];
    for (const s of sections) {
      if (scrolled >= s.offsetTop - 100) active = s;
    }
    btns.forEach(b => {
      const isActive = b.dataset.section === active.id;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  btns.forEach(b => b.addEventListener('click', () => {
    const target = document.getElementById(b.dataset.section);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }));

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ═══════════════════════════════════════════════
// FADE-UP OBSERVER
// ═══════════════════════════════════════════════
(function(){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; } });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(el);
  });

  // Pipeline stages
  const stageObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.pipeline-stage').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
    stageObserver.observe(el);
  });
})();

// ═══════════════════════════════════════════════
// MLP ARCHITECTURE SVG
// ═══════════════════════════════════════════════
(function(){
  const svg = document.getElementById('mlp-svg');
  if (!svg) return;

  const layers = [[60, [40,80,120,160]], [170, [60,100,140]], [280, [100]]];
  const labels = ['Input\n(4)', 'Hidden\n(3)', 'Output\n(1)'];
  const colors = ['#946800', '#635BFF', '#00875A'];
  let html = '';

  layers.forEach(([x, ys], li) => {
    ys.forEach((y, ni) => {
      layers.forEach(([x2, ys2], li2) => {
        if (li2 !== li + 1) return;
        ys2.forEach(y2 => {
          html += `<line x1="${x+14}" y1="${y}" x2="${x2-14}" y2="${y2}" stroke="${colors[li]}20" stroke-width="1"/>`;
        });
      });
      html += `<circle cx="${x}" cy="${y}" r="14" fill="${colors[li]}15" stroke="${colors[li]}60" stroke-width="1.5"/>`;
      html += `<text x="${x}" y="${y+4}" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="${colors[li]}">${li===0?'x'+(ni+1):li===1?'h'+(ni+1):'ŷ'}</text>`;
    });
    html += `<text x="${x}" y="195" text-anchor="middle" font-family="Inter" font-size="10" fill="#697386">${labels[li]}</text>`;
  });

  svg.innerHTML = html;
})();
