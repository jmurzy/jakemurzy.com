# jakemurzy.com [![build](https://img.shields.io/github/actions/workflow/status/jmurzy/jakemurzy.com/deploy.yml?branch=main&label=build)](https://github.com/jmurzy/jakemurzy.com/actions/workflows/deploy.yml) [![license: Proprietary](https://img.shields.io/badge/license-proprietary-red.svg)](LICENSE)

This web application is deployed to the `jakemurzy-com` Cloudflare Worker and serves the web
experience at `jakemurzy.com`.

## Web hosting

`alchemy.run.ts` adopts the existing `jakemurzy.com` zone and manages the `jakemurzy-com` Worker.
`zone.alchemy.run.ts` manages zone-wide DNS, redirects, and Web Analytics.
Review `just plan` and `just plan-zone` before production deploys.

Alchemy's Vite resource builds and deploys the TanStack Start server bundle and client assets.
Add future Cloudflare bindings and secrets to `alchemy.run.ts`.

## Deployment configuration

Configure these credentials as GitHub Actions repository secrets:

- `CLOUDFLARE_ACCOUNT_ID`: the target Cloudflare account identifier. It is used only by deployment
  workflows.
- `CLOUDFLARE_API_TOKEN`: a token restricted to that account, with only the permissions required to
  deploy the declared Worker resources. Review both production plans when infrastructure changes
  and narrow the token scope accordingly.
- `HARDCOVER_API_TOKEN`: a read-only personal access token used by the Worker to load the Hardcover
  library preview.

Configure `JULIA_WEBSITE` as a GitHub Actions variable. It is public deployment configuration
injected into runtime configuration.

## Commands

```sh
just prepare
just install
just check
just dev
```

`just prepare` installs the Homebrew development tools and configures the pre-commit hook.
`just dev` runs the local Cloudflare Worker through Alchemy with Vite hot module replacement at
`http://localhost:3000`. Vite generates `src/routeTree.gen.ts` during development and builds; run
`just generate-routes` to refresh it manually. Local development reads `.env`; it must provide
`JULIA_WEBSITE`. Add `HARDCOVER_API_TOKEN` to enable the library preview locally.

## Deployments

Review the production infrastructure changes, then deploy with the configured Cloudflare
credentials:

```sh
just plan
just plan-zone
just deploy
just deploy-zone
```

For local development, copy `.env.example` to `.env` and adjust its values as needed. The `.env`
file is used by `alchemy dev`; it is ignored and must not be committed.

The `Deploy Web` workflow deploys the site and the separate zone stack.
