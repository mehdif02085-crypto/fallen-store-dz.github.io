import { describe, expect, test } from "bun:test";
import { paymentAvailable, withSiteBase } from "./site-path";

describe("GitHub Pages public paths", () => {
  test("the supplied project repository keeps its full prefix", () => {
    expect(withSiteBase("/images/hero.jpg", "/fallen-store-dz.github.io/")).toBe(
      "/fallen-store-dz.github.io/images/hero.jpg",
    );
    expect(withSiteBase("/auth", "/fallen-store-dz.github.io/")).toBe(
      "/fallen-store-dz.github.io/auth",
    );
  });
  test("root hosting and already prefixed assets stay unchanged", () => {
    expect(withSiteBase("/images/hero.jpg", "/")).toBe("/images/hero.jpg");
    expect(withSiteBase("/fallen-store-dz.github.io/assets/shirt.jpg", "/fallen-store-dz.github.io/")).toBe(
      "/fallen-store-dz.github.io/assets/shirt.jpg",
    );
  });
  test("remote and uploaded images are not rewritten", () => {
    for (const path of ["https://example.com/shirt.jpg", "//example.com/shirt.jpg", "blob:upload", "data:image/png;base64,abc", "storage:custom-designs/guest/image.png"]) {
      expect(withSiteBase(path, "/fallen-store-dz.github.io/")).toBe(path);
    }
  });
});

describe("static hosting payment availability", () => {
  test("cash on delivery stays usable when enabled", () => {
    expect(paymentAvailable("cod", true, true)).toBe(true);
    expect(paymentAvailable("cod", false, true)).toBe(false);
  });
  test("CIB, Edahabia and BaridiMob cannot call nonexistent Pages servers", () => {
    for (const method of ["cib", "edahabia", "baridimob", "card"]) {
      expect(paymentAvailable(method, true, true)).toBe(false);
    }
  });
  test("Lovable payment availability is unchanged", () => {
    expect(paymentAvailable("cib", true, false)).toBe(true);
    expect(paymentAvailable("cib", false, false)).toBe(false);
  });
});