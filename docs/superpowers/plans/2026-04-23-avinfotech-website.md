# AV Infotech Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the public website for AV Infotech at avinfotechsolutions.in — a static Astro site on GitHub Pages covering 10 sections (Home, About, 3 services, Capabilities, Case Studies, Certifications, Team, Careers, Blog, Contact) with a content-collection-driven blog and case studies.

**Architecture:** Astro v4 static site with file-based routing, Tailwind CSS for styling via design tokens, content collections (Markdown + Zod schemas) for blog/case-studies/services, zero client JS except a mobile-nav toggle. Each page extends a shared `BaseLayout` that renders SEO tags, Header, and Footer. Deployment is automated via a GitHub Actions workflow that builds and publishes `dist/` to GitHub Pages; custom domain is wired via a `public/CNAME` file.

**Tech Stack:** Astro 4, Tailwind CSS 3, @astrojs/tailwind, @astrojs/sitemap, @fontsource/inter, @fontsource/jetbrains-mono, lucide-astro, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-04-23-avinfotech-website-design.md`

**Commit convention:** Each task ends in a commit; after every 2-3 tasks, push to `origin/main`. Subject lines are action-oriented, no Claude / Co-Authored-By trailers.

---

## File Structure

```
avinfotech/
├── astro.config.mjs                      # T1
├── tailwind.config.mjs                   # T2
├── package.json                          # T1
├── tsconfig.json                         # T1
├── .github/workflows/deploy.yml          # T19
├── public/
│   ├── CNAME                             # T19
│   ├── robots.txt                        # T4
│   ├── favicon.svg                       # T3
│   ├── favicon-32.png                    # T3
│   ├── apple-touch-icon.png              # T3
│   └── og-default.png                    # T3
├── src/
│   ├── env.d.ts                          # T1
│   ├── styles/global.css                 # T2
│   ├── assets/
│   │   ├── logo.svg                      # T3
│   │   ├── logo-dark.svg                 # T3
│   │   └── logo-mark.svg                 # T3
│   ├── data/site.ts                      # T4  (single source of truth for contact/legal/brand)
│   ├── layouts/
│   │   ├── BaseLayout.astro              # T4
│   │   └── PostLayout.astro              # T16, T17
│   ├── components/
│   │   ├── SEO.astro                     # T4
│   │   ├── Header.astro                  # T5
│   │   ├── Nav.astro                     # T5
│   │   ├── Footer.astro                  # T6
│   │   ├── Hero.astro                    # T7
│   │   ├── ServiceCard.astro             # T8
│   │   ├── TrustStrip.astro              # T8
│   │   ├── CTABand.astro                 # T8
│   │   ├── FAQ.astro                     # T12
│   │   └── ContactForm.astro             # T18
│   ├── content/
│   │   ├── config.ts                     # T10
│   │   ├── services/
│   │   │   ├── ai-consulting.md          # T11
│   │   │   ├── generative-ai.md          # T11
│   │   │   └── custom-software.md        # T11
│   │   ├── case-studies/.gitkeep         # T16
│   │   └── blog/
│   │       └── welcome-to-av-infotech.md # T17
│   └── pages/
│       ├── index.astro                   # T7, T8
│       ├── about.astro                   # T9
│       ├── capabilities.astro            # T12
│       ├── certifications.astro          # T13
│       ├── team.astro                    # T14
│       ├── careers.astro                 # T15
│       ├── contact.astro                 # T18
│       ├── services/[slug].astro         # T11
│       ├── case-studies/index.astro      # T16
│       ├── case-studies/[slug].astro     # T16
│       ├── blog/index.astro              # T17
│       └── blog/[slug].astro             # T17
```

---

## Task 1: Astro scaffold + dependencies

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`

- [ ] **Step 1: Initialize npm project**

Run (from repo root):
```bash
npm init -y
```

- [ ] **Step 2: Install Astro and integrations**

```bash
npm install astro@^4 @astrojs/tailwind@^5 @astrojs/sitemap@^3 tailwindcss@^3 @fontsource/inter@^5 @fontsource/jetbrains-mono@^5 lucide-astro@^0.446 --save-exact
```

- [ ] **Step 3: Write `package.json` scripts**

Overwrite `package.json` so the `scripts` block contains:
```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro"
}
```
Also set `"private": true` and `"type": "module"`.

- [ ] **Step 4: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://avinfotechsolutions.in',
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
});
```

- [ ] **Step 5: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 6: Create `src/env.d.ts`**

```ts
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

- [ ] **Step 7: Verify install**

```bash
npx astro --version
```
Expected: prints a version number ≥ `4.0.0`.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/env.d.ts
git commit -m "Scaffold Astro project with Tailwind and sitemap"
```

---

## Task 2: Tailwind theme tokens + global styles + fonts

**Files:**
- Create: `tailwind.config.mjs`, `src/styles/global.css`

- [ ] **Step 1: Create `tailwind.config.mjs`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        'ink-navy': '#0F172A',
        saffron: { DEFAULT: '#EA580C', warm: '#F59E0B', soft: '#FED7AA' },
        sand: '#FEF3C7',
        canvas: '#F8FAFC',
        slate: { DEFAULT: '#64748B', border: '#E2E8F0' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display': ['clamp(2.25rem, 4.5vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h2': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      maxWidth: { content: '72rem', prose: '44rem' },
      borderRadius: { card: '12px' },
      boxShadow: { card: '0 1px 2px rgba(15,23,42,.04), 0 4px 12px rgba(15,23,42,.04)' },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Create `src/styles/global.css`**

```css
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';
@import '@fontsource/inter/800.css';
@import '@fontsource/jetbrains-mono/400.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { @apply antialiased; scroll-behavior: smooth; }
  body { @apply bg-white text-ink-navy font-sans text-[16px] leading-relaxed; }
  ::selection { @apply bg-saffron/20 text-ink-navy; }
  :focus-visible { @apply outline-2 outline-offset-2 outline-saffron; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center gap-2 bg-saffron text-white font-semibold px-5 py-2.5 rounded-md hover:bg-saffron-warm transition-colors;
  }
  .btn-secondary {
    @apply inline-flex items-center gap-2 border-[1.5px] border-ink-navy text-ink-navy font-semibold px-5 py-2.5 rounded-md hover:bg-ink-navy hover:text-white transition-colors;
  }
  .eyebrow {
    @apply text-xs font-semibold uppercase tracking-[0.15em] text-slate;
  }
  .section { @apply max-w-content mx-auto px-6 md:px-8 py-16 md:py-24; }
  .prose-invert h1, .prose-invert h2, .prose-invert h3 { @apply text-white; }
}
```

- [ ] **Step 3: Smoke test build config**

Temporarily create `src/pages/_tmp.astro`:
```astro
---
import '../styles/global.css';
---
<html><body class="bg-canvas"><h1 class="text-display">tmp</h1></body></html>
```
Run: `npm run build`
Expected: build succeeds, `dist/_tmp/index.html` exists.

- [ ] **Step 4: Remove the smoke test**

Delete `src/pages/_tmp.astro` and `dist/`.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.mjs src/styles/global.css
git commit -m "Add Tailwind theme tokens, global styles, self-hosted fonts"
git push
```

---

## Task 3: Logo SVGs and favicon assets

**Files:**
- Create: `src/assets/logo.svg`, `src/assets/logo-dark.svg`, `src/assets/logo-mark.svg`, `public/favicon.svg`, `public/favicon-32.png` (placeholder), `public/apple-touch-icon.png` (placeholder), `public/og-default.png` (placeholder)

- [ ] **Step 1: Write `src/assets/logo.svg` (full lock-up, light backgrounds)**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 70" role="img" aria-label="AV Infotech">
  <defs>
    <linearGradient id="avg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>
  <rect x="2" y="5" width="60" height="60" rx="12" fill="url(#avg)"/>
  <text x="32" y="48" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="26" fill="#fff">AV</text>
  <text x="76" y="38" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="20" fill="#0F172A" letter-spacing="0.3">AV INFOTECH</text>
  <text x="76" y="56" font-family="Inter,Arial,sans-serif" font-weight="500" font-size="10" fill="#64748B" letter-spacing="2">AI · SOFTWARE · CONSULTING</text>
