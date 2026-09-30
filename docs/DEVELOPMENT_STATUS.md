# Development status

## Current milestone
Milestone 1 foundation plus the first Milestone 2 data-model slice. Runtime verification has not yet been performed in a local checkout.

## Implemented in repository
- Initial pnpm workspace configuration.
- Next.js landing page and simulated browser entry interface.
- Fastify health endpoint and environment validation.
- PostgreSQL Docker Compose configuration.
- Initial Prisma schema for users, sites, fictional domains, pages, and internal links.
- Shared Zod validation for internal hostnames and browser address input.
- Prisma generate/migrate commands.
- Initial architecture and roadmap documentation.

## Not yet verified
Dependencies have not been installed; the app, API, database, type checks, tests, and production build have not been run in this environment. No database migration has been generated or applied. Authentication, ownership routes, domain resolution, page editing, and publishing are not implemented.

## Next exact task
Run install, Prisma validation/generation, type checks, and tests in a local checkout; fix any failures. Then implement the first API routes for creating a site and claiming a domain with backend validation and ownership checks.
