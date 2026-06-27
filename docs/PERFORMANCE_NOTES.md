# Performance Notes

## Problem: Landing Page Jank

The landing page cycling photo grid was flashing gray between transitions and
causing noticeable jank. Two distinct root causes were identified and fixed.

---

## Root Cause 1: Next.js Image placeholder flash

Next.js `<Image>` rewrites every src to `/_next/image?url=...&w=...&q=...` — a
different URL than the raw file path. When a cell cycled to a new photo, the
component would show a gray placeholder until the Next.js-optimized version
downloaded. With 31 cycling cells at 1200ms intervals, the browser was almost
always fetching something new.

Preloading the raw `/images/...` paths had no effect because those URLs don't
match what `<Image>` actually requests.

### Fix
- Replaced all `<Image>` (Next.js) with plain `<img>` tags in `LandingPage.tsx`
- Plain `<img>` uses the literal src path — preloading works because URLs match
- Preload all landing images on mount via `new window.Image()` before cycling starts
- Cycling timers only fire after preload completes (`ready` state gate)

---

## Root Cause 2: Too many simultaneous animated elements

At peak (during crossfades), the DOM had ~58 image elements all running Framer
Motion opacity transitions simultaneously. The browser's compositor was
overwhelmed blending that many layered elements.

Breakdown at peak:
- 16 main grid cells × 2 (old + new during crossfade) = 32 elements
- 7 middle column cells × 2 = 14 elements
- 6 blur cells × 2 = 12 elements
- **Total: ~58 animated image elements**

### Fix
Reduced active cells significantly:

| Layer | Before | After |
|-------|--------|-------|
| Main grid | 16 cells | 10 cells (2×5) |
| Middle column | 7 cells | 4 cells |
| Blur layer | 6 cells | 10 cells (tiny 80px thumbs — nearly free) |
| **Peak DOM** | **~58 elements** | **~24 elements** |

---

## Separate Image Pools

Created a dedicated landing page image pool, independent of gallery/album images.

### Why
- Gallery and album pages need full-quality images for direct viewing
- Landing page cells display at 135px rotated 45° — detail is irrelevant
- The two pools can be compressed and curated independently

### Structure
```
public/images/
  series-1/        ← full quality, used by gallery + album (untouched)
  landing/         ← landing animation pool, 400px wide, quality 82 mozjpeg
  landing-blur/    ← 80px blur layer thumbs, quality 40 mozjpeg
```

### Workflow
When adding photos to the landing page:
1. Add originals to `public/images/series-1/`
2. Run: `node scripts/gen-landing-images.mjs`
3. Add filenames to `src/data/landingImages.ts`

When adding photos to gallery/album only:
1. Add originals to `public/images/series-1/`
2. Run: `node scripts/compress-images.mjs`
3. Add to `src/data/highlights.ts`

---

## Image Compression

All source images compressed from originals using `sharp` (mozjpeg):

| Pool | Width | Quality | Use |
|------|-------|---------|-----|
| `series-1/` | max 2400px | 85 | Gallery, album, lightbox |
| `landing/` | max 400px | 82 | Landing grid cells (135px display) |
| `landing-blur/` | 80×80px crop | 40 | Blur glow layer (heavily blurred, detail irrelevant) |

Original size: ~466MB → `series-1/` compressed: ~19MB (-96%)

---

## Transition Timing

- Cycle interval: 4500ms (was 1200ms) — gives time to register each photo
- Crossfade duration: 2s
- Initial stagger: `Math.random() * baseInterval` per cell — spreads all cells
  across a full 4500ms window so no two cells change at the same moment

---

## Scripts

| Script | Purpose |
|--------|---------|
| `node scripts/compress-images.mjs` | Compress series-1 for gallery/album |
| `node scripts/gen-landing-images.mjs` | Generate landing/ and landing-blur/ from series-1 |
| `node scripts/gen-blur-thumbs.mjs` | Legacy — superseded by gen-landing-images.mjs |