</svg>
```

- [ ] **Step 2: Write `src/assets/logo-dark.svg` (reverse for dark surfaces — white wordmark)**

Same structure but change `fill="#0F172A"` on the wordmark to `fill="#FFFFFF"` and the tagline `fill="#64748B"` to `fill="#CBD5E1"`.

- [ ] **Step 3: Write `src/assets/logo-mark.svg` (icon-only, square)**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="AV Infotech">
  <defs>
    <linearGradient id="avg2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="12" fill="url(#avg2)"/>
  <text x="32" y="43" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="28" fill="#fff">AV</text>
</svg>
```

- [ ] **Step 4: Write `public/favicon.svg`**

Copy the exact content of `logo-mark.svg` to `public/favicon.svg` (same icon).

- [ ] **Step 5: Add PNG placeholders**

For `public/favicon-32.png`, `public/apple-touch-icon.png`, `public/og-default.png`:
write tiny valid 1×1 PNG placeholders (transparent) so references don't 404. Create a script `scripts/gen-placeholders.mjs`:
```js
import { writeFileSync } from 'node:fs';
// 1x1 transparent PNG
const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const buf = Buffer.from(b64, 'base64');
for (const p of ['public/favicon-32.png', 'public/apple-touch-icon.png', 'public/og-default.png']) {
  writeFileSync(p, buf);
}
console.log('placeholders written');
```
Run: `node scripts/gen-placeholders.mjs`
Expected: `placeholders written`.

Note: replace with real assets before production launch — task deferred to user.

- [ ] **Step 6: Commit**

```bash
git add src/assets public/favicon.svg public/favicon-32.png public/apple-touch-icon.png public/og-default.png scripts/gen-placeholders.mjs
git commit -m "Add logo SVGs and favicon/OG placeholder assets"
```

---

## Task 4: Site data + BaseLayout + SEO + robots.txt

**Files:**
- Create: `src/data/site.ts`, `src/components/SEO.astro`, `src/layouts/BaseLayout.astro`, `public/robots.txt`

- [ ] **Step 1: Write `src/data/site.ts`**

```ts
export const site = {
  name: 'AV Infotech',
  legalName: 'Aashirwad Dubey',
  tradeName: 'AV INFOTECH',
  gstin: '23GLJPD1335K1Z9',
  url: 'https://avinfotechsolutions.in',
  email: 'hello@avinfotechsolutions.in',
  careersEmail: 'careers@avinfotechsolutions.in',
  phone: '+91 91794 32212',
  phoneHref: '+919179432212',
  tagline: 'AI · Software · Consulting',
  description:
    'Trusted technology partner for government and public-sector institutions. AI consulting, generative AI, and custom software — secure, compliant, made in India.',
  address: {
    street: 'Plot No. 4, Lake View Society, Bal Bharti School, Ratibad Road',
    locality: 'Neelbad',
    city: 'Bhopal',
    region: 'Madhya Pradesh',
    postalCode: '462044',
    country: 'IN',
  },
  registrationDate: '2025-11-19',
  social: {
    linkedin: '', twitter: '', github: '',
  },
} as const;

export const nav = [
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services/ai-consulting',
    children: [
      { label: 'AI Consulting', href: '/services/ai-consulting' },
      { label: 'Generative AI', href: '/services/generative-ai' },
      { label: 'Custom Software', href: '/services/custom-software' },
    ],
  },
  { label: 'Capabilities', href: '/capabilities' },
  {
    label: 'Work',
    href: '/case-studies',
    children: [
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Certifications', href: '/certifications' },
    ],
  },
  {
    label: 'Company',
    href: '/about',
    children: [
      { label: 'Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
    ],
  },
];
```

- [ ] **Step 2: Write `src/components/SEO.astro`**

```astro
---
import { site } from '../data/site';
export interface Props {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}
const {
  title,
  description = site.description,
  image = '/og-default.png',
  type = 'website',
  noindex = false,
} = Astro.props;
const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`;
const url = new URL(Astro.url.pathname, site.url).toString();
const imageUrl = new URL(image, site.url).toString();

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: new URL('/favicon.svg', site.url).toString(),
  email: site.email,
  telephone: site.phone,
  taxID: site.gstin,
  foundingDate: site.registrationDate,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
};
---
<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={url} />
{noindex && <meta name="robots" content="noindex, nofollow" />}

<meta property="og:type" content={type} />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={url} />
<meta property="og:image" content={imageUrl} />
<meta property="og:site_name" content={site.name} />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={imageUrl} />

<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

<script type="application/ld+json" set:html={JSON.stringify(orgSchema)} />
```

- [ ] **Step 3: Write `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import SEO from '../components/SEO.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
export interface Props {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}
const props = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <SEO {...props} />
  </head>
  <body class="flex min-h-screen flex-col">
    <Header />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

Header and Footer don't exist yet — build will fail until T5/T6. That's fine, we're laying pipe.

- [ ] **Step 4: Write `public/robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://avinfotechsolutions.in/sitemap-index.xml
```

- [ ] **Step 5: Commit**

```bash
git add src/data/site.ts src/components/SEO.astro src/layouts/BaseLayout.astro public/robots.txt
git commit -m "Add site data, SEO component, BaseLayout shell, robots.txt"
```

---

## Task 5: Header + Nav with mobile drawer

**Files:**
- Create: `src/components/Header.astro`, `src/components/Nav.astro`

- [ ] **Step 1: Write `src/components/Nav.astro`**

```astro
---
import { nav } from '../data/site';
const path = Astro.url.pathname;
const isActive = (href: string) =>
  href === '/' ? path === '/' : path.startsWith(href.split('/').slice(0, 2).join('/'));
---
<ul class="hidden lg:flex items-center gap-1">
  {nav.map((item) => (
    <li class="relative group">
      <a
        href={item.href}
        class={`px-3 py-2 text-sm font-medium rounded-md hover:text-saffron transition-colors ${
          isActive(item.href) ? 'text-saffron' : 'text-ink-navy'
        }`}
      >
        {item.label}{item.children && <span aria-hidden="true" class="ml-1">▾</span>}
      </a>
      {item.children && (
        <div class="absolute left-0 top-full pt-1 hidden group-hover:block group-focus-within:block">
          <ul class="min-w-[220px] bg-white shadow-card rounded-md border border-slate-border p-2">
            {item.children.map((c) => (
              <li>
                <a href={c.href} class="block px-3 py-2 text-sm rounded hover:bg-canvas text-ink-navy hover:text-saffron">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  ))}
</ul>

<!-- Mobile drawer -->
<button
  id="mobile-nav-toggle"
  class="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-slate-border"
  aria-label="Toggle navigation"
  aria-expanded="false"
  aria-controls="mobile-nav"
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
</button>

<nav id="mobile-nav" class="hidden lg:hidden fixed inset-x-0 top-16 bg-white border-t border-slate-border shadow-card">
  <ul class="flex flex-col p-4 gap-1">
    {nav.map((item) => (
      <li>
        <a href={item.href} class="block px-3 py-2 text-base font-semibold text-ink-navy hover:text-saffron">
          {item.label}
        </a>
        {item.children && (
          <ul class="pl-4 border-l border-slate-border ml-3">
            {item.children.map((c) => (
              <li><a href={c.href} class="block px-2 py-1.5 text-sm text-slate hover:text-saffron">{c.label}</a></li>
            ))}
          </ul>
        )}
      </li>
    ))}
    <li class="mt-2"><a href="/contact" class="btn-primary w-full justify-center">Request a Proposal →</a></li>
  </ul>
</nav>

<script>
  const toggle = document.getElementById('mobile-nav-toggle');
  const nav = document.getElementById('mobile-nav');
  toggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('hidden') === false;
    toggle.setAttribute('aria-expanded', String(open));
  });
</script>
```

- [ ] **Step 2: Write `src/components/Header.astro`**

