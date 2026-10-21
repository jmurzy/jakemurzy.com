import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getJuliaWebsite = createServerFn({ method: "GET" }).handler(
	() => env.JULIA_WEBSITE,
);

export const Route = createFileRoute("/debug")({
	loader: async () => ({
		juliaWebsite: await getJuliaWebsite(),
	}),
	component: DebugPage,
});

function DebugPage() {
	const { juliaWebsite } = Route.useLoaderData();

	return (
		<main>
			<p>JULIA_WEBSITE: {juliaWebsite}</p>
		</main>
	);
}
