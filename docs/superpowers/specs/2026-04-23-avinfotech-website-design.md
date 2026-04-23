# AV Infotech — Website Design Spec

**Date:** 2026-04-23
**Domain:** avinfotechsolutions.in
**Repository:** git@github.com:santoshray02/avinfotech.git
**Deploy target:** GitHub Pages + custom domain
**Status:** Pending user approval

## 1. Context

AV Infotech is a proprietorship registered in Bhopal, Madhya Pradesh (GSTIN 23GLJPD1335K1Z9, legal name Aashirwad Dubey, trade name AV INFOTECH, effective 19 Nov 2025). The business targets **government and public-sector contracts** as its primary market and offers three services:

1. AI consulting & strategy
2. Generative AI / chatbots / RAG / agent solutions
3. Custom software development (web & mobile)

The website at `avinfotechsolutions.in` is the company's public brochure, credibility surface for RFP responses, and primary lead-capture channel.

## 2. Goals

- **Signal trust and authority** to government procurement officers who will vet the vendor before an RFP invitation.
- **Communicate capability** across the three service lines with enough depth to answer "can they actually deliver this?".
- **Capture inbound leads** via a Contact / Request-Proposal CTA reachable from every page.
- **Be maintainable by a non-developer** — adding a blog post or case study should be a single Markdown commit.
- **Launch fast, operate cheap** — static site on GitHub Pages, no ongoing hosting cost.

## 3. Non-goals

- No authenticated dashboard, customer portal, or app-like functionality.
- No CMS UI — content is edited as Markdown in the repo.
- No dynamic backend (contact form submission uses `mailto:` with optional Formspree upgrade later).
- No e-commerce, payments, or transactional flows.
- No multilingual content at launch (Hindi/English can be added later via Astro i18n).

## 4. Information architecture

**Top-level nav (5 items):** About · Services ▾ · Capabilities · Work ▾ · Company ▾
**Persistent CTA:** "Request a Proposal" button in header (right-aligned) on all pages.
**Footer:** address, GST number, email, phone, socials, sitemap, copyright.

| Page | Route | Purpose |
|---|---|---|
| Home | `/` | Hero + 3-service grid + trust strip + proof points + CTA band |
| About | `/about` | Founder story, mission, Bhopal presence, registration credentials |
| AI Consulting | `/services/ai-consulting` | Problem → offering → deliverables → who it's for → engagement model |
| Generative AI | `/services/generative-ai` | Same structure |
| Custom Software | `/services/custom-software` | Same structure |
| Capabilities | `/capabilities` | Delivery methodology, compliance (IT Act, data residency), tech stack, SLAs |
| Case Studies | `/case-studies` + `/case-studies/[slug]` | Empty state at launch; Markdown-driven |
| Certifications | `/certifications` | GST cert (visible), MSME / Startup India placeholders |
| Team | `/team` | Founder card; "we're hiring" hook |
| Careers | `/careers` | Culture blurb; "no open roles" state; careers@ mailto |
| Blog | `/blog` + `/blog/[slug]` | Markdown-driven; 1 seed post at launch |
| Contact | `/contact` | Form (mailto fallback), full address, GMaps embed, RFP CTA |

Services and Work use grouped dropdowns; Company groups Team + Careers + Blog.

## 5. Visual system

**Palette:**

| Token | Hex | Usage |
|---|---|---|
| ink-navy | `#0F172A` | Primary text, logo ink, dark surfaces |
| saffron | `#EA580C` | Primary accent, CTAs, links |
| saffron-warm | `#F59E0B` | Logo gradient secondary, hover states |
| sand | `#FEF3C7` | Highlight bands, soft section backgrounds |
| canvas | `#F8FAFC` | Default section backgrounds |
| white | `#FFFFFF` | Cards, body |
| slate | `#64748B` | Secondary text |
| border | `#E2E8F0` | Dividers, card borders |

