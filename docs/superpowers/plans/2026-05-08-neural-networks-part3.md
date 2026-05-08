# Neural Networks Part 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `neural-networks/index.html` — a complete beginner's visual guide to neural networks based on Karpathy's micrograd video, matching the Part 1/2 design system exactly.

**Architecture:** Single-page HTML + copied CSS + vanilla JS. All 5 interactive demos are self-contained IFFEs in `main.js`. No build step, no dependencies. Same CSS variables, Inter + JetBrains Mono fonts, canvas/SVG patterns as Part 1/2.

**Tech Stack:** Vanilla HTML/CSS/JS, CSS custom properties, Canvas 2D API, inline SVG

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `neural-networks/index.html` | Create | All 8 sections, nav, hero |
| `neural-networks/style.css` | Copy from root | Design system (no changes) |
| `neural-networks/main.js` | Create | Hero canvas, typewriter, progress bar, scroll nav, fade-up observer, all 5 demos |
| `index.html` | Modify line 23 | Add Part 3 → nav link |
| `how-to-use-llms/index.html` | Modify line 19 | Add Part 3 → nav link |

---

## Task 1: Directory setup and style.css

**Files:**
- Create: `neural-networks/` directory
- Create: `neural-networks/style.css` (copy from root)

- [ ] **Step 1: Create directory and copy CSS**

```bash
mkdir -p /Users/yashnarwal/projects/how-llms-work/neural-networks
cp /Users/yashnarwal/projects/how-llms-work/style.css \
   /Users/yashnarwal/projects/how-llms-work/neural-networks/style.css
```

- [ ] **Step 2: Verify copy**

```bash
wc -l /Users/yashnarwal/projects/how-llms-work/neural-networks/style.css
```
Expected: same line count as root `style.css`

- [ ] **Step 3: Commit**

```bash
git add neural-networks/style.css
git commit -m "Add neural-networks dir with copied style.css"
```

---

## Task 2: Full HTML scaffold — index.html

**Files:**
- Create: `neural-networks/index.html`

Write the complete HTML file with all 8 sections. The `main.js` at the bottom initializes everything; demos render into their placeholder containers.

