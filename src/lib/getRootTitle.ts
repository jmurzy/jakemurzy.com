import type { AnyRouteMatch } from "@tanstack/react-router";

export function getRootTitle(matches: readonly AnyRouteMatch[]) {
	return matches
		.flatMap((match) => match.meta ?? [])
		.find((meta) => meta && "title" in meta)?.title;
}
