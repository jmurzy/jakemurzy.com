import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getJuliaWebsite = createServerFn({ method: "GET" }).handler(
	() => env.JULIA_WEBSITE,
);

const getHardcoverApiTokenStatus = createServerFn({ method: "GET" }).handler(
	() => Boolean(env.HARDCOVER_API_TOKEN),
);

export const Route = createFileRoute("/debug")({
	loader: async () => ({
		hasHardcoverApiToken: await getHardcoverApiTokenStatus(),
		juliaWebsite: await getJuliaWebsite(),
	}),
	component: DebugPage,
});

function DebugPage() {
	const { hasHardcoverApiToken, juliaWebsite } = Route.useLoaderData();

	return (
		<main>
			<p>JULIA_WEBSITE: {juliaWebsite}</p>
			<p>HARDCOVER_API_TOKEN: {hasHardcoverApiToken ? "yes" : "no"}</p>
		</main>
	);
}
