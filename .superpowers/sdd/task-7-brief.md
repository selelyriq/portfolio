# Task 7: Build ProjectAlbumView Component

## Context
You are building an album/project detail page for a photography portfolio gallery. This is part of a larger portfolio site with a main infinite-scroll gallery (LayeredGallery) already in place. Users should be able to click an image or navigate to an album to see all images from that project in the same visual style.

## Requirements

### 1. Album Detail Page Route
- Create `src/app/album/[id]/page.tsx`
- Route receives album ID as URL parameter (`[id]`)
- Fetch the correct project/album from `portfolioData` in `src/data/projects.ts`
- Pass album data to AlbumView component

### 2. AlbumView Component
- Create `src/components/Gallery/AlbumView.tsx`
- Display all images from a single album/project in infinite scroll
- Use the same layered gallery visual style as LayeredGallery:
  - Main image centered and bright (opacity 1)
  - Next 2 images stacked below, darkened (opacity 0.4 and 0.25)
  - Smooth animations between images
- Support scroll wheel and arrow key navigation (cycle through album images only, not across projects)
- Display lightbox on main image click
- Reuse logic from LayeredGallery but scope to single album

### 3. Styling
- Create `src/components/Gallery/albumView.module.css`
- Match the visual language from LayeredGallery:
  - Dark background
  - Glow/halo effect around main image
  - Frosted glass styling where applicable
  - Smooth transitions and animations
- Ensure responsive layout

### 4. Header/Navigation
- Display album title at top of page
- Display album description if available
- Add back button to return to main gallery (`/`)
- Use frosted glass styling consistent with theme

### 5. Image Navigation and Lightbox
- Images navigable via:
  - Scroll wheel (up/down)
  - Arrow keys (up/down)
  - Thumbnail navigation if using ThumbnailStrip
  - Lightbox navigation arrows
- Clicking main image opens lightbox (reuse ImageLightbox component)
- Lightbox navigation cycles within album only

### 6. Display Info
- Show current image count (e.g., "3 / 12") at bottom
- Show album title/description

## Implementation Notes

**Existing Components to Reuse:**
- `ImageLightbox.tsx` - for full-screen image viewing
- `ThumbnailStrip.tsx` - optional for thumbnail navigation
- Layout patterns from `LayeredGallery.tsx`

**Data Structure:**
- `portfolioData.projects` is an array of Project objects
- Each Project has: `id`, `title`, `slug`, `description`, `year`, `images[]`
- Images have: `id`, `src`, `alt`, `width`, `height`

**Key Differences from LayeredGallery:**
- Scope images to single album instead of all projects
- Scroll/navigation cycles within album only (no wrap-around to other projects)
- Display album title/description at top
- Include back button

## Testing Checklist
- [ ] Page loads correctly for valid album ID
- [ ] Images display in layered gallery style
- [ ] Scroll navigation works (up/down cycles through album images)
- [ ] Arrow key navigation works
- [ ] Clicking main image opens lightbox
- [ ] Lightbox navigation works within album
- [ ] Back button returns to main gallery
- [ ] Album title and description display correctly
- [ ] Image count shows correctly
- [ ] Responsive on mobile/tablet

## Files to Create
- `src/app/album/[id]/page.tsx` (album detail page route)
- `src/components/Gallery/AlbumView.tsx` (main album view component)
- `src/components/Gallery/albumView.module.css` (styling)

## Files to Modify
- None required (may integrate with existing components)
