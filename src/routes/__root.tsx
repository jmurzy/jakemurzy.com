import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import PageNotFound from "../components/NotFound/PageNotFound";
import appCss from "../styles.css?url";

const SITE_DESCRIPTION =
	"Engineering leader building agentic products and AI-native teams";
const SITE_NAME = "Jake Murzy";
const SITE_URL = "https://jakemurzy.com";
const SITE_IMAGE_URL = `${SITE_URL}/meta.png`;

const jsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "Person",
			"@id": `${SITE_URL}/#person`,
			name: SITE_NAME,
			url: SITE_URL,
			image: SITE_IMAGE_URL,
			sameAs: [
				"https://x.com/jmurzy",
				"https://github.com/jmurzy",
				"https://linkedin.com/in/jmurzy",
				"https://medium.com/@jmurzy",
			],
		},
		{
			"@type": "WebSite",
			"@id": `${SITE_URL}/#website`,
			url: SITE_URL,
			name: SITE_NAME,
			description: SITE_DESCRIPTION,
			publisher: {
				"@id": `${SITE_URL}/#person`,
			},
		},
	],
};

export const Route = createRootRoute({
	notFoundComponent: PageNotFound,
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				name: "theme-color",
				content: "#000",
			},
			{
				title: "jakemurzy.com",
			},
			{
				name: "description",
				content: SITE_DESCRIPTION,
			},
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: SITE_NAME },
			{ property: "og:title", content: SITE_NAME },
			{ property: "og:description", content: SITE_DESCRIPTION },
			{ property: "og:url", content: SITE_URL },
			{ property: "og:image", content: SITE_IMAGE_URL },
			{ property: "og:image:alt", content: SITE_NAME },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:site", content: "@jmurzy" },
			{ name: "twitter:creator", content: "@jmurzy" },
			{ name: "twitter:title", content: SITE_NAME },
			{ name: "twitter:description", content: SITE_DESCRIPTION },
			{ name: "twitter:image", content: SITE_IMAGE_URL },
			{ name: "twitter:image:alt", content: SITE_NAME },
		],
		links: [
			{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;700&display=swap",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify(jsonLd),
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
