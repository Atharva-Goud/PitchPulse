# Sample news images

Drop sample football news images into this folder — any filename with a
common image extension (jpg, png, webp, gif, avif, bmp, svg) counts.

`src/lib/utils/image.ts` deterministically maps each article to one of these
files by hashing the article id, so every article gets a relevant photo and
the same article always maps to the same image across syncs. If the folder is
empty, `NewsCard` falls back to its initials placeholder instead of showing a
broken-image icon.

Run `npm run sync:news` after adding or removing images —
`src/scripts/update-news-image-count.ts` rewrites the count automatically.