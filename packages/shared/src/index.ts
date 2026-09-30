import { z } from "zod";

export const API_VERSION = "v1" as const;

export const internalHostnameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(63)
  .regex(/^[a-z0-9](?:[a-z0-9-]{0, thirty}[a-z0-9])?\.(?:net|web|world)$/)
  .transform((hostname) => hostname);

export type HealthResponse = {
  status: "ok";
  service: string;
  timestamp: string;
};

export const resolveAddressSchema = z.object({
  hostname: internalHostnameSchema,
  path: z.string().trim().max(160).default("/"),
});

export type ResolveAddressInput = z.infer<typeof resolveAddressSchema>;
