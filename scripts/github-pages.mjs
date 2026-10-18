import { existsSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function pagesBase(repository) {
  const [owner, name, ...extra] = repository.split("/");
  if (!owner || !name || extra.length || !/^[a-z\d_.-]+$/i.test(owner) || !/^[a-z\d_.-]+$/i.test(name)) {
    throw new Error("Expected a GitHub repository in owner/name format.");
  }
  return name.toLowerCase() === `${owner.toLowerCase()}.github.io` ? "/" : `/${name}/`;
}

export function preparePages(directory) {
  const shell = resolve(directory, "_shell.html");
  if (!existsSync(shell) || !existsSync(resolve(directory, "assets"))) {
    throw new Error("The static shell or assets are missing. Do not deploy this build.");
  }
  const html = readFileSync(shell, "utf8");
  if (!html.includes("<script") || !html.includes("assets/")) {
    throw new Error("The static shell has no application assets. Do not deploy this build.");
  }
  copyFileSync(shell, resolve(directory, "index.html"));
  copyFileSync(shell, resolve(directory, "404.html"));
  writeFileSync(resolve(directory, ".nojekyll"), "");
  // Known routes receive HTTP 200 on direct access; dynamic product links use 404.html.
  for (const route of ["shop", "categories", "custom", "cart", "checkout", "order", "contact", "auth", "account", "admin", "admin/products", "admin/designs", "admin/settings", "admin/team", "admin/audit", "admin/customers", "admin/inventory", "admin/payments"]) {
    const folder = resolve(directory, route);
    mkdirSync(folder, { recursive: true });
    copyFileSync(shell, resolve(folder, "index.html"));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv[2] === "base") console.log(pagesBase(process.env.GITHUB_REPOSITORY || ""));
  else if (process.argv[2] === "prepare") preparePages(resolve(process.argv[3] || "dist/client"));
  else throw new Error("Use: node scripts/github-pages.mjs base | prepare [directory]");
}