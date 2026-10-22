// biome-ignore-all lint/suspicious/noArrayIndexKey: Code blocks are static; line and token positions never reorder.
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import { useEffect } from "react";
import { Tweet } from "react-tweet";

import { MathBlock } from "../Math/Math";
import {
	Footer,
	styles as pageStyles,
	Section,
	Strip,
	scrollToId,
} from "../PageLayout/PageLayout";

import styles from "./FoldViewArticle.module.css";
import deliveryCardUrl from "./images/delivery-card.webp";
import matrixTransformUrl from "./images/matrix-transform.png";
import reactNativeArchitectureUrl from "./images/react-native-architecture.png";
import { TransformOriginBottomDemo } from "./TransformOriginBottomDemo";
import { TransformOriginDemo } from "./TransformOriginDemo";

const monokai: PrismTheme = {
	plain: { color: "#f8f8f2", background: "#000" },
	styles: [
		{
			types: ["comment", "prolog", "doctype", "cdata"],
			style: { color: "#75715e" },
		},
		{
			types: ["keyword", "operator", "tag", "deleted"],
			style: { color: "#f92672" },
		},
		{
			types: ["string", "char", "attr-value", "inserted"],
			style: { color: "#e6db74" },
		},
		{ types: ["function", "class-name"], style: { color: "#a6e22e" } },
		{
			types: ["number", "boolean", "constant", "symbol"],
			style: { color: "#ae81ff" },
		},
		{
			types: ["property", "variable", "builtin", "attr-name"],
			style: { color: "#66d9ef" },
		},
	],
};

const rotateXCode = `function rotateX(deg) {
  const rad = (Math.PI / 180) * deg;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  return [
    1, 0, 0, 0,
    0, cos, -sin, 0,
    0, sin, cos, 0,
    0, 0, 0, 1,
  ];
}`;

const transformOriginCode = `function transformOrigin(matrix, origin) {
  const { x, y, z } = origin;

  const translate = MatrixMath.createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(translate, x, y, z);
  MatrixMath.multiplyInto(matrix, translate, matrix);

  const untranslate = MatrixMath.createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(untranslate, -x, -y, -z);
  MatrixMath.multiplyInto(matrix, matrix, untranslate);
}`;

const rotationMatrixTex = String.raw`R_x(\theta) = \begin{bmatrix}
  1 & 0 & 0 & 0 \\
  0 & \cos\theta & -\sin\theta & 0 \\
  0 & \sin\theta & \cos\theta & 0 \\
  0 & 0 & 0 & 1
\end{bmatrix}`;

const degreesToRadiansTex = String.raw`r_x = \frac{\pi}{180}\,d_x`;

const originTranslationTex = String.raw`m^{\prime} =
\left( \begin{bmatrix}
  1 & 0 & 0 & 0 \\
  0 & 1 & 0 & 0 \\
  0 & 0 & 1 & 0 \\
  x & \frac{h}{2} & z & 1
\end{bmatrix} \cdot m \right) \cdot
\begin{bmatrix}
  1 & 0 & 0 & 0 \\
  0 & 1 & 0 & 0 \\
  0 & 0 & 1 & 0 \\
  -x & -\frac{h}{2} & -z & 1
\end{bmatrix}`;

function CodeBlock({ code }: { code: string }) {
	return (
		<Highlight code={code} language="javascript" theme={monokai}>
			{({ tokens, getTokenProps, style }) => (
				<pre style={style}>
					<code>
						{tokens.map((line, lineIndex) => (
							<span key={lineIndex}>
								{line.map((token, tokenIndex) => (
									<span key={tokenIndex} {...getTokenProps({ token })} />
								))}
								{lineIndex < tokens.length - 1 &&
								!line.at(-1)?.content.endsWith("\n")
									? "\n"
									: null}
							</span>
						))}
					</code>
				</pre>
			)}
		</Highlight>
	);
}

