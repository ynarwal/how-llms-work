# Part 3: Neural Networks from Scratch — Design Spec

**Date:** 2026-05-08  
**Source video:** Andrej Karpathy — "The spelled-out intro to neural networks and backpropagation: building micrograd" (https://www.youtube.com/watch?v=VMj-3S1tku0)  
**Target audience:** Complete beginners — no prior knowledge of neural networks assumed. Reader has likely completed Part 1 (how LLMs work) and/or Part 2 (how to use LLMs).

---

## Location & File Structure

```
neural-networks/
  index.html   — main page
  style.css    — copied from root (no overrides)
  main.js      — all interactive demos
```

---

## Nav Updates

- **Part 1 (`index.html`):** Add "Part 3 →" link in the top nav next to the existing "Part 2 →" link.
- **Part 2 (`how-to-use-llms/index.html`):** Add "Part 3 →" link in the top nav.
- **Part 3 nav:** Shows "← Part 2" brand link on the left, section buttons on the right.

---

## Sections (8)

### Hero
- Title: "Neural Networks from Scratch"
- Explicit callout: *No prior knowledge needed.*
- Stats bar: 50 lines of Python · 8 concepts · 1 training loop · micrograd
- Typewriter component: asks "What even is a neural network?" and answers it
- Same animated canvas background as Part 1/2

### §1 · The Problem We're Solving
- **Chapter badge:** Chapter 1 · Motivation
- Goal: ground everything before any math appears
- Show a tiny concrete dataset: 4 inputs → 1 target output
- Explain: we need a function that *generalizes* — neural networks learn that function from examples
- No equations in this section
- Python: a simple list of training examples (`xs`, `ys`)
- Insight box: connects to Part 1 — "This is exactly what GPT is doing, but at 15 trillion token scale"

### §2 · What is a Neuron?
- **Chapter badge:** Chapter 2 · The Building Block
- Analogy first: a dimmer switch — takes inputs, weights how much each matters, adds a default lean (bias), squishes to a bounded range
- Equation shown *after* the analogy: `output = tanh(w1*x1 + w2*x2 + b)`
- Introduce `Value` class from micrograd — 5 lines, every line explained in a styled plain-English block beneath the code
- **Interactive demo: Neuron Playground** — sliders for w1, w2, b; output and tanh value update live on canvas

### §3 · Layers & the MLP
- **Chapter badge:** Chapter 3 · Architecture
- Analogy: assembly line — each layer refines the raw input into something more useful
- SVG diagram of a 2→3→1 MLP, labeled with node values
- Code built up in three steps: `class Neuron` → `class Layer` → `class MLP`, each with plain-English commentary
- Insight box: "GPT is this exact structure — 96 layers deep, 405 billion weights"

### §4 · Forward Pass
- **Chapter badge:** Chapter 4 · Computing the Output
- Step-by-step walkthrough: one example flows left to right, every multiplication and addition narrated
- Code: `model(x)` — call stack traced in inline comments
- **Interactive demo: Forward Pass Visualizer** — animated SVG network (2→3→1), click "Run Forward Pass" to light up nodes with computed values one at a time

### §5 · Loss — How Wrong Are We?
- **Chapter badge:** Chapter 5 · Measuring Error
- Analogy: a report card — one number summarizing "how bad are your predictions right now"
- Show MSE formula with relatable example (guessing someone's age)
- Explain why we need a *single scalar* (so we have one direction to nudge)
- Code: computing MSE loss from predictions vs targets, every line annotated
- **Interactive demo: Loss Landscape** — 2D canvas showing a loss curve; ball sits on it; "Step" button runs gradient descent; learning rate slider shows effect on convergence speed

### §6 · Derivatives — Which Way is Downhill?
- **Chapter badge:** Chapter 6 · The Math of Change
- "Calculus in 2 minutes" framing
- Analogy: standing on a hill — you feel which leg is lower and step that way; the derivative tells you the slope at your current position
- Key rule shown: `d/dx(tanh(x)) = 1 - tanh²(x)` — no proof, just the result
- No derivations; focus on building intuition for "what does a derivative tell me"
- **Interactive demo: Derivative Visualizer** — draggable point on f(x) = x²; tangent line and current slope value update as point moves

### §7 · Backpropagation
- **Chapter badge:** Chapter 7 · Assigning Blame
- Opens with the central question: "How does the network know which weights to blame for the error?"
- Chain rule explained as: "if A affects B and B affects the loss, then A affects the loss too — and we can compute by how much"
- Karpathy quote: "the only thing backprop does is apply the chain rule recursively"
- Code: `backward()` method and `zero_grad()`, narrated line by line
- **Interactive demo: Expression Graph** — nodes show value + grad fields; click "Backprop" to watch gradients propagate backwards through the graph

### §8 · Gradient Descent — The Training Loop
- **Chapter badge:** Chapter 8 · Learning
- The update rule: `w.data -= lr * w.grad` — subtract a tiny fraction of the gradient
- Explain why we subtract (moving opposite to the uphill direction = downhill)
- Full training loop in < 20 lines of Python, every line annotated in a styled block
- Non-interactive canvas: shows loss dropping across training steps (auto-animates on scroll into view — not a user-controlled demo)
- **Full pipeline summary** at the bottom: links all 8 concepts in sequence
- Closing insight: "This is exactly what pre-training does — billions of steps, 405 billion weights, 15 trillion tokens"
- Footer links back to Part 1, Part 2, and the source video

---

## Code Presentation Style

Every Python snippet uses two styled blocks:

1. **Code block** — uses `.token-format` class (JetBrains Mono, existing CSS)
2. **Plain-English block** — styled `.insight-box` below the code, with line-by-line annotations like:
   - `value.grad = 0.0` → *"Start with no knowledge of which direction to nudge this value"*
   - `loss.backward()` → *"Walk backwards through every operation, computing how much each value contributed to the error"*

---

## Interactive Demos (5)

| Demo | Section | Tech |
|------|---------|------|
| Neuron Playground | §2 | Canvas — sliders update output in real time |
| Forward Pass Visualizer | §4 | SVG — nodes animate with computed values |
| Loss Landscape | §5 | Canvas — ball rolls down curve with gradient descent |
| Derivative Visualizer | §6 | Canvas — draggable point, live tangent line |
| Expression Graph | §7 | SVG — gradient backprop animation |

All demos are self-contained functions in `main.js`, initialized on `DOMContentLoaded`. No external dependencies.

---

## Design Principles

- **Intuition before math:** every equation is preceded by an analogy or plain-English description
- **Code always annotated:** no snippet is shown without a plain-English breakdown beneath it
- **Connect to Part 1:** every major concept has an insight box connecting it back to LLMs at scale
- **No assumed knowledge:** terms like "gradient," "activation," and "loss" are defined when first used
- **Same visual language:** CSS variables, Inter font, canvas animations, SVG diagrams — identical to Part 1/2
