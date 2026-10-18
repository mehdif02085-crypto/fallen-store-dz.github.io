// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GitHub Pages build (BUILD_TARGET=github-pages): produce a fully static,
// client-only bundle (SPA shell) instead of the Cloudflare worker build.
// GitHub Pages cannot run the SSR server or server functions, so the app is
// hosted as a static shell that renders in the browser.
const isPages = process.env["BUILD_TARGET"] === "github-pages";
// Project sites are served under /<repo-name>/ — the base path must match,
// otherwise assets and client-side routes 404.
const pagesBase = process.env["GITHUB_PAGES_BASE"] || "/";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(isPages ? { spa: { enabled: true }, prerender: { failOnError: true } } : {}),
  },
  ...(isPages
    ? {
        // A build-only server renders the SPA shell. Upload ONLY dist/client.
        // Nitro's static preset does not retain the server needed by Start's prerender pass.
        nitro: {
          preset: "node-server",
          output: { dir: "dist", publicDir: "dist/client", serverDir: "dist/server" },
        },
        vite: {
          base: pagesBase,
          define: { "import.meta.env.VITE_HOSTING_TARGET": JSON.stringify("github-pages") },
        },
      }
    : {}),
});
