# Architecture

## Current implementation
- `apps/web`: Next.js app-router frontend and platform UI.
- `apps/api`: Fastify API, environment parsing, CORS, and versioned health endpoint.
- `packages/shared`: reserved for shared API types and schemas; not yet populated.
- PostgreSQL is configured for local development through Docker Compose. Product models and migrations are deferred until Milestone 2.

## Planned boundaries
The web client calls the API over HTTP. The API will own validation, authorization, and domain/page resolution. Fictional domains must be resolved internally and never sent to external DNS. User page content will use structured blocks and safe rendering.

## Planned data flow
A future browser request will submit an address to `/api/v1/browser/resolve`. The API will normalize the fictional domain, find the owning website and published page, and return structured content. Search will index published content only. The crawler will traverse only published pages in this simulated environment. The network explorer will derive edges from persisted internal links.

## Risks
- Domain and slug normalization must be consistent and case-insensitive.
- Public page rendering must prevent XSS.
- Ownership checks must happen on the backend.
- External URLs must never be fetched blindly by the API.