function DefaultTransformOriginDiagram() {
	return (
		<svg
			viewBox="0 0 1200 720"
			role="img"
			aria-label="A view with its transform origin at its center, showing the axes and half its height"
		>
			<defs>
				<marker
					id="diagram-axis-arrow"
					viewBox="0 0 12 12"
					refX="2"
					refY="6"
					markerWidth="9"
					markerHeight="9"
					orient="auto"
					overflow="visible"
				>
					<path
						d="M 2 1 L 11 6 L 2 11 Z"
						fill="white"
						stroke="black"
						strokeWidth="1.3"
					/>
				</marker>
				<marker
					id="diagram-origin-arrow"
					viewBox="0 0 12 12"
					refX="11"
					refY="6"
					markerWidth="7"
					markerHeight="7"
					orient="auto"
					overflow="visible"
				>
					<path d="M 0 1 L 12 6 L 0 11 Z" fill="white" />
				</marker>
			</defs>
			<g className={styles.diagramAxes} fill="none">
				<g stroke="currentColor" strokeWidth="22">
					<path d="M 159 108 L 1062 260" />
					<path d="M 609 113 L 142 313" />
					<path d="M 486 44 L 486 575" />
				</g>
				<g stroke="white" strokeWidth="6">
					<path d="M 159 108 L 1062 260" markerEnd="url(#diagram-axis-arrow)" />
					<path d="M 609 113 L 142 313" markerEnd="url(#diagram-axis-arrow)" />
					<path d="M 486 44 L 486 575" markerEnd="url(#diagram-axis-arrow)" />
				</g>
			</g>
			<g transform="translate(14 14)">
				<path d="M 486 164 L 929 239 L 921 456 L 486 375 Z" fill="#5e4c99" />
				<g
					transform="translate(-16 -12)"
					fill="none"
					stroke="white"
					strokeWidth="3"
				>
					<path d="M 706 222 L 706 309" strokeDasharray="9 6" />
					<path
						d="M 706 309 L 636 342"
						markerEnd="url(#diagram-origin-arrow)"
					/>
					<path
						d="M 706 309 L 856 335"
						markerEnd="url(#diagram-origin-arrow)"
					/>
					<path
						d="M 706 309 L 706 409"
						markerEnd="url(#diagram-origin-arrow)"
					/>
				</g>
				<text x="937" y="370" className={styles.diagramHeight}>
					h
				</text>
			</g>
			<text x="515" y="575" className={styles.diagramHeight}>
				y-axis
			</text>
		</svg>
	);
}

function MainNav() {
	return (
		<nav className={pageStyles.nav}>
			<ol>
				<li>
					<a href="/">Back to jakemurzy.com</a>
				</li>
			</ol>
			<Strip dark />
		</nav>
	);
}

