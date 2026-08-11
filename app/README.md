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

  Two notes for anyone porting this component elsewhere. The upstream demo
  uses `aspect-16/9`, which is Tailwind **v4** syntax; on the 3.4 here the
  equivalent is `aspect-[16/9]`, and without the change the class emits no
  rule, the container gets no height and nothing shows. And the transition
  duration is randomised during render, which is fine in this client-only
  app but would desync between server and client under SSR.
