# Photography Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a luxurious, ethereal art gallery experience. Users scroll through an infinite gallery of layered image cards with glow effects, click to see full images in a lightbox, click images to explore complete albums, and browse all projects from a catalog. Dark minimal aesthetic with frosted glass UI elements and smooth animations.

**Architecture:** 
- Main infinite scroll gallery with **layered card stack effect** (current image bright, next/previous images darkened beneath)
- Side thumbnail strip for navigation and context
- Glow/halo backdrop blur effect around main images
- Lightbox modal (frosted glass) for full-screen viewing
- Album detail views with same visual language
- Projects catalog page
- Dark theme with gold accents, glassmorphism UI elements

**Tech Stack:** 
- Next.js 14+ (React, TypeScript)
- Framer Motion (scroll animations, card transitions, scroll position tracking)
- Next.js Image component (optimization, aspect ratio handling)
- CSS Modules + CSS Variables (theming, backdrop-filter blur)
- Glassmorphism (frosted glass effects via backdrop-filter)
- Vercel (hosting + image optimization)

**Key Visual Features:**
- **Layered Cards:** Main image centered/bright, next images stacked below (darkened, opacity reduced)
- **Glow Effect:** Backdrop blur + box-shadow creating halo around main image
- **Frosted Glass:** Semi-transparent backgrounds with blur on all overlays (header, lightbox, buttons)
- **Thumbnail Strip:** Right-side vertical strip showing upcoming images
- **Infinite Scroll:** Smooth transitions between images as user scrolls
- **Aspect Ratio Handling:** Graceful layout for portrait/landscape images

---

## File Structure

```
portfolio-site/
├── public/
│   └── images/              # Project images organized by series
│       ├── series-1/
│       ├── series-2/
│       └── ...
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with dark theme provider
│   │   ├── page.tsx         # Gallery page (infinite scroll)
│   │   ├── globals.css      # CSS variables for theme
│   │   └── gallery.module.css
│   ├── components/
│   │   ├── Gallery/
│   │   │   ├── Gallery.tsx  # Main infinite scroll container
│   │   │   ├── ProjectSection.tsx # Project/series grouping
│   │   │   ├── ImageCard.tsx # Individual image with hover
│   │   │   └── gallery.module.css
│   ├── data/
│   │   └── projects.ts      # Project metadata and image data
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   └── utils/
│       └── imageLoader.ts   # Image loading utilities
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # (if using Tailwind, otherwise CSS Modules only)
└── package.json
```

---

## Task 1: Project Setup & Next.js Boilerplate
**STATUS: ✅ DONE**
- Created Next.js 14 project with TypeScript
- Installed Framer Motion, clsx
- Setup dark theme with CSS variables (gold accents)
- Created root layout, home page, globals.css
- Commit: `0da18e6 feat: initialize Next.js project with dark theme setup`

## Task 2: Create Project/Image Data Structure
**STATUS: ✅ DONE**
- Created `src/types/index.ts` with Image, Project, PortfolioData interfaces
- Created `src/data/projects.ts` with sample portfolio data
- Created `src/utils/imageLoader.ts` with utility functions
- Sample data loads without errors
- Commit: (from subagent)

## Task 3: Build Gallery Component (Infinite Scroll Container)
**STATUS: ✅ DONE**
- Created `src/components/Gallery/Gallery.tsx` with scroll tracking
- Created `src/components/Gallery/gallery.module.css`
- Maps through projects and renders ProjectSection for each
- Commit: (from subagent)

## Task 4: Build LayeredGallery Component (Redesigned)
**STATUS: ✅ DONE**
- Create infinite scroll gallery with layered card stack effect
- Main image centered and bright, adjacent images darkened below
- Implement scroll listener to update which image is "current"
- Calculate and render 2-3 layered images (current + next + next-next)
- Handle different aspect ratios gracefully
- Add glow/halo backdrop blur effect behind main image
- Files: src/components/Gallery/LayeredGallery.tsx, layeredGallery.module.css
- Key CSS: backdrop-filter blur, box-shadow glow, opacity transitions, z-index layering

