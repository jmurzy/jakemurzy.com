import { useEffect, useRef, useState } from "react";
import styles from "./AsciiIllustration.module.css";
import type { AsciiStage, AsciiStageOptions } from "./asciiStage";
import Illustration from "./Illustration";

const VIEW_WIDTH = 1214;
const VIEW_HEIGHT = 846;
const RASTER_SIZE = 2048;

export interface AsciiIllustrationProps extends AsciiStageOptions {
	className?: string;
	/** Accessible description of the artwork. */
	label?: string;
}

function loadSvgImage(url: string) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image();
		image.decoding = "async";
		image.onload = () => resolve(image);
		image.onerror = () => reject(new Error("Could not decode the SVG"));
		image.src = url;
	});
}

/** Rasterize the live SVG so the renderer can measure the artwork's tones. */
async function rasterize(
	svg: SVGSVGElement,
): Promise<HTMLCanvasElement | null> {
	const scale = RASTER_SIZE / Math.max(VIEW_WIDTH, VIEW_HEIGHT);
	const width = Math.round(VIEW_WIDTH * scale);
	const height = Math.round(VIEW_HEIGHT * scale);

	const clone = svg.cloneNode(true) as SVGSVGElement;
	clone.setAttribute("width", String(width));
	clone.setAttribute("height", String(height));
	clone.removeAttribute("class");
	clone.removeAttribute("aria-hidden");

	const markup = new XMLSerializer().serializeToString(clone);
	const url = URL.createObjectURL(
		new Blob([markup], { type: "image/svg+xml;charset=utf-8" }),
	);
	try {
		const image = await loadSvgImage(url);
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return null;
		ctx.drawImage(image, 0, 0, width, height);
		return canvas;
	} catch {
		return null;
	} finally {
		URL.revokeObjectURL(url);
	}
}

/**
 * The site illustration drawn in the browser as ASCII characters. The
 * three.js stage is kept out of the initial bundle and only built the first
 * time the artwork is hovered. Between hovers the plain SVG is shown and the
 * renderer is paused, so nothing runs unless someone points at it.
 */
export default function AsciiIllustration({
	className,
	label = "Isometric illustration of a creative workspace",
	...options
}: AsciiIllustrationProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<AsciiStage | null>(null);
	const startRef = useRef<(() => void) | null>(null);
	const hoveredRef = useRef(false);
	const latestOptions = useRef(options);
	const [hovered, setHovered] = useState(false);
	const [ready, setReady] = useState(false);

	latestOptions.current = options;

	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) return;

		let cancelled = false;
		let starting = false;

		const start = async () => {
			const svg = svgRef.current;
			const canvas = canvasRef.current;
			if (!svg || !canvas || starting || stageRef.current) return;

			starting = true;
			const source = await rasterize(svg);
			if (!source || cancelled) {
				starting = false;
				return;
			}

			const { createAsciiStage } = await import("./asciiStage");
			if (cancelled) {
				starting = false;
				return;
			}

			const stage = createAsciiStage(canvas, source, latestOptions.current);
			starting = false;
			if (!stage) return;

			// A hover that ended while the stage was building should not leave
			// it rendering behind the plain illustration.
			if (!hoveredRef.current) stage.pause();
			stageRef.current = stage;
			setReady(true);
		};

		startRef.current = () => void start();

		return () => {
			cancelled = true;
			startRef.current = null;
			stageRef.current?.destroy();
			stageRef.current = null;
		};
	}, []);

	// Rendering is tied to the pointer being over the artwork: the stage is
	// built on the first hover and paused again as soon as the pointer leaves.
	useEffect(() => {
		if (hovered) {
			startRef.current?.();
			stageRef.current?.resume();
		} else {
			stageRef.current?.pause();
		}
	}, [hovered]);

	useEffect(() => {
		stageRef.current?.update(options);
	});

	const showAscii = ready && hovered;

	return (
		<div
			className={className ? `${styles.root} ${className}` : styles.root}
			onPointerEnter={() => {
				hoveredRef.current = true;
				setHovered(true);
			}}
			onPointerLeave={() => {
				hoveredRef.current = false;
				setHovered(false);
			}}
			ref={wrapperRef}
		>
			<Illustration
				aria-hidden={showAscii}
				className={styles.artwork}
				data-hidden={showAscii}
				ref={svgRef}
			/>
			<canvas
				aria-hidden={!showAscii}
				aria-label={label}
				className={styles.canvas}
				data-ready={showAscii}
				ref={canvasRef}
				role="img"
			/>
		</div>
	);
}
