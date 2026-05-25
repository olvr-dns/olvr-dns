# olvr's marketplace

A static storefront for Adopt Me pet trading. No backend, no database — everything runs in the browser using `localStorage`.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing page |
| `shop.html` | Pet browsing grid with search, sort, and rarity filters |
| `pet.html` | Individual pet detail page (image, price, addons, TikTok DM) |
| `admin.html` | Password-protected admin dashboard |

## Getting started

Just open `index.html` in a browser. No build step, no server required.

To host it, push the repo to GitHub and enable **GitHub Pages** (Settings → Pages → Deploy from branch → `main` / `root`).

## Admin panel

Navigate to `admin.html` (or click the faint "admin" link at the bottom of the shop page).

**Default password:** `admin123` — change this immediately after first login via the Settings section.

Passwords are hashed with SHA-256 (Web Crypto API) on first use and stored only in `localStorage`. On first login the plaintext default is automatically upgraded to a hash.

### What you can do in admin

- Edit shop name, TikTok username, currency symbol, and password
- Add pets with name, rarity, variant, price, quantity, and an optional image
- Upload or remove per-pet images (stored as base64 in `localStorage`)
- Toggle pet visibility without deleting
- Edit any field inline — saves on blur
- Delete pets

## Data storage

All data lives in the visitor's `localStorage` under two keys:

- `adoptme_settings` — shop config
- `adoptme_pets` — pet listings

Images are stored as base64 data URLs. Because `localStorage` has a ~5 MB limit, avoid uploading very large images — resize them before uploading if needed.

## Customising defaults

Edit `data.js` to change the default pet listings (`DEFAULT_PETS`) or default settings (`DEFAULT_SETTINGS`). Changes only apply to browsers that haven't visited before (or after clearing `localStorage`).
