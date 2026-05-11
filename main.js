// ═══════════════════════════════════════════════
// HERO CANVAS — Floating Token Fragments
// ═══════════════════════════════════════════════
(function(){
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, tokens = [], animId;
  const WORDS = ['the','of','and','a ','to','in ','is ','it ','ing','tion','pre','er ','un','re ','ed ','ly ','ness','ment','ize','BPE','seq','dim','MLP','key','vec','loss','grad','mask','head','norm','next','data','text','byte','GPT','LLM','soft','max','Adam','logit','embed','token','layer','atten'];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
// BPE VISUALIZATION — live tokenizer (rebuilt)
// ═══════════════════════════════════════════════
(function(){
  const input   = document.getElementById('bpe-input');
  const strip   = document.getElementById('bpe-strip');
  const log     = document.getElementById('bpe-log');
  const stepBtn = document.getElementById('bpe-step-btn');
  const autoBtn = document.getElementById('bpe-auto-btn');
  const resetBtn= document.getElementById('bpe-reset-btn');
  const countEl = document.getElementById('bpe-count');
  if (!input || !strip) return;

  // Ordered BPE merge rules — representative of GPT-style English BPE
  const MERGES = [
    ['t','h'],['e','r'],['i','n'],['a','n'],['o','n'],['a','l'],
    ['th','e'],['e','d'],['i','t'],['o','r'],['o','u'],['e','n'],
    ['a','t'],['in','g'],['a','r'],['o','f'],['t','o'],['i','s'],
    ['er','s'],['o','w'],['c','h'],['w','h'],['an','d'],['th','at'],
    ['i','on'],['at','ion'],['a','s'],['r','e'],['r','s'],['s','t']
  ];

  const PILL_COLORS = ['#635BFF','#0570DE','#946800','#00875A','#DF1B41','#4F46E5','#7C3AED','#0891B2'];

  let tokens = [];
  let mergeStep = 0;
  let autoTimer = null;

  function initTokens(text) {
    tokens = (text || 'hello').split('');
    mergeStep = 0;
    log.innerHTML = '';
    render();
  }

  function render() {
    strip.innerHTML = '';
    tokens.forEach((tok, i) => {
      const pill = document.createElement('span');
      pill.className = 'bpe-pill';
      pill.textContent = tok;
      const color = PILL_COLORS[i % PILL_COLORS.length];
      pill.style.cssText = `color:${color};border-color:${color}55;background:${color}12`;
      strip.appendChild(pill);
    });
    countEl.textContent = tokens.length + ' token' + (tokens.length !== 1 ? 's' : '');
    stepBtn.disabled = mergeStep >= MERGES.length;
  }

  function applyNextMerge() {
    while (mergeStep < MERGES.length) {
      const [a, b] = MERGES[mergeStep++];
      let merged = false;
      const next = [];
      let i = 0;
      while (i < tokens.length) {
        if (i < tokens.length - 1 && tokens[i] === a && tokens[i+1] === b) {
          next.push(a + b);
          i += 2;
          merged = true;
        } else {
          next.push(tokens[i++]);
        }
      }
      if (merged) {
        tokens = next;
        const entry = document.createElement('div');
        entry.innerHTML = `→ merged <span class="bpe-log-token">'${a}'</span>+<span class="bpe-log-token">'${b}'</span> → <span class="bpe-log-token">'${a+b}'</span>`;
        log.insertBefore(entry, log.firstChild);
        render();
        requestAnimationFrame(() => {
          strip.querySelectorAll('.bpe-pill').forEach(p => {
            if (p.textContent === a+b) { p.classList.remove('merging'); void p.offsetWidth; p.classList.add('merging'); }
          });
        });
        return true;
      }
    }
    return false;
  }

  function startAuto() {
    autoBtn.textContent = '⏸ Pause';
    autoTimer = setInterval(() => { if (!applyNextMerge()) stopAuto(); }, 380);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
    autoBtn.textContent = '▶ Auto';
  }

  input.addEventListener('input', () => { stopAuto(); initTokens(input.value); });
  stepBtn.addEventListener('click', () => { stopAuto(); applyNextMerge(); });
  autoBtn.addEventListener('click', () => autoTimer ? stopAuto() : startAuto());
  resetBtn.addEventListener('click', () => { stopAuto(); initTokens(input.value); });

  initTokens(input.value);
})();


// ═══════════════════════════════════════════════
// TRANSFORMER DIAGRAM SVG — interactive rebuild
// ═══════════════════════════════════════════════
(function(){
  const svg  = document.getElementById('transformer-svg');
  const card = document.getElementById('transformer-card');
  if (!svg || !card) return;

  const LAYERS = [
    {id:'input',  y:306, h:24, color:'#946800', label:'Input Tokens',
     text:'Raw token IDs — integers from 0 to 100,276 representing sub-word chunks of your text.'},
    {id:'embed',  y:268, h:24, color:'#946800', label:'Token Embedding',
     text:'Each ID maps to a learned vector of ~4,096 numbers. Think of it as a coordinate in meaning-space — initialized randomly, shaped by training.'},
    {id:'attn',   y:218, h:32, color:'#635BFF', label:'Multi-Head Attention',
     text:'Each token "looks at" every other token and learns how much to weight their context. A 70B model runs 64 heads in parallel — each picking up different relationship patterns.', heatmap:true},
    {id:'mlp',    y:166, h:32, color:'#0570DE', label:'Feed Forward (MLP)',
     text:'Two linear layers with a nonlinearity between them, applied to each token independently. 4× the model width. Most parameters live here.'},
    {id:'norm',   y:126, h:24, color:'#697386', label:'Layer Norm + Residual',
     text:'Each sub-layer\'s output is added back to its input (residual) and normalized. This keeps gradients flowing cleanly through 80+ stacked blocks.'},
    {id:'repeat', y:90,  h:22, color:'#9B8E86', label:'× N Transformer Blocks',
     text:'The attention + MLP + norm stack repeats N times. GPT-3: 96 blocks. Llama 3 70B: 80 blocks. Each block refines the representations from the last.'},
    {id:'logits', y:48,  h:24, color:'#00875A', label:'Output Logits',
     text:'The final hidden state is projected to 100,277 logits — one per vocabulary token. Softmax converts these to next-token probabilities.'}
  ];

  let activeId = null;
  let dotY = 306;
  let dotTarget = 48;

  function heatmapHTML() {
    const W = [[.9,.05,.03,.02],[.1,.7,.15,.05],[.05,.2,.65,.1],[.08,.07,.05,.8]];
    let h = '<div class="transformer-heatmap">';
    for (const row of W) for (const w of row) {
      h += `<div class="tc-cell" style="background:rgba(99,91,255,${(0.08+w*.92).toFixed(2)})"></div>`;
    }
    return h + '</div><div style="font-size:10px;color:var(--txt2);margin-top:4px">Mock 4×4 attention matrix (dark=high)</div>';
  }

  function render(dy) {
    let html = '';
    for (let i = 0; i < 8; i++) {
      html += `<line x1="${45*i}" y1="0" x2="${45*i}" y2="340" stroke="rgba(216,208,194,.5)" stroke-width=".5"/>`;
      html += `<line x1="0" y1="${45*i}" x2="360" y2="${45*i}" stroke="rgba(216,208,194,.5)" stroke-width=".5"/>`;
    }

    LAYERS.forEach((layer, idx) => {
      const isActive = layer.id === activeId;
      html += `<rect data-layer="${layer.id}" x="24" y="${layer.y-layer.h/2}" width="312" height="${layer.h}" rx="5"
        fill="${layer.color}${isActive?'30':'18'}" stroke="${layer.color}${isActive?'cc':'40'}"
        stroke-width="${isActive?2:1.5}" style="cursor:pointer"/>`;
      html += `<text x="180" y="${layer.y+5}" text-anchor="middle" font-family="JetBrains Mono"
        font-size="${layer.h>=32?11:10}" fill="${layer.color}" style="pointer-events:none">${layer.label}</text>`;
      const next = LAYERS[idx+1];
      if (next) {
        const fy = layer.y-layer.h/2, ty = next.y+next.h/2, my = (fy+ty)/2;
        html += `<line x1="180" y1="${fy}" x2="180" y2="${my+4}" stroke="${layer.color}40" stroke-width="1"${layer.id==='norm'?' stroke-dasharray="3,3"':''}/>`;
        html += `<polygon points="175,${my+8} 185,${my+8} 180,${my+14}" fill="${next.color}80"/>`;
      }
    });

    html += `<circle cx="40" cy="${dy}" r="5" fill="rgba(99,91,255,.85)">
      <animate attributeName="opacity" values=".6;1;.6" dur="1.4s" repeatCount="indefinite"/>
    </circle>
    <circle cx="40" cy="${dy}" r="9" fill="none" stroke="rgba(99,91,255,.3)" stroke-width="1.5">
      <animate attributeName="r" values="7;13;7" dur="1.4s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".5;0;.5" dur="1.4s" repeatCount="indefinite"/>
    </circle>`;

    svg.innerHTML = html;

    svg.querySelectorAll('[data-layer]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.layer;
        if (activeId === id) { activeId = null; card.classList.remove('tc-visible'); card.innerHTML = ''; }
        else {
          activeId = id;
          const layer = LAYERS.find(l => l.id === id);
          card.innerHTML = `<div class="transformer-card-title" style="color:${layer.color}">${layer.label}</div>
            <div>${layer.text}</div>${layer.heatmap ? heatmapHTML() : ''}`;
          card.classList.add('tc-visible');
        }
        render(Math.round(dotY));
      });
    });
  }

  function animFrame() {
    dotY += (dotTarget - dotY) * 0.025;
    if (Math.abs(dotY - dotTarget) < 3) dotTarget = dotTarget === 48 ? 306 : 48;
    render(Math.round(dotY));
    requestAnimationFrame(animFrame);
  }
  animFrame();
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
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 400;
    const H = 200;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
// INFERENCE — Probability Sampling Demo (canvas rebuild)
// ═══════════════════════════════════════════════
(function(){
  const canvas    = document.getElementById('prob-canvas');
  const seqEl     = document.getElementById('gen-seq');
  const tempSl    = document.getElementById('temp-slider');
  const tempValEl = document.getElementById('temp-val');
  const sampleBtn = document.getElementById('sample-btn');
  const resetBtn  = document.getElementById('reset-gen-btn');
  if (!canvas || !seqEl) return;
  const ctx = canvas.getContext('2d');

  const COLORS = ['#635BFF','#0570DE','#946800','#00875A','#DF1B41','#4F46E5','#7C3AED','#0891B2'];

  const TOKEN_SETS = {
    'The sky appears blue': [
      {t:' because',raw:.31},{t:' due',raw:.18},{t:',',raw:.12},
      {t:' to',raw:.10},{t:' when',raw:.08},{t:' as',raw:.06},{t:' from',raw:.04},{t:' and',raw:.03}
    ],
    'The sky appears blue because': [
      {t:' of',raw:.42},{t:' light',raw:.20},{t:' Rayleigh',raw:.12},
      {t:' the',raw:.09},{t:' shorter',raw:.06},{t:' sunlight',raw:.04},{t:' scattered',raw:.03},{t:' wavelength',raw:.02}
    ],
    'The sky appears blue because of': [
      {t:' Rayleigh',raw:.38},{t:' the',raw:.25},{t:' light',raw:.12},
      {t:' scattering',raw:.09},{t:' atmospheric',raw:.07},{t:' how',raw:.04},{t:' sunlight',raw:.03},{t:' blue',raw:.02}
    ],
    'The sky appears blue because of Rayleigh': [
      {t:' scattering',raw:.72},{t:',',raw:.10},{t:' diffusion',raw:.07},
      {t:' effects',raw:.04},{t:' dispersion',raw:.03},{t:' waves',raw:.02},{t:' radiation',raw:.01},{t:' emission',raw:.01}
    ],
    'The sky appears blue because of Rayleigh scattering': [
      {t:', ',raw:.35},{t:' of',raw:.28},{t:' —',raw:.15},
      {t:'.',raw:.12},{t:' which',raw:.06},{t:' where',raw:.04}
    ],
    'The sky appears blue because of Rayleigh scattering,': [
      {t:' which',raw:.45},{t:' where',raw:.20},{t:' a',raw:.15},
      {t:' shorter',raw:.10},{t:' blue',raw:.06},{t:' sunlight',raw:.04}
    ],
    'The sky appears blue because of Rayleigh scattering, which': [
      {t:' causes',raw:.38},{t:' scatters',raw:.28},{t:' makes',raw:.18},
      {t:' bends',raw:.08},{t:' affects',raw:.05},{t:' creates',raw:.03}
    ]
  };
  const FALLBACK = [
    {t:' light',raw:.28},{t:' the',raw:.22},{t:' shorter',raw:.14},
    {t:' blue',raw:.12},{t:' wave',raw:.10},{t:' scatter',raw:.08},{t:' sun',raw:.04},{t:' air',raw:.02}
  ];

  function softmax(tokens, temp) {
    const logits = tokens.map(t => Math.log(Math.max(t.raw, 1e-9)) / temp);
    const maxL = Math.max(...logits);
    const exps = logits.map(l => Math.exp(l - maxL));
    const sum  = exps.reduce((a,b) => a+b, 0);
    return tokens.map((t,i) => ({...t, prob: exps[i]/sum}));
  }

  function getTokens() { return TOKEN_SETS[seqEl.textContent.trim()] || FALLBACK; }

  let heights = [];
  let targets = [];
  let selectedIdx = -1;

  function computeTargets() {
    const temp = parseFloat(tempSl.value);
    const toks = softmax(getTokens(), temp);
    targets = toks.map(t => t.prob);
    return toks;
  }

  function draw(toks) {
    const dpr  = window.devicePixelRatio || 1;
    const cssW = canvas.offsetWidth || 400;
    const cssH = 180;
    canvas.width  = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const n = toks.length, gap = 6;
    const barW    = (cssW - gap * (n + 1)) / n;
    const maxBarH = cssH - 40;

    toks.forEach((t, i) => {
      const x     = gap + i * (barW + gap);
      const h     = Math.max((heights[i] || 0) * maxBarH, 1);
      const y     = cssH - 24 - h;
      const color = COLORS[i % COLORS.length];
      const sel   = i === selectedIdx;

      ctx.globalAlpha = sel ? 1 : 0.6;
      ctx.fillStyle = color;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, barW, h, [3,3,0,0]);
      else ctx.rect(x, y, barW, h);
      ctx.fill();

      if (sel) { ctx.shadowColor = color; ctx.shadowBlur = 18; ctx.fill(); ctx.shadowBlur = 0; }
      ctx.globalAlpha = 1;

      ctx.fillStyle = sel ? color : color + 'bb';
      ctx.font = `${sel ? 'bold ' : ''}10px 'JetBrains Mono',monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(((heights[i]||0)*100).toFixed(0)+'%', x+barW/2, Math.max(y-4, 12));

      ctx.fillStyle = sel ? color : '#697386';
      ctx.font = `${sel ? 'bold ' : ''}9px 'JetBrains Mono',monospace`;
      const lbl = (t.t||'').trim() || '·';
      ctx.fillText(lbl.length > 8 ? lbl.slice(0,7)+'…' : lbl, x+barW/2, cssH - 6);
    });
  }

  function frame() {
    const toks = computeTargets();
    if (heights.length !== targets.length) {
      heights = [...targets];
    } else {
      for (let i = 0; i < heights.length; i++) heights[i] += (targets[i] - heights[i]) * 0.14;
    }
    draw(toks);
    requestAnimationFrame(frame);
  }

  tempSl.addEventListener('input', () => { tempValEl.textContent = parseFloat(tempSl.value).toFixed(1); });

  sampleBtn.addEventListener('click', () => {
    sampleBtn.disabled = true;
    const toks = softmax(getTokens(), parseFloat(tempSl.value));
    let r = Math.random(), cumul = 0, picked = toks.length - 1;
    for (let i = 0; i < toks.length; i++) { cumul += toks[i].prob; if (r < cumul) { picked = i; break; } }

    selectedIdx = picked;
    const base  = seqEl.textContent;
    const added = toks[picked].t;
    seqEl.innerHTML = '';
    const baseSpan = document.createElement('span');
    baseSpan.textContent = base;
    const newSpan = document.createElement('span');
    newSpan.className = 'gen-token-new';
    newSpan.textContent = added;
    seqEl.appendChild(baseSpan);
    seqEl.appendChild(newSpan);
    requestAnimationFrame(() => requestAnimationFrame(() => newSpan.classList.add('gen-token-new--in')));

    setTimeout(() => { selectedIdx = -1; sampleBtn.disabled = false; }, 700);
  });

  resetBtn.addEventListener('click', () => {
    seqEl.textContent = 'The sky appears blue';
    selectedIdx = -1;
    heights = [];
  });

  frame();
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
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth || 500;
  const H = canvas.offsetHeight || 200;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

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