- [ ] **Step 1: Create `neural-networks/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Neural Networks from Scratch — A Visual Deep Dive</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<style>
.code-block{background:var(--ink);color:#A5B4FC;font-family:var(--dm);font-size:12.5px;line-height:1.75;padding:18px 20px;border-radius:var(--radius);margin:16px 0;overflow-x:auto;border:1px solid rgba(255,255,255,0.06)}
.code-block .co{color:rgba(255,255,255,0.35)}
.code-block .kw{color:#C084FC}
.code-block .st{color:#86EFAC}
.code-block .nm{color:#FCA5A5}
.code-block .fn{color:#7DD3FC}
.code-line-explain{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--purple);padding:14px 18px;margin-top:-4px;margin-bottom:16px;font-size:13.5px;color:var(--txt);font-family:var(--db);border-radius:0 var(--radius-sm) var(--radius-sm) 0;line-height:1.7}
.code-line-explain code{font-family:var(--dm);font-size:12px;background:var(--card);padding:1px 5px;border-radius:3px;color:var(--purple)}
.demo-box{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow-sm);margin-top:16px}
.demo-label{font-family:var(--ds);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--txt2);margin-bottom:12px}
.slider-row{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.slider-row label{font-family:var(--dm);font-size:12px;color:var(--txt2);width:30px;flex-shrink:0}
.slider-row input[type=range]{flex:1;accent-color:var(--accent)}
.slider-val{font-family:var(--dm);font-size:12px;color:var(--accent);width:40px;text-align:right;flex-shrink:0}
.neuron-output{display:flex;gap:20px;margin-top:12px;font-family:var(--dm);font-size:12px}
.neuron-output .n-label{color:var(--txt2)}
.neuron-output .n-val{color:var(--accent);font-weight:600}
.nn-svg-wrap{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:12px;margin-top:12px}
.pipeline-full{display:flex;flex-direction:column;gap:0;margin-top:32px}
.pipeline-stage{display:flex;gap:20px;opacity:0;transform:translateY(12px);transition:opacity .5s,transform .5s}
.pipeline-stage.visible{opacity:1;transform:translateY(0)}
.pipeline-connector{width:3px;background:var(--border);height:24px;margin-left:23px}
.ps-num{font-family:var(--dm);font-size:11px;color:var(--txt2);padding-top:4px;flex-shrink:0;width:28px}
.ps-content{flex:1;border-left:3px solid var(--border);padding:12px 16px;background:var(--card);border-radius:0 var(--radius-sm) var(--radius-sm) 0;border:1px solid var(--border)}
.ps-title{font-family:var(--ds);font-size:12px;font-weight:700;letter-spacing:.04em;margin-bottom:4px}
.ps-desc{font-size:13.5px;color:var(--txt);line-height:1.6}
.ps-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
</style>
</head>
<body>
<a href="#main-content" class="skip-link">Skip to main content</a>
<div class="progress-bar" id="progress-bar" role="progressbar" aria-label="Reading progress" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>

<nav class="top-nav" id="top-nav" aria-label="Chapter navigation">
  <div class="top-nav-inner">
    <a href="../how-to-use-llms/index.html" class="top-nav-brand">← Part 2</a>
    <div class="top-nav-links" id="top-nav-links">
      <button class="tnav-btn active" data-section="s-intro" aria-current="true">Intro</button>
      <button class="tnav-btn" data-section="s-problem">Problem</button>
      <button class="tnav-btn" data-section="s-neuron">Neuron</button>
      <button class="tnav-btn" data-section="s-layers">Layers</button>
      <button class="tnav-btn" data-section="s-forward">Forward</button>
      <button class="tnav-btn" data-section="s-loss">Loss</button>
      <button class="tnav-btn" data-section="s-derivatives">Derivatives</button>
      <button class="tnav-btn" data-section="s-backprop">Backprop</button>
      <button class="tnav-btn" data-section="s-gd">Gradient Descent</button>
    </div>
  </div>
</nav>

<!-- ━━━━━━━━ HERO ━━━━━━━━ -->
<section id="s-intro" class="section" aria-label="Introduction">
  <canvas id="hero-canvas" aria-hidden="true"></canvas>
  <div class="hero-content" id="main-content">
    <div class="chapter-badge" aria-hidden="true">Part 3 · No Prior Knowledge Needed</div>
    <div class="hero-grid">
      <div class="hero-left">
        <h1 class="hero-title">Neural Networks<br><span>from Scratch</span></h1>
        <p class="hero-sub">The math, intuition, and code behind how neural networks actually learn — built up from a single neuron to a working training loop. Based on Andrej Karpathy's micrograd tutorial.</p>
        <dl class="hero-stats">
          <div class="stat-item"><dt class="stat-lbl">Concepts</dt><dd class="stat-val">8</dd></div>
          <div class="stat-item"><dt class="stat-lbl">Lines of Python</dt><dd class="stat-val">~50</dd></div>
          <div class="stat-item"><dt class="stat-lbl">Demos</dt><dd class="stat-val">5</dd></div>
          <div class="stat-item"><dt class="stat-lbl">Source</dt><dd class="stat-val">2h</dd></div>
        </dl>
        <p class="stats-caveat">Companion to <a href="../index.html" style="color:var(--accent)">Part 1: How LLMs Work</a>. All concepts and code traced directly to Karpathy's micrograd lecture.</p>
        <div class="scroll-hint" aria-hidden="true"><div class="scroll-arrow"></div>Scroll to explore</div>
      </div>
      <div class="hero-right">
        <div class="typewriter-wrap" aria-label="Neural network insight">
          <div class="tw-label" aria-hidden="true">Core Insight</div>
          <div class="tw-prompt">Q: What even is a neural network?</div>
          <div class="tw-response" id="tw-response" aria-live="polite" aria-atomic="true"><span class="tw-cursor" aria-hidden="true"></span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ━━━━━━━━ §1: THE PROBLEM ━━━━━━━━ -->
<section id="s-problem" class="section" aria-label="The Problem We're Solving">
  <div class="section-inner two-col">
    <div class="fade-up">
      <div class="chapter-badge">Chapter 1 · Motivation</div>
      <h2 class="section-title">The Problem<br>We're Solving</h2>
      <p class="body-text">Before we build anything, let's understand what we're trying to do. We have some inputs and we want to predict an output. For example: given these 4 measurements about a person, predict whether they'll like a movie.</p>
      <p class="body-text">The challenge: we don't know the formula. We can't write the rules by hand. Instead, we want a system that <span class="highlight">learns the formula from examples</span> — just by seeing a lot of input/output pairs.</p>
      <p class="body-text">A neural network is that system. It starts as a completely random function. Then it looks at thousands of examples and adjusts itself — tiny nudge by tiny nudge — until its predictions get good. This process is called <span class="highlight-a">training</span>.</p>
      <div class="insight-box">
        <strong>The Connection to Part 1</strong>
        GPT does exactly this — at massive scale. Its "inputs" are tokens, its "output" is the next token, and it trained on 15 trillion examples. The math is the same as what we'll build here. Just more of it.
      </div>
    </div>
    <div class="fade-up" style="animation-delay:.15s">
      <h3 class="sub-title">Our Training Dataset</h3>
      <p class="body-text" style="margin-bottom:12px">A tiny example to make it concrete. Four inputs, one target output:</p>
      <div class="demo-box">
        <div class="demo-label">Training Examples (xs → ys)</div>
        <div class="code-block">
<span class="co"># inputs: [x1, x2, x3, x4]</span>
xs = [
  [<span class="nm">2.0</span>, <span class="nm">3.0</span>, <span class="nm">-1.0</span>, <span class="nm">1.0</span>],
  [<span class="nm">3.0</span>, <span class="nm">-1.0</span>, <span class="nm">0.5</span>, <span class="nm">1.0</span>],
  [<span class="nm">0.5</span>, <span class="nm">1.0</span>, <span class="nm">1.0</span>, <span class="nm">1.0</span>],
  [<span class="nm">1.0</span>, <span class="nm">1.0</span>, <span class="nm">-1.0</span>, <span class="nm">1.0</span>],
]
<span class="co"># targets: what we want the network to output</span>
ys = [<span class="nm">1.0</span>, <span class="nm">-1.0</span>, <span class="nm">-1.0</span>, <span class="nm">1.0</span>]
        </div>
        <div class="code-line-explain">
          <code>xs</code> is our input data — 4 examples, each with 4 numbers. <code>ys</code> is the "right answer" for each example: 1.0 or -1.0. The network starts knowing nothing, and has to learn to map xs to ys.
        </div>
      </div>
      <div class="insight-box" style="margin-top:16px">
        <strong>Why -1 and 1?</strong>
        We use tanh as our activation function (more on this in §2), which outputs values between -1 and 1. So our targets are -1 and 1 to match that range.
      </div>
    </div>
  </div>
</section>

<!-- ━━━━━━━━ §2: WHAT IS A NEURON? ━━━━━━━━ -->
<section id="s-neuron" class="section" aria-label="What is a Neuron">
  <div class="section-inner two-col">
    <div class="fade-up">
      <div class="chapter-badge">Chapter 2 · The Building Block</div>
      <h2 class="section-title">What is<br>a Neuron?</h2>
      <p class="body-text">A neuron is just a tiny mathematical function. Think of it as a <span class="highlight">dimmer switch</span>: it takes a bunch of inputs, decides how much each one matters (the weights), adds a personal default lean (the bias), and squishes the result to a bounded range.</p>
      <p class="body-text">The formula: <span class="highlight-a">output = tanh(w₁·x₁ + w₂·x₂ + b)</span></p>
      <p class="body-text">Where w₁, w₂ are <span class="highlight">weights</span> ("how much does this input matter?"), b is the <span class="highlight">bias</span> ("what's my default lean when inputs are zero?"), and <span class="highlight-g">tanh</span> squishes the result to always land between -1 and 1.</p>
      <div class="code-block">
<span class="kw">class</span> <span class="fn">Value</span>:
  <span class="kw">def</span> <span class="fn">__init__</span>(<span class="nm">self</span>, data):
    <span class="nm">self</span>.data = data   <span class="co"># the actual number</span>
    <span class="nm">self</span>.grad = <span class="nm">0.0</span>   <span class="co"># gradient (filled in later)</span>

  <span class="kw">def</span> <span class="fn">__mul__</span>(<span class="nm">self</span>, other):
    <span class="kw">return</span> <span class="fn">Value</span>(<span class="nm">self</span>.data * other.data)

  <span class="kw">def</span> <span class="fn">__add__</span>(<span class="nm">self</span>, other):
    <span class="kw">return</span> <span class="fn">Value</span>(<span class="nm">self</span>.data + other.data)

  <span class="kw">def</span> <span class="fn">tanh</span>(<span class="nm">self</span>):
    <span class="kw">import</span> math
    t = math.<span class="fn">tanh</span>(<span class="nm">self</span>.data)
    <span class="kw">return</span> <span class="fn">Value</span>(t)
      </div>
      <div class="code-line-explain">
        <code>self.data</code> is just a number — like 0.5 or -1.3. <code>self.grad</code> starts at zero and gets filled in during backpropagation (§7). The <code>__mul__</code> and <code>__add__</code> methods let us use normal Python math operators (+, *) with Value objects. <code>tanh</code> squishes any number to the range (-1, 1).
      </div>
      <div class="insight-box">
        <strong>Why tanh?</strong>
        Without an activation function, stacking neurons just produces a linear function — no matter how many layers you add. tanh introduces non-linearity, which is what lets networks learn complex patterns.
      </div>
    </div>
    <div class="fade-up" style="animation-delay:.15s">
      <h3 class="sub-title">Neuron Playground</h3>
      <p class="body-text" style="margin-bottom:8px">Drag the sliders to change the weights and bias. Watch the neuron's output update live. Fixed inputs: x₁ = 0.5, x₂ = −0.3.</p>
      <div class="demo-box" id="neuron-playground">
        <div class="demo-label">Interactive Neuron</div>
        <div class="slider-row">
          <label>w₁</label>
          <input type="range" id="np-w1" min="-2" max="2" step="0.05" value="0.5" aria-label="Weight 1">
          <span class="slider-val" id="np-w1-val">0.50</span>
        </div>
        <div class="slider-row">
          <label>w₂</label>
          <input type="range" id="np-w2" min="-2" max="2" step="0.05" value="-0.3" aria-label="Weight 2">
          <span class="slider-val" id="np-w2-val">-0.30</span>
        </div>
        <div class="slider-row">
          <label>b</label>
          <input type="range" id="np-b" min="-2" max="2" step="0.05" value="0.0" aria-label="Bias">
          <span class="slider-val" id="np-b-val">0.00</span>
        </div>
        <canvas id="neuron-canvas" width="400" height="160" style="width:100%;display:block;margin-top:8px;border-radius:var(--radius-sm);border:1px solid var(--border)"></canvas>
        <div class="neuron-output" style="margin-top:10px">
          <span><span class="n-label">Raw sum: </span><span class="n-val" id="np-raw">0.00</span></span>
          <span><span class="n-label">tanh output: </span><span class="n-val" id="np-out">0.00</span></span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ━━━━━━━━ §3: LAYERS ━━━━━━━━ -->
<section id="s-layers" class="section" aria-label="Layers and Architecture">
  <div class="section-inner two-col">
    <div class="fade-up">
      <div class="chapter-badge">Chapter 3 · Architecture</div>
      <h2 class="section-title">Layers &<br>the MLP</h2>
      <p class="body-text">One neuron isn't enough to learn complex patterns. We stack them into <span class="highlight">layers</span>, and stack layers into a <span class="highlight-a">Multi-Layer Perceptron (MLP)</span>. Think of it as an assembly line: the first layer looks at raw inputs, the next layer looks at what the first layer found, and so on.</p>
      <p class="body-text">Every connection between neurons is one weight. A network with 4 inputs → 3 neurons → 1 output has <span class="highlight">(4×3) + (3×1) = 15 weights</span>, plus biases. GPT-4 has the same structure, just with 405 billion weights.</p>
      <div class="code-block">
<span class="kw">class</span> <span class="fn">Neuron</span>:
  <span class="kw">def</span> <span class="fn">__init__</span>(<span class="nm">self</span>, nin):
    <span class="co"># nin random weights + 1 bias, all start near 0</span>
    <span class="nm">self</span>.w = [<span class="fn">Value</span>(random.uniform(-<span class="nm">1</span>,<span class="nm">1</span>)) <span class="kw">for</span> _ <span class="kw">in</span> range(nin)]
    <span class="nm">self</span>.b = <span class="fn">Value</span>(<span class="nm">0</span>)

  <span class="kw">def</span> <span class="fn">__call__</span>(<span class="nm">self</span>, x):
    act = sum(wi*xi <span class="kw">for</span> wi,xi <span class="kw">in</span> zip(<span class="nm">self</span>.w, x)) + <span class="nm">self</span>.b
    <span class="kw">return</span> act.<span class="fn">tanh</span>()

<span class="kw">class</span> <span class="fn">Layer</span>:
  <span class="kw">def</span> <span class="fn">__init__</span>(<span class="nm">self</span>, nin, nout):
    <span class="nm">self</span>.neurons = [<span class="fn">Neuron</span>(nin) <span class="kw">for</span> _ <span class="kw">in</span> range(nout)]

  <span class="kw">def</span> <span class="fn">__call__</span>(<span class="nm">self</span>, x):
    <span class="kw">return</span> [n(x) <span class="kw">for</span> n <span class="kw">in</span> <span class="nm">self</span>.neurons]

<span class="kw">class</span> <span class="fn">MLP</span>:
  <span class="kw">def</span> <span class="fn">__init__</span>(<span class="nm">self</span>, nin, nouts):
    sizes = [nin] + nouts
    <span class="nm">self</span>.layers = [<span class="fn">Layer</span>(sizes[i], sizes[i+<span class="nm">1</span>])
                   <span class="kw">for</span> i <span class="kw">in</span> range(len(nouts))]

  <span class="kw">def</span> <span class="fn">__call__</span>(<span class="nm">self</span>, x):
    <span class="kw">for</span> layer <span class="kw">in</span> <span class="nm">self</span>.layers:
      x = layer(x)
    <span class="kw">return</span> x[<span class="nm">0</span>] <span class="kw">if</span> len(x) == <span class="nm">1</span> <span class="kw">else</span> x
      </div>
      <div class="code-line-explain">
        <code>Neuron(nin)</code> creates a neuron with <code>nin</code> random weights. <code>Layer(nin, nout)</code> creates <code>nout</code> neurons that each accept <code>nin</code> inputs. <code>MLP([4,3,1])</code> creates a 4→3→1 network: the output of each layer feeds into the next. <code>__call__</code> is Python's way of making an object callable — so <code>model(x)</code> runs the forward pass.
      </div>
    </div>
    <div class="fade-up" style="animation-delay:.15s">
      <h3 class="sub-title">MLP Architecture</h3>
      <p class="body-text" style="margin-bottom:12px">A 4→3→1 network: 4 inputs, one hidden layer of 3 neurons, 1 output.</p>
      <div class="nn-svg-wrap">
        <svg id="mlp-svg" viewBox="0 0 340 220" width="100%" role="img" aria-label="MLP architecture diagram"></svg>
      </div>
      <div class="insight-box" style="margin-top:16px">
        <strong>Create the model in one line</strong>
        <div class="code-block" style="margin-top:8px">
n = <span class="fn">MLP</span>(<span class="nm">4</span>, [<span class="nm">3</span>, <span class="nm">1</span>])  <span class="co"># 4 inputs → 3 hidden → 1 output</span>
        </div>
        That's it. We now have a randomly-initialized network with 4×3 + 3×1 = 15 weights plus 4 biases = 19 learnable parameters.
      </div>
    </div>
  </div>
</section>

<!-- ━━━━━━━━ §4: FORWARD PASS ━━━━━━━━ -->
<section id="s-forward" class="section" aria-label="Forward Pass">
  <div class="section-inner two-col">
    <div class="fade-up">
      <div class="chapter-badge">Chapter 4 · Computing the Output</div>
      <h2 class="section-title">The Forward<br>Pass</h2>
      <p class="body-text">The forward pass is simply: run data through the network from left to right. Each neuron fires in turn, passes its output to the next layer, and eventually we get a prediction out the end.</p>
      <p class="body-text">At the start, since weights are random, predictions are meaningless. But we can still run the forward pass — we need it to compute how wrong we are (§5), which tells us how to improve.</p>
      <div class="code-block">
<span class="co"># Run one training example through the network</span>
x = [<span class="fn">Value</span>(<span class="nm">2.0</span>), <span class="fn">Value</span>(<span class="nm">3.0</span>),
     <span class="fn">Value</span>(-<span class="nm">1.0</span>), <span class="fn">Value</span>(<span class="nm">1.0</span>)]

<span class="co"># This triggers __call__ on each layer in sequence</span>
prediction = n(x)

<span class="co"># prediction.data might be something like 0.23</span>
<span class="co"># Our target for this example is 1.0 — not great yet!</span>
print(prediction.data)  <span class="co"># e.g. 0.23</span>
      </div>
      <div class="code-line-explain">
        <code>n(x)</code> calls the MLP's <code>__call__</code> method, which loops through each layer and applies it to <code>x</code>. Each layer call applies each neuron: compute <code>w·x + b</code>, apply tanh, pass output to next layer. The final value is our prediction. It's just a chain of multiplications and additions.
      </div>
      <div class="insight-box">
        <strong>Everything is a number</strong>
        At every step, we're just computing numbers. The complexity comes from doing it for billions of parameters simultaneously, but the operation on each one is simple arithmetic.
      </div>
    </div>
    <div class="fade-up" style="animation-delay:.15s">
      <h3 class="sub-title">Forward Pass Visualizer</h3>
      <p class="body-text" style="margin-bottom:8px">Click "Run Forward Pass" to watch data flow through a 2→3→1 network. Each node lights up with its computed value.</p>
      <div class="demo-box">
        <div class="demo-label">Interactive Forward Pass</div>
        <svg id="fp-svg" viewBox="0 0 360 200" width="100%" style="display:block" role="img" aria-label="Forward pass animation"></svg>
        <div style="margin-top:12px;display:flex;gap:10px">
          <button class="btn btn-primary btn-sm" id="fp-run-btn">▶ Run Forward Pass</button>
          <button class="btn btn-ghost btn-sm" id="fp-reset-btn">Reset</button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ━━━━━━━━ §5: LOSS ━━━━━━━━ -->
<section id="s-loss" class="section" aria-label="Loss Function">
  <div class="section-inner two-col">
    <div class="fade-up">
      <div class="chapter-badge">Chapter 5 · Measuring Error</div>
      <h2 class="section-title">Loss — How<br>Wrong Are We?</h2>
      <p class="body-text">After the forward pass, we have predictions. Now we need to measure how wrong they are. The <span class="highlight">loss function</span> is a report card: one single number that summarizes "here is how bad your predictions are right now."</p>
      <p class="body-text">We use <span class="highlight-a">Mean Squared Error (MSE)</span>: for each example, square the difference between our prediction and the target, then average them all. Squaring ensures the loss is always positive and punishes big mistakes harder.</p>
      <p class="body-text">The goal of training: make this loss number as small as possible.</p>
      <div class="code-block">
<span class="co"># Run all training examples through the network</span>
ypred = [n(x) <span class="kw">for</span> x <span class="kw">in</span> xs]

<span class="co"># Compute mean squared error loss</span>
loss = sum(
  (yout - ygt)**<span class="nm">2</span>
  <span class="kw">for</span> ygt, yout <span class="kw">in</span> zip(ys, ypred)
)

print(loss.data)  <span class="co"># e.g. 4.73 — very wrong at first</span>
      </div>
      <div class="code-line-explain">
        For each example: <code>yout</code> is our network's prediction, <code>ygt</code> is the "ground truth" target. <code>(yout - ygt)**2</code> squares the error. If we predicted 0.23 but the target was 1.0, the error is (0.23−1.0)² = 0.59. We sum all 4 example errors to get one number. The training job is to push this number toward zero.
      </div>
    </div>
    <div class="fade-up" style="animation-delay:.15s">
      <h3 class="sub-title">Loss Landscape</h3>
      <p class="body-text" style="margin-bottom:8px">The loss is a function of all the weights. Think of it as a hilly terrain — we want to roll the ball to the lowest point. Click "Step" to run one gradient descent update.</p>
      <div class="demo-box">
        <div class="demo-label">Gradient Descent on Loss Curve</div>
        <canvas id="loss-canvas" width="400" height="160" style="width:100%;display:block;border-radius:var(--radius-sm);border:1px solid var(--border)"></canvas>
        <div class="slider-row" style="margin-top:12px">
          <label style="width:80px;color:var(--txt2);font-family:var(--dm);font-size:12px">Learn rate</label>
          <input type="range" id="loss-lr" min="0.01" max="0.5" step="0.01" value="0.1" aria-label="Learning rate">
          <span class="slider-val" id="loss-lr-val">0.10</span>
        </div>
        <div style="margin-top:8px;display:flex;gap:10px;align-items:center">
          <button class="btn btn-primary btn-sm" id="loss-step-btn">Step ↓</button>
          <button class="btn btn-ghost btn-sm" id="loss-reset-btn">Reset</button>
          <span style="font-family:var(--dm);font-size:12px;color:var(--txt2)">w = <span id="loss-w-val" style="color:var(--accent)">3.00</span> · loss = <span id="loss-val-display" style="color:var(--red)">1.00</span></span>
        </div>
      </div>
      <div class="insight-box" style="margin-top:16px">
        <strong>Loss is always a single number</strong>
        This is crucial. We need one number so we have one direction to optimize. If we had a vector of losses, we wouldn't know which way to move.
      </div>
    </div>
  </div>
</section>

<!-- ━━━━━━━━ §6: DERIVATIVES ━━━━━━━━ -->
<section id="s-derivatives" class="section" aria-label="Derivatives and Gradients">
  <div class="section-inner two-col">
    <div class="fade-up">
      <div class="chapter-badge">Chapter 6 · The Math of Change</div>
      <h2 class="section-title">Derivatives —<br>Which Way is Downhill?</h2>
      <p class="body-text">We want to push the loss down. To do that, we need to know: for each weight, does increasing it make the loss go up or down? That's exactly what a <span class="highlight">derivative</span> tells us.</p>
      <p class="body-text">Imagine standing on a hill. You can't see the whole landscape, but you can feel which direction your foot is going downhill. The derivative is that "feel" — the slope of the loss at your current position.</p>
      <p class="body-text">Key rules we'll use:</p>
      <ul style="font-size:15.5px;line-height:2;padding-left:20px;color:var(--txt)">
        <li><strong style="color:var(--accent)">Addition:</strong> d/dx(a + b) = 1 — adding passes the gradient through unchanged</li>
        <li><strong style="color:var(--amber)">Multiplication:</strong> d/dx(a · b) = b — the gradient scales by the other factor</li>
        <li><strong style="color:var(--green)">tanh:</strong> d/dx(tanh(x)) = 1 − tanh²(x) — the chain rule handles this</li>
      </ul>
      <div class="insight-box">
        <strong>The Chain Rule in one sentence</strong>
        If A affects B and B affects the loss, then A's effect on the loss = (A's effect on B) × (B's effect on the loss). We'll use this in §7 to propagate gradients backwards through the whole network.
      </div>
    </div>
    <div class="fade-up" style="animation-delay:.15s">
      <h3 class="sub-title">Derivative Visualizer</h3>
      <p class="body-text" style="margin-bottom:8px">Drag the point along f(x) = x². The tangent line shows the slope (derivative) at that position. Notice: at x=0 the slope is 0; it gets steeper as x moves away from center.</p>
      <div class="demo-box">
        <div class="demo-label">f(x) = x² — Drag the point</div>
        <canvas id="deriv-canvas" width="400" height="200" style="width:100%;display:block;border-radius:var(--radius-sm);border:1px solid var(--border);cursor:ew-resize"></canvas>
        <div style="margin-top:10px;font-family:var(--dm);font-size:12px">
          x = <span id="deriv-x" style="color:var(--accent)">1.00</span> &nbsp;·&nbsp;
          f(x) = <span id="deriv-fx" style="color:var(--amber)">1.00</span> &nbsp;·&nbsp;
          f'(x) = <span id="deriv-dfx" style="color:var(--green)">2.00</span>
        </div>
      </div>
      <div class="insight-box" style="margin-top:16px">
        <strong>Gradient vs Derivative</strong>
        A derivative is for a function of one variable. A gradient is the same idea for many variables — one slope per weight. The gradient of the loss tells us the slope in every weight direction at once.
      </div>
    </div>
  </div>
</section>

<!-- ━━━━━━━━ §7: BACKPROPAGATION ━━━━━━━━ -->
<section id="s-backprop" class="section" aria-label="Backpropagation">
  <div class="section-inner two-col">
    <div class="fade-up">
      <div class="chapter-badge">Chapter 7 · Assigning Blame</div>
      <h2 class="section-title">Backpropagation</h2>
      <p class="body-text">We know the loss. We know derivatives. But we have hundreds of weights — how do we know which ones to blame, and by how much?</p>
      <p class="body-text"><span class="highlight">Backpropagation</span> solves this efficiently. It walks the computation graph backwards — from the loss, through every operation, back to every weight — computing each weight's gradient using the chain rule.</p>
      <p class="body-text">Karpathy's key insight: <em>"The only thing backprop does is apply the chain rule recursively."</em> Nothing more. It's mechanical, not magical.</p>
      <div class="code-block">
<span class="co"># Zero out old gradients from the last step</span>
<span class="kw">for</span> p <span class="kw">in</span> n.parameters():
  p.grad = <span class="nm">0.0</span>

<span class="co"># Run the forward pass to build the computation graph</span>
ypred = [n(x) <span class="kw">for</span> x <span class="kw">in</span> xs]
loss = sum((yout - ygt)**<span class="nm">2</span> <span class="kw">for</span> ygt, yout <span class="kw">in</span> zip(ys, ypred))

<span class="co"># Walk the graph backwards: loss → every weight</span>
loss.<span class="fn">backward</span>()

<span class="co"># Now every parameter has a .grad filled in</span>
<span class="co"># p.grad = "if I increase p.data, loss goes up by p.grad"</span>
      </div>
      <div class="code-line-explain">
        <code>p.grad = 0.0</code> clears leftover gradients from the previous training step — they'd otherwise accumulate. <code>loss.backward()</code> walks backwards through every operation that produced <code>loss</code>, applying the chain rule at each node. After this call, every weight has a <code>.grad</code> that says "increase me → loss increases by this much."
      </div>
    </div>
    <div class="fade-up" style="animation-delay:.15s">
      <h3 class="sub-title">Expression Graph</h3>
      <p class="body-text" style="margin-bottom:8px">A simple expression: e = tanh((a·b) + a). Click "Run Forward" to compute values, then "Backprop" to watch gradients flow backwards.</p>
      <div class="demo-box">
        <div class="demo-label">Computation Graph — a=2, b=-3</div>
        <svg id="graph-svg" viewBox="0 0 380 260" width="100%" style="display:block" role="img" aria-label="Expression graph with backpropagation"></svg>
        <div style="margin-top:10px;display:flex;gap:10px">
          <button class="btn btn-primary btn-sm" id="graph-forward-btn">▶ Forward Pass</button>
          <button class="btn btn-ghost btn-sm" id="graph-back-btn" disabled>← Backprop</button>
          <button class="btn btn-ghost btn-sm" id="graph-reset-btn">Reset</button>
        </div>
      </div>
      <div class="insight-box" style="margin-top:16px">
        <strong>Why backwards?</strong>
        We already know the loss gradient (it's 1.0 — the loss with respect to itself). We work backwards because each node only needs the gradient from the node ahead of it (closer to the loss) to compute its own gradient. It's a clean recursive application of the chain rule.
      </div>
    </div>
  </div>
</section>

<!-- ━━━━━━━━ §8: GRADIENT DESCENT ━━━━━━━━ -->
<section id="s-gd" class="section" aria-label="Gradient Descent and Training">
  <div class="section-inner">
    <div class="fade-up" style="margin-bottom:40px">
      <div class="chapter-badge">Chapter 8 · Learning</div>
      <h2 class="section-title">Gradient Descent —<br>The Training Loop</h2>
      <p class="body-text" style="max-width:680px">We have gradients. Now we use them. The update rule is simple: for each weight, move it a tiny step in the opposite direction of its gradient. Opposite because the gradient points uphill — we want to go <em>downhill</em>.</p>
    </div>

    <div class="two-col">
      <div class="fade-up">
        <div class="code-block">
<span class="co"># Create the network</span>
n = <span class="fn">MLP</span>(<span class="nm">4</span>, [<span class="nm">3</span>, <span class="nm">1</span>])

<span class="kw">for</span> step <span class="kw">in</span> range(<span class="nm">100</span>):

  <span class="co"># 1. Forward pass → compute predictions</span>
  ypred = [n(x) <span class="kw">for</span> x <span class="kw">in</span> xs]

  <span class="co"># 2. Compute loss (single number)</span>
  loss = sum((yout - ygt)**<span class="nm">2</span>
             <span class="kw">for</span> ygt, yout <span class="kw">in</span> zip(ys, ypred))

  <span class="co"># 3. Zero out old gradients</span>
  <span class="kw">for</span> p <span class="kw">in</span> n.<span class="fn">parameters</span>():
    p.grad = <span class="nm">0.0</span>

  <span class="co"># 4. Backprop → fill in all gradients</span>
  loss.<span class="fn">backward</span>()

  <span class="co"># 5. Nudge every weight downhill</span>
  <span class="kw">for</span> p <span class="kw">in</span> n.<span class="fn">parameters</span>():
    p.data -= <span class="nm">0.01</span> * p.grad

  print(f<span class="st">"step {step} loss {loss.data:.4f}"</span>)
        </div>
        <div class="code-line-explain">
          Line by line: <strong>Forward pass</strong> — run all 4 examples through the network, get 4 predictions. <strong>Loss</strong> — square the errors and sum them; one number. <strong>Zero grads</strong> — gradients accumulate, so we must reset before each backward. <strong>Backprop</strong> — fill every <code>.grad</code> via chain rule. <strong>Update</strong> — <code>p.data -= 0.01 * p.grad</code> moves each weight a tiny step opposite its gradient. 0.01 is the learning rate — step size. Repeat 100 times: loss drops from ~4 to near 0.
        </div>
      </div>
      <div class="fade-up" style="animation-delay:.15s">
        <h3 class="sub-title" style="margin-bottom:8px">Loss During Training</h3>
        <canvas id="training-canvas" width="400" height="180" style="width:100%;display:block;background:var(--card);border:1px solid var(--border);border-radius:var(--radius)"></canvas>
        <div class="insight-box" style="margin-top:16px">
          <strong>The full loop, in words</strong>
          <ol style="margin:10px 0 0;padding-left:18px;line-height:2.1;font-size:13.5px">
            <li>Run the data forward — get predictions</li>
            <li>Measure how wrong they are (loss)</li>
            <li>Walk backwards — compute how much each weight contributed to the error</li>
            <li>Nudge each weight in the direction that reduces error</li>
            <li>Repeat</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- Full pipeline summary -->
    <div class="fade-up" style="margin-top:60px">
      <div class="chapter-badge" style="color:var(--purple);justify-content:center">Full Pipeline</div>
      <h3 class="sub-title" style="text-align:center;margin-top:12px;margin-bottom:32px">From Random Weights to Predictions</h3>
      <div class="pipeline-full" id="nn-pipeline">
        <div class="pipeline-stage">
          <div class="ps-num">01</div>
          <div class="ps-content" style="border-left:3px solid var(--cyan)">
            <div class="ps-title" style="color:var(--cyan)">Define a Neuron</div>
            <div class="ps-desc">Each neuron: weighted sum of inputs + bias → tanh. Weights start random. The Value class tracks numbers and their gradients.</div>
            <div class="ps-tags"><span class="tag tag-c">Value class</span><span class="tag tag-c">weights</span><span class="tag tag-c">bias</span><span class="tag tag-c">tanh</span></div>
          </div>
        </div>
        <div class="pipeline-connector"></div>
        <div class="pipeline-stage">
          <div class="ps-num">02</div>
          <div class="ps-content" style="border-left:3px solid var(--amber)">
            <div class="ps-title" style="color:var(--amber)">Stack into an MLP</div>
            <div class="ps-desc">Neurons → Layers → MLP. The output of each layer feeds the next. Every connection is one weight. Our 4→3→1 network has 19 parameters.</div>
            <div class="ps-tags"><span class="tag tag-a">Neuron</span><span class="tag tag-a">Layer</span><span class="tag tag-a">MLP</span></div>
          </div>
        </div>
        <div class="pipeline-connector"></div>
        <div class="pipeline-stage">
          <div class="ps-num">03</div>
          <div class="ps-content" style="border-left:3px solid var(--purple)">
            <div class="ps-title" style="color:var(--purple)">Forward Pass</div>
            <div class="ps-desc">Run training data left to right through the network. Each neuron computes and passes its output to the next layer. Result: one prediction per example.</div>
            <div class="ps-tags"><span class="tag tag-p">__call__</span><span class="tag tag-p">activations</span></div>
          </div>
        </div>
        <div class="pipeline-connector"></div>
        <div class="pipeline-stage">
          <div class="ps-num">04</div>
          <div class="ps-content" style="border-left:3px solid var(--red)">
            <div class="ps-title" style="color:var(--red)">Compute Loss</div>
            <div class="ps-desc">Mean Squared Error: sum of (prediction − target)². One scalar number. Big at the start, shrinks toward zero as training proceeds.</div>
            <div class="ps-tags"><span class="tag tag-g" style="color:var(--red);border-color:rgba(223,27,65,.25);background:var(--red-d)">MSE</span><span class="tag tag-g" style="color:var(--red);border-color:rgba(223,27,65,.25);background:var(--red-d)">scalar loss</span></div>
          </div>
        </div>
        <div class="pipeline-connector"></div>
        <div class="pipeline-stage">
          <div class="ps-num">05</div>
          <div class="ps-content" style="border-left:3px solid var(--green)">
            <div class="ps-title" style="color:var(--green)">Backpropagation</div>
            <div class="ps-desc">Walk the computation graph backwards. Chain rule at every node. Each weight gets a .grad: "increase me → loss changes by this much."</div>
            <div class="ps-tags"><span class="tag tag-g">backward()</span><span class="tag tag-g">chain rule</span><span class="tag tag-g">gradients</span></div>
          </div>
        </div>
        <div class="pipeline-connector"></div>
        <div class="pipeline-stage">
          <div class="ps-num">06</div>
          <div class="ps-content" style="border-left:3px solid var(--cyan);background:linear-gradient(135deg,rgba(5,112,222,0.04),transparent)">
            <div class="ps-title" style="color:var(--cyan)">Gradient Descent → Repeat</div>
            <div class="ps-desc">p.data -= lr * p.grad for every weight. Tiny step downhill. Zero gradients. Repeat forward → loss → backprop → update for hundreds of steps. Loss reaches ~0.</div>
            <div class="ps-tags"><span class="tag tag-c">learning rate</span><span class="tag tag-c">weight update</span><span class="tag tag-c">training loop</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="fade-up" style="text-align:center;margin-top:60px">
      <p class="body-text" style="max-width:560px;margin:0 auto;color:var(--txt2)">
        Built from Andrej Karpathy's <a href="https://www.youtube.com/watch?v=VMj-3S1tku0" target="_blank" rel="noopener" style="color:var(--accent)">"The spelled-out intro to neural networks and backpropagation: building micrograd"</a> lecture. Now you understand the math behind <a href="../index.html" style="color:var(--accent)">Part 1's training section</a> at the code level.
      </p>
      <p style="margin-top:16px;font-family:var(--ds);font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--txt2)">
        <a href="../index.html" style="color:var(--txt2);text-decoration:none;border-bottom:1px solid var(--border);padding-bottom:1px;transition:.2s" onmouseover="this.style.color='var(--accent)';this.style.borderColor='var(--accent)'" onmouseout="this.style.color='var(--txt2)';this.style.borderColor='var(--border)'">← Part 1: How LLMs Work</a>
        <span style="margin:0 12px;opacity:.4">·</span>
        <a href="../how-to-use-llms/index.html" style="color:var(--txt2);text-decoration:none;border-bottom:1px solid var(--border);padding-bottom:1px;transition:.2s" onmouseover="this.style.color='var(--accent)';this.style.borderColor='var(--accent)'" onmouseout="this.style.color='var(--txt2)';this.style.borderColor='var(--border)'">← Part 2: How to Use LLMs</a>
        <span style="margin:0 12px;opacity:.4">·</span>
        <a href="https://www.youtube.com/watch?v=VMj-3S1tku0" target="_blank" rel="noopener" style="color:var(--txt2);text-decoration:none;border-bottom:1px solid var(--border);padding-bottom:1px;transition:.2s" onmouseover="this.style.color='var(--accent)';this.style.borderColor='var(--accent)'" onmouseout="this.style.color='var(--txt2)';this.style.borderColor='var(--border)'">Source lecture</a>
      </p>
    </div>
  </div>
</section>

<script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify all 8 sections render, nav buttons scroll correctly**

```bash
open /Users/yashnarwal/projects/how-llms-work/neural-networks/index.html
```

Expected: Page loads with Inter font. Nav visible at top. All 8 section headings visible on scroll.

- [ ] **Step 3: Commit**

```bash
git add neural-networks/index.html
git commit -m "Add Part 3 HTML scaffold with all 8 sections"
```

---

## Task 3: main.js — core utilities (canvas, typewriter, progress bar, nav, fade-up)

**Files:**
- Create: `neural-networks/main.js`

- [ ] **Step 1: Create `neural-networks/main.js` with hero canvas, typewriter, progress bar, nav, and fade-up**

```javascript
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
```

- [ ] **Step 2: Open in browser, verify hero animation, typewriter, progress bar, nav highlighting, and MLP SVG all work**

```bash
open /Users/yashnarwal/projects/how-llms-work/neural-networks/index.html
```

Expected: floating math tokens in hero, typewriter cycles through 4 messages, progress bar moves on scroll, nav buttons highlight the active section, MLP SVG shows 3 layers with connections.

- [ ] **Step 3: Commit**

```bash
git add neural-networks/main.js
git commit -m "Add Part 3 core JS: hero canvas, typewriter, progress, nav, MLP svg"
```

---

## Task 4: Demo 1 — Neuron Playground

**Files:**
- Modify: `neural-networks/main.js` (append)

- [ ] **Step 1: Append Neuron Playground IFFE to `main.js`**

```javascript
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
```

- [ ] **Step 2: Verify in browser**

Open `neural-networks/index.html`, scroll to §2 (Neuron). Drag each slider. Expected: w₁-val, w₂-val, b-val labels update. Raw sum and tanh output update. Canvas shows neuron diagram with color-coded activation.

- [ ] **Step 3: Commit**

```bash
git add neural-networks/main.js
git commit -m "Add Neuron Playground interactive demo"
```

---

## Task 5: Demo 2 — Forward Pass Visualizer

**Files:**
- Modify: `neural-networks/main.js` (append)

- [ ] **Step 1: Append Forward Pass Visualizer IFFE to `main.js`**

```javascript
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
```

- [ ] **Step 2: Verify in browser**

Scroll to §4. Click "Run Forward Pass" three times. Expected: first click lights up input nodes with values, second click lights hidden nodes with tanh-computed values, third click lights output node with final prediction. "Reset" returns to unlit state.

- [ ] **Step 3: Commit**

```bash
git add neural-networks/main.js
git commit -m "Add Forward Pass Visualizer demo"
```

---

## Task 6: Demo 3 — Loss Landscape

**Files:**
- Modify: `neural-networks/main.js` (append)

- [ ] **Step 1: Append Loss Landscape IFFE to `main.js`**

```javascript
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
```

- [ ] **Step 2: Verify in browser**

Scroll to §5. Expected: blue parabola drawn on canvas, red ball at w=3.0. Click "Step" several times — ball should roll left toward the green minimum marker at w=0. Changing the learning rate slider affects step size.

- [ ] **Step 3: Commit**

```bash
git add neural-networks/main.js
git commit -m "Add Loss Landscape gradient descent demo"
```

---

## Task 7: Demo 4 — Derivative Visualizer

**Files:**
- Modify: `neural-networks/main.js` (append)

- [ ] **Step 1: Append Derivative Visualizer IFFE to `main.js`**

```javascript
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
```

- [ ] **Step 2: Verify in browser**

Scroll to §6. Expected: blue x² curve rendered. Red dashed tangent line at x=1.0 with slope=2.00 shown. Dragging left/right moves the point and updates the tangent line and slope label. At x=0, slope=0; at x=2, slope=4.

- [ ] **Step 3: Commit**

```bash
git add neural-networks/main.js
git commit -m "Add Derivative Visualizer interactive demo"
```

---

## Task 8: Demo 5 — Expression Graph with Backprop

**Files:**
- Modify: `neural-networks/main.js` (append)

- [ ] **Step 1: Append Expression Graph IFFE to `main.js`**

```javascript
// ═══════════════════════════════════════════════
// DEMO 5: EXPRESSION GRAPH WITH BACKPROP
// ═══════════════════════════════════════════════
(function(){
  const svg = document.getElementById('graph-svg');
  const fwdBtn = document.getElementById('graph-forward-btn');
  const backBtn = document.getElementById('graph-back-btn');
  const resetBtn = document.getElementById('graph-reset-btn');
  if (!svg || !fwdBtn) return;

  // Expression: a=2, b=-3
  // c = a * b = -6
  // d = c + a = -4
  // e = tanh(d) ≈ -0.9993
  // Gradients (backprop from e=1.0):
  // de/de = 1.0
  // de/dd = 1 - tanh²(d) ≈ 0.0007
  // de/dc = de/dd * 1 = 0.0007
  // de/da_from_d = de/dd * 1 = 0.0007
  // de/db = de/dc * a = 0.0007 * 2 = 0.0014
  // de/da_from_c = de/dc * b = 0.0007 * (-3) = -0.0021
  // de/da = de/da_from_d + de/da_from_c = 0.0007 + (-0.0021) = -0.0014

  const nodes = {
    a: {x:40,  y:60,  label:'a', val:2,           grad:-0.0014},
    b: {x:40,  y:160, label:'b', val:-3,           grad:0.0014},
    c: {x:160, y:110, label:'c=a×b', val:-6,       grad:0.0007},
    d: {x:260, y:60,  label:'d=c+a', val:-4,       grad:0.0007},
    e: {x:360, y:60,  label:'e=tanh(d)', val:-0.9993, grad:1.0}
  };
  const edges = [
    {from:'a',to:'c',label:'×'}, {from:'b',to:'c',label:'×'},
    {from:'c',to:'d',label:'+'}, {from:'a',to:'d',label:'+'},
    {from:'d',to:'e',label:'tanh'}
  ];

  let showVals = false, showGrads = false;

  function render() {
    let html = '';

    // Edges
    edges.forEach(({from, to, label}) => {
      const f = nodes[from], t = nodes[to];
      html += `<line x1="${f.x+24}" y1="${f.y}" x2="${t.x-28}" y2="${t.y}" stroke="#E3E8EF" stroke-width="1.5"/>`;
      const mx = (f.x+24 + t.x-28)/2, my = (f.y + t.y)/2;
      html += `<text x="${mx}" y="${my-5}" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#697386">${label}</text>`;
    });

    // Nodes
    Object.values(nodes).forEach(node => {
      const isLeaf = node.label === 'a' || node.label === 'b';
      const isOut = node.label.startsWith('e=');
      const color = isLeaf ? '#946800' : isOut ? '#00875A' : '#635BFF';
      const bw = node.label.length * 7 + 20;

      html += `<rect x="${node.x - bw/2}" y="${node.y - 22}" width="${bw}" height="44" rx="6" fill="${color}18" stroke="${color}66" stroke-width="1.5"/>`;
      html += `<text x="${node.x}" y="${node.y - 5}" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="${color}">${node.label}</text>`;

      if (showVals) {
        html += `<text x="${node.x}" y="${node.y + 8}" text-anchor="middle" font-family="JetBrains Mono" font-size="10" font-weight="bold" fill="${color}">${node.val.toFixed(4)}</text>`;
      } else {
        html += `<text x="${node.x}" y="${node.y + 8}" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#C8D0DC">val=?</text>`;
      }

      if (showGrads) {
        const gColor = node.grad > 0 ? '#00875A' : node.grad < 0 ? '#DF1B41' : '#697386';
        html += `<text x="${node.x}" y="${node.y + 38}" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="${gColor}">∂=${node.grad.toFixed(4)}</text>`;
      } else if (showVals) {
        html += `<text x="${node.x}" y="${node.y + 38}" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#C8D0DC">grad=?</text>`;
      }
    });

    // Legend
    html += `<text x="10" y="245" font-family="Inter" font-size="10" fill="#697386">a=2, b=-3. Forward: multiply → add → tanh.</text>`;
    if (showGrads) {
      html += `<text x="10" y="258" font-family="Inter" font-size="10" fill="#635BFF">Backprop: gradients flow right→left via chain rule.</text>`;
    }

    svg.innerHTML = html;
  }

  render();

  fwdBtn.addEventListener('click', () => {
    showVals = true; showGrads = false;
    fwdBtn.disabled = true; backBtn.disabled = false;
    render();
  });

  backBtn.addEventListener('click', () => {
    showGrads = true;
    backBtn.disabled = true;
    render();
  });

  resetBtn.addEventListener('click', () => {
    showVals = false; showGrads = false;
    fwdBtn.disabled = false; backBtn.disabled = true;
    render();
  });
})();
```

- [ ] **Step 2: Verify in browser**

Scroll to §7. Expected: expression graph with 5 nodes (a, b, c=a×b, d=c+a, e=tanh(d)) connected by labeled edges. Click "Forward Pass" — node values appear (2, -3, -6, -4, -0.9993). Click "Backprop" — gradients appear in green/red based on sign. "Reset" clears back to initial state.

- [ ] **Step 3: Commit**

```bash
git add neural-networks/main.js
git commit -m "Add Expression Graph backprop demo"
```

---

## Task 9: Training canvas (§8) + nav link updates

**Files:**
- Modify: `neural-networks/main.js` (append)
- Modify: `index.html` (line 23 area)
- Modify: `how-to-use-llms/index.html` (line 19 area)

- [ ] **Step 1: Append training loss canvas IFFE to `main.js`**

```javascript
// ═══════════════════════════════════════════════
// §8 TRAINING LOSS CANVAS (auto-animates on scroll)
// ═══════════════════════════════════════════════
(function(){
  const canvas = document.getElementById('training-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Simulated loss curve: loss(step) = 4.5 * e^(-0.05*step) + 0.05
  function simulatedLoss(step) { return 4.5 * Math.exp(-0.05 * step) + 0.05; }

  const totalSteps = 80;
  let drawn = 0;
  let animating = false;

  function drawFrame() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const PAD = {top:16, right:16, bottom:24, left:40};
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;
    const maxLoss = 5;

    // Grid lines
    ctx.strokeStyle = '#F0F4F8'; ctx.lineWidth = 1;
    [0,1,2,3,4,5].forEach(l => {
      const y = PAD.top + plotH - (l/maxLoss)*plotH;
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W-PAD.right, y); ctx.stroke();
      ctx.fillStyle = '#C8D0DC'; ctx.font = '9px JetBrains Mono'; ctx.textAlign = 'right';
      ctx.fillText(l.toFixed(0), PAD.left-4, y+3);
    });

    // Loss curve (up to drawn steps)
    if (drawn > 0) {
      ctx.beginPath();
      for (let s = 0; s <= drawn; s++) {
        const x = PAD.left + (s / totalSteps) * plotW;
        const y = PAD.top + plotH - (simulatedLoss(s) / maxLoss) * plotH;
        s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      const grad = ctx.createLinearGradient(PAD.left, 0, W-PAD.right, 0);
      grad.addColorStop(0, '#DF1B41');
      grad.addColorStop(1, '#00875A');
      ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.stroke();

      // Current point
      const cx = PAD.left + (drawn/totalSteps)*plotW;
      const cy = PAD.top + plotH - (simulatedLoss(drawn)/maxLoss)*plotH;
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI*2);
      ctx.fillStyle = drawn >= totalSteps ? '#00875A' : '#DF1B41'; ctx.fill();
    }

    // Axes
    ctx.strokeStyle = '#E3E8EF'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD.left, PAD.top); ctx.lineTo(PAD.left, H-PAD.bottom); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(PAD.left, H-PAD.bottom); ctx.lineTo(W-PAD.right, H-PAD.bottom); ctx.stroke();

    ctx.fillStyle = '#697386'; ctx.font = '9px JetBrains Mono'; ctx.textAlign = 'center';
    ctx.fillText('Training Steps →', W/2, H-4);
    ctx.save(); ctx.rotate(-Math.PI/2); ctx.fillText('Loss', -H/2, 12); ctx.restore();
  }

  function animate() {
    if (drawn >= totalSteps) return;
    drawn++;
    drawFrame();
    setTimeout(animate, 30);
  }

  drawFrame();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !animating) { animating = true; animate(); }
    });
  }, { threshold: 0.3 });
  observer.observe(canvas);
})();
```

- [ ] **Step 2: Verify training canvas in browser**

Scroll to §8. Expected: when the canvas scrolls into view, it animates the loss curve from high (red, ~4.5) to low (green, ~0.05) over 80 steps.

- [ ] **Step 3: Update Part 1 nav — add Part 3 → link**

In `index.html`, find this line (around line 23):
```html
      <a href="how-to-use-llms/index.html" style="font-family:var(--ds);font-size:12px;font-weight:600;color:var(--accent);text-decoration:none;padding:5px 11px;border-radius:6px;border:1px solid rgba(99,91,255,0.3);background:rgba(99,91,255,0.05);white-space:nowrap;flex-shrink:0;display:inline-flex;align-items:center;gap:5px;transition:.15s;margin-right:6px" onmouseover="this.style.background='rgba(99,91,255,0.1)'" onmouseout="this.style.background='rgba(99,91,255,0.05)'">Part 2 →</a>
