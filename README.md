# jakemurzy.com

[![build](https://img.shields.io/github/actions/workflow/status/jmurzy/jakemurzy.com/deploy.yml?branch=main&label=build)](https://github.com/jmurzy/jakemurzy.com/actions/workflows/deploy.yml)
[![license: Proprietary](https://img.shields.io/badge/license-proprietary-red.svg)](LICENSE)

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

Install [mise](https://mise.jdx.dev/getting-started.html), then install the project tools and set up
the optional Git hook:

```sh
mise install
mise exec -- pre-commit install --hook-type pre-commit
```

Activate mise in your shell, or prefix commands with `mise exec --`. Then run:

```sh
just install
just check
just dev
```

The second command installs the optional pre-commit hook.
`just dev` runs the local Cloudflare Worker through Alchemy with Vite hot module replacement at
`http://localhost:3000`. Vite generates `src/routeTree.gen.ts` during development and builds; run
`just generate-routes` to refresh it manually. Local development reads `.env`; it must provide
`JULIA_WEBSITE`. Add `HARDCOVER_API_TOKEN` to enable the library preview locally.

## Dev container

Open the repository in a Dev Containers-compatible editor and select **Reopen in Container**.
The container provides Node.js and mise, installs the tools from `mise.toml`, and runs `just install`
when it is created. Its `node_modules` volume is separate from the host's dependencies, and port
3000 is forwarded to the host. Rebuild the container after changing its configuration.

The container mounts the host's `~/.alchemy` directory read-only, so it can read the existing
`personal` profile but cannot modify its credentials. Create, connect, or refresh the profile on the
host when needed; setup prints instructions if the profile is missing. Cloudflare authentication
still requires your approval. This mount requires a local macOS or Linux host with `HOME` set and
does not work in GitHub Codespaces. If Alchemy needs to write or refresh credentials during
development, the read-only mount may prevent it from doing so.

Copy `.env.example` to `.env` if you have not already, then run `just dev`. Use `just check` to
run the project checks. Git hooks are shared with the host, but the pre-commit hook may record the
Python path from the environment where it was installed. Install the hook in the environment where
you make commits, and reinstall it there if you switch between host and container.

Run development commands in a terminal attached to the dev container. Container processes can read
the mounted Alchemy credentials.

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
