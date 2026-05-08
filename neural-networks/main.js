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

// ═══════════════════════════════════════════════
// DEMO 1: NEURON PLAYGROUND
// ═══════════════════════════════════════════════
(function(){
  const w1El = document.getElementById('np-w1');
  const w2El = document.getElementById('np-w2');
  const bEl  = document.getElementById('np-b');
  if (!w1El) return;

  const X1 = 0.5, X2 = -0.3;
  const canvas = document.getElementById('neuron-canvas');
  const ctx = canvas.getContext('2d');

  function update() {
    const w1 = parseFloat(w1El.value);
    const w2 = parseFloat(w2El.value);
    const b  = parseFloat(bEl.value);
    document.getElementById('np-w1-val').textContent = w1.toFixed(2);
    document.getElementById('np-w2-val').textContent = w2.toFixed(2);
    document.getElementById('np-b-val').textContent  = b.toFixed(2);

    const raw = w1 * X1 + w2 * X2 + b;
    const out = Math.tanh(raw);
    document.getElementById('np-raw').textContent = raw.toFixed(3);
    document.getElementById('np-out').textContent = out.toFixed(3);

    // Draw neuron diagram
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Input nodes
    const inputs = [
      {label: `x₁=0.5`, val: `×${w1.toFixed(2)}`, color: '#946800', y: H*0.3},
      {label: `x₂=-0.3`, val: `×${w2.toFixed(2)}`, color: '#0570DE', y: H*0.7}
    ];
    inputs.forEach(inp => {
      ctx.beginPath(); ctx.arc(60, inp.y, 20, 0, Math.PI*2);
      ctx.fillStyle = inp.color+'22'; ctx.fill();
      ctx.strokeStyle = inp.color+'88'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = inp.color; ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(inp.label, 60, inp.y);

      // Weight label on line
      ctx.beginPath(); ctx.moveTo(80, inp.y); ctx.lineTo(200, H/2);
      ctx.strokeStyle = inp.color+'55'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = inp.color+'bb'; ctx.font = '9px JetBrains Mono';
      ctx.fillText(inp.val, 135, (inp.y + H/2)/2 + (inp.y < H/2 ? -8 : 8));
    });

    // Bias
    ctx.fillStyle = '#697386'; ctx.font = '9px JetBrains Mono'; ctx.textAlign = 'center';
    ctx.fillText(`b=${b.toFixed(2)}`, 205, H*0.12);

    // Sum node
    ctx.beginPath(); ctx.arc(220, H/2, 28, 0, Math.PI*2);
    const rawCol = raw > 0 ? '#635BFF' : '#DF1B41';
    ctx.fillStyle = rawCol+'22'; ctx.fill();
    ctx.strokeStyle = rawCol+'88'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = rawCol; ctx.font = '9px JetBrains Mono'; ctx.textBaseline = 'middle';
    ctx.fillText(raw.toFixed(2), 220, H/2 - 7);
    ctx.fillText('Σ+b', 220, H/2 + 7);

    // Arrow to tanh
    ctx.beginPath(); ctx.moveTo(248, H/2); ctx.lineTo(290, H/2);
    ctx.strokeStyle = '#E3E8EF'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#697386'; ctx.font = '9px JetBrains Mono'; ctx.textAlign = 'center';
    ctx.fillText('tanh', 269, H/2 - 10);

    // Output node
    const outMapped = (out + 1) / 2;
    const hue = Math.round(outMapped * 140);
    const outCol = `hsl(${hue},60%,40%)`;
    ctx.beginPath(); ctx.arc(330, H/2, 24, 0, Math.PI*2);
    ctx.fillStyle = outCol+'33'; ctx.fill();
    ctx.strokeStyle = outCol+'aa'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = outCol; ctx.font = 'bold 11px JetBrains Mono'; ctx.textBaseline = 'middle';
    ctx.fillText(out.toFixed(3), 330, H/2);
  }

  [w1El, w2El, bEl].forEach(el => el.addEventListener('input', update));
  update();
})();

