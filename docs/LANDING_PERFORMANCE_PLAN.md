# Landing Page Performance Plan

## Problem

The landing page cycling photo grid flashes gray between image transitions. Root cause:
- Next.js `<Image>` rewrites src to `/_next/image?url=...&w=...` — a different URL than the raw file
- Every time a cell cycles to a new photo, Next.js shows a gray placeholder while the optimized version downloads
- 31 cycling cells at 1200ms intervals = almost always something loading
- Preloading `/images/series-1/file.jpg` doesn't warm the cache that `<Image>` actually hits

On Vercel, optimized images are generated on first request and cached at the edge — but the on-demand src-swap flash remains regardless.

## Solution

For decorative cycling cells, bypass Next.js `<Image>` entirely. Use plain `<img>` tags pointing to aggressively pre-compressed files. Preloading then works because the URL is literal.

---

## Directory Structure

```
public/images/
  series-1/          ← full quality, gallery + album only (never modify)
  landing/           ← landing animation pool, aggressively compressed in-place
  landing-blur/      ← 80px blur layer thumbs generated from landing/
  blur-thumbs/       ← deprecated once landing-blur is wired up
```

---

## Phase 1 — Separate the landing image pool

### 1a. Create `public/images/landing/`
Hand-pick photos for the landing animation — can be all 56 or a curated subset.
These display at 135px rotated 45°, so detail is irrelevant. Quantity: 20-30 recommended.

### 1b. Compression script: `scripts/gen-landing-images.mjs`
- Input: originals dropped into `public/images/landing/`
- Output A: resize to 200px wide, quality 60 mozjpeg → overwrites in-place (main grid + middle column cells)
- Output B: 80px wide, quality 40 → writes to `public/images/landing-blur/` (blur layer)

### 1c. Create `src/data/landingImages.ts`
Separate array from `highlights.ts`. Landing page pulls from this exclusively.
Gallery and album pages never reference it.

```ts
export const landingImages = [
  { src: 'landing/file1.jpg' },
  { src: 'landing/file2.jpg' },
  // ...
];
```

---

## Phase 2 — Fix cycling performance

### 2a. Swap `<Image>` → `<img>` in `LandingPage.tsx`
All cycling cells (main grid, middle column, blur layer) use plain `<img>`:

```tsx
<img
  src={`/images/landing/${filename}`}
  alt=""
  className={styles.image}
/>
```

No Next.js placeholder behavior. No URL rewriting. Preloading works.

### 2b. Preload all landing images on mount

```ts
useEffect(() => {
  landingImages.forEach(img => {
    const el = new window.Image();
    el.src = `/images/landing/${img.filename}`;
  });
}, []);
```

Fires all fetches in parallel on first render. By the time the 1200ms cycle timer
fires, everything is browser-cached. Zero flash after initial load.

### 2c. Gate cycling behind ready state

```ts
const [ready, setReady] = useState(false);

useEffect(() => {
  let loaded = 0;
  landingImages.forEach(img => {
    const el = new window.Image();
    el.onload = () => {
      loaded++;
      if (loaded === landingImages.length) setReady(true);
    };
    el.src = `/images/landing/${img.filename}`;
  });
}, []);

// Only start timers when ready === true
```

Grid fades in once preload completes — no mid-cycle pop-in on first load.

---

## Phase 3 — Cleanup

- Point blur layer to `public/images/landing-blur/` instead of `blur-thumbs/`
- Delete `public/images/blur-thumbs/` (or keep as fallback until confirmed working)
- `<Image>` (Next.js) stays for: lightbox, gallery grid, album pages — where optimization matters

---

## Developer Workflow

When adding new photos to the landing page:
1. Drop originals into `public/images/landing/`
2. Run: `node scripts/gen-landing-images.mjs`
3. Add filenames to `src/data/landingImages.ts`
4. Commit both the compressed images and the data file

When adding photos to the gallery/album:
- Work only in `public/images/series-1/` and `src/data/highlights.ts`
- Run: `node scripts/compress-images.mjs` (existing script)
- The two pools are fully independent

---

## Files Changed

| File | Change |
|------|--------|
| `public/images/landing/` | New directory — landing-only image pool |
| `public/images/landing-blur/` | New directory — generated 80px blur thumbs |
| `scripts/gen-landing-images.mjs` | New script — compresses landing pool |
| `src/data/landingImages.ts` | New data file — landing image list |
| `src/components/Landing/LandingPage.tsx` | Swap `<Image>` → `<img>`, add preload effect |
| `src/components/Landing/landingPage.module.css` | Minor cleanup if needed |
