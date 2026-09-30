import { z } from "zod";

export const resolveQuerySchema = z.object({
  hostname: z
    .string()
    .trim()
    .toLowerCase()
    .max(63)
    .regex(/^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?\.(?:net|web|world)$/),
  path: z
    .string()
    .trim()
    .max(160)
    .default("/")
    .refine((path) => path.startsWith("/") && !path.includes("\\") && !path.includes("?") && !path.includes("#"), {
      message: "Path must be an internal path.",
    }),
});

export function pathToPageSlug(path: string): string {
  if (path === "/") return "home";
  return path.replace(/^\/+|\/+$/g, "").split("/").join("-");
}
