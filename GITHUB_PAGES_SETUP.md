# FALLEN STORE — GitHub Pages setup

## Status: not yet verified live

On 18 October 2026, both the requested `https://fallen-store-dz.github.io` and the actual project URL returned GitHub's 404 page. The public repository exists and its last two Actions runs failed; the latest failed at **Build static site**. Full build logs require GitHub access and could not be read publicly. This document does not claim the migration is complete.

## 1. Understand the correct address

For owner **mehdif02085-crypto** and repository **fallen-store-dz.github.io**, GitHub assigns:

**https://mehdif02085-crypto.github.io/fallen-store-dz.github.io/**

The repository name alone does not create `fallen-store-dz.github.io`. That root address requires control of the GitHub account or organization **fallen-store-dz**, with a repository named **fallen-store-dz.github.io** inside it. A `CNAME` file, DNS record, or Vite setting cannot claim another account's `github.io` address.

Alternative: name a repository **mehdif02085-crypto.github.io** under your existing account for **https://mehdif02085-crypto.github.io/**. The workflow detects root repositories automatically. Do not transfer or rename anything until you have checked ownership and the files in the destination.

## 2. Keep Lovable connected

1. Open your existing FALLEN STORE project in Lovable.
2. Open **Project settings → Git** and check the connected repository and synced branch.
3. If it already shows **mehdif02085-crypto/fallen-store-dz.github.io** and **main**, leave the connection in place. Your repository contains the same hosting files inspected for this task, but that alone does not verify the Lovable connection.
4. If it is not connected, connect GitHub and authorize Lovable. **Lovable creates a new repository; it cannot attach this project directly to an arbitrary existing repository.**
5. If a different repository is already synced, keep it connected while deciding how to preserve your existing destination repository. Do not disconnect expecting to reconnect to the old repository: reconnecting creates another repository.

### If the required repository already exists but is not the synced repository

The safest supported option is to deploy the Lovable-created repository and use its resulting Pages URL. If you need the original repository name, first back up and inspect both repositories, preserve the existing repository under a different name, then rename the **Lovable-connected** repository on GitHub to the desired available name. GitHub repository renaming preserves Lovable sync. This is a deliberate manual operation; no existing repository files were deleted, replaced, or transferred by this task.

Using a separate mirror to an unrelated existing repository is not configured here: it requires extra write authorization and conflict handling. Do not manually overwrite an existing repository to force a connection.

## 3. Enable GitHub Pages

1. Open **https://github.com/mehdif02085-crypto/fallen-store-dz.github.io** (or your confirmed synced repository).
2. Select **Settings → Pages**.
3. Under **Build and deployment**, set **Source: GitHub Actions**.
4. Leave **Custom domain** empty for a standard `github.io` address. No DNS changes are needed.
5. Under **Settings → Actions → General**, allow GitHub Actions and the actions used by the workflow. The workflow requests `contents: read`, `pages: write`, and `id-token: write`.
6. Check **Settings → Environments → github-pages** if deployment is waiting for approval; allow the **main** branch and approve a pending deployment if required by your rules.
7. Open **Actions → Deploy Fallen Store to GitHub Pages → Run workflow**, choose **main**, and run it once.
8. Wait until every step is green. Open the URL shown by the successful **Publish website** step, not a URL inferred from the repository name.

Public repositories support Pages on GitHub Free. Private-repository Pages availability depends on your GitHub plan; Lovable-created repositories are private by default. Check eligibility before changing visibility. Never make a repository public until private credentials have been checked.

## 4. Exact files already included

| File | Purpose |
| --- | --- |
| `.github/workflows/deploy.yml` | Builds and deploys on every push to **main**, plus manual runs; installs the locked dependencies with Bun 1.3.3; uploads only `dist/client`. |
| `vite.config.ts` | `BUILD_TARGET=github-pages` enables the SPA shell; `GITHUB_PAGES_BASE` controls asset paths. A build-only Node target renders the shell; its server files are **not deployed**. Default Lovable hosting is unchanged. |
| `src/router.tsx` | Uses Vite's `BASE_URL` as the TanStack Router base path. |
| `scripts/github-pages.mjs` | Calculates the base from the actual owner/repository, validates the output, creates `index.html`, `404.html`, `.nojekyll`, and known-page shells. |
| `src/lib/site-path.ts` | Keeps static images and email confirmation links under the repository prefix; prevents server-only payments being selected on static hosting. |
| `public/.nojekyll` | Prevents GitHub's Jekyll processing of the static website. |

