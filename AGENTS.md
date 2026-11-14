# Pislinfra Frontend & CMS Integration Rules

This document outlines the mandatory rules, learned behaviors, and deployment constraints for the Pislinfra codebase. Every agent working in this project MUST strictly follow these rules.

---

## 1. WordPress CMS Subdirectory (`/cms`) Rules
- **Live Location:** `https://pislinfra.com/cms/` (Hosted on Hostinger LiteSpeed / Apache at `public_html/cms`).
- **Single Public URL Policy:**
  - The **ONLY** URL accessible for WordPress is: `https://pislinfra.com/cms/wp-admin/` (and its login script `wp-login.php`).
  - All other routes under `/cms` (e.g. `https://pislinfra.com/cms`, `https://pislinfra.com/cms/`, `/cms/dfd`, or any random URL) **MUST immediately 301 redirect back to the main website `https://pislinfra.com/`**.
  - **NEVER** expose debug cards, "Headless CMS Active", or API health pages to the public.
- **REST API Path:**
  - `https://pislinfra.com/cms/wp-json/pislinfra/v1/`
  - Redirection rules must **NEVER** block REST requests (`REST_REQUEST`).
- **Server Deployment Safety:**
  - **NEVER delete or overwrite `public_html/cms`** when deploying the frontend build to `public_html/`.

---

## 2. Frontend Pre-rendering & Flicker Prevention
- **Root Container Discipline:**
  - In `scripts/prerenderBlogs.js`: **NEVER** inject visible HTML layout markup directly into `<div id="root">` of `dist/index.html` or prerendered sub-pages.
  - Doing so causes a 1-second Flash of Unstyled / Wrong Content (FOUC) when users refresh any page.
  - `<div id="root">` must **ALWAYS** preserve the smooth, branded animated Pislinfra logo spinner from `index.html`.
- **SEO Crawlable Content:**
  - Crawlable static HTML text, headings, and links must be injected inside `<noscript>` tags right before `</body>`.
  - Search engine crawlers (Googlebot, Bingbot) and social crawlers parse `<head>` metadata (canonical, title, description, Schema.org JSON-LD) and `<noscript>` body content with zero layout shift for real human users.

---

## 3. WordPress Editor Bar (`WpAdminBar.jsx`)
- **Normal Browsing:**
  - `WpAdminBar` must **NEVER** be shown during ordinary browsing on `pislinfra.com` (even if the user has an active WordPress admin login session).
- **Preview Sessions Only:**
  - It must **ONLY** activate when specifically in an active preview session triggered from WordPress (i.e. `pisl_preview=1` exists in query params).
  - Clicking "Exit Preview" removes the preview parameters and immediately hides the bar.

---

## 4. Header & Navigation Sync
- Top Bar contact details (Address, Phone: `085270 40411`, Email: `info@pislinfra.com`) and navigation menus are managed via the WordPress Admin Visual Menu Builder in `pislinfra-headless-cms` plugin.
- `Navbar.jsx` dynamically synchronizes with these settings while maintaining hardcoded fallbacks if the API is offline.

---

## 5. Clean Repository & Git Workflow
- **No Artifacts or Test Scripts:**
  - Never commit or leave temporary `.bak` files, email mockups, one-off test scripts (`test*.js`), or quarantine directories in the frontend.
- **Branch Naming:**
  - Name git feature/update branches by current date format (e.g. `14-Nov-2026`).
- **Build Output:**
  - Always verify `npm run build` exits with code 0.
  - Deployment zip files: `pislinfra-frontend-dist-light.zip` (lightweight update without existing media) and `pislinfra-frontend-dist.zip` (full 1.2 GB package).
