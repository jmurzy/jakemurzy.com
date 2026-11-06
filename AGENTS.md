# Development environment

Run project development commands and checks in the running dev container, not on the host.
If already inside the dev container, run commands directly. From the host, identify the running
container for this checkout and its workspace mount, then use `docker exec` as the `node` user,
with that mount as the working directory and `mise exec --` before the command. Do not guess the
container or workspace path. If no unique container or workspace mount can be identified, ask the
user to start or identify it instead of running project commands on the host.

The workspace is shared, so agents can edit files on the host. Container dependencies are kept
separate from host dependencies. Run relevant checks and report any that could not be run.

Never print or disclose `.env` or Alchemy credentials. Ask before deployments, Git pushes, or
other production changes. The container's read-only Alchemy mount still permits credential use.
