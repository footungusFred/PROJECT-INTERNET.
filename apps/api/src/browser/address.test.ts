import { describe, expect, it } from "vitest";
import { pathToPageSlug, resolveQuerySchema } from "./address.js";

describe("internal browser addresses", () => {
  it("normalizes a hostname and defaults to the home page", () => {
    expect(resolveQuerySchema.parse({ hostname: " FIELDNOTES.NET " })).toEqual({
      hostname: "fieldnotes.net",
      path: "/",
    });
  });

  it("accepts only supported internal domain suffixes", () => {
    expect(resolveQuerySchema.safeParse({ hostname: "notes.web" }).success).toBe(true);
    expect(resolveQuerySchema.safeParse({ hostname: "example.com" }).success).toBe(false);
  });

  it("rejects paths that could be interpreted as URL components", () => {
    expect(resolveQuerySchema.safeParse({ hostname: "notes.web", path: "about" }).success).toBe(false);
    expect(resolveQuerySchema.safeParse({ hostname: "notes.web", path: "/about?x=1" }).success).toBe(false);
    expect(resolveQuerySchema.safeParse({ hostname: "notes.web", path: "/about\\team" }).success).toBe(false);
  });

  it("maps internal paths to page slugs", () => {
    expect(pathToPageSlug("/")).toBe("home");
    expect(pathToPageSlug("/about/our-place/")).toBe("about-our-place");
  });
});
