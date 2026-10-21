import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";

const HARDCOVER_API_URL = "https://api.hardcover.app/v1/graphql";
const LIBRARY_SIZE = 24;

export interface HardcoverBook {
	id: number;
	imageUrl: string | null;
	slug: string;
	title: string;
}

interface GraphqlResponse<Data> {
	data?: Data;
	errors?: Array<{ message: string }>;
}

async function queryHardcover<Data>(
	token: string,
	query: string,
	variables?: Record<string, unknown>,
): Promise<Data> {
	const response = await fetch(HARDCOVER_API_URL, {
		method: "POST",
		headers: {
			accept: "application/json",
			authorization: `Bearer ${token}`,
			"content-type": "application/json",
		},
		body: JSON.stringify({ query, variables }),
	});

	if (!response.ok) {
		throw new Error(`Hardcover API returned ${response.status}`);
	}

	const result = (await response.json()) as GraphqlResponse<Data>;

	if (!result.data || result.errors?.length) {
		throw new Error(
			result.errors?.[0]?.message ?? "Hardcover API returned no data",
		);
	}

	return result.data;
}

export const getHardcoverLibrary = createServerFn({ method: "GET" }).handler(
	async (): Promise<HardcoverBook[]> => {
		if (!env.HARDCOVER_API_TOKEN) {
			return [];
		}

		const profile = await queryHardcover<{ me: Array<{ id: number }> }>(
			env.HARDCOVER_API_TOKEN,
			`query MyProfile {
				me {
					id
				}
			}`,
		);
		const userId = profile.me[0]?.id;

		if (!userId) {
			return [];
		}

		const library = await queryHardcover<{
			user_books: Array<{
				id: number;
				book: { image: { url: string } | null; slug: string; title: string };
			}>;
		}>(
			env.HARDCOVER_API_TOKEN,
			`query MyLibrary($userId: Int!, $limit: Int!) {
				user_books(
					where: { user_id: { _eq: $userId } }
					order_by: { date_added: desc }
					limit: $limit
				) {
					id
					book {
						title
						slug
						image {
							url
						}
					}
				}
			}`,
			{ userId, limit: LIBRARY_SIZE },
		);

		return library.user_books.map(({ book, id }) => ({
			id,
			imageUrl: book.image?.url ?? null,
			slug: book.slug,
			title: book.title,
		}));
	},
);