```astro
---
import { site } from '../data/site';
import Nav from './Nav.astro';
import logo from '../assets/logo.svg?raw';
---
<header class="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-border">
  <div class="max-w-content mx-auto px-6 md:px-8 h-16 flex items-center justify-between gap-4">
    <a href="/" class="flex items-center" aria-label={site.name}>
      <span class="block h-9" set:html={logo} />
    </a>
    <div class="flex items-center gap-3">
      <Nav />
      <a href="/contact" class="hidden lg:inline-flex btn-primary">Request Proposal →</a>
    </div>
  </div>
</header>
```

- [ ] **Step 3: Verify build**

Create a minimal `src/pages/index.astro` temporarily (will be replaced in T7):
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Home"><div class="section"><h1 class="text-display">Hello</h1></div></BaseLayout>
```
Run: `npm run build`
Expected: build succeeds; `dist/index.html` contains the logo SVG and nav.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/components/Header.astro src/pages/index.astro
git commit -m "Add sticky Header with desktop dropdown nav and mobile drawer"
```

---

## Task 6: Footer

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write `src/components/Footer.astro`**

```astro
---
import { site } from '../data/site';
const year = new Date().getFullYear();
---
<footer class="bg-ink-navy text-white mt-24">
  <div class="max-w-content mx-auto px-6 md:px-8 py-14 grid gap-10 md:grid-cols-4">
    <div class="md:col-span-2">
      <div class="flex items-center gap-3 mb-4">
        <svg width="40" height="40" viewBox="0 0 64 64" aria-hidden="true">
          <defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EA580C"/><stop offset="1" stop-color="#F59E0B"/></linearGradient></defs>
          <rect width="64" height="64" rx="12" fill="url(#fg)"/>
          <text x="32" y="43" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800" font-size="28" fill="#fff">AV</text>
        </svg>
        <div>
          <div class="font-extrabold tracking-tight">{site.name}</div>
          <div class="text-xs text-slate-300">{site.tagline}</div>
        </div>
      </div>
      <p class="text-sm text-slate-300 max-w-sm">{site.description}</p>
      <p class="mt-4 font-mono text-xs text-slate-400">GSTIN: {site.gstin}</p>
    </div>

    <div>
      <div class="eyebrow text-slate-300 mb-3">Office</div>
      <address class="not-italic text-sm text-slate-300 leading-6">
        {site.address.street}<br />
        {site.address.locality}, {site.address.city}<br />
        {site.address.region} — {site.address.postalCode}<br />
        {site.address.country === 'IN' ? 'India' : site.address.country}
      </address>
    </div>

    <div>
      <div class="eyebrow text-slate-300 mb-3">Get in touch</div>
      <ul class="text-sm text-slate-300 space-y-2">
        <li><a href={`mailto:${site.email}`} class="hover:text-white">{site.email}</a></li>
        <li><a href={`tel:${site.phoneHref}`} class="hover:text-white">{site.phone}</a></li>
        <li><a href="/contact" class="hover:text-white">Request a proposal →</a></li>
      </ul>
    </div>
  </div>

  <div class="border-t border-white/10">
    <div class="max-w-content mx-auto px-6 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
      <div>© {year} {site.tradeName}. All rights reserved.</div>
      <div class="flex gap-4">
        <a href="/about" class="hover:text-white">About</a>
        <a href="/capabilities" class="hover:text-white">Capabilities</a>
        <a href="/blog" class="hover:text-white">Blog</a>
        <a href="/contact" class="hover:text-white">Contact</a>
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds; `dist/index.html` now renders both the header and footer.

- [ ] **Step 3: Commit + push**

```bash
git add src/components/Footer.astro
git commit -m "Add footer with address, GSTIN, contact links"
git push
```

---

## Task 7: Home page — Hero

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/Hero.astro`**

```astro
---
import { site } from '../data/site';
---
<section class="relative overflow-hidden bg-gradient-to-b from-white to-sand">
  <div aria-hidden="true" class="pointer-events-none absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full"
       style="background: radial-gradient(circle, rgba(234,88,12,0.25) 0%, transparent 70%);"></div>
  <div class="relative max-w-content mx-auto px-6 md:px-8 py-20 md:py-28">
    <span class="inline-flex items-center gap-2 rounded-full bg-white/80 border border-saffron/30 px-3 py-1 text-xs font-semibold tracking-[0.15em] text-amber-900 uppercase backdrop-blur">
      🇮🇳 GST Registered · Bhopal, MP
    </span>
    <h1 class="mt-5 text-display font-extrabold max-w-3xl">
      Building AI &amp; software for <span class="text-saffron">Digital India</span>
    </h1>
    <p class="mt-5 max-w-2xl text-lg text-slate leading-7">
      Trusted technology partner for government departments and public-sector institutions.
      AI consulting, generative AI systems, and custom software — secure, compliant, and made in India.
    </p>
    <div class="mt-8 flex flex-col sm:flex-row gap-3">
      <a href="/contact" class="btn-primary">Request a Proposal →</a>
      <a href="/services/ai-consulting" class="btn-secondary">Our Services</a>
    </div>
    <dl class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
      <div><dt class="eyebrow">Registered</dt><dd class="mt-1 font-semibold text-ink-navy">Nov 2025 · MP</dd></div>
      <div><dt class="eyebrow">Focus</dt><dd class="mt-1 font-semibold text-ink-navy">Gov &amp; Public Sector</dd></div>
      <div><dt class="eyebrow">Delivery</dt><dd class="mt-1 font-semibold text-ink-navy">India-first · Secure</dd></div>
      <div><dt class="eyebrow">GSTIN</dt><dd class="mt-1 font-mono text-sm text-ink-navy">{site.gstin}</dd></div>
    </dl>
  </div>
</section>
```

- [ ] **Step 2: Update `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
---
<BaseLayout>
  <Hero />
</BaseLayout>
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```
Open http://localhost:4321 — verify the hero renders with saffron accent, trust pill, two CTAs, and the 4-item stat grid. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "Add home hero section"
```

---

## Task 8: Home page — Services grid + TrustStrip + CTABand

**Files:**
- Create: `src/components/ServiceCard.astro`, `src/components/TrustStrip.astro`, `src/components/CTABand.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/ServiceCard.astro`**

```astro
---
export interface Props {
  href: string;
  title: string;
  description: string;
  icon: string; // emoji or inline SVG string
}
const { href, title, description, icon } = Astro.props;
---
<a href={href} class="group block rounded-card border border-slate-border bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
  <div class="flex h-10 w-10 items-center justify-center rounded-md bg-sand text-xl" aria-hidden="true">{icon}</div>
  <h3 class="mt-4 text-lg font-bold text-ink-navy">{title}</h3>
  <p class="mt-2 text-sm text-slate leading-6">{description}</p>
  <span class="mt-4 inline-flex items-center text-sm font-semibold text-saffron group-hover:gap-2 transition-[gap]">
    Learn more <span class="ml-1" aria-hidden="true">→</span>
  </span>
