# GitHub Actions workflow linter.
actionlint_bin := env_var_or_default("ACTIONLINT_BIN", "actionlint")
# Markdown linter.
rumdl_bin := env_var_or_default("RUMDL_BIN", "rumdl")

[default]
[doc("List available development commands.")]
help:
    @just --list

[doc("Install locked Node.js dependencies.")]
install:
    npm ci

[doc("Run the local Cloudflare Worker development server. Extra arguments are forwarded to Alchemy.")]
dev *args:
    npm run dev -- {{ args }}

test:

format-check:
    npm run format

format:
    npm run format -- --fix

lint-check:
    npm run lint

lint:
    npm run lint -- --fix

markdownlint-check:
    "{{ rumdl_bin }}" check .

markdownlint:
    "{{ rumdl_bin }}" check --fix .

typecheck:
    npm run typecheck

[doc("Check GitHub Actions workflows.")]
actionlint-check:
    "{{ actionlint_bin }}"

[doc("Run checks.")]
check: format-check lint-check markdownlint-check actionlint-check typecheck test

[doc("Deploy the Worker using the configured Cloudflare credentials. Extra arguments are forwarded to Alchemy.")]
deploy *args:
    npm run deploy -- {{ args }}

[doc("Preview the production infrastructure changes. Extra arguments are forwarded to Alchemy.")]
plan *args:
    npm run plan -- {{ args }}

[doc("Deploy the zone stack. Extra arguments are forwarded to Alchemy.")]
deploy-zone *args:
    npm run deploy:zone -- {{ args }}

[doc("Preview zone stack changes. Extra arguments are forwarded to Alchemy.")]
plan-zone *args:
    npm run plan:zone -- {{ args }}

# Vite generates routeTree.gen.ts during dev and builds; use this to refresh it manually.
generate-routes:
    npm run generate-routes