## Task 5: Build ThumbnailStrip Component
**STATUS: ✅ DONE**
- Create right-side thumbnail navigation strip
- Display thumbnails of upcoming images (vertical scroll)
- Click thumbnail to jump to that image
- Highlight current thumbnail (gold border)
- Responsive: hide/compact on mobile, maintain on desktop
- Files: src/components/Gallery/ThumbnailStrip.tsx, thumbnailStrip.module.css
- Integrated into LayeredGallery
- Commit: `5e22efc` (in Task 4 commit, integrated in Task 5)

## Task 6: Build ImageLightbox Component
**STATUS: ⏳ TODO**
- Create modal/lightbox for full-screen image viewing
- Triggered when user clicks on main image
- Frosted glass backdrop (glassmorphism)
- Close button with frosted glass styling
- Navigation arrows to browse within lightbox
- Files: src/components/Gallery/ImageLightbox.tsx, imageLightbox.module.css

## Task 7: Build ProjectAlbumView Component
**STATUS: ⏳ TODO**
- Create album/project detail page view
- Click image from main gallery → navigate to full album
- Display all images from selected album in infinite scroll
- Same layered gallery visual style as main gallery
- Back button to return to main gallery
- Album title and description at top
- Files: src/app/album/[id]/page.tsx, src/components/Gallery/AlbumView.tsx, albumView.module.css

## Task 8: Build ProjectsCatalog Component
**STATUS: ⏳ TODO**
- Create "Albums/Projects" catalog page
- Display grid or list of all projects/series
- Click project → navigate to album view (Task 7)
- Accessible from "Albums" button in header
- Same dark theme + frosted glass styling
- Files: src/app/projects/page.tsx, src/components/Projects/ProjectsCatalog.tsx, projectsCatalog.module.css

## Task 9: Build Header Navigation
**STATUS: ⏳ TODO**
- Create fixed header with dark background
- Logo/branding on left
- Menu items: "Gallery" (main), "Albums", "About", "Contact"
- Social links (Instagram, etc.)
- Frosted glass effect on header
- Files: src/components/Header/Header.tsx, header.module.css

## Task 10: Add Glow & Glassmorphism Effects
**STATUS: ⏳ TODO**
- Implement glow/halo effect CSS with backdrop-filter blur
- Create frosted glass component utility for UI elements
- Apply to: image cards, buttons, modals, header
- Ensure performant (use CSS transforms, not heavy filters on scroll)
- Files: Create src/styles/glassmorphism.css, update component styles

## Task 11: Project Data Migration & Image Organization
**STATUS: ⏳ TODO**
- Organize user's actual images into /public/images/series-*/ directories
- Update src/data/projects.ts with real project data and album metadata
- Ensure aspect ratios captured for layout calculations
- Files: Modify src/data/projects.ts, add image files

## Task 12: Performance Optimization & Deployment
**STATUS: ✅ COMPLETE (ready for GitHub → Vercel)**
- ✅ Optimize images (Next.js Image component with formats, sizes, caching)
- ✅ Add SEO metadata to layout (Open Graph, Twitter, robots, viewport)
- ✅ Create vercel.json with build config, security headers, caching policy
- ✅ Clean production build (no TypeScript errors, no warnings)
- ⏳ NEXT: Push to GitHub, connect to Vercel, configure custom domain (user responsibility)
- Files: Modified src/app/layout.tsx, next.config.js; created public/robots.txt, vercel.json
- Commits: 2ba300b (SEO + Vercel config), 2747f51 (config fixes)

---

## Session History

### Session 1 (2026-06-26)
- ✅ Tasks 1-3 completed and reviewed (spec + quality)
- Planning approach: Subagent-driven development with two-stage reviews
- All foundational components and data structure in place
- Ready for component build-out (Tasks 4-5)
- No blockers identified

**Next steps:** Continue with Task 4 (ProjectSection component) in next session or current session pending user direction.

---

## Notes
- Using subagent-driven development approach: fresh subagent per task + spec compliance review + code quality review
- All commits follow pattern: feat/fix: description
- CSS uses CSS Modules for scoping, CSS variables for theming
- TypeScript strict mode enabled
- Next.js Image component used for all image optimization
