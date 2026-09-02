# CMF Title

Website for CMF Title — an independent, WFG-underwritten title agency based in Fort Mill, SC,
serving residential and commercial title insurance across South and North Carolina.

Static site, Apple-inspired aesthetic: floating dynamic imagery with mouse parallax, glassmorphic
chips, gradient-mesh backgrounds, scroll-reveal motion, a sticky glass navbar, and a county marquee.
No build step, no dependencies.

## Brand
| Token | Value | Use |
| --- | --- | --- |
| Deep Blue | `#124278` | Primary brand |
| Blue Lift | `#1d5da3` | Gradient mid / links |
| Sage Green | `#5b7672` | Secondary accent, checkmarks |
| Navy | `#0b2340` | Footer, dark bands |

## Structure
- `index.html` — Home (hero, stats, county marquee, services, how it works, why us, WFG, CTA)
- `services.html` — Residential & Land, Closing, Commercial + FAQ accordion
- `homeowners.html` — Buyers, Sellers, Title Insurance 101, coverage, cost
- `contact.html` — Contact cards + mailto form
- `assets/css/style.css` — design system
- `assets/js/main.js` — nav, scroll reveal, count-up, accordion, parallax, form
- `assets/img/` — optimized imagery + logo
- `_headers` — Cloudflare Pages cache & security headers
- `robots.txt`, `sitemap.xml` — SEO

## Contact details (single source of truth)
Change these four strings site-wide if anything moves:
- Phone: `704-467-3031` (link form: `tel:7044673031`)
- Email: `orders@cmftitle.com`
- Location: Fort Mill, SC
- Rate calculator: `https://rates.wfgnationaltitle.com/`

## Swapping in the real logo
The current mark is a placeholder wordmark built in the brand colors.
Replace these two files, keeping the same filenames, and the whole site updates:
- `assets/img/logo.svg` — dark version (used on light backgrounds / scrolled navbar)
- `assets/img/logo-white.svg` — white version (used on dark hero / footer)

Using PNGs instead? Drop in `logo.png` / `logo-white.png` and run:
```
sed -i '' 's|logo.svg|logo.png|g; s|logo-white.svg|logo-white.png|g' *.html
```
Favicon lives at `assets/img/favicon.png`.

## Run locally
```
python3 -m http.server 8000
```
Then visit http://localhost:8000

## Deploy — Cloudflare Workers (Static Assets)

Configured in `wrangler.jsonc` as an assets-only Worker named `cmf-title`.
No build step; the repo root is the asset directory, and `.assetsignore` keeps
`.git`, `_unused`, the README and the source logo out of the upload.

Deploy from this folder:
```
npx wrangler@latest deploy
```

First time on a new machine, authenticate once with `npx wrangler login`.

### Custom domain
After the first deploy, in the Cloudflare dashboard:
Workers & Pages -> `cmf-title` -> Settings -> Domains & Routes -> Add custom domain
-> `cmftitle.com` and `www.cmftitle.com`.

### Auto-deploy on push (optional)
Workers & Pages -> `cmf-title` -> Settings -> Build -> Connect a repository
-> `AaronPilk/CMF-title`. Leave the build command empty; deploy command
`npx wrangler deploy`.

## Pages
- `index.html`, `services.html`, `homeowners.html`, `contact.html`
- `404.html` — served for unmatched routes (`not_found_handling: "404-page"`)