```

Replace with:
```html
      <a href="how-to-use-llms/index.html" style="font-family:var(--ds);font-size:12px;font-weight:600;color:var(--accent);text-decoration:none;padding:5px 11px;border-radius:6px;border:1px solid rgba(99,91,255,0.3);background:rgba(99,91,255,0.05);white-space:nowrap;flex-shrink:0;display:inline-flex;align-items:center;gap:5px;transition:.15s;margin-right:4px" onmouseover="this.style.background='rgba(99,91,255,0.1)'" onmouseout="this.style.background='rgba(99,91,255,0.05)'">Part 2 →</a>
      <a href="neural-networks/index.html" style="font-family:var(--ds);font-size:12px;font-weight:600;color:var(--green);text-decoration:none;padding:5px 11px;border-radius:6px;border:1px solid rgba(0,135,90,0.3);background:rgba(0,135,90,0.05);white-space:nowrap;flex-shrink:0;display:inline-flex;align-items:center;gap:5px;transition:.15s;margin-right:6px" onmouseover="this.style.background='rgba(0,135,90,0.1)'" onmouseout="this.style.background='rgba(0,135,90,0.05)'">Part 3 →</a>
```

- [ ] **Step 4: Update Part 2 nav — add Part 3 → link**

In `how-to-use-llms/index.html`, find the brand link (around line 18):
```html
    <a href="../index.html" class="top-nav-brand">← Part 1</a>
