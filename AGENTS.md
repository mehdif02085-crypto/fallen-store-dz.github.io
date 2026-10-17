<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- GitHub Pages deployment: `BUILD_TARGET=github-pages` switches `vite build` to a client-only SPA
  (`tanstackStart.spa` + `vite.base` from `GITHUB_PAGES_BASE`, output in `dist/client`); the
  workflow `.github/workflows/deploy.yml` rebuilds on every push to main and copies `_shell.html`
  to `index.html`/`404.html`. Why: GitHub Pages serves static files only — no SSR, no server
  functions (online card payments don't run there; COD checkout and admin do, via the browser
  Supabase client). The default Lovable build (Cloudflare) is unchanged.
