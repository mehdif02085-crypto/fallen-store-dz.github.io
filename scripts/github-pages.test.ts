import { expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pagesBase, preparePages } from "./github-pages.mjs";

test("the user's owner and repository describe a project site, not the requested root domain", () => {
  expect(pagesBase("mehdif02085-crypto/fallen-store-dz.github.io")).toBe("/fallen-store-dz.github.io/");
});

test("a repository named after the owner has a root URL", () => {
  expect(pagesBase("mehdif02085-crypto/mehdif02085-crypto.github.io")).toBe("/");
  expect(pagesBase("fallen-store-dz/fallen-store-dz.github.io")).toBe("/");
});

test("prepare produces matching root, direct-page and deep-link shells", () => {
  const folder = mkdtempSync(join(tmpdir(), "fallen-pages-"));
  try {
    mkdirSync(join(folder, "assets"));
    const shell = '<html><script src="/fallen-store-dz.github.io/assets/app.js"></script></html>';
    writeFileSync(join(folder, "_shell.html"), shell);
    preparePages(folder);
    for (const file of ["index.html", "404.html", "shop/index.html", "auth/index.html", "admin/products/index.html"]) {
      expect(readFileSync(join(folder, file), "utf8")).toBe(shell);
    }
  } finally { rmSync(folder, { recursive: true, force: true }); }
});

test("missing output stops deployment instead of uploading an empty site", () => {
  const folder = mkdtempSync(join(tmpdir(), "fallen-pages-"));
  try { expect(() => preparePages(folder)).toThrow("static shell or assets"); }
  finally { rmSync(folder, { recursive: true, force: true }); }
});