```

Replace with:
```html
    <a href="../index.html" class="top-nav-brand">← Part 1</a>
    <a href="../neural-networks/index.html" style="font-family:var(--ds);font-size:12px;font-weight:600;color:var(--green);text-decoration:none;padding:5px 11px;border-radius:6px;border:1px solid rgba(0,135,90,0.3);background:rgba(0,135,90,0.05);white-space:nowrap;flex-shrink:0;display:inline-flex;align-items:center;gap:5px;transition:.15s;margin-right:6px" onmouseover="this.style.background='rgba(0,135,90,0.1)'" onmouseout="this.style.background='rgba(0,135,90,0.05)'">Part 3 →</a>
```

- [ ] **Step 5: Verify nav links in browser**

Open `index.html` — nav should show "Part 2 →" and "Part 3 →" links. Open `how-to-use-llms/index.html` — nav should show "Part 3 →" link. Click each — should navigate to the correct page.

- [ ] **Step 6: Commit all changes**

```bash
git add neural-networks/main.js index.html how-to-use-llms/index.html
git commit -m "Add training canvas, Part 3 nav links in Part 1 and Part 2"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** All 8 sections in HTML ✓. Hero + 7 chapters ✓. 5 demos (Neuron Playground, Forward Pass, Loss Landscape, Derivative Visualizer, Expression Graph) ✓. Training loss canvas (non-interactive, auto-animate) ✓. Nav links in Part 1 and Part 2 ✓. Code snippets with plain-English explanation blocks ✓. Pipeline summary in §8 ✓. Footer links ✓.
- [x] **Placeholders:** None. All JS code is complete and runnable.
- [x] **Type consistency:** `nodes`, `edges`, `phase` — all used consistently within their IFFEs. `wToX`/`lossToY` defined before use in Loss demo. `xToCanvas`/`yToCanvas`/`canvasToX` defined before use in Derivative demo. `simulatedLoss` defined before use in Training canvas.
- [x] **No cross-task references:** Each task's code is fully self-contained.
