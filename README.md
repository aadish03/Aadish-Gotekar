# Aadish Gotekar — Portfolio

A single-page portfolio built with Next.js (App Router), TypeScript, Tailwind v4, GSAP ScrollTrigger and Lenis. The signature section is a scroll-pinned 3D helix of award photos rendered with CSS transforms (no WebGL).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Theme

Light mode is the default. A **Light / Dark** control stays in the bottom-right corner; the choice is stored in `localStorage` under the key `theme` and applied before first paint so there is no flash. The OS colour-scheme preference is ignored on purpose so a first visit is always light.

## Build and deploy

```bash
npm run build
npm start
```

The site is fully static and deploys to Vercel with zero configuration (`vercel` or connect the repo). Any Node host that runs `next start` also works.

## Editing content

All copy lives in `lib/content.ts`: identity and links, experience, projects, achievements, publications, skills and the gallery captions. The UI components only read from this file, so résumé updates never touch markup.

## Replacing the award photos

The helix gallery currently uses generated placeholders in `public/gallery/`:

| File | Event |
| --- | --- |
| `sih-2024.svg` | Smart India Hackathon 2024 |
| `moveai.svg` | MoveAI (Aptos) |
| `hack4change.svg` | Hack4Change@Charcha |
| `code4ai.svg` | Code4AI |
| `syntechxathon.svg` | SyntechXathon |
| `dmx.svg` | DMX leadership |

To swap in real photos:

1. Export each photo as JPG or WebP at roughly a 4:5 portrait ratio (800×1000 is plenty).
2. Drop it into `public/gallery/` and update the matching `src` in the `gallery` array in `lib/content.ts` (for example `/gallery/sih-2024.jpg`). Update `alt` and `caption` while you are there.
3. To add or remove frames, add or remove entries in the same array; the helix spacing adapts automatically.

## Accessibility and motion

Every section renders its content without JavaScript. When the OS setting `prefers-reduced-motion: reduce` is on, smooth scroll and GSAP animations are disabled and the helix falls back to a static photo grid with the same captions.
