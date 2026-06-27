# Photography Portfolio

A unique, immersive photography portfolio website built with Next.js, featuring smooth scroll interactions, dark minimal aesthetic with gold accents, and full image optimization for Vercel deployment.

## Project Status

**Implementation Plan:** See [`docs/superpowers/plans/2026-06-26-photography-portfolio.md`](docs/superpowers/plans/2026-06-26-photography-portfolio.md)

### Completed (Session 1 - 2026-06-26)
- ✅ Task 1: Next.js 14 boilerplate with dark theme + gold accents
- ✅ Task 2: Project/image data structure & TypeScript types
- ✅ Task 3: Gallery component with scroll tracking

### In Progress
- ⏳ Task 4: ProjectSection component
- ⏳ Task 5: ImageCard component with hover animations
- ⏳ Task 6-12: Scroll effects, optimization, header, deployment

## Getting Started

### Development
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the portfolio in development.

### Build & Deploy
```bash
npm run build
npm start
```

Deploy to Vercel by pushing to GitHub and connecting the repo to Vercel. See Task 12 in the implementation plan.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components (Gallery, ProjectSection, ImageCard, Header)
├── data/            # Project metadata and image data
├── types/           # TypeScript type definitions
└── utils/           # Utility functions (image loading, etc)

public/
└── images/          # Project images organized by series
    ├── series-1/
    ├── series-2/
    └── ...
```

## Tech Stack

- **Framework:** Next.js 14+ with TypeScript
- **Styling:** CSS Modules + CSS Variables
- **Animations:** Framer Motion
- **Image Optimization:** Next.js Image component
- **Hosting:** Vercel
- **Build Tool:** npm

## Key Features (Planned)

- Organized image galleries by project/series
- Smooth infinite scroll with parallax effects
- Hover animations on images with gold accents
- Dark minimal design aesthetic
- Fully optimized images for web
- Mobile-responsive layout
- SEO-friendly

## Next Steps

1. Continue implementation with Task 4 (ProjectSection component)
2. Build out remaining components and features
3. Add actual project images to `/public/images/`
4. Deploy to Vercel

See the full implementation plan for detailed task breakdown.
