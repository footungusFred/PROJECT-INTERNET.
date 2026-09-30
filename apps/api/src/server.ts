import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { pathToPageSlug, resolveQuerySchema } from "./browser/address.js";

const app = Fastify({ logger: true });
await app.register(cors, { origin: env.WEB_ORIGIN });

app.get("/api/v1/health", async () => ({
  status: "ok",
  service: "project-internet-api",
  timestamp: new Date().toISOString(),
}));

app.get("/api/v1/browser/resolve", async (request, reply) => {
  const parsed = resolveQuerySchema.safeParse(request.query);
  if (!parsed.success) {
    return reply.status(400).send({
      error: { code: "INVALID_ADDRESS", message: "Enter a valid internal address and path." },
    });
  }

  const { hostname, path } = parsed.data;
  const slug = pathToPageSlug(path);

  try {
    const page = await prisma.page.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
        site: {
          status: "PUBLISHED",
          domains: { some: { hostname } },
        },
      },
      select: {
        title: true,
        description: true,
        content: true,
        slug: true,
        publishedAt: true,
        site: {
          select: {
            title: true,
            description: true,
            domains: { where: { hostname }, select: { hostname: true }, take: 1 },
          },
        },
      },
    });

    if (!page) {
      return reply.status(404).send({
        error: { code: "PAGE_NOT_FOUND", message: "That address does not lead to a published page." },
      });
    }

    return reply.send({
      address: { hostname, path },
      site: page.site,
      page: {
        title: page.title,
        description: page.description,
        content: page.content,
        slug: page.slug,
        publishedAt: page.publishedAt,
      },
    });
  } catch (error) {
    request.log.error(error, "Browser resolution failed");
    return reply.status(503).send({
      error: { code: "STORAGE_UNAVAILABLE", message: "The internal web is temporarily unavailable." },
    });
  }
});

app.setErrorHandler((error, _request, reply) => {
  app.log.error(error);
  void reply.status(500).send({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } });
});

try {
  await app.listen({ host: "0.0.0.0", port: env.API_PORT });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