For your supplied owner/repository the workflow computes exactly:

```text
BUILD_TARGET=github-pages
GITHUB_PAGES_BASE=/fallen-store-dz.github.io/
```

There is no need to edit `index.html`, replace the router, add another hosting service's redirect file, or add a custom-domain `CNAME`.

## 5. Public build settings

The workflow accepts these names under GitHub **Settings → Secrets and variables → Actions → Variables**:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
```

These are the generated public browser connection settings for your existing Lovable Cloud backend, **not** private credentials. Use the existing project's values; do not create a replacement backend. Their values are intentionally not reproduced in this guide. Existing committed public `.env` settings remain a fallback when Actions variables are empty. The URL and publishable key are required; the project ID is optional for the browser client.

Never add a service-role key, database password, payment secret, or `sb_secret_` key to browser build settings. Variables prefixed `VITE_` become public JavaScript. Private payment credentials must stay on a server, not in GitHub Pages assets.

## 6. Authentication settings

In Lovable's backend authentication settings, retain the existing Lovable redirects and allow this exact additional confirmation callback:

```text
https://mehdif02085-crypto.github.io/fallen-store-dz.github.io/auth
```

If you choose a different owner or repository, use that deployed URL followed by `/auth`. The callback now includes the repository prefix. Hosted auth settings and confirmation emails must still be verified after a successful deployment; source inspection alone does not confirm them.

Existing accounts remain in the same backend. Customers and admins will need to sign in again on the new origin. Existing browser carts, language preferences, and checkout tokens do not automatically transfer between domains; the cart feature is preserved, but browsers isolate stored state by origin.

## 7. What continues working, and what cannot run on Pages

The design, product data, images, shirt designer, browser cart, and backend are preserved. Cash-on-delivery orders and ordinary admin operations use the existing browser-to-backend connection; they require successful live verification after Pages deployment. No database migration or deletion was made for this task.

**GitHub Pages cannot run server functions or payment webhooks.** CIB, Edahabia, BaridiMob and online-payment configuration cannot be migrated there as server functionality. Those methods stay visible but unavailable in the Pages checkout. Existing payment records and the Lovable-hosted payment implementation are untouched. Do not shut down Lovable hosting or the existing backend if you need those endpoints.

Keeping every server-dependent feature requires a separately hosted secure server/API and explicit integration; that is not supplied by GitHub Pages and is not configured by this migration. Do not put payment secrets in the browser to work around this limit.

## 8. Automatic updates

After the correct repository is connected and Pages is enabled:

**Edit in Lovable → changes sync to main → GitHub Actions builds → Pages updates.**

No Lovable **Publish** click is needed for the GitHub-hosted website. Your `.lovable.app` website updates separately through Lovable publishing. Only the synced branch's pushes trigger this workflow; if you use a different branch, deliberately change the workflow's `on.push.branches` and environment permissions to match it.

## 9. Verify before declaring migration complete

After the workflow succeeds, test the deployed address on desktop and mobile:

1. Open the homepage and verify the hero and product photos.
2. Open `/shop` and a real product page directly, then refresh both.
3. Add a real product to the cart, refresh, and confirm it is retained.
4. Open `/custom`, edit a design, and confirm its mockups load.
5. Place an authorized test cash-on-delivery order and confirm its number/status can be read back through `/order`.
6. Sign in as an authorized administrator and confirm products and orders can be read. Do not alter real prices or delete real orders merely for testing.
7. Verify an email confirmation returns to the correct `/auth` address.
8. Confirm online payment options cannot be selected on Pages.
9. Confirm HTTPS is valid and there are no broken assets or browser errors.

Known-page shells support direct links with HTTP 200. Dynamic product deep links use GitHub's `404.html` fallback: the app can render the correct product, but GitHub still returns HTTP 404 for that initial request. GitHub Pages has no configurable SPA rewrite; fully successful HTTP status codes for every dynamic URL require generating each product path at build time or different hosting.

If a run fails, open its failed step and provide the error text—never private credentials. Live deployment remains **unverified** until these checks pass.

Official references: [Lovable Git sync](https://docs.lovable.dev/integrations/github), [GitHub Pages types and URLs](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).