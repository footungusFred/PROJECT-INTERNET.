import { describe, expect, it } from "vitest";
import { internalHostnameSchema, resolveAddressSchema } from "./index";

describe("internal address validation", () => {
  it("normalizes hostnames to lowercase", () => {
    expect(internalHostnameSchema.parse("  My-Site.WEB ")).toBe("my-site.web");
  });

  it("accepts supported internal suffixes", () => {
    expect(internalHostnameSchema.safeParse("fieldnotes.net").success).toBe(true);
    expect(internalHostnameSchema.safeParse("catplanet.world").success).toBe(true);
  });

  it("rejects external domains and malformed hostnames", () => {
    expect(internalHostnameSchema.safeParse("example.com").success).toBe(false);
    expect(internalHostnameSchema.safeParse("-bad.web").success).toBe(false);
    expect(internalHostnameSchema.safeParse("bad..web").success).toBe(false);
  });

  it("defaults a missing page path to the root", () => {
    expect(resolveAddressSchema.parse({ hostname: "toaster.net" })).toEqual({
      hostname: "toaster.net",
      path: "/",
    });
  });
});