**Typography:**
- Headings / body: **Inter** (400, 500, 600, 700, 800) — self-hosted via `@fontsource/inter`
- Technical / code / GST numbers: **JetBrains Mono** — self-hosted via `@fontsource/jetbrains-mono`
- Fluid type scale: body `16px → 17px`, H1 `clamp(2rem, 4vw, 3rem)`, H2 `clamp(1.5rem, 3vw, 2.25rem)`
- Eyebrow labels: Inter 600, uppercase, tracking-[0.15em], 12px

**Logo (Option A — Monogram + Wordmark):**
- Rounded saffron tile (12px radius, gradient `#EA580C → #F59E0B`) with white "AV" monogram, Inter 800.
- Wordmark "AV INFOTECH" in Ink Navy, Inter 800.
- Tagline "AI · SOFTWARE · CONSULTING" in Slate, Inter 500, 10px, tracking-[2px].
- Delivered as: `logo.svg` (light bg), `logo-dark.svg` (reverse for dark surfaces), `logo-mark.svg` (icon-only 60px/28px/16px — favicon, apple-touch-icon).
- Favicon: `favicon.svg` (SVG primary) + `favicon-32.png` fallback + `apple-touch-icon.png` 180×180.

**Component inventory:**
- Buttons — primary (saffron fill), secondary (navy outline), ghost
- Service card — icon tile + title + description + "Learn more →"
- Trust strip — GST / Bhopal / MSME badges as horizontal row
- Hero — sand-gradient background, eyebrow pill, H1 with saffron accent word, two CTAs
- CTA band — full-bleed navy section with contrast CTA
- FAQ accordion — CSS-only `<details>` element
- Contact form — labeled inputs, saffron submit
- Nav — sticky header, mobile hamburger drawer

## 6. Tech stack

