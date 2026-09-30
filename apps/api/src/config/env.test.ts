import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("environment schema", () => {
  const schema = z.object({ API_PORT: z.coerce.number().int().min(1).max(65535).default(4000) });
  it("rejects an invalid port", () => {
    expect(schema.safeParse({ API_PORT: "70000" }).success).toBe(false);
  });
  it("provides a development default", () => {
    expect(schema.parse({}).API_PORT).toBe(4000);
  });
});
