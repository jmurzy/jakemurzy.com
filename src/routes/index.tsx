import { createFileRoute } from "@tanstack/react-router";

import Home from "../components/Home/Home";
import { getHardcoverLibrary } from "../server/hardcover";
import { getRootTitle } from "../lib/getRootTitle";

export const Route = createFileRoute("/")({
	loader: async () => {
		try {
			return { hardcoverBooks: await getHardcoverLibrary() };
		} catch (error) {
			console.error("Unable to load Hardcover library", error);
			return { hardcoverBooks: [] };
		}
	},
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