- **Framework:** [Astro](https://astro.build) v4+ (static output)
- **Styling:** Tailwind CSS v3 via `@astrojs/tailwind`
- **Content:** Astro Content Collections with Zod schemas
- **Icons:** `lucide-astro` (tree-shakeable SVG icons)
- **Fonts:** `@fontsource/inter`, `@fontsource/jetbrains-mono` (self-hosted)
- **Sitemap:** `@astrojs/sitemap`
- **No client JS** except mobile-nav toggle and optional lightweight form handling.

**Rationale:** Astro ships zero JS by default, produces plain static HTML ideal for GitHub Pages, supports Markdown content collections for blog/case-studies/services, and keeps the editing workflow friendly for a non-developer (add a `.md`, commit).

## 7. Repository layout

```
avinfotech/
├── astro.config.mjs          # site: https://avinfotechsolutions.in
├── tailwind.config.mjs       # theme tokens + Inter / JetBrains Mono
├── package.json
├── .github/workflows/deploy.yml
├── docs/superpowers/specs/   # this doc lives here
├── public/
│   ├── CNAME                 # avinfotechsolutions.in
│   ├── robots.txt
│   ├── favicon.svg
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   └── og-default.png
└── src/
    ├── assets/
    │   ├── logo.svg
    │   ├── logo-dark.svg
    │   └── logo-mark.svg
    ├── layouts/
    │   ├── BaseLayout.astro  # head + header + footer + SEO
    │   └── PostLayout.astro
    ├── components/
    │   ├── Header.astro, Nav.astro, Footer.astro
    │   ├── Hero.astro, ServiceCard.astro, TrustStrip.astro
    │   ├── CTABand.astro, FAQ.astro, ContactForm.astro
    │   └── SEO.astro
    ├── content/
    │   ├── config.ts
    │   ├── services/
    │   │   ├── ai-consulting.md
    │   │   ├── generative-ai.md
    │   │   └── custom-software.md
    │   ├── case-studies/.gitkeep
    │   └── blog/welcome-to-av-infotech.md
    └── pages/
        ├── index.astro
        ├── about.astro
        ├── capabilities.astro
        ├── team.astro
        ├── careers.astro
        ├── contact.astro
        ├── certifications.astro
        ├── services/[slug].astro
        ├── case-studies/index.astro
        ├── case-studies/[slug].astro
        ├── blog/index.astro
        └── blog/[slug].astro
```

## 8. Contact details (source of truth)

- **Legal name:** Aashirwad Dubey
- **Trade name:** AV INFOTECH
- **GSTIN:** 23GLJPD1335K1Z9
- **Constitution:** Proprietorship
- **Registration date:** 19 November 2025
- **Address:** Plot No. 4, Lake View Society, Bal Bharti School, Ratibad Road, Neelbad, Bhopal, Madhya Pradesh — 462044
- **Email:** hello@avinfotechsolutions.in
- **Mobile:** +91 91794 32212
- **Careers mailto:** careers@avinfotechsolutions.in
- **Social handles:** placeholder (to add later)

## 9. SEO & metadata

- Per-page `<title>` and `<meta name="description">`, 50–60 / 150–160 char targets.
- Open Graph + Twitter card tags, default OG image `/og-default.png` (1200×630).
- JSON-LD structured data:
  - `Organization` schema on every page (name, logo, url, sameAs)
  - `LocalBusiness` schema on Home + Contact (address, geo, telephone, openingHours)
  - `BlogPosting` schema on blog posts
- `sitemap.xml` via `@astrojs/sitemap`
- `robots.txt` — allow all; point to sitemap
- Canonical URLs on every page

## 10. Performance targets

- Lighthouse (mobile): Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- First Contentful Paint < 1.5 s on fast 3G
- Total page weight < 300 KB for landing pages (excluding images)
- Zero render-blocking third-party JS

## 11. Accessibility

- Semantic HTML (`<main>`, `<nav>`, `<section>`, `<article>`)
- Visible focus rings on all interactive elements
- Min 4.5:1 text contrast (saffron on white measured; body text uses ink-navy or slate)
- `prefers-reduced-motion` respected for transitions
- All images have descriptive alt text
- Forms: label + `aria-describedby` for error states; native validation

## 12. Deployment

**GitHub Actions workflow** (`.github/workflows/deploy.yml`):

- Triggered on push to `main`
- Node 20, `npm ci`, `npm run build`
- Uploads `dist/` to `actions/upload-pages-artifact@v3`
- Deploys via `actions/deploy-pages@v4`

**GitHub Pages setup (one-time, post first push):**

1. Repo Settings → Pages → Source = GitHub Actions
2. Custom domain = `avinfotechsolutions.in`
3. Enforce HTTPS = on
4. `public/CNAME` file shipped in build ensures the custom domain persists across deploys

**DNS (to be configured by user at registrar):**

Option 1 (recommended, covers apex + www):
```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  santoshray02.github.io.
```

Option 2 (if registrar supports ALIAS/ANAME on apex):
```
ALIAS @    santoshray02.github.io.
CNAME www  santoshray02.github.io.
```

Let's Encrypt SSL is provisioned automatically by GitHub Pages after DNS propagates.

## 13. Implementation approach

Frequent commits and pushes to `main` throughout implementation (per user preference). Each meaningful chunk — scaffold, layout, page, content — lands as its own commit with a clear subject line, no `Claude` or `Co-Authored-By` trailers.

Build order (high-level — detailed steps in the implementation plan):

1. Astro scaffold + Tailwind + fonts + base config
2. Logo SVGs + favicon assets
3. BaseLayout + Header + Footer + SEO component
4. Home page (hero, services grid, trust strip, CTA band)
5. Services collection + 3 service detail pages
6. About, Capabilities, Team, Careers, Certifications
7. Blog + Case Studies collections and index/detail pages
8. Contact page + form
9. GitHub Action + CNAME + repo push
10. First deploy; verify Pages build; DNS handoff notes for user

## 14. Open items (defer to user)

- **Founder photo for Team page** — launching with initials-avatar placeholder; user can drop a JPG into `src/assets/team/aashirwad.jpg` later.
- **Real MSME / Startup India certification numbers** — using "Coming soon" placeholders on Certifications page.
- **Social handles** (LinkedIn, X, etc.) — footer links will be added when user provides URLs.
- **Formspree / Web3Forms upgrade** — starting with `mailto:` form; swap in ~10 minutes when a real endpoint is wanted.
- **GA4 / Plausible analytics** — not wired up at launch. User should decide.
