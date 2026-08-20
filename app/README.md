# BREVES — App (React + TypeScript + Tailwind + shadcn)

This folder holds a **shadcn-structured** React app, kept separate from the live
static site at the repository root (`/index.html`, `/juridico/`) so the current
GitHub Pages deploy is not affected.

## Stack
- Vite + React 18 + TypeScript
- Tailwind CSS (shadcn theme tokens / CSS variables)
- shadcn conventions: `@/*` alias → `src/*`, UI components in `src/components/ui`,
  `cn` helper in `src/lib/utils.ts`, config in `components.json`

## Scripts
```bash
npm install      # install dependencies
npm run dev      # start the dev server
npm run build    # type-check (tsc -b) + production build to dist/
npm run preview  # preview the production build
```

## Adding more shadcn components
The `@/` alias, `components.json`, `tailwind.config.js` and `src/lib/utils.ts`
are already wired, so you can pull registry components directly:
```bash
npx shadcn@latest add button card dialog
```
They land in `src/components/ui/`.

## Included components
- `src/components/ui/cards.tsx` — `HoverRevealCards`, a responsive grid of
  cards with a hover/focus reveal effect (hovered card highlights, others
  de-emphasize). Demo wiring in `src/demo.tsx`, rendered by `src/App.tsx`.
  Card images are Unsplash URLs and can be swapped freely.
- `src/components/ui/border-beam-panel.tsx` — `BorderBeamPanel` (Motiq, MIT).
  A panel whose border is a rotating conic gradient carrying one or two
  comets. The angular *velocity* is sprung, so the beams wind up toward
  `hoverSpeed` on hover/focus and coast back to `idleSpeed` on leave. The ring
  is cut with a two-layer CSS alpha mask (`mask-composite: exclude`), and only
  one custom property changes per frame, so panel content never repaints. It
  parks itself offscreen or when the tab is hidden, and renders a static lit
  border under `prefers-reduced-motion`. Demo in
  `src/components/ui/border-beam-panel-demo.tsx`.

  It ships its own `--motiq-*` tokens in a low `@layer motiq`, so defining
  `:root { --motiq-accent: … }` in `src/index.css` overrides them without
  touching the component.
- `src/components/ui/floating-paths.tsx` — `FloatingPathsBackground`, a
  wrapper that lays 36 animated SVG curves behind whatever you pass as
  `children`. `position` (a number) shifts and mirrors the sweep — `-1` and
  `1` give opposed fields. Colour comes from `currentColor`, so it follows
  `text-slate-950 dark:text-white`. Uses `motion/react`. Demo in
  `src/components/ui/floating-paths-demo.tsx`.

- `src/components/ui/beams-background.tsx` — `BeamsBackground`, a canvas of 30
  blurred light beams drifting upward at ~-35°, each pulsing on its own phase.
  Wrap it around whatever you pass as `children`. `intensity`
  (`subtle`/`medium`/`strong`) scales overall opacity; `hue` (`[start, spread]`
  in degrees), `saturation` and `lightness` set the colour range — the defaults
  `[190, 70]` / `85` / `65` are the upstream cyan → blue. Uses `motion/react`
  for the breathing overlay. Demo in
  `src/components/ui/beams-background-demo.tsx`, which renders both the upstream
  look and a `BeamsBackgroundBreves` variant tuned to the site palette
  (`hue={[214, 52]} saturation={38} lightness={72}` over `#131313`).

  Four changes from the upstream snippet, all of them load-bearing:

  1. **Beams were seeded and recycled in device pixels while being drawn in CSS
     pixels.** The context is scaled by `devicePixelRatio`, but `createBeam` and
     `resetBeam` were handed `canvas.width`/`canvas.height` — the backing-store
     size. On a 2× screen the field was spread over twice the visible area and
     most beams sat outside it. Everything now measures in CSS pixels.
  2. **`children` was declared in the props interface but never rendered** — the
     component hard-coded its own "Beams / Background" headline, so it could not
     actually be used as a background. The copy moved to the demo.
  3. **It sized itself to `window.innerWidth/innerHeight`**, so it only worked
     full-viewport. It now measures its own box through a `ResizeObserver`,
     which is what lets the BREVES variant be a 560px hero.
  4. **No reduced-motion or offscreen handling.** It now paints a single static
     frame under `prefers-reduced-motion` (verified: the canvas is byte-identical
     over 2.5s), and parks the loop while the tab is hidden or the element is
     scrolled out of view.

  Watch the cost. A full-bleed canvas carrying `ctx.filter = blur(35px)`, a CSS
  `blur(15px)` on top and a `backdrop-filter: blur(50px)` overlay is genuinely
  expensive — at `deviceScaleFactor: 2` on a 1440×900 viewport, Playwright could
  not even complete a screenshot within 30s. `devicePixelRatio` is therefore
  capped at 2 in the component, and it is worth keeping this off long pages.

  Two notes for anyone porting the floating-paths component elsewhere. The upstream demo
  uses `aspect-16/9`, which is Tailwind **v4** syntax; on the 3.4 here the
  equivalent is `aspect-[16/9]`, and without the change the class emits no
  rule, the container gets no height and nothing shows. And the transition
  duration is randomised during render, which is fine in this client-only
  app but would desync between server and client under SSR.
