# Deep Learning Architecture — Interactive Visual Library

> 8 animated, step-by-step interactive diagrams of core deep learning architectures. No dependencies. No server. Pure HTML — open in any browser.

**[▶ Live Demo →](https://piyush24kp.github.io/dl-architecture-diagrams)**

---

## Architectures Covered

| # | Architecture | Stages | Key Concepts |
|---|---|---|---|
| 1 | **CNN** | 9 | Conv filters, ReLU, MaxPool, FC layers |
| 2 | **Transformer** | 9 | Multi-head attention, positional encoding, encoder-decoder |
| 3 | **BERT** | 8 | Bidirectional attention, MLM, NSP, fine-tuning |
| 4 | **VAE** | 8 | Reparameterization trick, ELBO, latent space |
| 5 | **GAN** | 8 | Generator vs Discriminator, minimax, Nash equilibrium |
| 6 | **Diffusion** | 7 | Forward noise, U-Net, CFG, VAE decode |
| 7 | **CLIP** | 7 | Dual encoders, contrastive loss, zero-shot inference |
| 8 | **Mamba / SSM** | 7 | Selective SSM, parallel scan, O(1) inference |

---

## Features

- **Sticky floating dock** — Next/Auto/Reset always visible, no scrolling needed
- **Auto-scroll** — Smoothly centers the active stage as you step through
- **Keyboard shortcuts** — `Space` or `→` = next step · `A` = auto-run all · `R` = reset
- **Speed control** — 0.5× to 3× animation speed
- **Animated visualisations** — Canvas drawings, bar charts, attention grids, recurrent chains
- **Fully offline** — All self-contained HTML, no CDN calls for logic (fonts load from Google Fonts)

---

## Usage

```bash
# Clone the repo
git clone https://github.com/piyush24kp/dl-architecture-diagrams.git
cd dl-architecture-diagrams

# Open the index — no server needed
open index.html       # macOS
start index.html      # Windows
xdg-open index.html   # Linux
```

Or just open any individual file directly in your browser.

---

## Deploy to GitHub Pages

1. Push to GitHub
2. Go to **Settings → Pages → Source → Deploy from branch → main → / (root)**
3. Your live URL: `https://piyush24kp.github.io/dl-architecture-diagrams`

---

## Project Background

Built as part of a structured deep learning self-study path alongside an **MS in AI & ML at LJMU London**.  
The diagrams are designed for visual learners — each stage reveals progressively with animations that match the actual data flow.

---

## Author

**Piyush** · AI Engineering Lead @ Wipro (HP Client) · MS AI/ML @ LJMU London  
GitHub: [@piyush24kp](https://github.com/piyush24kp)

---

*All HTML files are self-contained — safe to share as a ZIP, host on GitHub Pages, or drop on Netlify.*
