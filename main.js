// ═══════════════════════════════════════════════
// HERO CANVAS — Floating Token Fragments
// ═══════════════════════════════════════════════
(function(){
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, tokens = [], animId;
  const WORDS = ['the','of','and','a ','to','in ','is ','it ','ing','tion','pre','er ','un','re ','ed ','ly ','ness','ment','ize','BPE','seq','dim','MLP','key','vec','loss','grad','mask','head','norm','next','data','text','byte','GPT','LLM','soft','max','Adam','logit','embed','token','layer','atten'];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeToken() {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const size = 10 + Math.floor(Math.random() * 5);
    const alpha = 0.055 + Math.random() * 0.09;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * 0.18,
      vy: -0.12 - Math.random() * 0.14,
      word, size, alpha
    };
  }

  function init() {
    resize();
    tokens = Array.from({length: 45}, makeToken);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const t of tokens) {
      t.x += t.vx;
      t.y += t.vy;
      if (t.y < -30) { Object.assign(t, makeToken(), { x: Math.random() * W, y: H + 20 }); }
      if (t.x < -60) t.x = W + 20;
      if (t.x > W + 60) t.x = -20;
      ctx.font = `${t.size}px 'JetBrains Mono', monospace`;
      const mw = ctx.measureText(t.word).width;
      const pad = 5, ph = t.size + 6;
      ctx.strokeStyle = `rgba(26,31,54,${t.alpha * 0.55})`;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(t.x - pad/2, t.y - ph + 3, mw + pad, ph);
      ctx.fillStyle = `rgba(26,31,54,${t.alpha})`;
      ctx.fillText(t.word, t.x, t.y);
    }
    animId = requestAnimationFrame(draw);
  }

  init();
  requestAnimationFrame(draw);
  window.addEventListener('resize', () => { resize(); init(); });
})();

