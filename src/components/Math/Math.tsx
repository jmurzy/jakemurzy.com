import katex from "katex";
import { useMemo } from "react";

import "katex/dist/katex.min.css";
import styles from "./Math.module.css";

type MathBlockProps = {
	/** LaTeX source for the expression. */
	tex: string;
	/** Spoken description for screen readers, in place of raw TeX. */
	label?: string;
};

/**
 * Renders display math with KaTeX. KaTeX typesets once to HTML + MathML, so the
 * output stays legible without relying on the browser's native MathML styling.
 */
export function MathBlock({ tex, label }: MathBlockProps) {
	const html = useMemo(
		() =>
			katex.renderToString(tex, {
				displayMode: true,
				throwOnError: false,
			}),
		[tex],
	);

	return (
		<div
			className={styles.math}
			role="math"
			aria-label={label}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX output is generated from trusted, static LaTeX written in the article.
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