</a>
```

- [ ] **Step 2: Write `src/components/TrustStrip.astro`**

```astro
---
import { site } from '../data/site';
const badges = [
  { label: 'GST Registered', value: site.gstin },
  { label: 'Based in', value: `${site.address.city}, ${site.address.region}` },
  { label: 'MSME', value: 'Registration in progress' },
  { label: 'Startup India', value: 'Application in progress' },
];
---
<section class="border-y border-slate-border bg-canvas">
  <div class="max-w-content mx-auto px-6 md:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
    {badges.map((b) => (
      <div>
        <div class="eyebrow">{b.label}</div>
        <div class="mt-1 font-mono text-sm text-ink-navy">{b.value}</div>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Write `src/components/CTABand.astro`**

```astro
---
export interface Props { title?: string; subtitle?: string; ctaHref?: string; ctaLabel?: string }
const {
  title = 'Have an RFP or a project brief?',
  subtitle = 'We respond to government and public-sector enquiries within 24 hours.',
  ctaHref = '/contact',
  ctaLabel = 'Request a Proposal →',
} = Astro.props;
---
<section class="bg-ink-navy text-white">
  <div class="max-w-content mx-auto px-6 md:px-8 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
    <div>
      <h2 class="text-h2 font-extrabold">{title}</h2>
      <p class="mt-2 text-slate-300 max-w-xl">{subtitle}</p>
    </div>
    <a href={ctaHref} class="bg-saffron hover:bg-saffron-warm text-white font-semibold px-6 py-3 rounded-md inline-flex items-center gap-2">{ctaLabel}</a>
  </div>
</section>
```

- [ ] **Step 4: Update `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import TrustStrip from '../components/TrustStrip.astro';
import ServiceCard from '../components/ServiceCard.astro';
import CTABand from '../components/CTABand.astro';

const services = [
  {
    href: '/services/ai-consulting',
    title: 'AI Consulting & Strategy',
    icon: '🧭',
    description:
      'Roadmaps, feasibility studies, and vendor-neutral architecture for AI adoption across departments and workflows.',
  },
  {
    href: '/services/generative-ai',
    title: 'Generative AI & Agents',
    icon: '🤖',
    description:
      'RAG systems, domain chatbots, and AI copilots trained on your data — with guardrails, auditability, and privacy built in.',
  },
  {
    href: '/services/custom-software',
    title: 'Custom Software Development',
    icon: '💻',
    description:
      'Web, mobile, and internal tools delivered end-to-end — from discovery to deployment on secure Indian infrastructure.',
  },
];
---
<BaseLayout>
  <Hero />
  <TrustStrip />

  <section class="section">
    <div class="max-w-prose">
      <div class="eyebrow">What we do</div>
      <h2 class="mt-2 text-h2 font-extrabold">Three services, built for Indian institutions</h2>
      <p class="mt-3 text-slate leading-7">
        We combine AI engineering with software delivery experience to help government and
        public-sector teams ship real, measurable outcomes.
      </p>
    </div>
    <div class="mt-10 grid gap-6 md:grid-cols-3">
      {services.map((s) => <ServiceCard {...s} />)}
    </div>
  </section>

  <CTABand />
</BaseLayout>
```

- [ ] **Step 5: Verify in dev**

`npm run dev` → visit http://localhost:4321 → confirm hero, trust strip, 3 service cards (with hover lift), CTA band, footer all render cleanly on desktop and mobile (DevTools narrow viewport).

- [ ] **Step 6: Commit + push**

```bash
git add src/components/ServiceCard.astro src/components/TrustStrip.astro src/components/CTABand.astro src/pages/index.astro
git commit -m "Home: services grid, trust strip, CTA band"
git push
```

---

## Task 9: About page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Write `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CTABand from '../components/CTABand.astro';
import { site } from '../data/site';
---
<BaseLayout title="About" description="AV Infotech is a Bhopal-based AI and software company focused on delivering compliant, secure systems to India's public institutions.">
  <section class="section">
    <div class="max-w-prose">
      <div class="eyebrow">About</div>
      <h1 class="mt-2 text-h1 font-extrabold">A Bhopal-based team building AI and software that India's public institutions can trust.</h1>
      <p class="mt-6 text-slate leading-7">
        AV Infotech was founded in 2025 with a simple premise: India's government departments and
        public-sector bodies deserve the same quality of AI and software delivery as any global
        enterprise — without the cost, compliance friction, or vendor lock-in that usually comes with it.
      </p>
      <p class="mt-4 text-slate leading-7">
        We combine deep technical execution with an understanding of how public-sector procurement,
        audit, and operations actually work. Whether it's a generative-AI assistant for citizen services,
        a custom portal for a department, or a strategic AI roadmap — we build to ship, measure, and hand over.
      </p>
    </div>
  </section>

  <section class="bg-canvas border-y border-slate-border">
    <div class="max-w-content mx-auto px-6 md:px-8 py-16">
      <div class="eyebrow">Principles</div>
      <h2 class="mt-2 text-h2 font-extrabold">How we work</h2>
      <div class="mt-8 grid gap-6 md:grid-cols-3">
        {[
          { title: 'India-first', body: 'Data residency, procurement norms, and language coverage are defaults, not afterthoughts.' },
          { title: 'Secure by design', body: 'We follow IT Act and sectoral guidelines. Security reviews are part of delivery, not an add-on.' },
          { title: 'Measurable outcomes', body: 'Every engagement ends with instrumentation — so the impact is visible, not claimed.' },
        ].map((p) => (
          <div class="rounded-card border border-slate-border bg-white p-6 shadow-card">
            <h3 class="font-bold text-ink-navy">{p.title}</h3>
            <p class="mt-2 text-sm text-slate leading-6">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="max-w-prose">
      <div class="eyebrow">Registration</div>
      <h2 class="mt-2 text-h2 font-extrabold">Compliant and verifiable</h2>
      <dl class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm">
        <dt class="font-semibold text-ink-navy">Legal name</dt><dd class="text-slate">{site.legalName}</dd>
        <dt class="font-semibold text-ink-navy">Trade name</dt><dd class="text-slate">{site.tradeName}</dd>
        <dt class="font-semibold text-ink-navy">Constitution</dt><dd class="text-slate">Proprietorship</dd>
        <dt class="font-semibold text-ink-navy">GSTIN</dt><dd class="font-mono text-slate">{site.gstin}</dd>
        <dt class="font-semibold text-ink-navy">Registered since</dt><dd class="text-slate">19 November 2025</dd>
        <dt class="font-semibold text-ink-navy">State</dt><dd class="text-slate">Madhya Pradesh, India</dd>
      </dl>
    </div>
  </section>

  <CTABand />
</BaseLayout>
```

- [ ] **Step 2: Verify**

`npm run build` → no errors. `npm run dev` → visit `/about` → confirm layout.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "Add About page"
```

---

## Task 10: Content collections config

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Write `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    icon: z.string(),
    order: z.number(),
    deliverables: z.array(z.string()),
    audience: z.array(z.string()),
    engagement: z.string(),
  }),
});

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    sector: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    hero: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('AV Infotech'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, 'case-studies': caseStudies, blog };
```

- [ ] **Step 2: Verify**

```bash
npm run build
```
Expected: build succeeds with a note like "Synced content config". Collections exist but are empty (no errors because there are no entries yet).

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "Define content collections: services, case-studies, blog"
```

---

## Task 11: Services — 3 Markdown files + dynamic detail page

**Files:**
- Create: `src/content/services/ai-consulting.md`, `src/content/services/generative-ai.md`, `src/content/services/custom-software.md`, `src/pages/services/[slug].astro`

- [ ] **Step 1: Write `src/content/services/ai-consulting.md`**

```md
---
title: AI Consulting & Strategy
tagline: Vendor-neutral roadmaps for adopting AI across departments and workflows.
icon: "🧭"
order: 1
deliverables:
  - AI opportunity assessment across 3–5 candidate workflows
  - Build-vs-buy architecture recommendation
  - Phased implementation roadmap with budget and team shape
  - Risk register covering data, compliance, and vendor lock-in
audience:
  - Department heads evaluating AI adoption
  - PSU innovation / transformation cells
  - Programme offices sizing a pilot
engagement: 4–6 week engagements, fixed-fee, with a detailed written deliverable and on-site closeout.
---

We help public-sector teams cut through the AI hype and focus on what will
actually work for their operations. Our consulting engagements start with where
you are — your data, your staff, your procurement constraints — and end with a
pragmatic plan you can execute against.

## Typical engagement

1. **Discover** — interviews with sponsors, data inventory, workflow shadowing.
2. **Evaluate** — benchmark 2–3 candidate approaches against cost, compliance, and change-management cost.
3. **Recommend** — architecture, vendors, team shape, and 6/12/18-month milestones.

## Why departments hire us

Most AI consulting in India is either a vendor pitch dressed up as advice, or
a slide deck with no technical depth. We bring engineers into the room,
validate assumptions with real data, and hand over a plan that can survive
a procurement cycle.
```

- [ ] **Step 2: Write `src/content/services/generative-ai.md`**

```md
---
title: Generative AI & Agents
tagline: RAG systems, domain chatbots, and AI copilots built on your data.
icon: "🤖"
order: 2
deliverables:
  - Production-ready RAG pipeline (ingest, index, retrieve, answer)
  - Evaluation harness with hallucination and coverage metrics
  - Guardrails for PII, citation, and refusal behaviour
  - Admin console for content freshness and query review
audience:
  - Citizen-services departments wanting 24/7 FAQ answering
  - Internal knowledge-base owners
  - Analytics teams building AI copilots for officers
engagement: 8–12 week builds, milestone-based billing, with source code delivered to the client's repo.
---

Generative AI is only useful in government when it's grounded, auditable, and
cheap to operate. We build RAG systems and agents that meet those three bars
from day one.

## What we deliver

- Ingestion that handles messy PDFs, scanned documents, and multi-lingual content
- Retrieval with citation, so every answer can be traced back to a source
- Guardrails tuned for Indian languages and domain vocabularies
- Evaluation dashboards — not just vibes

## Stack

We work across open-source (Llama 3, Mistral, Gemma) and hosted models
(Claude, Gemini, OpenAI) depending on what your data-residency and budget
requirements allow. We're model-agnostic by design.
```

- [ ] **Step 3: Write `src/content/services/custom-software.md`**

```md
---
title: Custom Software Development
tagline: Web, mobile, and internal tools — delivered end-to-end on secure Indian infrastructure.
icon: "💻"
order: 3
deliverables:
  - Product discovery and wireframes
  - Production application (web + optional mobile)
  - Deployment on client-approved infra (MeitY-empanelled CSPs, on-prem, or govt cloud)
  - Handover documentation, runbooks, and training
audience:
  - Departments replacing legacy portals
  - Programmes needing a field-data or monitoring app
  - Teams building internal tools for officers or inspectors
engagement: 12–20 week engagements, milestone-based, with weekly demos and bi-weekly stakeholder reviews.
---

We build the kind of software the public sector actually needs: clear, fast,
works on low-end devices, accessible in English and a regional language, and
maintainable by a small in-house team after handover.

## How we engage

We deliver in weekly increments so stakeholders can course-correct early. Our
engineering practice covers:

- Modern, accessible web and mobile frontends
- API and data layer with audit trails by default
- CI/CD and infrastructure-as-code so deployments are reproducible
- Security review and OWASP testing before every release
```

- [ ] **Step 4: Write `src/pages/services/[slug].astro`**

```astro
---
import { getCollection, getEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import CTABand from '../../components/CTABand.astro';

export async function getStaticPaths() {
  const services = await getCollection('services');
  return services
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => ({ params: { slug: entry.slug }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
const all = (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
const others = all.filter((s) => s.slug !== entry.slug);
---
<BaseLayout title={entry.data.title} description={entry.data.tagline}>
  <section class="section">
    <div class="max-w-prose">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-md bg-sand text-xl" aria-hidden="true">{entry.data.icon}</div>
        <div class="eyebrow">Service</div>
      </div>
      <h1 class="mt-3 text-h1 font-extrabold">{entry.data.title}</h1>
      <p class="mt-4 text-lg text-slate leading-7">{entry.data.tagline}</p>
    </div>

    <div class="mt-12 grid gap-10 md:grid-cols-3">
      <div class="md:col-span-2 prose prose-slate max-w-none">
        <Content />
      </div>
      <aside class="space-y-8">
        <div class="rounded-card border border-slate-border bg-canvas p-5">
          <div class="eyebrow">Deliverables</div>
          <ul class="mt-3 space-y-2 text-sm text-ink-navy">
            {entry.data.deliverables.map((d) => <li class="flex gap-2"><span class="text-saffron">▸</span>{d}</li>)}
          </ul>
        </div>
        <div class="rounded-card border border-slate-border bg-canvas p-5">
          <div class="eyebrow">Who it's for</div>
          <ul class="mt-3 space-y-2 text-sm text-ink-navy">
            {entry.data.audience.map((a) => <li class="flex gap-2"><span class="text-saffron">●</span>{a}</li>)}
          </ul>
        </div>
        <div class="rounded-card border border-slate-border bg-canvas p-5">
          <div class="eyebrow">Engagement</div>
          <p class="mt-3 text-sm text-ink-navy leading-6">{entry.data.engagement}</p>
        </div>
      </aside>
    </div>
  </section>

  <section class="bg-canvas border-t border-slate-border">
    <div class="max-w-content mx-auto px-6 md:px-8 py-16">
      <div class="eyebrow">Other services</div>
      <div class="mt-6 grid gap-6 md:grid-cols-2">
        {others.map((o) => (
          <a href={`/services/${o.slug}`} class="block rounded-card border border-slate-border bg-white p-5 hover:shadow-card">
            <div class="flex items-center gap-2 text-lg">{o.data.icon} <span class="font-bold text-ink-navy">{o.data.title}</span></div>
            <p class="mt-2 text-sm text-slate">{o.data.tagline}</p>
          </a>
        ))}
      </div>
    </div>
  </section>

  <CTABand />
</BaseLayout>
```

- [ ] **Step 5: Install @tailwindcss/typography for the `prose` classes**

```bash
npm install --save-exact @tailwindcss/typography@^0.5
```
Update `tailwind.config.mjs` — add `plugins: [require('@tailwindcss/typography')]` (top of file add `import typography from '@tailwindcss/typography';` and change to `plugins: [typography]`).

- [ ] **Step 6: Verify**

`npm run build` → build passes. `npm run dev` → visit `/services/ai-consulting`, `/services/generative-ai`, `/services/custom-software` — each renders cleanly with deliverables/audience/engagement sidebar and "Other services" cross-links.

- [ ] **Step 7: Commit + push**

```bash
git add src/content/services src/pages/services tailwind.config.mjs package.json package-lock.json
git commit -m "Add services collection and detail pages"
git push
```

---

## Task 12: Capabilities page

**Files:**
- Create: `src/pages/capabilities.astro`, `src/components/FAQ.astro`

- [ ] **Step 1: Write `src/components/FAQ.astro`**

```astro
---
export interface Props { items: { q: string; a: string }[] }
const { items } = Astro.props;
---
<div class="divide-y divide-slate-border border border-slate-border rounded-card bg-white">
  {items.map((item) => (
    <details class="group p-5">
      <summary class="cursor-pointer list-none flex items-start justify-between gap-4 font-semibold text-ink-navy">
        <span>{item.q}</span>
        <span class="text-saffron transition-transform group-open:rotate-45 text-xl leading-none" aria-hidden="true">+</span>
      </summary>
      <p class="mt-3 text-sm text-slate leading-6">{item.a}</p>
    </details>
  ))}
</div>
```

- [ ] **Step 2: Write `src/pages/capabilities.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CTABand from '../components/CTABand.astro';
import FAQ from '../components/FAQ.astro';

const pillars = [
  { title: 'Delivery methodology', items: ['Weekly demos', 'Milestone billing', 'Bi-weekly stakeholder reviews', 'Runbook + training at handover'] },
  { title: 'Security & compliance', items: ['IT Act 2000 alignment', 'OWASP ASVS-aligned reviews', 'Role-based access and audit trails', 'Data residency on client-approved infra'] },
  { title: 'Engineering stack', items: ['Python, TypeScript, Go', 'PostgreSQL, Redis, object storage', 'FastAPI, Next.js, Astro, Flutter', 'Docker, Terraform, GitHub Actions'] },
  { title: 'AI & GenAI', items: ['Open (Llama, Mistral, Gemma) + hosted (Claude, Gemini, OpenAI)', 'RAG with citation and guardrails', 'Evaluation harnesses with coverage metrics', 'Hindi + Indic-language handling'] },
];

const faqs = [
  { q: 'Do you work on GeM (Government e-Marketplace)?', a: 'Yes. We can respond to RFPs routed through GeM and standard tender processes. We also support direct department engagements and empanelments.' },
  { q: 'Where will our data live?', a: 'On infrastructure you specify — MeitY-empanelled cloud service providers, government cloud (MeghRaj), your on-prem racks, or a hybrid arrangement. We document data flows before build starts.' },
  { q: 'How do handovers work?', a: 'Every engagement ends with source code in your repo, a runbook, a threat model, and a training session with your internal team. No lock-in.' },
  { q: 'What\'s the smallest engagement you take?', a: 'A 4-week consulting sprint or a 6-week GenAI proof-of-concept. We prefer small, scoped starts over open-ended contracts.' },
];
---
<BaseLayout title="Capabilities" description="Delivery methodology, compliance posture, engineering stack, and AI capabilities at AV Infotech.">
  <section class="section">
    <div class="max-w-prose">
      <div class="eyebrow">Capabilities</div>
      <h1 class="mt-2 text-h1 font-extrabold">Built to ship in the public sector.</h1>
      <p class="mt-6 text-slate leading-7">
        We combine modern software engineering with the realities of government delivery —
        procurement, audit, handover, and operations. Here's what we bring to every engagement.
      </p>
    </div>

    <div class="mt-12 grid gap-6 md:grid-cols-2">
      {pillars.map((p) => (
        <div class="rounded-card border border-slate-border bg-white p-6 shadow-card">
          <h3 class="font-bold text-ink-navy">{p.title}</h3>
          <ul class="mt-3 space-y-2 text-sm text-slate">
            {p.items.map((i) => <li class="flex gap-2"><span class="text-saffron">▸</span>{i}</li>)}
          </ul>
        </div>
      ))}
    </div>
  </section>

  <section class="section">
    <div class="max-w-prose">
      <div class="eyebrow">FAQ</div>
      <h2 class="mt-2 text-h2 font-extrabold">Common questions from procurement teams</h2>
    </div>
    <div class="mt-8 max-w-prose">
      <FAQ items={faqs} />
    </div>
  </section>

  <CTABand />
</BaseLayout>
```

- [ ] **Step 3: Verify**

`npm run dev` → visit `/capabilities`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/capabilities.astro src/components/FAQ.astro
git commit -m "Add Capabilities page with pillars and FAQ"
```

---

## Task 13: Certifications page

**Files:**
- Create: `src/pages/certifications.astro`

- [ ] **Step 1: Write `src/pages/certifications.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CTABand from '../components/CTABand.astro';
import { site } from '../data/site';

const certs = [
  {
    title: 'Goods and Services Tax (GST)',
    issuer: 'Government of India · CBIC',
    status: 'Registered',
    number: site.gstin,
    since: '19 November 2025',
    note: 'Proprietorship registered under Rule 10(1) of the CGST Rules. Registration Certificate issued electronically (Form GST REG-06).',
  },
  {
    title: 'MSME (Udyam Registration)',
    issuer: 'Ministry of MSME, GoI',
    status: 'Application in progress',
    number: null,
    since: null,
    note: 'Udyam certificate will be listed here once issued.',
  },
  {
    title: 'Startup India Recognition',
    issuer: 'DPIIT, Ministry of Commerce',
    status: 'Application in progress',
    number: null,
    since: null,
    note: 'Recognition will be listed here once granted.',
  },
];
---
<BaseLayout title="Certifications" description="Government certifications, registrations, and empanelments held by AV Infotech.">
  <section class="section">
    <div class="max-w-prose">
      <div class="eyebrow">Certifications &amp; Registrations</div>
      <h1 class="mt-2 text-h1 font-extrabold">Compliant, verifiable, on the record.</h1>
      <p class="mt-6 text-slate leading-7">
        We maintain active government registrations and publish their status transparently
        so procurement teams can verify credentials during vendor due-diligence.
      </p>
    </div>

    <div class="mt-12 grid gap-6 md:grid-cols-2">
      {certs.map((c) => (
        <article class="rounded-card border border-slate-border bg-white p-6 shadow-card flex flex-col gap-3">
          <div class="flex items-start justify-between gap-4">
            <h3 class="font-bold text-ink-navy">{c.title}</h3>
            <span class={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.status === 'Registered' ? 'bg-saffron/10 text-saffron' : 'bg-canvas text-slate border border-slate-border'}`}>{c.status}</span>
          </div>
          <div class="eyebrow">{c.issuer}</div>
          {c.number && <div class="font-mono text-sm text-ink-navy">{c.number}</div>}
          {c.since && <div class="text-sm text-slate">Since {c.since}</div>}
          <p class="text-sm text-slate leading-6">{c.note}</p>
        </article>
      ))}
    </div>
  </section>
  <CTABand />
</BaseLayout>
```

- [ ] **Step 2: Verify + commit**

```bash
npm run dev   # visit /certifications
git add src/pages/certifications.astro
git commit -m "Add Certifications page"
```

---

## Task 14: Team page

**Files:**
- Create: `src/pages/team.astro`

- [ ] **Step 1: Write `src/pages/team.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CTABand from '../components/CTABand.astro';
---
<BaseLayout title="Team" description="The team behind AV Infotech.">
  <section class="section">
    <div class="max-w-prose">
      <div class="eyebrow">Team</div>
      <h1 class="mt-2 text-h1 font-extrabold">Small team. Senior hands. Based in Bhopal.</h1>
      <p class="mt-6 text-slate leading-7">
        We're intentionally senior-heavy. Every engagement is led by an engineer who has
        shipped production systems — not staffed out to juniors after the sales call.
      </p>
    </div>

    <div class="mt-12 grid gap-6 md:grid-cols-3">
      <article class="rounded-card border border-slate-border bg-white p-6 shadow-card">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-full bg-saffron text-white font-extrabold text-lg">AD</div>
          <div>
            <h3 class="font-bold text-ink-navy">Aashirwad Dubey</h3>
            <div class="text-sm text-slate">Founder &amp; Principal</div>
          </div>
        </div>
        <p class="mt-4 text-sm text-slate leading-6">
          Leads engagements end-to-end — discovery, architecture, hands-on delivery, and handover.
        </p>
      </article>

      <article class="rounded-card border-2 border-dashed border-slate-border bg-canvas p-6 flex flex-col justify-center items-center text-center">
        <div class="text-3xl">🧑‍💻</div>
        <h3 class="mt-2 font-bold text-ink-navy">Engineering roles opening</h3>
        <p class="mt-2 text-sm text-slate">Full-stack, ML, and DevOps hires planned through 2026.</p>
        <a href="/careers" class="mt-4 text-sm font-semibold text-saffron">See careers →</a>
      </article>

      <article class="rounded-card border border-slate-border bg-white p-6 shadow-card">
        <h3 class="font-bold text-ink-navy">Partner network</h3>
        <p class="mt-2 text-sm text-slate leading-6">
          We collaborate with specialist partners — legal, compliance, accessibility auditors, and
          design studios — so every engagement gets the right expertise at the right time.
        </p>
      </article>
    </div>
  </section>
  <CTABand />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/team.astro
git commit -m "Add Team page"
```

---

## Task 15: Careers page

**Files:**
- Create: `src/pages/careers.astro`

- [ ] **Step 1: Write `src/pages/careers.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CTABand from '../components/CTABand.astro';
import { site } from '../data/site';
---
<BaseLayout title="Careers" description="Join AV Infotech — engineering roles opening in 2026.">
  <section class="section">
    <div class="max-w-prose">
      <div class="eyebrow">Careers</div>
      <h1 class="mt-2 text-h1 font-extrabold">Come build software that matters, with senior engineers.</h1>
      <p class="mt-6 text-slate leading-7">
        AV Infotech is growing in 2026. We hire senior-to-mid engineers who want to work
        close to real problems — government, public sector, field operations — and who
        care about the craft of delivery, not just code.
      </p>
    </div>

    <div class="mt-12 max-w-prose rounded-card border-2 border-dashed border-slate-border bg-canvas p-8 text-center">
      <h2 class="font-bold text-ink-navy">No open roles right now.</h2>
      <p class="mt-2 text-sm text-slate leading-6">
        We're not actively hiring, but we're always happy to hear from engineers who want
        to be first-in-line when roles open. Send a short note and a link to something you've built.
      </p>
      <a href={`mailto:${site.careersEmail}`} class="mt-6 btn-primary">Email {site.careersEmail} →</a>
    </div>
  </section>
  <CTABand />
</BaseLayout>
```

- [ ] **Step 2: Commit + push**

```bash
git add src/pages/careers.astro
git commit -m "Add Careers page"
git push
```

---

## Task 16: Case Studies index + detail + PostLayout

**Files:**
- Create: `src/layouts/PostLayout.astro`, `src/pages/case-studies/index.astro`, `src/pages/case-studies/[slug].astro`, `src/content/case-studies/.gitkeep`

- [ ] **Step 1: Write `src/layouts/PostLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
export interface Props { title: string; description?: string; eyebrow?: string; meta?: string }
const { title, description, eyebrow, meta } = Astro.props;
---
<BaseLayout title={title} description={description} type="article">
  <article class="section max-w-prose">
    {eyebrow && <div class="eyebrow">{eyebrow}</div>}
    <h1 class="mt-2 text-h1 font-extrabold">{title}</h1>
    {meta && <div class="mt-2 text-sm text-slate">{meta}</div>}
    <div class="mt-8 prose prose-slate max-w-none"><slot /></div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Write `src/pages/case-studies/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import CTABand from '../../components/CTABand.astro';
import { getCollection } from 'astro:content';

const studies = (await getCollection('case-studies', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<BaseLayout title="Case Studies" description="Selected engagements and outcomes from AV Infotech's work.">
  <section class="section">
    <div class="max-w-prose">
      <div class="eyebrow">Case Studies</div>
      <h1 class="mt-2 text-h1 font-extrabold">Engagements &amp; outcomes</h1>
      <p class="mt-6 text-slate leading-7">
        We publish anonymised and client-approved case studies from our engagements.
      </p>
    </div>

    {studies.length === 0 ? (
      <div class="mt-12 max-w-prose rounded-card border-2 border-dashed border-slate-border bg-canvas p-10 text-center">
        <h2 class="font-bold text-ink-navy">Case studies are being prepared.</h2>
        <p class="mt-2 text-sm text-slate leading-6">
          Our first public case studies will be published as engagements conclude.
          In the meantime, we can share references privately during procurement conversations.
        </p>
        <a href="/contact" class="mt-6 btn-primary">Talk to us →</a>
      </div>
    ) : (
      <ul class="mt-12 grid gap-6 md:grid-cols-2">
        {studies.map((s) => (
          <li>
            <a href={`/case-studies/${s.slug}`} class="block rounded-card border border-slate-border bg-white p-6 shadow-card hover:-translate-y-0.5 transition">
              <div class="eyebrow">{s.data.sector}</div>
              <h3 class="mt-2 font-bold text-ink-navy">{s.data.title}</h3>
              <p class="mt-2 text-sm text-slate leading-6">{s.data.summary}</p>
              <div class="mt-4 text-xs text-slate">{s.data.client} · {s.data.date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}</div>
            </a>
          </li>
        ))}
      </ul>
    )}
  </section>
  <CTABand />
</BaseLayout>
```

- [ ] **Step 3: Write `src/pages/case-studies/[slug].astro`**

```astro
---
import { getCollection } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';
import CTABand from '../../components/CTABand.astro';

export async function getStaticPaths() {
  const studies = await getCollection('case-studies', ({ data }) => !data.draft);
  return studies.map((entry) => ({ params: { slug: entry.slug }, props: { entry } }));
}
const { entry } = Astro.props;
const { Content } = await entry.render();
const meta = `${entry.data.client} · ${entry.data.sector} · ${entry.data.date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}`;
---
<PostLayout title={entry.data.title} description={entry.data.summary} eyebrow="Case Study" meta={meta}>
  <Content />
</PostLayout>
<CTABand />
```

- [ ] **Step 4: Seed empty collection**

Create `src/content/case-studies/.gitkeep` (empty file) so the directory is tracked.

- [ ] **Step 5: Verify + commit**

`npm run build` should pass. `/case-studies` should render the empty state.

```bash
git add src/layouts/PostLayout.astro src/pages/case-studies src/content/case-studies/.gitkeep
git commit -m "Add case-studies index and detail with empty state"
```

---

## Task 17: Blog index + detail + seed post

**Files:**
- Create: `src/content/blog/welcome-to-av-infotech.md`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`

- [ ] **Step 1: Write `src/content/blog/welcome-to-av-infotech.md`**

```md
---
title: "Welcome to AV Infotech"
description: "Why we started AV Infotech, and what we're building for India's public sector."
pubDate: 2025-11-20
tags: ["company", "government", "ai"]
---

India's public sector is in the middle of a once-in-a-generation shift. Digital
delivery, AI adoption, and citizen-facing software are moving from "nice to have"
to "core infrastructure" — and the gap between policy intent and engineering
reality is where most of the friction lives.

We started **AV Infotech** in November 2025 to close some of that gap. We're a
small, senior team based in Bhopal, Madhya Pradesh, building AI systems, generative-AI
assistants, and custom software for government departments and public-sector bodies.

## What we care about

- **Data residency and compliance** — defaults, not afterthoughts.
- **Bilingual / multi-lingual systems** — Hindi and Indian languages, not just English.
- **Senior hands on every engagement** — no bait-and-switch to juniors after the pitch.
- **Handover, not lock-in** — every project ends with source code and runbooks in the client's repo.

## What's next

We'll use this blog to share what we're learning — architecture patterns that work
in the public sector, evaluation techniques for generative AI on Indian data,
compliance notes, and occasional tools and open-source releases.

If you're in a department, PSU, or programme office and thinking about an AI
or software engagement — [say hello](/contact). We respond within 24 hours.
```

- [ ] **Step 2: Write `src/pages/blog/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import CTABand from '../../components/CTABand.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
---
<BaseLayout title="Blog" description="Notes from AV Infotech — architecture, AI, and public-sector delivery.">
  <section class="section">
    <div class="max-w-prose">
      <div class="eyebrow">Blog</div>
      <h1 class="mt-2 text-h1 font-extrabold">Notes from the field</h1>
      <p class="mt-6 text-slate leading-7">
        Architecture, AI evaluation, compliance, and lessons from public-sector delivery.
      </p>
    </div>

    <ul class="mt-12 divide-y divide-slate-border border-t border-slate-border">
      {posts.map((p) => (
        <li>
          <a href={`/blog/${p.slug}`} class="block py-6 group">
            <div class="flex items-center gap-3 text-xs text-slate">
              <time datetime={p.data.pubDate.toISOString()}>{p.data.pubDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              {p.data.tags.length > 0 && <span class="flex gap-2">{p.data.tags.map((t) => <span class="uppercase tracking-wider text-[10px] font-semibold">{t}</span>)}</span>}
            </div>
            <h2 class="mt-1 text-xl font-bold text-ink-navy group-hover:text-saffron">{p.data.title}</h2>
            <p class="mt-1 text-sm text-slate leading-6 max-w-2xl">{p.data.description}</p>
          </a>
        </li>
      ))}
    </ul>
  </section>
  <CTABand />
</BaseLayout>
```

- [ ] **Step 3: Write `src/pages/blog/[slug].astro`**

```astro
---
import { getCollection } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';
import CTABand from '../../components/CTABand.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((entry) => ({ params: { slug: entry.slug }, props: { entry } }));
}
const { entry } = Astro.props;
const { Content } = await entry.render();
const meta = `${entry.data.author} · ${entry.data.pubDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`;
---
<PostLayout title={entry.data.title} description={entry.data.description} eyebrow="Blog" meta={meta}>
  <Content />
</PostLayout>
<CTABand />
```

- [ ] **Step 4: Verify + commit + push**

`npm run build` → build passes, blog and seed post render at `/blog` and `/blog/welcome-to-av-infotech`.

```bash
git add src/content/blog src/pages/blog
git commit -m "Add blog index, detail page, and seed welcome post"
git push
```

---

## Task 18: Contact page + form

**Files:**
- Create: `src/components/ContactForm.astro`, `src/pages/contact.astro`

- [ ] **Step 1: Write `src/components/ContactForm.astro`**

```astro
---
import { site } from '../data/site';
---
<form action={`mailto:${site.email}`} method="post" enctype="text/plain"
      class="space-y-4 rounded-card border border-slate-border bg-white p-6 shadow-card">
  <div class="grid gap-4 sm:grid-cols-2">
    <label class="block">
      <span class="text-sm font-semibold text-ink-navy">Name</span>
      <input required name="name" class="mt-1 block w-full rounded-md border border-slate-border px-3 py-2 focus:border-saffron focus:outline-none" />
    </label>
    <label class="block">
      <span class="text-sm font-semibold text-ink-navy">Organisation</span>
      <input name="organisation" class="mt-1 block w-full rounded-md border border-slate-border px-3 py-2 focus:border-saffron focus:outline-none" />
    </label>
    <label class="block">
      <span class="text-sm font-semibold text-ink-navy">Email</span>
      <input required type="email" name="email" class="mt-1 block w-full rounded-md border border-slate-border px-3 py-2 focus:border-saffron focus:outline-none" />
    </label>
    <label class="block">
      <span class="text-sm font-semibold text-ink-navy">Phone (optional)</span>
      <input type="tel" name="phone" class="mt-1 block w-full rounded-md border border-slate-border px-3 py-2 focus:border-saffron focus:outline-none" />
    </label>
  </div>
  <label class="block">
    <span class="text-sm font-semibold text-ink-navy">What are you looking to build?</span>
    <textarea required name="message" rows="5" class="mt-1 block w-full rounded-md border border-slate-border px-3 py-2 focus:border-saffron focus:outline-none"></textarea>
  </label>
  <div class="flex items-center justify-between gap-4 flex-wrap">
    <p class="text-xs text-slate">By submitting, you agree to be contacted about your enquiry.</p>
    <button type="submit" class="btn-primary">Send enquiry →</button>
  </div>
</form>
<p class="mt-3 text-xs text-slate">
  Having trouble? Email us directly at
  <a href={`mailto:${site.email}`} class="text-saffron font-semibold">{site.email}</a>.
</p>
```

- [ ] **Step 2: Write `src/pages/contact.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ContactForm from '../components/ContactForm.astro';
import { site } from '../data/site';

const mapQuery = encodeURIComponent(`${site.address.street}, ${site.address.locality}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`);
---
<BaseLayout title="Contact" description="Get in touch with AV Infotech for RFPs, proposals, or general enquiries.">
  <section class="section">
    <div class="max-w-prose">
      <div class="eyebrow">Contact</div>
      <h1 class="mt-2 text-h1 font-extrabold">Let's talk about your project.</h1>
      <p class="mt-6 text-slate leading-7">
        We respond to government and public-sector enquiries within 24 hours.
        For RFP responses, please attach the tender reference in your message.
      </p>
    </div>

    <div class="mt-12 grid gap-10 lg:grid-cols-3">
      <div class="lg:col-span-2"><ContactForm /></div>
      <aside class="space-y-6">
        <div class="rounded-card border border-slate-border bg-canvas p-6">
          <div class="eyebrow">Registered office</div>
          <address class="mt-2 not-italic text-sm text-ink-navy leading-6">
            {site.address.street}<br />
            {site.address.locality}, {site.address.city}<br />
            {site.address.region} — {site.address.postalCode}<br />
            India
          </address>
        </div>
        <div class="rounded-card border border-slate-border bg-canvas p-6 space-y-2 text-sm">
          <div><span class="eyebrow block">Email</span><a href={`mailto:${site.email}`} class="mt-1 inline-block font-semibold text-saffron">{site.email}</a></div>
          <div><span class="eyebrow block">Phone</span><a href={`tel:${site.phoneHref}`} class="mt-1 inline-block font-semibold text-ink-navy">{site.phone}</a></div>
          <div><span class="eyebrow block">Hours</span><span class="mt-1 inline-block text-ink-navy">Mon–Sat · 10:00–19:00 IST</span></div>
        </div>
      </aside>
    </div>

    <div class="mt-12 overflow-hidden rounded-card border border-slate-border">
      <iframe
        title="Map to AV Infotech"
        class="w-full h-80"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
      ></iframe>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Verify + commit**

`npm run dev` → visit `/contact`, confirm form, sidebar, and map embed render.

```bash
git add src/components/ContactForm.astro src/pages/contact.astro
git commit -m "Add Contact page with mailto form and map embed"
```

---

## Task 19: GitHub Actions deploy workflow + CNAME

**Files:**
- Create: `.github/workflows/deploy.yml`, `public/CNAME`

- [ ] **Step 1: Write `public/CNAME`**

Single line, no trailing newline needed:
```
avinfotechsolutions.in
```

- [ ] **Step 2: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Commit + push**

```bash
git add .github/workflows/deploy.yml public/CNAME
git commit -m "Add GitHub Pages deploy workflow and CNAME"
git push
```

- [ ] **Step 4: Enable Pages in repo settings (manual, one-time)**

Open https://github.com/santoshray02/avinfotech/settings/pages
- Source: **GitHub Actions**
- Custom domain: `avinfotechsolutions.in`
- Tick **Enforce HTTPS** (may take a few minutes for SSL to provision)

- [ ] **Step 5: Monitor the Actions run**

Open https://github.com/santoshray02/avinfotech/actions
Expected: the `Deploy to GitHub Pages` workflow completes green. The deploy step output prints the Pages URL.

---

## Task 20: First deploy verification + DNS handoff notes

**Files:**
- Modify: `README.md` (add a DNS section)

- [ ] **Step 1: Verify live site**

Open `https://santoshray02.github.io/avinfotech/` (or the URL printed by the Actions `deploy` step).
Expected: the full site renders. If any page 404s or assets are missing, investigate before proceeding.

- [ ] **Step 2: Add DNS instructions to README**

Append to `README.md`:

```markdown

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

After DNS propagates (usually 15–60 minutes), GitHub Pages will provision a Let's Encrypt certificate automatically. You can then enable "Enforce HTTPS" in Settings → Pages if it isn't already.
```

- [ ] **Step 3: Commit + push**

```bash
git add README.md
git commit -m "Document DNS setup for custom domain"
git push
```

- [ ] **Step 4: Hand off**

Tell the user:
- Site is live on GitHub Pages at the temporary URL printed by Actions.
- DNS records need to be added at their registrar (see README).
- Once DNS propagates, the site will be accessible at `https://avinfotechsolutions.in`.
- Deferred items (from spec §14): founder photo, real MSME / Startup India numbers, social handles, optional Formspree upgrade, analytics — all can be added incrementally without changing the site architecture.

---

## Self-review

**Spec coverage check:**
- §2 Goals — addressed: trust signalling (hero trust strip, certifications page, GSTIN in footer), capability depth (services detail pages, capabilities page), lead capture (contact form, CTA band on every page), maintainability (Markdown content collections), cost (static GH Pages). ✓
- §3 Non-goals — respected (no backend, no CMS UI, no auth, no i18n, no e-commerce). ✓
- §4 IA — all 10 sections covered by tasks 7–18; nav structure in T5 matches spec exactly. ✓
- §5 Visual system — palette, typography, logo lock-up, components all produced (T2, T3, T5–T8). ✓
- §6 Tech stack — Astro + Tailwind + content collections + @fontsource + sitemap + lucide-astro all installed T1. ✓
- §7 Repo layout — plan file list matches spec layout. ✓
- §8 Contact details — source-of-truth in `src/data/site.ts` (T4). ✓
- §9 SEO — SEO.astro handles title, meta, OG, Twitter, canonical, Organization JSON-LD (T4); sitemap via @astrojs/sitemap (T1). ✓
- §10 Performance — achieved by Astro defaults + self-hosted fonts; no dedicated task but verified at T20. ✓
- §11 Accessibility — semantic HTML, focus rings in global.css, prefers-reduced-motion, alt text on logos, form labels. ✓
- §12 Deployment — T19 implements GH Actions + CNAME; T20 covers DNS. ✓
- §13 Implementation approach — frequent commits per task, pushes every 2-3 tasks. ✓
- §14 Open items — all deferred explicitly to user in T20 handoff. ✓

**Placeholder scan:** No "TBD"/"TODO" in the plan. One "placeholder PNG" step (T3) is a real step with a script, not a plan gap.

**Type consistency:** Collection names (`services`, `case-studies`, `blog`) match between `src/content/config.ts` (T10) and all pages that call `getCollection` (T11, T16, T17). Frontmatter keys in Markdown (T11, T17) match Zod schemas. `site` import is consistent across all pages. `Nav` + `Header` + `Footer` names match imports in `BaseLayout.astro`.

Plan is ready.