// ═══════════════════════════════════════════════
// TYPEWRITER EFFECT
// ═══════════════════════════════════════════════
(function(){
  const el = document.getElementById('tw-response');
  const messages = [
    "It's a large language model — a neural network with 405 billion parameters trained to predict the next token in a sequence...",
    "The magic is in the weights: 15 trillion tokens of training data compressed into parameters that encode human knowledge...",
    "Every word you see is sampled from a probability distribution over 100,277 possible tokens. There's no magic — just math at scale."
  ];
  let mi = 0, ci = 0, deleting = false, pauseTimer = null;

  function type() {
    const msg = messages[mi];
    if (!deleting) {
      if (ci < msg.length) {
        el.innerHTML = msg.slice(0, ++ci) + '<span class="tw-cursor"></span>';
        setTimeout(type, 28 + Math.random() * 20);
      } else {
        pauseTimer = setTimeout(() => { deleting = true; type(); }, 2800);
      }
    } else {
      if (ci > 0) {
        el.innerHTML = msg.slice(0, --ci) + '<span class="tw-cursor"></span>';
        setTimeout(type, 12);
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
// BPE VISUALIZATION SVG
// ═══════════════════════════════════════════════
(function(){
  const svg = document.getElementById('bpe-svg');
  const steps = [
    { label: 'Raw Text', tokens: ['t','o','k','e','n','i','z','a','t','i','o','n'], desc: 'Start: individual characters' },
    { label: 'Bytes (UTF-8)', tokens: ['116','111','107','101','110','105','122','97','116','105','111','110'], desc: 'Encode to byte IDs (0–255)' },
    { label: 'After BPE merge 1', tokens: ['to','k','en','i','za','ti','on'], desc: 'Merge frequent pairs' },
    { label: 'After BPE merge 2', tokens: ['token','iza','tion'], desc: 'Continue merging' },
    { label: 'Final Tokens', tokens: ['token','ization'], desc: 'GPT-4: 2 tokens for this word' }
  ];
  let step = 0;

  function renderStep() {
    const s = steps[step];
    const colors = ['#635BFF','#946800','#0570DE','#00875A','#DF1B41','#4F46E5','#946800','#00875A'];
    let html = `<text x="190" y="24" text-anchor="middle" font-family="Barlow Condensed" font-size="11" fill="#697386" letter-spacing="2">${s.desc.toUpperCase()}</text>`;

    const tokenW = Math.min(340 / s.tokens.length - 4, 52);
    const startX = (380 - (s.tokens.length * (tokenW + 4))) / 2;

    s.tokens.forEach((tok, i) => {
      const x = startX + i * (tokenW + 4);
      const color = colors[i % colors.length];
      html += `<rect x="${x}" y="40" width="${tokenW}" height="28" rx="4" fill="${color}20" stroke="${color}40" stroke-width="1"/>`;
      html += `<text x="${x + tokenW/2}" y="59" text-anchor="middle" font-family="JetBrains Mono" font-size="${tok.length > 4 ? 9 : 11}" fill="${color}">${tok}</text>`;
    });

    html += `<rect x="10" y="82" width="360" height="1" fill="#E3E8EF"/>`;
    html += `<text x="10" y="100" font-family="JetBrains Mono" font-size="10" fill="#697386">TOKENS: ${s.tokens.length}</text>`;
    html += `<text x="370" y="100" text-anchor="end" font-family="JetBrains Mono" font-size="10" fill="#635BFF">${s.label}</text>`;

    steps.forEach((_, i) => {
      const cx = 50 + i * 70;
      html += `<rect x="${cx-7}" y="123" width="14" height="14" rx="1" fill="${i === step ? '#635BFF' : '#FFFFFF'}" stroke="${i <= step ? '#635BFF' : '#E3E8EF'}" stroke-width="1.5"/>`;
      if (i < steps.length - 1) html += `<line x1="${cx+7}" y1="130" x2="${cx+63}" y2="130" stroke="${i < step ? '#635BFF60' : '#E3E8EF80'}" stroke-width="1"/>`;
      html += `<text x="${cx}" y="150" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="${i === step ? '#635BFF' : '#697386'}">${i+1}</text>`;
    });

    html += `<text x="190" y="185" text-anchor="middle" font-family="Barlow Condensed" font-size="11" fill="#697386" letter-spacing="1">CLICK TO ADVANCE</text>`;

    const barW = Math.max(8, Math.min(340, step === 4 ? 340 * (2/100277) * 10000 : step === 0 ? 30 : step === 1 ? 80 : step === 2 ? 160 : 260));
    html += `<rect x="20" y="205" width="340" height="6" rx="0" fill="#F6F9FC"/>`;
    html += `<rect x="20" y="205" width="${barW}" height="6" rx="0" fill="url(#grad)"/>`;
    html += `<defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#635BFF"/><stop offset="1" stop-color="#946800"/></linearGradient></defs>`;
    html += `<text x="20" y="225" font-family="JetBrains Mono" font-size="9" fill="#697386">SEQUENCE LENGTH →</text>`;
    html += `<text x="360" y="225" text-anchor="end" font-family="JetBrains Mono" font-size="9" fill="#697386">← VOCAB SIZE</text>`;

    const annotations = ['12 symbols (chars)','12 symbols (bytes: 0–255)','7 tokens','3 tokens','2 tokens ✓'];
    html += `<text x="190" y="260" text-anchor="middle" font-family="Inter" font-size="13" font-weight="700" fill="#1A1F36">${annotations[step]}</text>`;

    svg.innerHTML = html;
  }

  function advance() {
    step = (step + 1) % steps.length;
    renderStep();
    const lbl = document.getElementById('bpe-step-label');
    if (lbl) lbl.textContent = `Step ${step + 1} of ${steps.length}`;
  }

  renderStep();
  svg.addEventListener('click', advance);
  const advBtn = document.getElementById('bpe-advance-btn');
  if (advBtn) advBtn.addEventListener('click', advance);
})();


// ═══════════════════════════════════════════════
// TRANSFORMER DIAGRAM SVG
// ═══════════════════════════════════════════════
(function(){
  const svg = document.getElementById('transformer-svg');
  const layers = [
    { label: 'Input Tokens', color: '#946800', y: 310 },
    { label: 'Token Embedding', color: '#946800', y: 272 },
    { label: 'Multi-Head Attention', color: '#635BFF', y: 220 },
    { label: 'Feed Forward (MLP)', color: '#0570DE', y: 168 },
    { label: 'Layer Norm + Residual', color: '#697386', y: 130 },
    { label: '× N Transformer Blocks', color: '#9B8E86', y: 95 },
    { label: 'Output Logits', color: '#00875A', y: 50 },
  ];

  let html = '';
  for (let i = 0; i < 8; i++) {
    html += `<line x1="${45*i}" y1="0" x2="${45*i}" y2="340" stroke="rgba(216,208,194,0.7)" stroke-width=".5"/>`;
    html += `<line x1="0" y1="${45*i}" x2="360" y2="${45*i}" stroke="rgba(216,208,194,0.7)" stroke-width=".5"/>`;
  }

  layers.forEach((layer, i) => {
    const isMain = i >= 2 && i <= 3;
    const h = isMain ? 32 : 26;
    const alpha = i === 5 ? '20' : '18';
    html += `<rect x="30" y="${layer.y - h/2}" width="300" height="${h}" rx="5" fill="${layer.color}${alpha}" stroke="${layer.color}40" stroke-width="1.5"/>`;
    html += `<text x="180" y="${layer.y + 5}" text-anchor="middle" font-family="JetBrains Mono" font-size="${isMain ? 11 : 10}" fill="${layer.color}">${layer.label}</text>`;
    if (i < layers.length - 1) {
      const nextY = layers[i+1].y + (isMain ? 16 : 13);
      html += `<line x1="180" y1="${layer.y - h/2}" x2="180" y2="${nextY + 2}" stroke="${layer.color}50" stroke-width="1" stroke-dasharray="${i>=4?'3,3':''}"/>`;
      html += `<polygon points="175,${nextY + 8} 185,${nextY + 8} 180,${nextY + 14}" fill="${layers[i+1].color}80"/>`;
    }
  });

  html += `<circle cx="90" cy="220" r="4" fill="#635BFF" opacity="0.55"><animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.55;1;0.55" dur="2s" repeatCount="indefinite"/></circle>`;
  html += `<circle cx="270" cy="220" r="4" fill="#635BFF" opacity="0.55"><animate attributeName="r" values="3;6;3" dur="2s" begin="1s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.55;1;0.55" dur="2s" begin="1s" repeatCount="indefinite"/></circle>`;

  svg.innerHTML = html;
})();

// ═══════════════════════════════════════════════
// TRAINING LOOP — Loss Curve
// ═══════════════════════════════════════════════
(function(){
  const canvas = document.getElementById('loss-canvas');
  const ctx = canvas.getContext('2d');
  const lossEl = document.getElementById('current-loss');
  const stepEl = document.getElementById('current-step');
  const textEl = document.getElementById('training-text-output');
  let targetStep = 500, animStep = 0, animId = null;

  const lossData = [];
  function genLoss(step) {
    const base = 2.4 + 8.8 * Math.exp(-step / 4000);
    return base + (Math.random() - .5) * 0.25 * Math.exp(-step / 3000);
  }
  for (let i = 0; i <= 32000; i += 100) lossData.push({ step: i, loss: genLoss(i) });

  const trainingTexts = {
    1: `<span class="incoherent">wqp mxr tkz bnf opc lsw mzq vdf nrt</span>`,
    500: `<span class="incoherent">the model has learn</span><span class="coherent">ing</span> <span class="incoherent">but confus</span><span class="coherent">tion</span> <span class="incoherent">still wqp</span> <span class="coherent">the model</span> <span class="incoherent">bns</span> <span class="coherent">to predict</span>...`,
    5000: `<span class="coherent">The language model learns to predict the next token in a sequence.</span> <span class="incoherent">Training requires many thousands of</span> <span class="coherent">gradient descent steps</span> <span class="incoherent">to converge</span>.`,
    32000: `<span class="coherent">The neural network has learned the statistical patterns of human language. It can generate coherent text on virtually any topic, answer questions, write code, and engage in multi-turn conversations.</span>`
  };

  function drawCurve(upToStep) {
    const W = canvas.offsetWidth || 400;
    const H = 200;
    canvas.width = W;
    canvas.height = H;
    const pad = { l: 40, r: 20, t: 15, b: 30 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;
    const maxLoss = 12, minLoss = 2.0;

    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (i/4) * cH;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(216,208,194,0.8)';
      ctx.lineWidth = .5;
      ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
      const lv = maxLoss - (i/4) * (maxLoss - minLoss);
      ctx.fillStyle = 'rgba(123,110,102,0.75)';
      ctx.font = '9px JetBrains Mono';
      ctx.fillText(lv.toFixed(1), 2, y + 3);
    }
    ctx.strokeStyle = 'rgba(216,208,194,1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, H - pad.b); ctx.lineTo(W - pad.r, H - pad.b);
    ctx.stroke();
    ctx.fillStyle = 'rgba(123,110,102,0.75)';
    ctx.font = '8px JetBrains Mono';
    ['0','10K','20K','32K'].forEach((l, i) => ctx.fillText(l, pad.l + (i/3)*cW - 8, H - 5));

    const grd = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
    grd.addColorStop(0, 'rgba(99,91,255,0.14)');
    grd.addColorStop(1, 'rgba(99,91,255,0)');

    const visData = lossData.filter(d => d.step <= upToStep);
    if (visData.length < 2) return;

    ctx.beginPath();
    visData.forEach((d, i) => {
      const x = pad.l + (d.step / 32000) * cW;
      const y = pad.t + ((maxLoss - d.loss) / (maxLoss - minLoss)) * cH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    const lastX = pad.l + (visData[visData.length-1].step / 32000) * cW;
    ctx.lineTo(lastX, H - pad.b);
    ctx.lineTo(pad.l, H - pad.b);
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.beginPath();
    visData.forEach((d, i) => {
      const x = pad.l + (d.step / 32000) * cW;
      const y = pad.t + ((maxLoss - d.loss) / (maxLoss - minLoss)) * cH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#635BFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    const last = visData[visData.length-1];
    const lx = pad.l + (last.step / 32000) * cW;
    const ly = pad.t + ((maxLoss - last.loss) / (maxLoss - minLoss)) * cH;
    ctx.beginPath();
    ctx.arc(lx, ly, 4, 0, Math.PI*2);
    ctx.fillStyle = '#635BFF';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lx, ly, 7, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(99,91,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function animateTo(step) {
    if (animId) cancelAnimationFrame(animId);
    const startStep = animStep;
    const delta = step - startStep;
    const duration = Math.min(1200, Math.abs(delta) / 20);
    const start = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < .5 ? 2*t*t : -1+(4-2*t)*t;
      const cur = Math.round(startStep + delta * eased);
      animStep = cur;
      drawCurve(cur);

      const lossPoint = lossData.find(d => d.step >= cur) || lossData[lossData.length-1];
      lossEl.textContent = lossPoint.loss.toFixed(1);
      stepEl.textContent = cur.toLocaleString();

      if (t < 1) animId = requestAnimationFrame(frame);
    }
    animId = requestAnimationFrame(frame);
  }

  document.querySelectorAll('.stage-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.stage-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const step = parseInt(this.dataset.step);
      targetStep = step;
      animateTo(step);
      textEl.innerHTML = trainingTexts[step];
    });
  });

  setTimeout(() => {
    animateTo(500);
    textEl.innerHTML = trainingTexts[500];
  }, 500);
  window.addEventListener('resize', () => drawCurve(animStep));
})();

// ═══════════════════════════════════════════════
// INFERENCE — Probability Sampling Demo
// ═══════════════════════════════════════════════
(function(){
  const seqEl = document.getElementById('gen-seq');
  const barsEl = document.getElementById('prob-bars');
  const tempSlider = document.getElementById('temp-slider');
  const tempVal = document.getElementById('temp-val');
  const sampleBtn = document.getElementById('sample-btn');
  const resetBtn = document.getElementById('reset-gen-btn');
  const infoEl = document.getElementById('sample-info');

  const tokenSets = {
    'The sky appears blue': [
      {t: ' because', raw: 0.31}, {t: ' due', raw: 0.18}, {t: ',', raw: 0.12},
      {t: ' to', raw: 0.10}, {t: ' when', raw: 0.08}, {t: ' as', raw: 0.06},
      {t: ' from', raw: 0.04}, {t: ' and', raw: 0.03},
    ],
    'The sky appears blue because': [
      {t: ' of', raw: 0.42}, {t: ' light', raw: 0.20}, {t: ' Rayleigh', raw: 0.12},
      {t: ' the', raw: 0.09}, {t: ' shorter', raw: 0.06}, {t: ' sunlight', raw: 0.04},
      {t: ' scattered', raw: 0.03}, {t: ' wavelength', raw: 0.02},
    ],
    'The sky appears blue because of': [
      {t: ' Rayleigh', raw: 0.38}, {t: ' the', raw: 0.25}, {t: ' light', raw: 0.12},
      {t: ' scattering', raw: 0.09}, {t: ' atmospheric', raw: 0.07}, {t: ' how', raw: 0.04},
      {t: ' sunlight', raw: 0.03}, {t: ' blue', raw: 0.02},
    ],
  };
  const fallback = [
    {t: ' light', raw: 0.28}, {t: ' the', raw: 0.22}, {t: ' a', raw: 0.14},
    {t: ' an', raw: 0.10}, {t: ' scattering', raw: 0.08}, {t: ' wavelengths', raw: 0.06},
    {t: ' blue', raw: 0.05}, {t: ' molecules', raw: 0.04},
  ];

  const barColors = ['#635BFF','#0570DE','#946800','#00875A','#DF1B41','#4F46E5','#946800','#00875A'];

  function applyTemp(tokens, temp) {
    const logits = tokens.map(t => Math.log(t.raw) / temp);
    const maxL = Math.max(...logits);
    const exps = logits.map(l => Math.exp(l - maxL));
    const sum = exps.reduce((a,b) => a+b, 0);
    return tokens.map((t, i) => ({ ...t, prob: exps[i] / sum }));
  }

  function renderBars(tokens, selectedIdx = -1) {
    const temp = parseFloat(tempSlider.value);
    const processed = applyTemp(tokens, temp);
    barsEl.innerHTML = '';
    processed.forEach((t, i) => {
      const pct = (t.prob * 100).toFixed(1);
      const row = document.createElement('div');
      row.className = 'prob-row' + (i === selectedIdx ? ' selected' : '');
      const color = barColors[i % barColors.length];
      row.innerHTML = `
        <div class="prob-token-label">${t.t}</div>
        <div class="prob-bar-bg">
          <div class="prob-bar-fill" style="width:${t.prob * 100}%;background:${color}${i === selectedIdx ? 'ff' : '66'}">
            <span>${pct}%</span>
          </div>
        </div>`;
      barsEl.appendChild(row);
    });
    return processed;
  }

  function getCurrentTokens() {
    const seq = seqEl.textContent;
    return tokenSets[seq] || fallback;
  }

  let lastProcessed = null;

  function updateBars() {
    lastProcessed = renderBars(getCurrentTokens());
  }

  tempSlider.addEventListener('input', () => {
    tempVal.textContent = tempSlider.value;
    updateBars();
  });

  sampleBtn.addEventListener('click', () => {
    sampleBtn.disabled = true;
    const temp = parseFloat(tempSlider.value);
    const tokens = getCurrentTokens();
    const processed = applyTemp(tokens, temp);

    renderBars(tokens);

    setTimeout(() => {
      const r = Math.random();
      let cumul = 0, selectedIdx = processed.length - 1;
      for (let i = 0; i < processed.length; i++) {
        cumul += processed[i].prob;
        if (r < cumul) { selectedIdx = i; break; }
      }

      renderBars(tokens, selectedIdx);

      setTimeout(() => {
        const newText = seqEl.textContent + processed[selectedIdx].t;
        seqEl.innerHTML = '';
        const span = document.createElement('span');
        span.className = 'gen-token';
        span.textContent = newText;
        seqEl.appendChild(span);

        infoEl.textContent = `Sampled "${processed[selectedIdx].t}" (${(processed[selectedIdx].prob * 100).toFixed(1)}% prob)`;

        setTimeout(() => {
          updateBars();
          sampleBtn.disabled = false;
        }, 300);
      }, 600);
    }, 200);
  });

  resetBtn.addEventListener('click', () => {
    seqEl.textContent = 'The sky appears blue';
    infoEl.textContent = '';
    updateBars();
  });

  updateBars();
})();

// ═══════════════════════════════════════════════
// PIPELINE ANIMATION
// ═══════════════════════════════════════════════
(function(){
  const nodes = document.querySelectorAll('.pipeline-node');
  const arrows = document.querySelectorAll('.pipeline-arrow');

  function activateNode(node) {
    const wasActive = node.classList.contains('active');
    nodes.forEach(n => {
      n.classList.remove('active');
      n.setAttribute('aria-expanded', 'false');
    });
    if (!wasActive) {
      node.classList.add('active');
      node.setAttribute('aria-expanded', 'true');
    }
  }

  nodes.forEach(node => {
    node.addEventListener('click', function() { activateNode(this); });
    node.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateNode(this); }
    });
  });

  document.getElementById('run-pipeline-btn').addEventListener('click', function() {
    nodes.forEach(n => { n.classList.remove('active'); n.setAttribute('aria-expanded','false'); });
    arrows.forEach(a => a.classList.remove('lit'));
    let i = 0;
    function next() {
      if (i < nodes.length) {
        nodes[i].classList.add('active');
        nodes[i].setAttribute('aria-expanded','true');
        if (i > 0) arrows[i-1].classList.add('lit');
        i++;
        setTimeout(next, 500);
      }
    }
    next();
  });
})();

// ═══════════════════════════════════════════════
// SCROLL OBSERVER — Animations + Nav
// ═══════════════════════════════════════════════
(function(){
  const sections = document.querySelectorAll('.section');
  const navDots = document.querySelectorAll('.tnav-btn');
  const progressBar = document.getElementById('progress-bar');
  const pipelineStages = document.querySelectorAll('.pipeline-stage');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = Math.round(scrolled / total * 100);
    progressBar.style.width = pct + '%';
    progressBar.setAttribute('aria-valuenow', pct);
  }, {passive: true});

  document.querySelectorAll('.fade-up, .fade-in').forEach(el => el.classList.add('animate-ready'));

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .fade-in').forEach(el => fadeObserver.observe(el));

  pipelineStages.forEach(s => s.classList.add('animate-ready'));
  const pipelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        pipelineStages.forEach((s, i) => setTimeout(() => s.classList.add('visible'), i * 100));
        pipelineObserver.disconnect();
      }
    });
  }, { threshold: 0.05 });

  const summarySection = document.getElementById('s-summary');
  if (summarySection) pipelineObserver.observe(summarySection);

  function setActiveNav(sectionId) {
    navDots.forEach(btn => {
      const isActive = btn.dataset.section === sectionId;
      btn.classList.toggle('active', isActive);
      if (isActive) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
      if (isActive) btn.scrollIntoView({block:'nearest',inline:'center'});
    });
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveNav(entry.target.id);
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  function handleNavClick(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  }

  navDots.forEach(btn => {
    btn.addEventListener('click', () => handleNavClick(btn.dataset.section));
  });

  document.querySelectorAll('.stage-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.stage-btn').forEach(b => b.setAttribute('aria-pressed', 'false'));
      this.setAttribute('aria-pressed', 'true');
    });
  });
})();

