/** Resolve only public-root paths; leave remote, data, blob and bundled URLs alone. */
export function withSiteBase(path: string, base: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const prefix = base === "/" ? "/" : `/${base.replace(/^\/+|\/+$/g, "")}/`;
  if (prefix !== "/" && path.startsWith(prefix)) return path;
  return `${prefix}${path.replace(/^\/+/, "")}`;
}

export function publicPath(path: string): string {
  return withSiteBase(path, import.meta.env.BASE_URL || "/");
}

export const isGitHubPages = import.meta.env['VITE_HOSTING_TARGET'] === "github-pages";

/** Pages has no payment server; keep unavailable methods visible but unselectable. */
export function paymentAvailable(code: string, enabled: boolean, staticHosting: boolean): boolean {
  return enabled && (!staticHosting || code === "cod");
}