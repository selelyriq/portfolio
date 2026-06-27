# Task 9: Build Header Navigation

## Context
You are building a fixed header that appears at the top of every page. The header contains navigation links to main sections (Gallery, Albums, About, Contact) and social links. It uses frosted glass styling consistent with the portfolio's dark theme.

## Requirements

### 1. Header Component
- Create `src/components/Header/Header.tsx`
- Fixed positioning at top (z-index managed appropriately)
- Dark background with frosted glass effect (backdrop-filter blur)
- Spans full width

### 2. Header Content

**Left side:**
- Logo/branding (can be text "Photography" or simple logo)
- Use Link to navigate to "/" (home/gallery)

**Center/Right:**
- Navigation menu items (Links):
  - "Gallery" → `/` (main gallery with LayeredGallery)
  - "Albums" → `/projects` (projects catalog from Task 8)
  - "About" → `/about` (stub page OK, not required to be functional)
  - "Contact" → `/contact` (stub page OK, not required to be functional)
- Social links (icons/text):
  - Instagram (placeholder URL OK)
  - Email (placeholder OK)
  - Can use simple emoji or text as placeholders

### 3. Styling
- Create `src/components/Header/header.module.css`
- Fixed positioning
- Dark background (var(--bg-primary) or similar)
- Frosted glass: `backdrop-filter: blur(12px)`
- Border bottom with subtle gold accent
- Responsive: collapse menu on mobile (burger menu optional, or stack menu vertically)
- Text: white/light color with gold accents on hover

### 4. Integration
- Import and render Header in `src/app/layout.tsx`
- Header should appear on all pages
- Adjust main content padding so it doesn't hide behind fixed header

## Visual Design
- Match dark theme with gold accents (var(--accent-gold))
- Frosted glass effect (semi-transparent with blur)
- Smooth transitions on hover
- Readable text with good contrast

## Implementation Notes

**Layout:**
- Flexbox with space-between or similar
- Left: logo + branding
- Right: nav items + social links
- Optional: mobile menu toggle (not required, can be responsive stacking)

**Linking:**
- Use Next.js Link component for internal routes
- Anchor tags for external links (Instagram, email)

**Mobile consideration:**
- Reduce font size on mobile
- Stack menu items or hide behind toggle
- Maintain touch target sizes (48px minimum)

## Testing Checklist
- [ ] Header renders on all pages
- [ ] Links navigate correctly
- [ ] Frosted glass effect visible (blur background)
- [ ] Hover effects work
- [ ] Header stays fixed at top during scroll
- [ ] Text is readable with good contrast
- [ ] Responsive on mobile (no text overlap)
- [ ] Z-index correct (not behind content, but behind modals/lightbox)

## Files to Create
- `src/components/Header/Header.tsx` (header component)
- `src/components/Header/header.module.css` (styling)

## Files to Modify
- `src/app/layout.tsx` (import and render Header, adjust padding)
