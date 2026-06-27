# Task 10: Add Glow & Glassmorphism Effects

## Context
You are enhancing the visual design with consistent glow effects and frosted glass styling across all components. This creates the "ethereal art gallery" aesthetic described in the plan. Effects should be performant and reusable.

## Requirements

### 1. Glassmorphism CSS Utility
- Create `src/styles/glassmorphism.css`
- Define CSS classes for frosted glass effect:
  - `.glass` or `.glassmorphism` — base frosted glass style
    - `background: rgba(255, 255, 255, 0.05)` (semi-transparent white)
    - `backdrop-filter: blur(12px)`
    - `border: 1px solid rgba(255, 255, 255, 0.1)`
    - Smooth transitions
  - `.glass-sm`, `.glass-md`, `.glass-lg` — size variants (if useful)
- Can be applied to buttons, cards, modals, overlays

### 2. Glow Effect Classes
- Define CSS classes for glow/halo effect around images:
  - `.glow` or `.image-glow` — large halo behind image
    - `box-shadow: 0 0 60px 30px rgba(212, 175, 55, 0.2)` (gold glow)
    - `filter: blur(40px)` on pseudo-element, or use box-shadow with spread
    - Positioned behind main element
  - `.glow-bright` — stronger glow for emphasis
  - `.glow-subtle` — minimal glow for secondary elements

### 3. Apply Effects Throughout

**LayeredGallery & AlbumView (already have basic glow):**
- Verify `.glow` div is styled consistently
- Ensure glow opacity/blur matches glassmorphism theme

**ProjectsCatalog cards:**
- Add frosted glass effect to project cards
- Add subtle glow on hover

**Header:**
- Already has frosted glass (backdrop-filter)
- Verify border is styled with gold accent

**ImageLightbox modal:**
- Add frosted glass background to backdrop
- Verify close button has frosted glass style

**Buttons throughout:**
- Apply frosted glass effect to action buttons
- Smooth hover transitions

### 4. Performance Considerations
- Use `will-change: filter` sparingly (only on animated elements)
- Use CSS transforms for animations (gpu-accelerated), not filter changes during animation
- Avoid animating `backdrop-filter` itself (expensive); animate opacity instead
- Use `contain: paint` on elements with heavy filters

### 5. Color Palette
- Gold accent: `var(--accent-gold)` or `#d4af37`
- Gold light: `var(--accent-gold-light)` or `#e8c547`
- Dark bg: `var(--bg-primary)` or `#0a0a0a`
- Border colors: `rgba(255, 255, 255, 0.1)` for subtle dividers

## Implementation Notes

**CSS approach:**
- Define utility classes in `src/styles/glassmorphism.css`
- Import in `src/app/globals.css` or individual component modules
- Use CSS variables for colors and blur amounts
- Keep it DRY: extract common values to CSS custom properties

**Example classes:**
```css
.glassmorphism {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glow {
  position: relative;
}
.glow::before {
  content: '';
  position: absolute;
  inset: -40px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
  filter: blur(40px);
  z-index: -1;
}
```

**Integration:**
- Apply to existing components where appropriate
- Don't add glow/glass to every element (only key focal points)
- Focus on images, cards, and important interactive elements

## Testing Checklist
- [ ] Glassmorphism classes defined and importable
- [ ] Glow classes defined and importable
- [ ] Frosted glass visible on header
- [ ] Frosted glass visible on ProjectsCatalog cards
- [ ] Glow visible on main images (LayeredGallery, AlbumView)
- [ ] Glow visible on hover effects
- [ ] Effects performant (no jank during scroll or animation)
- [ ] Effects visible on different browsers (Chrome, Safari, Firefox)
- [ ] Colors consistent (gold accents, transparency levels)

## Files to Create
- `src/styles/glassmorphism.css` (utility classes)

## Files to Modify
- `src/app/globals.css` (import glassmorphism.css)
- `src/components/Gallery/layeredGallery.module.css` (enhance glow, verify frosted glass)
- `src/components/Gallery/albumView.module.css` (enhance glow, verify frosted glass)
- `src/components/Projects/projectsCatalog.module.css` (add frosted glass to cards, add glow on hover)
- `src/components/Header/header.module.css` (verify frosted glass, add gold border)
- `src/components/Gallery/imageLightbox.module.css` (add frosted glass to backdrop/modal)
