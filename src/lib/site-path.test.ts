import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { paymentAvailable, withSiteBase } from "./site-path";

describe("GitHub Pages public paths", () => {
  test("the supplied project repository keeps its full prefix", () => {
    assert.equal(withSiteBase("/images/hero.jpg", "/fallen-store-dz.github.io/"),
      "/fallen-store-dz.github.io/images/hero.jpg",
    );
    assert.equal(withSiteBase("/auth", "/fallen-store-dz.github.io/"),
      "/fallen-store-dz.github.io/auth",
    );
  });
  test("root hosting and already prefixed assets stay unchanged", () => {
    assert.equal(withSiteBase("/images/hero.jpg", "/"), "/images/hero.jpg");
    assert.equal(withSiteBase("/fallen-store-dz.github.io/assets/shirt.jpg", "/fallen-store-dz.github.io/"),
      "/fallen-store-dz.github.io/assets/shirt.jpg",
    );
  });
  test("remote and uploaded images are not rewritten", () => {
    for (const path of ["https://example.com/shirt.jpg", "//example.com/shirt.jpg", "blob:upload", "data:image/png;base64,abc", "storage:custom-designs/guest/image.png"]) {
      assert.equal(withSiteBase(path, "/fallen-store-dz.github.io/"), path);
    }
  });
});

describe("static hosting payment availability", () => {
  test("cash on delivery stays usable when enabled", () => {
    assert.equal(paymentAvailable("cod", true, true), true);
    assert.equal(paymentAvailable("cod", false, true), false);
  });
  test("CIB, Edahabia and BaridiMob cannot call nonexistent Pages servers", () => {
    for (const method of ["cib", "edahabia", "baridimob", "card"]) {
      assert.equal(paymentAvailable(method, true, true), false);
    }
  });
  test("Lovable payment availability is unchanged", () => {
    assert.equal(paymentAvailable("cib", true, false), true);
    assert.equal(paymentAvailable("cib", false, false), false);
  });
});