// ═══════════════════════════════════════════════
// RAG SECTION — Scatter canvas + demo animation
// ═══════════════════════════════════════════════
(function() {
  const canvas = document.getElementById('rag-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const dots = [
    {x: .28, y: .38, c: 'rgba(5,112,222,0.65)', r: 5, lbl: 'colony', retrieved: false},
    {x: .34, y: .30, c: 'rgba(5,112,222,0.65)', r: 5, lbl: 'capital', retrieved: false},
    {x: .22, y: .44, c: 'rgba(5,112,222,0.5)', r: 4, lbl: 'colonists', retrieved: false},
    {x: .30, y: .52, c: 'rgba(5,112,222,0.35)', r: 4, lbl: '', retrieved: false},
    {x: .68, y: .32, c: 'rgba(123,110,102,0.55)', r: 5, lbl: 'temperature', retrieved: false},
    {x: .74, y: .40, c: 'rgba(123,110,102,0.55)', r: 4, lbl: 'climate', retrieved: false},
    {x: .62, y: .25, c: 'rgba(123,110,102,0.45)', r: 4, lbl: 'geography', retrieved: false},
    {x: .60, y: .70, c: 'rgba(123,110,102,0.5)', r: 5, lbl: 'mission', retrieved: false},
    {x: .68, y: .62, c: 'rgba(123,110,102,0.45)', r: 4, lbl: 'launch', retrieved: false},
    {x: .54, y: .76, c: 'rgba(123,110,102,0.35)', r: 4, lbl: '', retrieved: false},
    {x: .31, y: .33, c: '#635BFF', r: 7, lbl: 'query ▲', isQuery: true}
  ];

  let showQuery = false, showLines = false;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(216,208,194,0.6)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 44) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    ctx.font = '10px JetBrains Mono,monospace';
    ctx.fillStyle = 'rgba(5,112,222,0.3)';
    ctx.fillText('colony / capital cluster', .06*W, .75*H);
    ctx.fillStyle = 'rgba(123,110,102,0.3)';
    ctx.fillText('science cluster', .55*W, .52*H);
    if (showLines) {
      const q = dots[dots.length-1];
      [dots[0], dots[1]].forEach(d => {
        const g = ctx.createLinearGradient(q.x*W,q.y*H,d.x*W,d.y*H);
        g.addColorStop(0,'rgba(99,91,255,0.7)'); g.addColorStop(1,'rgba(5,112,222,0.55)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.5;
        ctx.setLineDash([4,4]);
        ctx.beginPath(); ctx.moveTo(q.x*W,q.y*H); ctx.lineTo(d.x*W,d.y*H); ctx.stroke();
        ctx.setLineDash([]);
      });
    }
    dots.forEach((d, i) => {
      if (d.isQuery && !showQuery) return;
      const x = d.x*W, y = d.y*H;
      const isNearest = showLines && (i === 0 || i === 1);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(x, y, isNearest ? d.r+1 : d.r, 0, Math.PI*2);
      ctx.fillStyle = isNearest ? '#0570DE' : d.c;
      ctx.fill();
      if (d.lbl) {
        ctx.font = '9px JetBrains Mono,monospace';
        ctx.fillStyle = d.isQuery ? '#635BFF' : (isNearest ? '#0570DE' : 'rgba(123,110,102,0.65)');
        ctx.fillText(d.lbl, x + d.r + 3, y + 3);
      }
    });
  }

  draw();

  const ragSec = document.getElementById('s-rag');
  let seenOnce = false;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !seenOnce) {
      seenOnce = true;
      setTimeout(() => { showQuery = true; draw(); }, 500);
    }
  }, {threshold: 0.2});
  if (ragSec) obs.observe(ragSec);

  const runBtn    = document.getElementById('rag-run-btn');
  const resetBtn  = document.getElementById('rag-reset-btn');
  const flowSteps = [1,2,3,4,5,6].map(i => document.getElementById('rag-s'+i));
  const doc0      = document.getElementById('rdoc-0');
  const doc1      = document.getElementById('rdoc-1');
  const ctxBox    = document.getElementById('rag-ctx-box');
  const ansGood   = document.getElementById('rag-ans-good');
  const goodBadge = document.getElementById('rag-good-badge');

  function resetDemo() {
    flowSteps.forEach(s => s && s.classList.remove('rag-active'));
    doc0 && doc0.classList.remove('rag-retrieved');
    doc1 && doc1.classList.remove('rag-retrieved');
    if (ctxBox) ctxBox.classList.remove('rag-visible');
    if (ansGood) ansGood.style.opacity = '0.3';
    if (goodBadge) goodBadge.style.opacity = '0.3';
    showLines = false; draw();
    if (runBtn) { runBtn.disabled = false; runBtn.textContent = '▶ Run RAG Query'; }
  }

  function runDemo() {
    if (!runBtn) return;
    runBtn.disabled = true; runBtn.textContent = 'Running…';
    const timings = [0, 700, 1400, 2100, 2900, 3700];
    timings.forEach((t, i) => {
      setTimeout(() => {
        flowSteps.forEach(s => s && s.classList.remove('rag-active'));
        flowSteps[i] && flowSteps[i].classList.add('rag-active');
        if (i === 2) { showLines = true; draw(); }
        if (i === 3) { doc0 && doc0.classList.add('rag-retrieved'); doc1 && doc1.classList.add('rag-retrieved'); }
        if (i === 4) { ctxBox && ctxBox.classList.add('rag-visible'); }
        if (i === 5) {
          if (ansGood) ansGood.style.opacity = '1';
          if (goodBadge) goodBadge.style.opacity = '1';
          runBtn.disabled = false; runBtn.textContent = '▶ Run Again';
        }
      }, t);
    });
  }

  runBtn  && runBtn.addEventListener('click',  () => { resetDemo(); setTimeout(runDemo, 80); });
  resetBtn && resetBtn.addEventListener('click', resetDemo);
})();
