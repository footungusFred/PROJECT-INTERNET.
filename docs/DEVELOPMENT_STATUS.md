# Development status

## Current milestone
Milestone 3 — browser-to-resolver integration. Changes are committed to the repository; runtime verification has not been performed in a local checkout.

## Implemented in repository
- Initial pnpm workspace and Netlify build configuration.
- Responsive landing page and simulated internal browser.
- Next.js same-origin health endpoint.
- Fastify health endpoint and public published-page resolver.
- PostgreSQL/Prisma data model for users, sites, domains, pages, and internal links.
- Address validation and path-to-slug mapping tests.
- Same-origin Next.js proxy at `/api/v1/browser/resolve`, forwarding to the configured Fastify API.
- Browser form validates internal hostnames, calls the proxy, shows loading/errors, and renders returned page metadata/content.
- Example environment files for web and API services.

## Required deployment configuration
- Deploy PostgreSQL and apply a Prisma migration.
- Deploy the Fastify API with `DATABASE_URL` and `WEB_ORIGIN`.
- Deploy the Next.js app and set `API_BASE_URL` to the API origin.
- Netlify hosts only the web app in the current configuration; it does not provision the API or database.

## Not yet implemented
- Authentication and session management.
- Protected ownership routes, account creation, site/domain registration, page editor, draft saving, publishing, and search/discovery.
- Abuse reporting/moderation and rate limits.
- Automated integration/e2e tests and runtime verification.

## Verification status
No dependencies have been installed and no local typecheck, test suite, migration, or production build has been run in this environment. The web proxy and browser UI are code changes only; they are not evidence of a live deployment.
