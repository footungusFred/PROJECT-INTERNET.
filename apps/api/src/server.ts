import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: env.WEB_ORIGIN });

app.get("/api/v1/health", async () => ({
  status: "ok",
  service: "project-internet-api",
  timestamp: new Date().toISOString(),
}));

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
