import { Link } from "@tanstack/react-router";
import type { ReactNode, RefObject, SVGProps } from "react";
import { useEffect, useRef } from "react";

import styles from "./PageLayout.module.css";

type SectionProps = {
	children: ReactNode;
	dimmed?: boolean;
	id: string;
	noLink?: boolean;
	onClickOutside: () => void;
	path: "/" | "/cofounder" | "/blog/$slug";
	params?: { slug: string };
	rotate?: string;
	selected?: boolean;
};

function hasClickHandler(element: Element | null): boolean {
	if (!(element instanceof HTMLElement)) return false;
	if (element.onclick) return true;
	return hasClickHandler(element.parentElement);
}

function useClickOutside(
	elementRef: RefObject<HTMLElement | null>,
	callback: () => void,
) {
	const callbackRef = useRef(callback);
	callbackRef.current = callback;

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target;
			if (
				!(target instanceof Element) ||
				elementRef.current?.contains(target)
			) {
				return;
			}

			if (target.closest("a, button") || hasClickHandler(target)) return;
			callbackRef.current();
		};

		document.addEventListener("click", handleClickOutside, true);
		return () =>
			document.removeEventListener("click", handleClickOutside, true);
	}, [elementRef]);
}

export function Section({
	children,
	dimmed = false,
	id,
	noLink = false,
	onClickOutside,
	path,
	params,
	rotate = "0deg",
	selected = false,
}: SectionProps) {
	const elementRef = useRef<HTMLDivElement>(null);
	useClickOutside(elementRef, () => {
		if (selected) onClickOutside();
	});

	return (
		<div className={styles.section}>
			<div
				className={styles.sectionContent}
				data-dimmed={dimmed}
				data-rotate={rotate}
				data-selected={selected}
				id={id}
				ref={elementRef}
			>
				{children}
			</div>
			{noLink ? null : (
				<div className={styles.hardLink}>
					{path === "/blog/$slug" && params ? (
						<Link
							aria-label={`Link to ${id}`}
							params={params}
							resetScroll={false}
							search={{ s: id }}
							to={path}
						>
							<LinkIcon />
						</Link>
					) : path === "/" || path === "/cofounder" ? (
						<Link
							aria-label={`Link to ${id}`}
							resetScroll={false}
							search={{ s: id }}
							to={path}
						>
							<LinkIcon />
						</Link>
					) : null}
				</div>
			)}
		</div>
	);
}

export function Strip({ dark = false }: { dark?: boolean }) {
	return <span className={styles.strip} data-dark={dark} />;
}

export function Footer() {
	return (
		<footer>
			<div className={styles.copyright}>
				© {new Date().getFullYear()} Jake Murzy
			</div>
		</footer>
	);
}

export function scrollToId(id?: string) {
	if (!id) return;
	const element = document.getElementById(id);
	if (!element) return;
	setTimeout(
		() =>
			element.scrollIntoView({
				behavior: "auto",
				block: "center",
				inline: "nearest",
			}),
		0,
	);
}

function LinkIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			height={18}
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			viewBox="0 0 24 24"
			width={18}
			{...props}
		>
			<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
			<path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
		</svg>
	);
}

export { styles };