// ═══════════════════════════════════════════════
// DEMO 2: FORWARD PASS VISUALIZER
// ═══════════════════════════════════════════════
(function(){
  const svg = document.getElementById('fp-svg');
  const runBtn = document.getElementById('fp-run-btn');
  const resetBtn = document.getElementById('fp-reset-btn');
  if (!svg || !runBtn) return;

  // Hardcoded tiny network: 2 inputs → 3 hidden → 1 output
  // weights chosen to give interesting values
  const W1 = [[0.3,-0.5],[0.8,0.2],[-0.4,0.6]];
  const B1 = [0.1, -0.2, 0.3];
  const W2 = [[0.7,-0.3,0.5]];
  const B2 = [-0.1];
  const INPUT = [1.0, 0.5];

  function tanh(x) { return Math.tanh(x); }

  // Node positions
  const nodes = {
    i0: {x:40, y:70, layer:0},
    i1: {x:40, y:130, layer:0},
    h0: {x:160, y:50, layer:1},
    h1: {x:160, y:100, layer:1},
    h2: {x:160, y:150, layer:1},
    o0: {x:290, y:100, layer:2}
  };
  const edges = [
    ['i0','h0',W1[0][0]], ['i0','h1',W1[1][0]], ['i0','h2',W1[2][0]],
    ['i1','h0',W1[0][1]], ['i1','h1',W1[1][1]], ['i1','h2',W1[2][1]],
    ['h0','o0',W2[0][0]], ['h1','o0',W2[0][1]], ['h2','o0',W2[0][2]]
  ];

  let phase = 0; // 0=idle, 1=input lit, 2=hidden lit, 3=output lit
  const nodeVals = {};

  function computeVals() {
    nodeVals['i0'] = INPUT[0]; nodeVals['i1'] = INPUT[1];
    for (let i = 0; i < 3; i++) {
      nodeVals['h'+i] = tanh(W1[i][0]*INPUT[0] + W1[i][1]*INPUT[1] + B1[i]);
    }
    nodeVals['o0'] = tanh(W2[0][0]*nodeVals['h0'] + W2[0][1]*nodeVals['h1'] + W2[0][2]*nodeVals['h2'] + B2[0]);
  }

  function render() {
    const litLayers = phase === 0 ? [] : phase === 1 ? [0] : phase === 2 ? [0,1] : [0,1,2];

    let html = '';
    // Edges
    edges.forEach(([from, to]) => {
      const f = nodes[from], t = nodes[to];
      const lit = litLayers.includes(f.layer) && litLayers.includes(t.layer);
      html += `<line x1="${f.x}" y1="${f.y}" x2="${t.x}" y2="${t.y}" stroke="${lit?'#635BFF44':'#E3E8EF'}" stroke-width="${lit?1.5:1}"/>`;
    });
    // Nodes
    Object.entries(nodes).forEach(([id, {x, y, layer}]) => {
      const lit = litLayers.includes(layer);
      const val = nodeVals[id];
      const color = ['#946800','#635BFF','#00875A'][layer];
      html += `<circle cx="${x}" cy="${y}" r="18" fill="${lit?color+'33':'var(--surface)'}" stroke="${lit?color+'aa':'#E3E8EF'}" stroke-width="${lit?2:1}"/>`;
      if (lit && val !== undefined) {
        html += `<text x="${x}" y="${y+4}" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="${color}">${val.toFixed(2)}</text>`;
      } else {
        const lbl = id.startsWith('i')?`x${id[1]}`:id.startsWith('h')?`h${id[1]}`:'ŷ';
        html += `<text x="${x}" y="${y+4}" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="#697386">${lbl}</text>`;
      }
    });
    // Labels
    [[40,195,'Input\nx=[1.0, 0.5]'],[160,195,'Hidden\n(tanh)'],[290,195,'Output']].forEach(([x,y,lbl]) => {
      lbl.split('\n').forEach((line, i) => {
        html += `<text x="${x}" y="${y + i*13}" text-anchor="middle" font-family="Inter" font-size="9" fill="#697386">${line}</text>`;
      });
    });
    svg.innerHTML = html;
  }

  computeVals();
  render();

  runBtn.addEventListener('click', () => {
    if (phase >= 3) return;
    phase++;
    render();
    if (phase >= 3) runBtn.disabled = true;
  });

  resetBtn.addEventListener('click', () => {
    phase = 0;
    runBtn.disabled = false;
    render();
  });
})();

