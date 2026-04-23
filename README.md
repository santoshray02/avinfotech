# AV Infotech — avinfotechsolutions.in

Public website for **AV Infotech**, a Bhopal-based AI and software company.

- **GSTIN:** 23GLJPD1335K1Z9
- **Domain:** https://avinfotechsolutions.in
- **Stack:** Astro + Tailwind CSS, deployed via GitHub Pages

## Local development

```bash
npm install
npm run dev
```

Site runs at http://localhost:4321

## Build

```bash
npm run build
npm run preview
```

## Deploy

Push to `main`. GitHub Actions builds and deploys to GitHub Pages automatically. Custom domain is configured via `public/CNAME`.

## Content

- Blog posts: `src/content/blog/*.md`
- Case studies: `src/content/case-studies/*.md`
- Service descriptions: `src/content/services/*.md`

Add a new post: drop a Markdown file in the relevant directory with the required frontmatter and commit.

## Design spec

See [docs/superpowers/specs/2026-04-23-avinfotech-website-design.md](docs/superpowers/specs/2026-04-23-avinfotech-website-design.md).
