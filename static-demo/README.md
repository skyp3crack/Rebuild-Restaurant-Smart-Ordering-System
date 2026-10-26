# Smart Restaurant Ordering System: Static Demo

A browser-only version of the [Laravel app](../smart-restaurant) that can be hosted on any static host (Vercel, Netlify, GitHub Pages). It has the same screens, markup and Tailwind styling as the Blade views, but there is no PHP, database or server: the data lives in the visitor's own browser.

## What is included

| Area | Pages / behaviour | Laravel original |
|------|-------------------|------------------|
| Landing | `/` with Log in / Register or Dashboard link | `welcome.blade.php` |
| Customer ordering | `/table/{n}`: menu grouped by category (available items only), add / `+` / `-`, cart total, special instructions (500 chars), checkout | `OrderController` + `customer/menu.blade.php` |
| Kitchen | `/kitchen`: pending orders oldest first, items, notes, **Mark as Completed**, refresh. Updates by itself when an order is placed in another tab | `OrderController@kitchen` |
| Menu management | `/menu`: list, create, edit, delete (confirm), image upload, availability (sold out) | `MenuItemController` |
| Categories | `/categories`: list, create, edit, delete (removes its items, like `cascadeOnDelete`) | `CategoryController` |
| Authentication | login, remember me, register, forgot / reset password, confirm password, verify email, logout, redirect to the page you asked for | Laravel Breeze |
| Profile | update name and email, change password, delete account (password confirmation modal) | `ProfileController` |

Validation rules and messages mirror Laravel's (for example `The price field must be at least 0.`).

## Demo account

| Email | Password |
|-------|----------|
| `test@example.com` | `password` |

The database is seeded with 4 categories, 13 menu items (one sold out) and a few orders. **Reset demo data** in the top bar restores it.

## How it differs from the real app

- **Storage:** `localStorage` replaces SQLite, `sessionStorage` replaces the session (login and carts). Data is per browser and is never shared.
- **Images:** uploads are resized to 480 px and stored as data URLs instead of `storage/app/public`.
- **Auth:** simulated in the browser (passwords are SHA-256 hashed). It is for demonstration only and is not a security boundary.
- **Email:** a static site cannot send mail, so "forgot password" shows the reset link on the page.
- **Navigation:** Menu, Categories and Kitchen are in the top navigation. The Laravel app only links to the dashboard there.

## Run locally

```bash
cd static-demo
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
npm run preview
```

## Deploy on Vercel

1. Import the repository in Vercel.
2. Set **Root Directory** to `static-demo`. The Vite preset is detected automatically.
3. Deploy. `vercel.json` rewrites every path to `index.html`, so links such as `/table/5` work when opened directly (for example from a QR code).
