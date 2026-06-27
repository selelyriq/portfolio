# Photography Portfolio - Design & Implementation Notes

> Session: 2026-06-26  
> Status: 5/12 features complete, design refinements needed

---

## Current State
- ✅ Layered gallery rendering (3 images at a time)
- ✅ Thumbnail strip navigation (right side)
- ✅ Scroll/arrow key navigation
- ⚠️ Visual design needs refinement

---

## Known Issues & Design Gaps

### 1. **Image Centering** (Easy Fix)
**Issue:** Main image is offset to the right, not centered in viewport  
**Expected:** Image centered horizontally and vertically  
**Files affected:** `src/components/Gallery/layeredGallery.module.css`  
**Fix approach:** Add flexbox/grid centering to `.cardStack` container  

---

### 2. **Glassmorphism Effect is Too Heavy** (Medium Fix)
**Issue:** Glow/backdrop-filter effect is obscuring image clarity and bleeding blur onto photos  
**Current behavior:** Photos are visually muddy due to excessive blur/glow  
**Expected behavior:** 
- Photos should be CLEAN and CLEAR (no glassmorphism)
- Glassmorphism only applied to UI overlays (buttons, modals, header - tasks 6-9)
- Glow effect should be subtle, not obscuring image details

**Files affected:** `src/components/Gallery/layeredGallery.module.css` (.glow class)  
**Fix approach:**
- Remove or significantly reduce `.glow` backdrop-filter blur
- Keep subtle box-shadow for visual separation
- Reserve glassmorphism for future UI elements (lightbox, header, buttons)

---

### 3. **Layered Card Stack Not Visually Distinct** (Important Fix)
**Issue:** Next 2 images are stacked directly on top, not separated enough to show layering effect  
**Current:** All 3 images nearly overlapping, no visual hierarchy  
**Expected (from mockups):**
- **Main image (index 0):** 
  - Full size (100% width/height)
  - Full opacity (1.0)
  - Full brightness
  - Centered, in forefront
  
- **Next image (index 1):**
  - 70% of main image size (0.7x scale)
  - Lower opacity (0.4-0.5)
  - Positioned behind main image with ~10% vertical offset
  - Slightly darker/desaturated
  
- **Next-next image (index 2):**
  - 70% of main image size (0.7x scale)
  - Even lower opacity (0.2-0.3)
  - Positioned further behind main image with ~20% vertical offset
  - Most desaturated

**Files affected:** 
- `src/components/Gallery/LayeredGallery.tsx` (layer calculation)
- `src/components/Gallery/layeredGallery.module.css` (scaling/positioning)

**Fix approach:**
```css
/* Current (wrong): all cards roughly same size stacked */
/* Expected: scale and offset progressively */
.card:nth-child(1) { transform: scale(1) translateY(0); opacity: 1; z-index: 3; }
.card:nth-child(2) { transform: scale(0.7) translateY(60px); opacity: 0.5; z-index: 2; }
.card:nth-child(3) { transform: scale(0.7) translateY(120px); opacity: 0.2; z-index: 1; }
```

---

### 4. **Manual Image Dimension Entry** (Design System Issue)
**Issue:** Must manually enter width/height for each photo in `projects.ts`  
**Problem:** Not scalable for 50+ photos; error-prone; brittle  
**Current:** 
```typescript
{
  id: "photo-1",
  src: "series-1/banger3.jpg",
  alt: "Photo 1",
  width: 1920,    // <-- Must manually enter
  height: 1280,   // <-- Must manually enter
}
```

**Desired:** Auto-detect aspect ratio and scale appropriately  
**Solution approach:**
- **Option A (Frontend auto-detection):** 
  - Load image, read dimensions, calculate aspect ratio
  - Scale to max 1080px (width or height, whichever is larger)
  - Preserve aspect ratio
  - Requires image load-time calculation
  
- **Option B (Build-time processing):** 
  - Create script that reads all images in `/public/images/`
  - Auto-generates `projects.ts` with correct dimensions
  - Scales images down to max 1080px during build
  - More efficient, cleaner data
  - Recommended approach

- **Option C (CMS/metadata file):**
  - Create `.metadata.json` for each series
  - Auto-populate from image files
  - Hybrid approach

**Files affected:** 
- `src/data/projects.ts` (data structure)
- Need: `scripts/generate-project-data.js` or similar

**Recommended:** Option B - build-time script to auto-generate project data from image files

