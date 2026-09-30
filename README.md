# PROJECT INTERNET

A miniature internet made of user-created websites with fictional internal domains.

## Status

The platform foundation and public page resolver are in place. The browser now submits fictional addresses through a same-origin Next.js proxy and can display published page records returned by the API. Account creation, site/domain management, editing, publishing, and search are still in development.

## Planned stack

- Next.js, React, TypeScript, Tailwind CSS
- Fastify API
- PostgreSQL and Prisma
- Zod validation
- Vitest and Playwright
- pnpm workspaces

See `docs/` for the product overview, architecture, roadmap, technical decisions, and development status.


## Connecting the browser to the API

The web app uses a server-side proxy at `/api/v1/browser/resolve`. Copy `apps/web/.env.example` to `apps/web/.env.local` and set `API_BASE_URL` to the deployed Fastify API origin (for local development, `http://localhost:4000`). The API needs PostgreSQL; copy `apps/api/.env.example` to `apps/api/.env`, set `DATABASE_URL`, and apply the Prisma migration before expecting published pages to resolve. Keep secrets out of Git.

Netlify can host the Next.js web app, but it does not host the separate Fastify API or PostgreSQL database. Configure `API_BASE_URL` in the Netlify site's environment variables after deploying the API and database elsewhere. Without it, the browser reports that the API is not connected.

## Current limitation

The resolver can only display pages already present in the database with published page and site status. There is not yet a safe account/ownership workflow to create those records through the product UI.