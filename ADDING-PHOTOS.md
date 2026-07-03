# Adding Photos & Albums

End-to-end guide for adding new content to the portfolio. Written for both personal reference and future Claude sessions picking up this project.

---

## TL;DR — The Repeatable Workflow

```
1. Export full-res JPEGs from Lightroom/Capture One to Desktop
2. Run compression script
3. Drop into the right album folder
4. (Optional) Add cover.txt
5. Run codegen script
6. Verify in browser → commit
```

---

## Folder Structure

```
public/images/
  albums/
    Japan/
      DSC07491.jpg
      DSC07569.jpg
      cover.txt          ← optional: controls which photo is the album thumbnail
    Lake District/
    GT3RS/
    ...
  landing/               ← curated hero images for the landing page (managed separately)
  landing-blur/          ← blur placeholders for landing hero (managed separately)
  about.jpg
```

Albums live at `public/images/albums/<Album Name>/`. Folder names become the album title on `/projects` — capitalize and space them exactly as you want them displayed (e.g. `Blue Ridge`, not `blue-ridge`).

---

## Step 1 — Export from Lightroom / Capture One

Export at full resolution as JPEG. Quality doesn't matter at export since the compression script handles it. Drop exports anywhere convenient (Desktop is fine).

---

## Step 2 — Compress Photos

Run this from the project root. It resizes to max 2400px on the longest edge at 80% JPEG quality (targets ~200–400 KB per image):

```bash
# Compress a folder of photos and output to a specific album
SOURCE=~/Desktop/new-photos
ALBUM="Japan"
DEST="public/images/albums/$ALBUM"

mkdir -p "$DEST"
for f in "$SOURCE"/*.jpg "$SOURCE"/*.JPG "$SOURCE"/*.jpeg; do
  [ -f "$f" ] || continue
  filename=$(basename "$f")
  sips -Z 2400 -s format jpeg -s formatOptions 80 "$f" --out "$DEST/$filename"
done
```

`sips` is built into macOS — no install needed.

**Or** if you've already dropped uncompressed photos directly into the album folder, compress in-place:

```bash
ALBUM="public/images/albums/Japan"
find "$ALBUM" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r f; do
  sips -Z 2400 -s format jpeg -s formatOptions 80 "$f" --out "$f" 2>/dev/null
done
```

> **Target size check:** `du -sh public/images/albums/` should stay under ~400 MB total for comfortable Vercel deployment (500 MB limit on public assets).

---

## Step 3 — Add / Create the Album Folder

If it's a new album, just create the folder:

```bash
mkdir "public/images/albums/New Album Name"
```

Then move your compressed photos into it. No other config needed — the codegen script discovers it automatically.

---

## Step 4 — Set the Album Cover (Optional)

By default the codegen uses the first photo alphabetically as the album thumbnail on `/projects`. To override:

1. Open the album folder in Finder or the IDE
2. Create a file called `cover.txt`
3. Put just the filename inside (no path, no quotes):

```
DSC07491.jpg
```

That photo becomes the cover thumbnail. Every `generate-gallery-data.mjs` run will respect it.

---

## Step 5 — Run the Codegen Script

```bash
node scripts/generate-gallery-data.mjs
```

This script:
- Scans every folder under `public/images/albums/`
- Reads the real pixel dimensions of each image using `sharp`
- Checks for `cover.txt` in each album and promotes that file to index 0
- Rewrites `src/data/projects.ts` (one `Project` per album, used by `/projects` and `/album/:id`)
- Rewrites `src/data/galleryFeed.ts` (flat list of all photos, used by the landing card stack and `/gallery`)

You'll see output like:

```
Japan — 44 images
  cover → DSC02685.jpg
Lake District — 12 images
...
Done.
  projects.ts   — 27 albums
  galleryFeed.ts — 320 photos
```

**Do not hand-edit `projects.ts` or `galleryFeed.ts`** — they're auto-generated and will be overwritten next time you run the script.

---

## Step 6 — Verify in the Browser

With `npm run dev` running:

| What to check | URL |
|---|---|
| New album appears with correct cover | `/projects` |
| Album photos display correctly (portrait + landscape) | `/album/<slug>` |
| New photos appear in the infinite scroll | `/` (landing) |
| New photos appear in the masonry gallery | `/gallery` |

The album slug is the folder name lowercased with spaces replaced by hyphens. Example: `Blue Ridge` → `/album/blue-ridge`.

---

## Step 7 — Commit

```bash
git add public/images/albums/ src/data/projects.ts src/data/galleryFeed.ts
git commit -m "feat: add <Album Name> album (<N> photos)"
```

---

## Adding to an Existing Album

Same process — just skip the folder creation step. Drop photos into the existing album folder, compress if needed, and re-run the codegen. The script picks up all new files automatically.

---

## Removing a Photo

1. Delete the file from the album folder
2. If it was the `cover.txt` photo, update `cover.txt` to a new filename
3. Re-run `node scripts/generate-gallery-data.mjs`

---

## Removing an Album

1. Delete the folder from `public/images/albums/`
2. Re-run `node scripts/generate-gallery-data.mjs`

---

## Landing Page Hero Pool

The landing page hero images (the blurred rotating background behind the album glow) live in `public/images/landing/` and are **curated separately** — they are not pulled from the album folders. To add or change landing hero images, drop files into `public/images/landing/` and `public/images/landing-blur/` directly and update `src/data/landingImages.ts` if that data file is used.

---

## Reference — Scripts

| Script | Purpose |
|---|---|
| `node scripts/generate-gallery-data.mjs` | Regenerate `projects.ts` + `galleryFeed.ts` from album folders |
| `scripts/compress-images.mjs` | Batch compress (uses sharp — alternative to the sips one-liner) |
| `scripts/gen-landing-images.mjs` | Regenerate landing hero pool thumbnails |
| `scripts/gen-blur-thumbs.mjs` | Regenerate blur placeholders |

---

## Notes for a Future Claude Session

- **Data files are auto-generated.** `src/data/projects.ts` and `src/data/galleryFeed.ts` are outputs of `generate-gallery-data.mjs`. Never edit them manually.
- **Image URLs with spaces work.** `getImageUrl()` in `src/utils/imageLoader.ts` encodes path segments with `encodeURIComponent`, so album names like `Blue Ridge` resolve correctly.
- **Real dimensions matter.** The codegen reads actual pixel width/height via `sharp` so Next.js Image renders correct aspect ratios. This is why landscape and portrait photos both render properly in the masonry grids.
- **The card stack on the landing page** (`LayeredGallery`) reads from `galleryFeed` and shows one photo at a time — it handles any number of photos with no performance cost since only 3 cards are in the DOM at once.
- **The `/gallery` page** uses Intersection Observer to load 24 photos at a time as the user scrolls — no virtualization library, just a sentinel div.
- **Albums page (`/projects`)** uses `project.images[0]` as the thumbnail — the codegen puts the `cover.txt` file first when present.
