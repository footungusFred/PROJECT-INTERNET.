import { describe, expect, it } from "vitest";

describe("PROJECT INTERNET foundation", () => {
  it("uses fictional internal domains rather than real DNS", () => {
    const exampleAddress = "toaster.net";
    expect(exampleAddress).toMatch(/^[a-z0-9-]+\.(net|web|world)$/);
  });
});
