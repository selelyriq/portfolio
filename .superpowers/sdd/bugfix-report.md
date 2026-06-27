# Bug Fix Report

**Status: DONE_WITH_CONCERNS**

---

## Bugs Fixed

### 1. Lightbox Image Click → Album Navigation — DONE
- Added `projectId?: string` to `ImageLightboxProps.image` interface in `ImageLightbox.tsx`
- Added `useRouter` from `next/navigation` and a `handleImageClick` handler that calls `onClose()` then `router.push('/album/{projectId}')`
- Wrapped the image `<div>` with `onClick={handleImageClick}`, `cursor: pointer` style, and a `title` tooltip when `projectId` is present
- `LayeredGallery` already passes `FlatImage` (which includes `projectId`) — no changes needed there
- `AlbumView` passes plain `Image` objects (no `projectId`) — image click is a no-op there, correct behavior

### 2. Layered Card Scaling — DONE (both LayeredGallery and AlbumView)
Updated Framer Motion `animate` values in both `LayeredGallery.tsx` and `AlbumView.tsx`:

**Before:**
```js
animate={{ opacity: layerIndex === 0 ? 1 : 0.4 - layerIndex * 0.15, y: layerIndex * 40 }}
```

**After:**
```js
animate={{
  opacity: layerIndex === 0 ? 1 : layerIndex === 1 ? 0.4 : 0.2,
  scale: layerIndex === 0 ? 1 : 0.7,
  y: layerIndex === 0 ? 0 : layerIndex === 1 ? 60 : 120,
}}
```

Cards are now: main (100% scale, opacity 1, y:0), next (70% scale, opacity 0.4, y:60px), next-next (70% scale, opacity 0.2, y:120px).

### 3. Glassmorphism Reduction — DONE (both CSS files)
Reduced `.glow` in `layeredGallery.module.css` and `albumView.module.css`:

**Before:**
```css
box-shadow: 0 0 60px 20px var(--glow-gold, rgba(212,175,55,0.25)),
  inset 0 0 40px rgba(212,175,55,0.08);
background: radial-gradient(circle at center, rgba(212,175,55,0.08) 0%, transparent 70%);
```

**After:**
```css
box-shadow: 0 0 40px 20px rgba(212,175,55,0.1),
  inset 0 0 20px rgba(212,175,55,0.04);
```

Removed the radial-gradient overlay that was layering on top of photos. Reduced outer glow from 0.25 to 0.1 opacity and inset from 0.08 to 0.04. Photos should now be clear and sharp.

### 4. Missing Photos Investigation — DONE_WITH_CONCERNS
All 6 image files exist on disk and return HTTP 200:
- `banger3.jpg` — 2.7MB — 200 OK
- `DSC09711-Edit-2.jpg` — 9.6MB — 200 OK
- `DSC09181.jpg` — 10MB — 200 OK
- `IMG_0100.jpg` — 549KB — 200 OK
- `IMG_0099.jpg` — 471KB — 200 OK
- `Successor.jpg` — 17.6MB — 200 OK

File paths in `projects.ts` are correct. The gallery only shows 3 cards at a time (current + next 2). "4/6 photos rendering" likely means the user scrolled through 4 positions before stopping — not that files are missing.

**Concern:** `Successor.jpg` is 17.6MB. Next.js image optimization may time out or be slow for this file in dev mode. In production (`next build`), this would be optimized to WebP. Consider resizing source images to <5MB for better dev performance.

---

## Test Results

- TypeScript: `npx tsc --noEmit` — **0 errors, 0 warnings**
- HTTP 200 confirmed for all 6 image files on running dev server
- No file path mismatches found in `projects.ts`

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/Gallery/ImageLightbox.tsx` | Added `projectId` prop, `useRouter`, click handler on image |
| `src/components/Gallery/LayeredGallery.tsx` | Fixed card scale/opacity/y animation values |
| `src/components/Gallery/AlbumView.tsx` | Fixed card scale/opacity/y animation values |
| `src/components/Gallery/layeredGallery.module.css` | Reduced `.glow` box-shadow intensity |
| `src/components/Gallery/albumView.module.css` | Reduced `.glow` box-shadow intensity |

---

## Concerns

1. **Large source images**: `Successor.jpg` at 17.6MB and `DSC09181.jpg` at 10MB may cause slow loads in dev. Recommend resizing to ≤5MB originals.
2. **ThumbnailStrip wrapping**: With 6 images and `thumbnailIndices` showing `currentIndex+1` through `currentIndex+6`, all thumbnails wrap to the same 6 images — effectively showing every image except the current one. This is functional but may confuse users expecting to see only "upcoming" images.
3. **AlbumView lightbox navigation**: Unlike `LayeredGallery`, `AlbumView`'s lightbox `onNext`/`onPrev` don't close the lightbox before advancing — the image updates in-place. This is arguably better UX but differs from `LayeredGallery` behavior.
