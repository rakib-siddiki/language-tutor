## What to build

Bootstrap the NX monorepo that serves as the foundation for all other slices. Initialize the workspace using NX with pnpm as the package manager. Create two applications (`apps/web` for Next.js and `apps/api` for NestJS) and two libraries (`libs/shared-types` for shared TypeScript interfaces and `libs/ui` for the shadcn/ui shared component library). Configure TypeScript path aliases so that both apps can import from `@language-tutor/shared-types` and `@language-tutor/ui`. Add a root `.env.example` file and a `README.md` documenting how to run the monorepo locally.

The end result is a working `pnpm install` + `nx serve web` / `nx serve api` setup where both apps start without errors (even if they only render placeholder pages).

## Acceptance criteria

- [ ] `nx.json`, `pnpm-workspace.yaml`, and root `package.json` are present and correctly configured.
- [ ] `apps/web` is a Next.js 14+ App Router project with TypeScript.
- [ ] `apps/api` is a NestJS project with TypeScript.
- [ ] `libs/shared-types` exports at least a placeholder `index.ts`.
- [ ] `libs/ui` is scaffolded and referenced in `apps/web`.
- [ ] Both apps can be served independently via NX (`nx serve web`, `nx serve api`).
- [ ] TypeScript path aliases resolve correctly in both apps (`@language-tutor/shared-types`, `@language-tutor/ui`).
- [ ] `.env.example` documents the `GEMINI_API_KEY` variable.
- [ ] `README.md` at the root describes setup and local run commands.

## Blocked by

None — can start immediately.

## Status
Pending
