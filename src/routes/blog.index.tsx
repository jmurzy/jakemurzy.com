import { createFileRoute } from "@tanstack/react-router";

import Blog from "../components/Blog/Blog";
import { getRootTitle } from "../lib/getRootTitle";

export const Route = createFileRoute("/blog/")({
	head: ({ matches }) => {
		const rootTitle = getRootTitle(matches);

		return {
			meta: [{ title: `Blog — ${rootTitle}` }],
		};
	},
	component: Blog,
});