---

### 5. **Aspect Ratio Handling** (Design System)
**Issue:** All photos currently set to 1920x1280 (16:9), but user photos are portrait  
**Current:** Portrait photos squeezed/distorted to fit 16:9  
**Expected:**
- Portrait photos display as portrait (e.g., 1080x1920)
- Landscape photos display as landscape (e.g., 1920x1280)
- Each photo scales responsively based on its actual aspect ratio
- Max dimension: 1080px (for performance/storage)

**Implementation:**
- Store actual dimensions from each photo
- CSS uses `aspect-ratio` property or calculates dynamically
- Next.js Image component respects `width`/`height` for proper scaling

**Files affected:** `src/data/projects.ts`, `LayeredGallery.tsx`, `layeredGallery.module.css`

---

### 6. **Thumbnail Strip Centering** (Easy Fix)
**Issue:** Thumbnail strip not vertically centered; selected photo not centered in the reel  
**Current:** Strip positioned fixed at top 50%, but photos not centered  
**Expected:**
- Selected (next upcoming) photo centered vertically on screen
- 2 photos above, 2 photos below visible in strip
- Strip itself positioned right side, centered
- Smooth scrolling so selected photo stays centered as user navigates

**Files affected:** `src/components/Gallery/ThumbnailStrip.tsx`, `thumbnailStrip.module.css`  
**Fix approach:** Adjust `.strip` positioning and scroll behavior to keep selected thumbnail centered

---

### 7. **Thumbnail Border Color** (Trivial)
**Issue:** Selected thumbnail has gold/yellow border  
**Expected:** White border instead  
**Files affected:** `src/components/Gallery/thumbnailStrip.module.css` (.highlight class)  
**Fix approach:** Change `border-color: var(--accent-gold)` to white; update box-shadow accordingly

---

### 8. **Missing Photos in Gallery** (Critical - Investigate)
**Issue:** Only 4/6 photos rendering in gallery and navigation  
**Current state:**
- DSC02089.jpg ✓
- DSC09181.jpg ✓
- DSC09711-Edit-2.jpg ✓
- PR1-2-Fireworks-1.jpg ✓
- Successor.jpg ✗ (missing)
- banger3.jpg ✗ (missing)

**Possible causes:**
1. File paths in projects.ts don't match actual file names
2. File permissions issue on certain files
3. Image files too large/corrupt
4. Next.js image optimization failing silently

**Investigation steps:**
1. Verify files exist: `ls -la public/images/series-1/`
2. Check browser console for 404 errors
3. Check Next.js build logs for image processing errors
4. Verify file permissions (some files show `rw-------` instead of `rw-r--r--`)
5. Try accessing image URLs directly: `http://localhost:3000/_next/image?url=/images/series-1/Successor.jpg`

**Files affected:** `public/images/series-1/`, `src/data/projects.ts`

---

## Design Refinement Checklist

### Phase 1: Core Layering (Before Features 6-12)
- [ ] Fix image centering
- [ ] Remove excessive glassmorphism from photos
- [ ] Implement proper layered card scaling (70%, 10% offset)
- [ ] Add opacity/brightness differentiation
- [ ] Verify z-index/stacking context

### Phase 2: Auto Image Processing (Before Data Migration)
- [ ] Create build script to auto-detect image dimensions
- [ ] Generate `projects.ts` from image files
- [ ] Scale images down to max 1080px
- [ ] Support portrait/landscape aspect ratios

### Phase 3: UI Glassmorphism (Features 6-9)
- [ ] Apply frosted glass to lightbox modal (Task 6)
- [ ] Apply to header (Task 9)
- [ ] Apply to buttons/interactive elements
- [ ] Ensure glassmorphism enhances, doesn't obscure

---

## Reference Screenshots
- Current state: See screenshot from 2026-06-26 21:31
- Expected layering: See Photoshop mockups from 2026-06-26 08:46

---

## Notes on Vision
> "Make scrolling through my photos an experience. Feel like you're walking through a luxurious, almost ethereal art gallery."

Current blockers:
1. Photos aren't visually distinct (layering not clear)
2. Glassmorphism on photos muddies clarity
3. All photos forced to one aspect ratio

Once fixed:
- Photos should "breathe" with clear visual hierarchy
- Each scroll reveals the next photo as the main focus
- Portrait/landscape variety adds visual interest
- Minimal UI keeps focus on photography
