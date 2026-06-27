# Task 10 Report — Glow & Glassmorphism Effects

## Status: DONE

## Commits

`358dd57 feat: add glassmorphism and glow utility CSS, apply throughout components`

## What was done

### New file: `src/styles/glassmorphism.css`
Defines reusable utility classes backed by CSS custom properties:
- `.glass`, `.glass-sm`, `.glass-md`, `.glass-lg` — frosted glass variants with `-webkit-backdrop-filter` for Safari
- `.glass-gold` — gold-bordered frosted glass (used on header-adjacent surfaces)
- `.glow`, `.glow-bright`, `.glow-subtle` — box-shadow gold halos at three intensities
- `.glow-halo` — pseudo-element radial gradient halo (blurred, behind element via `isolation: isolate`)
- `.glow-on-hover` — zero-cost at rest, gold glow triggered only on `:hover`
- CSS vars: `--glow-gold`, `--glow-gold-bright`, `--glow-gold-subtle`, `--glass-bg*`, `--glass-border*`, `--glass-blur*`

### `src/app/globals.css`
Added `@import '../styles/glassmorphism.css'` so vars and utility classes are globally available.

### `src/components/Gallery/layeredGallery.module.css`
- `.glow`: replaced hard-coded rgba values with CSS vars, removed `backdrop-filter` from inset glow element (avoids stacking expensive filters)
- Added `.glowOuter`: a static blurred radial-gradient div that can sit behind the card stack for depth (non-animated)

### `src/components/Gallery/albumView.module.css`
- `.glow`: same refactor as LayeredGallery — CSS vars, removed `backdrop-filter` from inset

### `src/components/Gallery/imageLightbox.module.css`
- `.backdrop`: blur increased from 5px to 16px with `-webkit-backdrop-filter` added
- `.closeButton` / `.navButton`: switched to glass CSS vars, added gold border and box-shadow glow on `:hover`; only non-`filter` properties transition so no repaint on hover

### `src/components/Projects/projectsCatalog.module.css`
- `.card`: wired `--glass-bg`, `--glass-border`, `--glass-blur` vars; added `-webkit-backdrop-filter`; separated `transition` properties (no `filter` in the list)
- `.card:hover`: gold border via `--glass-border-gold`, gold glow via `--glow-gold`

### Header (`src/components/Header/header.module.css`)
Already had correct frosted glass (`backdrop-filter: blur(12px)`, `-webkit-backdrop-filter`, `border-bottom: 1px solid rgba(212, 175, 55, 0.2)`). No changes needed.

## Performance notes
- `backdrop-filter` is applied only to static elements (backdrop, header, buttons at rest); never animated directly
- Glow effects use `box-shadow` (compositor-only) or inert `::before` pseudo-elements with `filter: blur` — neither triggers layout
- No `will-change` added globally; can be added per-element if profiling reveals need
- `isolation: isolate` on `.glow-halo` keeps `z-index: -1` scoped to the local stacking context

## Test summary
- `npx tsc --noEmit` — zero errors
- `npx next build` — compiled successfully, all 5 pages generated (/, /projects, /album/[id], /_not-found)
- Manual: effects visible in browser on /, /projects, /album/1; no scroll jank observed

## Concerns
None. All checklist items from the brief are satisfied.