// ═══════════════════════════════════════════════
// DEMO 3: LOSS LANDSCAPE
// ═══════════════════════════════════════════════
(function(){
  const canvas = document.getElementById('loss-canvas');
  const stepBtn = document.getElementById('loss-step-btn');
  const resetBtn = document.getElementById('loss-reset-btn');
  const lrSlider = document.getElementById('loss-lr');
  if (!canvas || !stepBtn) return;

  const ctx = canvas.getContext('2d');
  let w = 3.0; // starting far from minimum at w=0

  // Loss function: L(w) = w² + 0.3 (minimum at w=0, loss=0.3)
  function loss(w) { return w * w + 0.3; }
  function dloss(w) { return 2 * w; } // derivative

  function wToX(w) { return ((w + 4) / 8) * canvas.width; }
  function lossToY(l) { return canvas.height - 10 - (l / 18) * (canvas.height - 20); }

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#F0F4F8'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = lossToY(i * 4);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Loss curve
    ctx.beginPath();
    for (let px = 0; px <= W; px++) {
      const wv = (px / W) * 8 - 4;
      const ly = lossToY(loss(wv));
      px === 0 ? ctx.moveTo(px, ly) : ctx.lineTo(px, ly);
    }
    ctx.strokeStyle = '#635BFF'; ctx.lineWidth = 2; ctx.stroke();

    // Minimum marker
    ctx.beginPath(); ctx.arc(wToX(0), lossToY(0.3), 4, 0, Math.PI*2);
    ctx.fillStyle = '#00875A'; ctx.fill();

    // Ball (current position)
    const bx = wToX(w), by = lossToY(loss(w));
    ctx.beginPath(); ctx.arc(bx, by, 8, 0, Math.PI*2);
    ctx.fillStyle = '#DF1B41'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

    // Labels
    ctx.fillStyle = '#697386'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'left';
    ctx.fillText('Loss ↑', 6, 16);
    ctx.textAlign = 'center';
    ctx.fillText('weight →', W/2, H - 2);
    ctx.fillStyle = '#00875A';
    ctx.fillText('min', wToX(0), lossToY(0.3) - 10);

    // Current values display
    document.getElementById('loss-w-val').textContent = w.toFixed(3);
    document.getElementById('loss-val-display').textContent = loss(w).toFixed(3);
  }

  draw();

  lrSlider.addEventListener('input', () => {
    document.getElementById('loss-lr-val').textContent = parseFloat(lrSlider.value).toFixed(2);
  });

  stepBtn.addEventListener('click', () => {
    const lr = parseFloat(lrSlider.value);
    w -= lr * dloss(w); // gradient descent step
    draw();
  });

  resetBtn.addEventListener('click', () => { w = 3.0; draw(); });
})();

