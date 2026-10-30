# Bon Voyage Braderie

Self-contained static page at `/braderie/`. No build step, dependencies, or changes to the professional website. Nothing is published until the repository’s publishing branch is updated.

## Preview

From the repository root, run `python3 -m http.server 8000`, then visit http://localhost:8000/braderie/. Opening the HTML directly will not load the JSON file. Stop the server with Ctrl+C.

## Add or update items

Edit `items.json`; no HTML edits are necessary. Each item has a permanent unique `id`, `name`, numeric euro `price` (0 means Free), `description`, `category`, `status` (`available`, `reserved`, or `sold`), optional `availability`, and `photos` array. Keep IDs stable so direct links such as `/braderie/#lagrange-pizza-oven` keep working.

Store web-sized photos in `images/<item-id>/`. Each photo entry looks like:

```json
{"src": "images/lagrange-pizza-oven/01.webp", "alt": "Pizza oven open with its pizza stone", "width": 1200, "height": 900}
```

The first photo is the main image. All photos stay inside the card; swipe, use arrows/dots, or focus the gallery and use left/right keys. Images are lazy-loaded and displayed without cropping. For mixed photo orientations, a neutral surround preserves the whole object; crop and straighten actual photos thoughtfully before export to reduce empty space.

Conversational workflow: supply photos (attachments or local file paths), price, known condition, and pickup timing. Codex can choose the lead photo, make optimized WebP/JPEG copies (roughly 1000–1200px wide, targeting 100–250KB each), and add the listing. Keep full-resolution originals outside this public repository; don't commit private photographs or metadata. Descriptions should only use supplied facts. Review before pushing.

## Publishing

The repository contains a root `index.html` and `CNAME` (`jennifer-bertrand.com`) with no build configuration or Actions workflow. A GitHub Pages deployment serving this repository root will serve `braderie/index.html` at https://jennifer-bertrand.com/braderie/ and its relative assets automatically. Confirm the configured branch/folder in GitHub Settings → Pages before merging/pushing; local files alone cannot verify remote Pages settings. Leave the root website and CNAME unchanged. The page includes `noindex, nofollow`; this discourages indexing but does not restrict access.

## Prototype status

The pizza oven listing includes five optimized JPEG photos, with IMG_7417 as the lead image. The gallery uses a 3:4 portrait frame, preserving complete photos, including landscape shots. Original files remain outside the repository. WhatsApp instructions use names only; no phone numbers or contact links have been invented.
