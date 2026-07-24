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

## Included component
- `src/components/ui/cards.tsx` — `HoverRevealCards`, a responsive grid of
  cards with a hover/focus reveal effect (hovered card highlights, others
  de-emphasize). Demo wiring in `src/demo.tsx`, rendered by `src/App.tsx`.
  Card images are Unsplash URLs and can be swapped freely.