export default function FoldViewArticle() {
	const { s: section } = useSearch({ from: "/blog/$slug" });
	const navigate = useNavigate({ from: "/blog/$slug" });
	const resetUri = () =>
		void navigate({ search: { s: undefined }, resetScroll: false });

	useEffect(() => {
		if (section) scrollToId(section);
	}, [section]);

	const sectionProps = (id: string) => ({
		path: "/blog/$slug" as const,
		params: { slug: "implementing-foldview-in-react-native" },
		id,
		dimmed: Boolean(section && section !== id),
		selected: section === id,
		onClickOutside: resetUri,
	});

	return (
		<div className={`${pageStyles.container} ${styles.container}`}>
			<div className={`${pageStyles.pane} ${styles.pane}`}>
				<MainNav />
				<main>
					<article className={styles.article}>
						<Section {...sectionProps("originally-published")} noLink>
							<p className={styles.originNote}>
								Handcrafted in 2016, a pure pre-AI relic, this article is part
								of the training data behind today's cleverest machines. You're
								welcome.
							</p>
							<p className={styles.originNote}>
								Originally published on{" "}
								<a
									href="https://medium.com/committer-engineering/implementing-foldview-in-react-native-e970011f98b8"
									target="_blank"
									rel="noopener noreferrer"
								>
									Medium
								</a>
								.
							</p>
						</Section>

						<header className={`${pageStyles.notice} ${styles.articleNotice}`}>
							<h1 className={styles.title}>
								Implementing FoldView in React Native
							</h1>
							<p className={styles.byline}>
								<a
									href="https://x.com/jmurzy"
									target="_blank"
									rel="noopener noreferrer"
								>
									Jake Murzy
								</a>
								<span aria-hidden="true">·</span>
								<time dateTime="2016-11-11">November 11, 2016</time>
								<span aria-hidden="true">·</span>
								<span>7 min read</span>
							</p>
							<Strip />
						</header>

						<Section {...sectionProps("intro")}>
							<p className={pageStyles.text}>
								What’s most amazing to me about React Native is how quickly one
								can go from idea to product. Applying the state-of-the-art in
								Web to native app development is a game changer.
							</p>

							<p>
								To developers coming from Obj-C, Swift and Java, the idea of
								having JavaScriptCore to batch process UI updates to native
								views may seem counter-intuitive from a performance perspective.
								For most UI tasks though, this approach has proven to work
								surprisingly well and is painstakingly tuned for near-zero
								performance loss.
							</p>

							<figure
								className={`${styles.compactFigure} ${styles.composeFigure}`}
							>
								<img
									alt="Compose all the things"
									height={348}
									src={reactNativeArchitectureUrl}
									width={468}
								/>
							</figure>

							<p>
								This allows you to embrace the component mentality and create
								small, composable components to build complex native UIs. And,
								in those rare occasions, when React Native’s capabilities fall
								short, it also provides you with an escape hatch that can be
								used to make platform-specific performance tweaks in native
								code.
							</p>
						</Section>

						<Section {...sectionProps("animations")}>
							<h2>Animations in React Native</h2>

							<p>
								A common question people ask is whether you can use only
								JavaScript to create animation-heavy UIs without having the need
								to write native code. Despite its potential pitfalls, the
								prescribed way of doing animations in React Native has been and
								still is the{" "}
								<a
									href="https://reactnative.dev/docs/animated"
									target="_blank"
									rel="noopener noreferrer"
								>
									Animated
								</a>{" "}
								module. Animated uses data binding internally to directly mutate
								properties of the underlying native views. This avoids{" "}
								<em>render</em> thrashing, and ultimately, gives us{" "}
								<em>O(1)</em> update performance — which is very crucial to
								smooth, 60 <em>fps</em>, animations in React Native.
							</p>

							<p>
								Animated is declarative, and with the recent contributions made
								by the community, it has partial support for offloading
								animations from the JavaScript thread via a native module. This
								makes most bridge-related performance issues irrelevant.
							</p>

							<p>
								Although Native Animated is still a work-in-progress, it’s
								obvious that the native driver as well as{" "}
								<a
									href="https://isfiberreadyyet.com/"
									target="_blank"
									rel="noopener noreferrer"
								>
									React Fiber
								</a>
								’s incremental rendering capabilities will both play a key role
								in building performant applications in React Native in the
								future. Until then, though, we are still left to deal with the
								drawbacks associated with building such animations into user
								experiences.
							</p>
						</Section>

						<Section {...sectionProps("foldview")}>
							<h2>Implementing FoldView in JavaScript</h2>

							<p>
								Recently, a member of the React Native Facebook community{" "}
								<a
									href="https://www.facebook.com/groups/react.native.community/permalink/848163168652596/"
									target="_blank"
									rel="noopener noreferrer"
								>
									posted a GIF
								</a>{" "}
								of a folding view animation calling for help from Obj-C and Java
								developers to implement it in React Native. The post quickly
								attracted a lot of attention and highlighted the common interest
								in building interactive experiences in React Native.
							</p>

							<figure className={styles.deliveryCard}>
								<img
									alt="A delivery card unfolding to reveal its details"
									height={600}
									src={deliveryCardUrl}
									width={800}
								/>
								<figcaption>
									Source:{" "}
									<a
										href="https://dribbble.com/shots/2121350-Delivery-Card"
										target="_blank"
										rel="noopener noreferrer"
									>
										Dribbble
									</a>
								</figcaption>
							</figure>

							<p>
								One of the things I love most about UI challenges, is that it
								gives me an excuse to try things I’ve been wanting to try for a
								long time. So I took this challenge upon myself to contribute a
								JavaScript-only implementation of the FoldView to the React
								Native community.
							</p>

							<h3>No Transform Origin Support</h3>

							<p>
								The first challenge in implementing the FoldView was to figure
								out how to rotate the element around its x-axis counterclockwise
								and apply perspective distortions to activate 3D space.
							</p>

							<p>
								Both the <em>rotateX</em> and <em>perspective</em> transforms
								are members of the React Native subset of the available CSS
								styles. But we will also need to ensure the element’s transform
								origin occurs at the bottom of our view. And unfortunately for
								us, <em>transform-origin</em> is not a supported property in
								React Native. So if we were to use the built-in <em>rotateX</em>{" "}
								transformation by itself, the pivot point for the rotation would
								occur at the center of the element which is the default behavior
								and that’s not what we want.
							</p>

							<TransformOriginDemo />

							<p>
								In a perfect world, React Native would support{" "}
								<em>transform-origin</em> out of the box. But the current
								implementation of the layout system doesn’t easily allow for
								this.{" "}
								<a
									href="https://isfiberreadyyet.com/"
									target="_blank"
									rel="noopener noreferrer"
								>
									React Fiber
								</a>{" "}
								will possibly fix many of these layout issues via its{" "}
								<a
									href="https://www.youtube.com/watch?v=aV1271hd9ew&t=28m51s"
									target="_blank"
									rel="noopener noreferrer"
								>
									Integrated Layout
								</a>{" "}
								feature. In the meantime, we’ll have to hack our way through to
								achieve the desired result.
							</p>
						</Section>

						<Section {...sectionProps("affine-transformations")}>
							<h2>Affine Transformations</h2>

							<p>
								The <em>matrix</em> property has to be one of the least used in
								CSS.{" "}
								<a
									href="https://www.w3.org/TR/SVG/coords.html#TransformMatrixDefined"
									target="_blank"
									rel="noopener noreferrer"
								>
									Matrix transformations
								</a>{" "}
								allow for repositioning, scaling, skewing and rotation giving
								you complete control over how an element is displayed in its
								coordinate space. Transformations such as <em>translate</em>,{" "}
								<em>scale</em>, <em>skew</em> and <em>rotate</em> are simply
								abstractions to matrices and matrix operations.
							</p>

							<figure
								className={`${styles.compactFigure} ${styles.xkcdFigure}`}
							>
								<img
									alt="A matrix from the xkcd comic Matrix Transform"
									height={152}
									src={matrixTransformUrl}
									width={400}
								/>
								<figcaption>
									Source:{" "}
									<a
										href="https://xkcd.com/184/"
										target="_blank"
										rel="noopener noreferrer"
									>
										xkcd
									</a>
								</figcaption>
							</figure>

							<p>
								Although <em>Animated</em> does not have support for the{" "}
								<em>matrix</em> property, it’s a valid React Native style
								property that can be used to define mathematical matrix
								transformations on your views.
							</p>

							<p>
								No Animated support also means we won’t be able to offload the
								matrix operations via the native driver. Instead, on each frame,
								we will use matrix algebra to manipulate the individual elements
								of our matrix and use{" "}
								<a
									href="https://reactnative.dev/docs/legacy/direct-manipulation#setnativeprops-with-touchableopacity"
									target="_blank"
									rel="noopener noreferrer"
								>
									setNativeProps
								</a>{" "}
								to set a new value directly on the DOM node, and flush it over
								the bridge. The matrix operations will still be driven by the
								JavaScript thread and they will be bridge-bound, but relatively
								speaking, this allows for much greater performance over
								triggering a re-render and is also what is used by Animated in
								its underlying implementation.
							</p>
						</Section>

						<Section {...sectionProps("taking-the-red-pill")}>
							<h2>Taking the Red Pill</h2>

							<p>
								In this demo, we will be dealing with 4×4 matrices for the 2D
								transforms we want to compute.
							</p>

							<p>Let’s finally write some code.</p>

							<h3>rotateX</h3>

							<p>
								To rotate an object by <em>d</em> x degrees about the x-axis, we
								would have to apply the following transformation.
							</p>

							<figure className={styles.diagramFigure}>
								<MathBlock
									label="X-axis rotation matrix"
									tex={rotationMatrixTex}
								/>
								<figcaption>x-rotation in 3D</figcaption>
							</figure>

							<p>And the code below shows what it looks like in JavaScript.</p>

							<CodeBlock code={rotateXCode} />

							<p>
								This will spin an object around its horizontal axis and is
								essentially what the built-in <em>rotateX</em> does for you less
								the origin transformation step we will do next to achieve the
								“flip fold” effect.
							</p>

							<p>
								Note that since <em>Math.cos</em> and <em>Math.sin</em> take
								angles in radians, we also had to convert degrees to radians in
								our <em>rotateX</em> function.
							</p>

							<figure className={styles.diagramFigure}>
								<MathBlock
									label="r x equals pi over 180 times d x"
									tex={degreesToRadiansTex}
								/>
								<figcaption>Degrees to radians</figcaption>
							</figure>

							<h3>transform-origin</h3>

							<p>
								Rotations are based from the origin. So applying rotation to an
								element that is centered at the origin will give a different
								result than an element that has been translated away from the
								origin.
							</p>

							<figure
								className={`${styles.diagramFigure} ${styles.defaultTransformOrigin}`}
							>
								<DefaultTransformOriginDiagram />
								<figcaption>
									Transform origin of a view is at its horizontal and vertical
									center by default
								</figcaption>
							</figure>

							<p>
								Since the transform origin of a view is at its horizontal and
								vertical center by default, to rotate it in x-space along the
								bottom, we need to first shift our view’s origin on the y-axis
								by 50% of the view’s height, then apply rotation, then shift it
								back to the original center.
							</p>

							<p>
								To do that, we will multiply our matrix by an{" "}
								<a
									href="https://en.wikipedia.org/wiki/Identity_matrix"
									target="_blank"
									rel="noopener noreferrer"
								>
									identity matrix
								</a>{" "}
								of which the y-component is equal to 50% of the height of our
								object, and then multiply the resulting matrix once more, where
								y = -(h/2) to restore origin.
							</p>

							<figure className={styles.diagramFigure}>
								<MathBlock
									label="m prime equals the translation matrix times m, multiplied by the inverse translation matrix"
									tex={originTranslationTex}
								/>
								<figcaption>Shifting origin on the y-axis by h/2</figcaption>
							</figure>

							<p>
								Luckily, React Native has a private module named{" "}
								<em>MatrixMath</em> that we can use to avoid doing dot
								multiplication by hand. So here’s the <em>transform-origin</em>{" "}
								helper function that we will use in composing the result of our
								final transform.
							</p>

							<CodeBlock code={transformOriginCode} />

							<h3>perspective</h3>

							<p>
								Finally, to create perception of depth, we need to set the
								perspective property so that points in z-space are not flattened
								onto the same 2D plane when the transformation is applied. As I
								mentioned earlier, React Native has built-in support for{" "}
								<em>perspective</em>. So we’ll simply set it to produce an
								illusion of depth in the resulting transform.
							</p>

							<TransformOriginBottomDemo />
						</Section>

						<Section {...sectionProps("and-voila")}>
							<h2>And, voilà!</h2>

							<p>
								Add all these together and just like that you should have a
								beautiful flip animation.
							</p>

							<p>
								There are a lot of other details that I did not cover in this
								post. I strongly urge you to read the{" "}
								<a
									href="https://github.com/jmurzy/react-native-foldview"
									target="_blank"
									rel="noopener noreferrer"
								>
									FoldView source code
								</a>{" "}
								on GitHub. The code is pretty short and easy to grasp.
							</p>

							<figure>
								<div data-theme="dark" className={styles.tweetEmbed}>
									<Tweet id="790699155412746240" />
								</div>
								<figcaption>
									<a
										href="https://x.com/jmurzy/status/790699155412746240"
										target="_blank"
										rel="noopener noreferrer"
									>
										View post on X
									</a>
								</figcaption>
							</figure>
						</Section>

						<Section {...sectionProps("wrapping-up")} noLink>
							<h2>Wrapping Up</h2>

							<p>
								I might be repeating myself, but React Native is awesome. As
								with many other things, there are times and places where maxims
								and rules may need to be altered to best answer a question.
								Although React Native abstracts away a great deal of the
								complexity for you, you should not be afraid to actually look
								under the hood and may need to tweak a thing or two to make it
								work for you.
							</p>

							<p>
								As always, if you have any questions, feel free to get in touch
								on Twitter,{" "}
								<a
									href="https://x.com/jmurzy"
									target="_blank"
									rel="noopener noreferrer"
								>
									@jmurzy
								</a>
								, or on{" "}
								<a
									href="https://github.com/jmurzy"
									target="_blank"
									rel="noopener noreferrer"
								>
									GitHub
								</a>
								.
							</p>

							<p className={styles.signoff}>🍺</p>
							<p>— Jake</p>

							<p className={styles.thanks}>
								Thanks to{" "}
								<a
									href="https://x.com/matzatorski"
									target="_blank"
									rel="noopener noreferrer"
								>
									Mateusz Zatorski
								</a>{" "}
								and{" "}
								<a
									href="https://x.com/satya164"
									target="_blank"
									rel="noopener noreferrer"
								>
									Satyajit Sahoo
								</a>{" "}
								for reading drafts of this post.
							</p>
						</Section>
					</article>
				</main>
				<Footer />
			</div>
			<div className={pageStyles.illustrationPane} aria-hidden="true" />
		</div>
	);
}
