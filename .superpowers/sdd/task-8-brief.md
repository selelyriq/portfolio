# Task 8: Build ProjectsCatalog Component

## Context
You are building a projects/albums catalog page where users can see all available photo projects/series as a grid or list. Clicking a project navigates to its album detail view (Task 7). The catalog is accessible via an "Albums" link in the navigation.

## Requirements

### 1. Projects Catalog Page Route
- Create `src/app/projects/page.tsx`
- Server component (can fetch data server-side)
- Renders ProjectsCatalog component

### 2. ProjectsCatalog Component
- Create `src/components/Projects/ProjectsCatalog.tsx`
- Display all projects from `portfolioData.projects`
- Show each project as a card/tile with:
  - Project title
  - Project description
  - Thumbnail image (first image from project.images)
  - Year
  - Click to navigate to `/album/[id]`
- Use grid layout (responsive: 1 col mobile, 2-3 cols desktop)
- Hover effect on cards (glow, scale, or brightness)

### 3. Styling
- Create `src/components/Projects/projectsCatalog.module.css`
- Match portfolio dark theme with gold accents
- Frosted glass effect on cards (glassmorphism)
- Smooth hover transitions
- Responsive grid layout

### 4. Visual Design
- Card layout with image, title, description, year
- Same visual language as main gallery (dark bg, gold accents, glow effects)
- Image uses Next.js Image component with proper sizing
- Aspect ratio handling for thumbnail images

## Implementation Notes

**Data Structure:**
- `portfolioData.projects` is array of Project objects
- Each Project: `{ id, title, slug, description, year, images[] }`
- Use first image (images[0]) as thumbnail

**Linking:**
- Use Next.js Link component
- Navigate to `/album/{id}` on project click

**Responsive:**
- Mobile: 1 column, full width cards with padding
- Tablet: 2 columns
- Desktop: 3 columns
- Breakpoints: 640px (mobile), 1024px (desktop)

## Testing Checklist
- [ ] Page loads correctly at /projects
- [ ] All projects display as cards
- [ ] Thumbnails load correctly
- [ ] Project metadata (title, description, year) shows
- [ ] Cards have hover effect
- [ ] Click on card navigates to /album/{id}
- [ ] Grid layout responsive on mobile/tablet/desktop
- [ ] Images have proper aspect ratio

## Files to Create
- `src/app/projects/page.tsx` (projects page route)
- `src/components/Projects/ProjectsCatalog.tsx` (catalog component)
- `src/components/Projects/projectsCatalog.module.css` (styling)
