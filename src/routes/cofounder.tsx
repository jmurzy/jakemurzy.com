import { createFileRoute } from "@tanstack/react-router";

import Cofounder from "../components/Cofounder/Cofounder";
import { getRootTitle } from "../lib/getRootTitle";

export const Route = createFileRoute("/cofounder")({
	head: ({ matches }) => {
		const rootTitle = getRootTitle(matches);

		return {
			meta: [{ title: `Co-founder — ${rootTitle}` }],
		};
	},
	validateSearch: (search: Record<string, unknown>) => ({
		s: typeof search.s === "string" ? search.s : undefined,
	}),
	component: Cofounder,
});
