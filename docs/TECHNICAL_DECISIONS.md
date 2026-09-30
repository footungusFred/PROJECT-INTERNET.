# Technical decisions

## Initial monorepo
Use pnpm workspaces with separate web, API, and shared packages to keep responsibilities clear while allowing shared types.

## API framework
Use Fastify with a versioned `/api/v1` route namespace. The first endpoint is health only.

## Database scope
Provide PostgreSQL through Docker Compose now. Defer product models and migrations until Milestone 2 rather than creating unused schema prematurely.

## Simulated browser
The first browser UI is an honest entry point. It does not claim to resolve addresses before the resolver exists and does not send fictional domains to external DNS.

## Visual direction
Use a warm neutral canvas, restrained moss accent, editorial type hierarchy, and a deliberately composed network illustration. No emoji, generic dashboard cards, or fake platform metrics.
