# Development status

## Current milestone
Milestone 2 — initial data model and published-page address resolution. Runtime verification has not yet been performed in a local checkout.

## Implemented in repository
- Initial pnpm workspace configuration and Netlify build configuration.
- Next.js landing page and simulated browser entry interface.
- Same-origin web health endpoint.
- Fastify API health endpoint and environment validation.
- PostgreSQL Docker Compose configuration.
- Initial Prisma schema for users, sites, fictional domains, pages, and internal links.
- Prisma client singleton.
- Public API endpoint to resolve a published internal page by hostname and path.
- Validation that rejects unsupported domains and URL-like path components.
- Tests for internal address parsing and path-to-page slug mapping.
- Prisma generate/migrate commands and initial project documentation.

## Not yet verified
Dependencies have not been installed; the app, API, database, type checks, tests, and production build have not been run in this environment. No database migration has been generated or applied. Authentication, ownership routes, site/domain creation, page editing, and publishing are not implemented. The Fastify API is not deployed on Netlify; the web app's browser UI is not yet connected to the resolver.

## Next exact task
Run install, Prisma validation/generation, type checks, and tests in a local checkout. Then add account authentication and protected site/domain creation routes with ownership checks, followed by a browser UI connection to the hosted API.
