import { useState } from "react";

import type { HardcoverBook } from "../../server/hardcover";
import styles from "./HardcoverPreview.module.css";

export interface HardcoverPreviewProps {
	books: HardcoverBook[];
}

export default function HardcoverPreview({ books }: HardcoverPreviewProps) {
	const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

	if (books.length === 0) {
		return null;
	}

	const sequence = Array.from(
		{ length: Math.max(1, Math.ceil(12 / books.length)) },
		(_, repeat) => books.map((book) => ({ book, key: `${repeat}-${book.id}` })),
	).flat();

	return (
		<section
			className={styles.preview}
			aria-label="On my bookshelf"
			onMouseEnter={() => setHoveredTitle(null)}
			onMouseLeave={() => setHoveredTitle(null)}
		>
			<div className={styles.heading}>
				<div>On my bookshelf</div>
				{hoveredTitle ? (
					<span className={styles.hoveredBookTitle}>{hoveredTitle}</span>
				) : null}
			</div>
			<div className={styles.viewport}>
				<div className={styles.track}>
					{[0, 1].map((copy) => (
						<div className={styles.sequence} key={copy}>
							{sequence.map(({ book, key }) => (
								<a
									className={styles.book}
									href={`https://hardcover.app/books/${book.slug}`}
									key={`${copy}-${key}`}
									rel="noreferrer"
									target="_blank"
									aria-label={book.title}
									onMouseEnter={() => setHoveredTitle(book.title)}
									onMouseLeave={() => setHoveredTitle(null)}
									onFocus={() => setHoveredTitle(book.title)}
									onBlur={() => setHoveredTitle(null)}
								>
									{book.imageUrl ? (
										<img
											src={book.imageUrl}
											alt=""
											decoding="async"
											loading="lazy"
										/>
									) : (
										<div className={styles.bookPlaceholder}>
											{book.title.slice(0, 1)}
										</div>
									)}
								</a>
							))}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
