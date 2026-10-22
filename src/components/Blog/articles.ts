import type { ComponentType } from "react";

import FoldViewArticle from "../FoldViewArticle/FoldViewArticle";
import socialCardUrl from "../FoldViewArticle/images/social-card.png";
import ReactRouterNativeArticle from "../ReactRouterNativeArticle/ReactRouterNativeArticle";

type Article = {
	slug: string;
	title: string;
	description: string;
	published: string;
	label: string;
	image?: string;
	component: ComponentType;
};

export const articles: Article[] = [
	{
		slug: "implementing-foldview-in-react-native",
		title: "Implementing FoldView in React Native",
		description:
			"Building a JavaScript-only folding view animation in React Native using matrix transformations, transform origins, and perspective.",
		published: "2016-11-11",
		label: "Nov 11, 2016",
		image: socialCardUrl,
		component: FoldViewArticle,
	},
	{
		slug: "introducing-react-router-native",
		title: "Introducing React Router Native",
		description:
			"Introducing React Router Native, a routing library bringing React Router's declarative API, deep linking, and URL-driven development to native apps.",
		published: "2016-09-12",
		label: "Sep 12, 2016",
		component: ReactRouterNativeArticle,
	},
];

export const findArticle = (slug: string) =>
	articles.find((article) => article.slug === slug);
