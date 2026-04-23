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

## DNS setup (custom domain)

To point `avinfotechsolutions.in` at this site, configure the following at your domain registrar:

**Option A — Apex with A records (works everywhere):**

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  santoshray02.github.io.
```

**Option B — Apex via ALIAS/ANAME (if registrar supports it):**

```
ALIAS @    santoshray02.github.io.
CNAME www  santoshray02.github.io.
```

After DNS propagates (usually 15–60 minutes), GitHub Pages will provision a Let's Encrypt certificate automatically. Enable "Enforce HTTPS" in Settings → Pages.

## GitHub Pages settings (one-time)

- Repo Settings → Pages → Source = **GitHub Actions**
- Custom domain = `avinfotechsolutions.in`
- **Enforce HTTPS** = on
