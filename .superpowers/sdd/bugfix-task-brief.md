# Bug Fix Task: Critical Design & UX Issues

## Context
The gallery is feature-complete but has visual and interaction bugs that need fixing before shipping. This task fixes the 4 most critical issues preventing a polished user experience.

## Bugs to Fix

### 1. CRITICAL: Lightbox Image Click Should Navigate to Album
**Current behavior:** Clicking on the full-screen lightbox image does nothing  
**Expected behavior:** Clicking the image in lightbox should navigate to that project's album (`/album/{projectId}`)  
**Why:** User should be able to go from main gallery → lightbox → album view seamlessly  

**Files to modify:**
- `src/components/Gallery/ImageLightbox.tsx` — make image clickable (add onClick handler or wrap in Link)
- Need to pass `projectId` from LayeredGallery → ImageLightbox → image click handler
- Use `useRouter().push('/album/{projectId}')` or Next.js Link

**Implementation notes:**
- ImageLightbox already receives `image` prop which has `id`, `src`, `alt`, etc.
- LayeredGallery flattens images with `projectId` and `projectTitle` (lines 23-31)
- Need to pass `projectId` through to ImageLightbox or derive it from image data
- Make image cursor pointer on hover (visual affordance)

---

### 2. HIGH: Layered Card Stack Not Visually Distinct
**Current behavior:** 3 cards stacked directly on top, nearly overlapping, no clear layering  
**Expected behavior (from design notes):**
- Main image (index 0): 100% size, opacity 1.0, z-index 3
- Next image (index 1): 70% scale, opacity 0.4-0.5, 60px offset, z-index 2
- Next-next image (index 2): 70% scale, opacity 0.2-0.3, 120px offset, z-index 1

**Files to modify:**
- `src/components/Gallery/LayeredGallery.tsx` — update animation values for cards
- `src/components/Gallery/layeredGallery.module.css` — update `.card` and `.cardActive` CSS
- Same fix needed in `src/components/Gallery/AlbumView.tsx` and `albumView.module.css`

**Current CSS (wrong):**
```css
.card { opacity: 0; y: 20; }
.card:hover { opacity: layerIndex === 0 ? 1 : 0.4 - layerIndex * 0.15; y: layerIndex * 40; }
```

**Expected CSS (correct):**
```css
.card:nth-child(1) { scale: 1; opacity: 1; translateY(0); }
.card:nth-child(2) { scale: 0.7; opacity: 0.4; translateY(60px); }
.card:nth-child(3) { scale: 0.7; opacity: 0.2; translateY(120px); }
```

Or use dynamic Framer Motion `animate` values based on layerIndex.

---

### 3. MEDIUM: Glassmorphism Effect Too Heavy on Photos
**Current behavior:** Glow effect and backdrop-filter blur is obscuring image clarity and muddying photos  
**Expected behavior:** Photos should be CLEAN and CLEAR; glassmorphism only on UI overlays (header, buttons, modals)

**Files to modify:**
- `src/components/Gallery/layeredGallery.module.css` — `.glow` class
- `src/components/Gallery/albumView.module.css` — `.glow` class
- `src/styles/glassmorphism.css` — reduce glow intensity

**Current issue:** 
- `.glow` has `backdrop-filter: blur()` which blurs the image itself
- Box-shadow glow is too intense or spread too wide

**Fix approach:**
- Remove `backdrop-filter` from `.glow` div (it doesn't help)
- Reduce box-shadow spread radius and opacity (e.g., `0 0 40px 20px rgba(212,175,55,0.1)` instead of current)
- Keep subtle visual separation but prioritize photo clarity
- Verify glow doesn't obscure image details

---

### 4. MEDIUM: Investigate & Fix Missing Photos
**Current behavior:** Only 4/6 photos rendering; Successor.jpg and banger3.jpg are missing  
**Investigation steps:**
1. Check if files exist: `ls -la /Users/lyriqsele/portfolio-site/public/images/series-1/`
2. Verify file paths in `src/data/projects.ts` match actual file names exactly (case-sensitive)
3. Check browser console for 404 errors on missing images
4. Check build logs for image optimization failures
5. Try accessing images directly via browser/curl

**Common causes:**
- File name mismatch (typo in projects.ts)
- File permissions issue
- Corrupted image file
- Next.js image optimization silently failing

**Fix:** Update `src/data/projects.ts` with correct file paths and verify all images are present

---

## Testing Checklist
- [ ] Lightbox image click navigates to album (test on main gallery)
- [ ] Layered cards have clear visual hierarchy with proper scaling
- [ ] Photos are clear and sharp (no muddy glassmorphism)
- [ ] All 6 photos render in gallery
- [ ] No console errors or 404s
- [ ] Hover effects still work correctly
- [ ] TypeScript build passes (npx tsc --noEmit)

## Implementation Order
1. Fix missing photos first (investigation/data fix)
2. Fix lightbox navigation (interaction)
3. Fix layered card scaling (visual hierarchy)
4. Reduce glassmorphism (polish)

## Files to Create/Modify
- `src/components/Gallery/LayeredGallery.tsx` (lightbox projectId passing, animation values)
- `src/components/Gallery/AlbumView.tsx` (same fixes)
- `src/components/Gallery/ImageLightbox.tsx` (image click handler)
- `src/components/Gallery/layeredGallery.module.css` (card scaling CSS)
- `src/components/Gallery/albumView.module.css` (card scaling CSS)
- `src/styles/glassmorphism.css` (reduce glow intensity)
- `src/data/projects.ts` (fix file paths if needed)
