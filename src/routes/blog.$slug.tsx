import { createFileRoute, notFound } from "@tanstack/react-router";

import { findArticle } from "../components/Blog/articles";
import BlogNotFound from "../components/NotFound/BlogNotFound";

export const Route = createFileRoute("/blog/$slug")({
	loader: ({ params }) => {
		if (!findArticle(params.slug)) throw notFound();
		return { slug: params.slug };
	},
	validateSearch: (search: Record<string, unknown>) => ({
		s: typeof search.s === "string" ? search.s : undefined,
	}),
	head: ({ params }) => {
		const article = findArticle(params.slug);
		if (!article) throw notFound();
		const postUrl = `https://jakemurzy.com/blog/${article.slug}`;
		const imageUrl = article.image
			? new URL(article.image, postUrl).href
			: undefined;
		return {
			meta: [
				{ title: `${article.title} — Jake Murzy` },
				{ name: "description", content: article.description },
				{ property: "og:type", content: "article" },
				{ property: "og:title", content: article.title },
				{ property: "og:description", content: article.description },
				{ property: "og:url", content: postUrl },
				...(imageUrl ? [{ property: "og:image", content: imageUrl }] : []),
				{ property: "article:published_time", content: article.published },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: article.title },
				{ name: "twitter:description", content: article.description },
				...(imageUrl ? [{ name: "twitter:image", content: imageUrl }] : []),
			],
			links: [{ rel: "canonical", href: postUrl }],
			scripts: [
				{
					type: "application/ld+json",
					children: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "TechArticle",
						"@id": postUrl,
						url: postUrl,
						headline: article.title,
						description: article.description,
						...(imageUrl ? { image: imageUrl } : {}),
						datePublished: article.published,
						mainEntityOfPage: postUrl,
						author: {
							"@id": "https://jakemurzy.com/#person",
						},
					}),
				},
			],
		};
	},
	component: () => {
		const { slug: currentSlug } = Route.useLoaderData();
		const article = findArticle(currentSlug);
		if (!article) throw notFound();
		const Article = article.component;
		return <Article />;
	},
	notFoundComponent: BlogNotFound,
});