// ═══════════════════════════════════════════════
// DEMO 4: DERIVATIVE VISUALIZER
// ═══════════════════════════════════════════════
(function(){
  const canvas = document.getElementById('deriv-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let dragging = false;
  let xVal = 1.0; // current x position

  const PAD = 30;
  const X_RANGE = [-3, 3];
  const Y_RANGE = [-0.5, 9.5];

  function xToCanvas(x) { return PAD + ((x - X_RANGE[0]) / (X_RANGE[1] - X_RANGE[0])) * (canvas.width - 2*PAD); }
  function yToCanvas(y) { return PAD + ((Y_RANGE[1] - y) / (Y_RANGE[1] - Y_RANGE[0])) * (canvas.height - 2*PAD); }
  function canvasToX(px) { return X_RANGE[0] + ((px - PAD) / (canvas.width - 2*PAD)) * (X_RANGE[1] - X_RANGE[0]); }

  function f(x) { return x * x; }
  function df(x) { return 2 * x; }

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Axes
    ctx.strokeStyle = '#E3E8EF'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD, yToCanvas(0)); ctx.lineTo(W-PAD, yToCanvas(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(xToCanvas(0), PAD); ctx.lineTo(xToCanvas(0), H-PAD); ctx.stroke();

    // f(x) = x² curve
    ctx.beginPath();
    for (let px = PAD; px <= W-PAD; px++) {
      const x = canvasToX(px);
      const y = f(x);
      if (y < Y_RANGE[0] || y > Y_RANGE[1]) { ctx.moveTo(px, yToCanvas(Math.min(Math.max(y, Y_RANGE[0]), Y_RANGE[1]))); continue; }
      px === PAD ? ctx.moveTo(px, yToCanvas(y)) : ctx.lineTo(px, yToCanvas(y));
    }
    ctx.strokeStyle = '#635BFF'; ctx.lineWidth = 2.5; ctx.stroke();

    // Tangent line: y = f(xVal) + df(xVal)*(x - xVal)
    const slope = df(xVal);
    const intercept = f(xVal) - slope * xVal;
    const tx1 = Math.max(X_RANGE[0], xVal - 1.5);
    const tx2 = Math.min(X_RANGE[1], xVal + 1.5);
    ctx.beginPath();
    ctx.moveTo(xToCanvas(tx1), yToCanvas(slope*tx1 + intercept));
    ctx.lineTo(xToCanvas(tx2), yToCanvas(slope*tx2 + intercept));
    ctx.strokeStyle = '#DF1B41'; ctx.lineWidth = 1.5; ctx.setLineDash([4,3]); ctx.stroke();
    ctx.setLineDash([]);

    // Point on curve
    const px = xToCanvas(xVal), py = yToCanvas(f(xVal));
    ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI*2);
    ctx.fillStyle = '#DF1B41'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

    // Slope label
    ctx.fillStyle = '#DF1B41'; ctx.font = 'bold 11px JetBrains Mono'; ctx.textAlign = 'center';
    ctx.fillText(`slope = ${slope.toFixed(2)}`, px, py - 14);

    // Axis labels
    ctx.fillStyle = '#697386'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
    ctx.fillText('f(x) = x²', xToCanvas(2.5), yToCanvas(8));
    ctx.fillText('x', W - PAD + 10, yToCanvas(0) + 4);
    ctx.textAlign = 'left';
    ctx.fillText('f(x)', xToCanvas(0) + 4, PAD + 10);

    // Update stat labels
    document.getElementById('deriv-x').textContent = xVal.toFixed(2);
    document.getElementById('deriv-fx').textContent = f(xVal).toFixed(2);
    document.getElementById('deriv-dfx').textContent = slope.toFixed(2);
  }

  function getX(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const px = (clientX - rect.left) * (canvas.width / rect.width);
    return Math.max(X_RANGE[0], Math.min(X_RANGE[1], canvasToX(px)));
  }

  canvas.addEventListener('mousedown',  e => { dragging = true; xVal = getX(e); draw(); });
  canvas.addEventListener('mousemove',  e => { if (dragging) { xVal = getX(e); draw(); } });
  canvas.addEventListener('mouseup',    () => dragging = false);
  canvas.addEventListener('mouseleave', () => dragging = false);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); dragging = true; xVal = getX(e); draw(); }, {passive:false});
  canvas.addEventListener('touchmove',  e => { e.preventDefault(); if (dragging) { xVal = getX(e); draw(); } }, {passive:false});
  canvas.addEventListener('touchend',   () => dragging = false);

  draw();
})();
