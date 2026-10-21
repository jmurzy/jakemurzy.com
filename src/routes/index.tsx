import { createFileRoute } from "@tanstack/react-router";

import Home from "../components/Home/Home";
import { getRootTitle } from "../lib/getRootTitle";

export const Route = createFileRoute("/")({
	head: ({ matches }) => {
		const rootTitle = getRootTitle(matches);

		return {
			meta: [{ title: `Jake Murzy — ${rootTitle}` }],
		};
	},
	validateSearch: (search: Record<string, unknown>) => ({
		s: typeof search.s === "string" ? search.s : undefined,
	}),
	component: Home,
});
