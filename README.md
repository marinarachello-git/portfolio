# Marina Rachello — Portfolio

One-page portfolio scaffold built from the Figma **Intro** file (1440 desktop / 768 tablet).

## Sections

1. **Intro** — name title + bio (orange)
2. **Hero carousel** — eqt → medt → dentsply → paws → cartier
3. **Career** — four chapters (cream)
4. **Skills** — expertise list with hover GIF preview (orange)
5. **Love / Hate** — personal statement (charcoal)
6. **Footer** — thank you + contact links (orange)

## Run locally

```bash
cd ~/Projects/portfolio
python3 -m http.server 8080
```

Open http://localhost:8080

## Assets to add

### Skills GIFs

Place hover preview GIFs in `assets/skills/` with these filenames:

| Skill | File |
|-------|------|
| Digital product design | `digital-product.gif` |
| Visual & brand design | `visual-brand.gif` |
| UX & interaction design | `ux-interaction.gif` |
| Design systems | `design-systems.gif` |
| Design research | `design-research.gif` |

### Carousel

Project screenshots live in `assets/carousel/` (already copied from Desktop).

### CV

Update `assets/Marina-Rachello-CV.pdf` when you have a newer version.

## Figma reference

- Desktop 1440: [Intro — node 230-121](https://www.figma.com/design/mpP7HOaVQHsV1SRgbNbSs2/Intro?node-id=230-121)
- Tablet 768: [Intro — node 232-199](https://www.figma.com/design/mpP7HOaVQHsV1SRgbNbSs2/Intro?node-id=232-199)

## Animations

- **Carousel** — auto-advances every 5s; pauses on hover/focus; prev/next controls
- **Titles** — fade/slide up on scroll (`data-animate-title`)
- **Skills** — hover or focus reveals GIF in preview panel

All animations respect `prefers-reduced-motion`.
