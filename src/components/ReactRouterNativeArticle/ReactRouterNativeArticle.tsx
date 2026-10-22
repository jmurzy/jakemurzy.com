// biome-ignore-all lint/suspicious/noArrayIndexKey: Code block lines and tokens are static.
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import { useEffect } from "react";

import {
	Footer,
	styles as pageStyles,
	Section,
	Strip,
	scrollToId,
} from "../PageLayout/PageLayout";
import addressBarUrl from "./images/dinesh.gif";
import demoUrl from "./images/demo.gif";
import exampleUrl from "./images/address-bar.png";
import hardwareBackUrl from "./images/hardware-back.png";
import styles from "./ReactRouterNativeArticle.module.css";

const originalUrl =
	"https://medium.com/committer-engineering/introducing-react-router-native-b02e76b8ca5d";

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

const exampleCode = `import React from 'react';
import { Header, Link, nativeHistory, Route, Router, StackRoute, withRouter } from 'react-router-native';
import { ScrollView, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  component: { backgroundColor: '#FFFFFF', flex: 1 },
  home: { backgroundColor: '#FFFFFF' flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  detailCard: { height: 100, margin: 20, width: 100 },
});

const Master = (props) => (<View style={styles.component}>{props.children}</View>);

const HomeHeader = withRouter((props) => {
  const handleRightButtonPress = () => {
    props.router.push('/detail/gray');
  };

  return (
    <Header {...props} style={{ backgroundColor: '#26BBE5' }} title="Feed" rightButtonText="Gray" onRightButtonPress={handleRightButtonPress} />
  );
});

const Home = () => {
  const DetailCard = ({ backgroundColor }) => (
    <Link to={\`/detail/\${encodeURIComponent(backgroundColor)}\`} style={styles.detailCard}>
      <View style={{ flex: 1, backgroundColor }} />
    </Link>
  );

  return (
    <ScrollView style={styles.component} contentContainerStyle={styles.home}>
      <DetailCard backgroundColor="#EF4E5E" />
      <DetailCard backgroundColor="#9498CA" />
      <DetailCard backgroundColor="#AFCCB3" />
      <DetailCard backgroundColor="#F0D73D" />
      <DetailCard backgroundColor="#A176B0" />
      <DetailCard backgroundColor="#416BB4" />
      <DetailCard backgroundColor="#94B5DC" />
      <DetailCard backgroundColor="#D48445" />
    </ScrollView>
  );
};

const DetailHeader = withRouter((props) => {
  const { routeParams } = props;
  const title = routeParams.themeColor;
  const backgroundColor = routeParams.themeColor;
  const colors = ['#EF4E5E', '#D48445', '#AFCCB3', '#F0D73D', '#A176B0'];

  const handleRightButtonPress = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomIndex];
    props.router.push(\`/detail/\${encodeURIComponent(randomColor)}\`);
  };

  return (
    <Header {...props} title={title} style={{ backgroundColor }} leftButtonText="Back" rightButtonText="Random" onRightButtonPress={handleRightButtonPress} />
  );
});

const Detail = (props) => (
  <View style={[styles.component, { backgroundColor: '#FFFFFF' }]}>{props.children}</View>
);

const routes = (
  /* Address Bar can be toggled on or off by setting the addressBar prop */
  <Router history={nativeHistory} addressBar>
    <StackRoute path="master" component={Master}>
      <Route path="/" component={Home} overlayComponent={HomeHeader} />
      <Route path="/detail/:themeColor" component={Detail} overlayComponent={DetailHeader} />
    </StackRoute>
  </Router>
);

export default routes; `;

function CodeBlock({ code }: { code: string }) {
	return (
		<Highlight code={code} language="jsx" theme={monokai}>
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

export default function ReactRouterNativeArticle() {
	const { s: section } = useSearch({ from: "/blog/$slug" });
	const navigate = useNavigate({ from: "/blog/$slug" });
	const resetUri = () =>
		void navigate({ search: { s: undefined }, resetScroll: false });

	useEffect(() => {
		if (section) scrollToId(section);
	}, [section]);

	const sectionProps = (id: string) => ({
		path: "/blog/$slug" as const,
		params: { slug: "introducing-react-router-native" },
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
								<a href={originalUrl} target="_blank" rel="noopener noreferrer">
									Medium
								</a>
								.
							</p>
						</Section>

						<header className={`${pageStyles.notice} ${styles.articleNotice}`}>
							<h1 className={styles.title}>Introducing React Router Native</h1>
							<p className={styles.byline}>
								<a
									href="https://x.com/jmurzy"
									target="_blank"
									rel="noopener noreferrer"
								>
									Jake Murzy
								</a>
								<span aria-hidden="true">·</span>
								<time dateTime="2016-09-12">September 12, 2016</time>
								<span aria-hidden="true">·</span>
								<span>4 min read</span>
							</p>
							<Strip />
						</header>

						<Section {...sectionProps("intro")}>
							<h2>Learn Once, Write Anywhere</h2>
							<p>
								I’m very excited to announce a project that has been a few
								months in the making,{" "}
								<a
									href="https://github.com/jmurzy/react-router-native"
									target="_blank"
									rel="noopener noreferrer"
								>
									react-router-native
								</a>
								, a routing library for <em>React Native</em> that strives for
								sensible API parity with{" "}
								<a
									href="https://github.com/reactjs/react-router/"
									target="_blank"
									rel="noopener noreferrer"
								>
									react-router
								</a>
								.
							</p>
							<p>
								This project was born out of my frustration while searching for
								a router to use with <em>React Native</em>. Unfortunately,
								<em> React Router</em> itself{" "}
								<a
									href="https://github.com/reactjs/react-router/issues/743"
									target="_blank"
									rel="noopener noreferrer"
								>
									doesn’t have support
								</a>{" "}
								for <em>React Native</em>, and the{" "}
								<em>NavigationExperimental</em> team has{" "}
								<a
									href="https://github.com/ericvicenti/navigation-rfc/issues/64#issuecomment-209001717"
									target="_blank"
									rel="noopener noreferrer"
								>
									no intention to support
								</a>{" "}
								a <em>React Router</em>-like interface. This leaves the
								navigation state up to the developer to maintain. As awesome as{" "}
								<em>NavigationExperimental</em> is, it is a bit too low level
								for people that want to focus on the real challenges of their
								apps and not the insignificant details of navigation state
								management. The low level nature of{" "}
								<em>NavigationExperimental</em> is only by design to allow
								greater abstractions to be built up in higher layers.
							</p>
						</Section>

						<Section {...sectionProps("goals")}>
							<h2>Goals</h2>
							<p>
								Primary goals of <em>React Router Native</em> are:
							</p>
							<ul>
								<li>URL Driven Development</li>
								<li>
									<strong>Learn once, write anywhere</strong>: knowledge and
									proven idioms from <em>React Router</em> can be reused while
									extending them as necessary to allow navigation semantics
									unique to native platforms
								</li>
								<li>First class deep linking support</li>
								<li>Cross-platform</li>
							</ul>
							<p>
								A declarative API removes the need to write boilerplate code and
								greatly speeds up native app development. <em>React Router</em>{" "}
								has done a pretty good job of this on the web. Following{" "}
								<em>React</em>’s “learn once, write anywhere” principle, I
								thought the best approach to creating a similar abstraction
								would be through marrying <em>React Router</em> concepts, or
								rather <em>React Router</em> itself, to those of{" "}
								<em>NavigationExperimental</em>.
							</p>
							<p>
								<em>React Router Native</em> is the product of this marriage. It
								provides a superset of <em>React Router</em>’s API, uses{" "}
								<em>React Router</em> to render navigational components and
								delegates rendering of user components to{" "}
								<em>NavigationExperimental</em>, all without taking away
								control—so you still have access to{" "}
								<em>NavigationExperimental features</em> to do all kinds of
								fancy transition animations if that’s what you need.
							</p>
							<figure>
								<img
									className={styles.demoImage}
									src={demoUrl}
									alt="React Router Native navigation demo with an address bar"
									width={638}
									height={1077}
								/>
								<figcaption>
									React Router Native example with <b>address bar</b>
								</figcaption>
							</figure>
						</Section>

						<Section {...sectionProps("framework-agnostic")}>
							<h2>Framework agnostic</h2>
							<p>
								Since <em>React Router Native</em> manages navigation state for
								you, you don’t have to write reducers for each and every scene
								you want to render. In fact,{" "}
								<a
									href="https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367"
									target="_blank"
									rel="noopener noreferrer"
								>
									if you are not a Redux-person
								</a>
								, you don’t even need to know what a <em>reducer</em> is to
								start using <em>React Router Native</em>.
							</p>
							<p>
								This is especially useful when you are just getting started and
								all you need is to be able to click a button and have it
								transition to a different scene. The following code example does
								that and much, much more under 75 lines of code. I highly
								encourage you to compare the brevity of this example to whatever
								you may be using today.
							</p>
							<p>
								When you are ready to explore further, there is a more complex{" "}
								<a
									href="https://github.com/jmurzy/react-router-native/tree/master/examples"
									target="_blank"
									rel="noopener noreferrer"
								>
									example
								</a>{" "}
								in the repo that demonstrates various common patterns found in
								modern mobile applications.
							</p>
							<CodeBlock code={exampleCode} />
						</Section>

						<Section {...sectionProps("address-bar")}>
							<h2>The Address Bar</h2>
							<p>
								I admit the native app ecosystem is not web-like, and you can
								argue that URLs aren’t necessary. But I think, most people take
								URLs for granted and their advantages are not so pronounced.
							</p>
							<figure>
								<img
									className={`${styles.smallImage} ${styles.exampleImage}`}
									src={exampleUrl}
									alt="Navigation controls, an address bar showing /profile/me, and a Docs button"
									width={600}
									height={110}
								/>
								<figcaption>
									<b>Development mode</b> in React Router Native
								</figcaption>
							</figure>
							<p>
								<em>React Router Native</em> encourages URL driven development.
								A not so surprising perk of this is first-class deep-linking
								support. In <em>React Router Native</em>, you can toggle a prop
								on your <em>Router</em> to go into development mode. This places
								an address bar above your app and creates a browser-like
								environment.
							</p>
							<figure>
								<img
									className={styles.addressBarImage}
									src={addressBarUrl}
									alt="Entering a URL in the React Router Native address bar to navigate between screens"
									width={480}
									height={269}
								/>
							</figure>
							<p>
								I cannot stress enough how awesome it is being able to navigate
								your app via the address bar when developing native apps. You
								just have to{" "}
								<a
									href="https://github.com/jmurzy/react-router-native/blob/master/docs/Examples.md"
									target="_blank"
									rel="noopener noreferrer"
								>
									hop on inside
								</a>{" "}
								and see it for yourself.
							</p>
						</Section>

						<Section {...sectionProps("hardware-back-button")}>
							<h2>Hardware Back Button</h2>
							<p>
								<em>React Router Native</em> provides sensible defaults to
								handle the user pressing the hardware back button on an Android
								device. This works “magically” without manual labor on your end.
								When the default behavior doesn’t work for you, it also provides
								you with the necessary hooks to{" "}
								<a
									href="https://github.com/jmurzy/react-router-native/tree/master/docs#hardware-back-button"
									target="_blank"
									rel="noopener noreferrer"
								>
									customize the hardware back button behavior
								</a>
								.
							</p>
							<figure>
								<img
									className={`${styles.smallImage} ${styles.hardwareBackImage}`}
									src={hardwareBackUrl}
									alt="Android hardware back button illustration"
									width={381}
									height={74}
								/>
							</figure>
						</Section>

						<Section {...sectionProps("closing-notes")} noLink>
							<h2>Closing Notes</h2>
							<p>
								We’re still in the early days of <em>React Native</em> and{" "}
								<em>NavigationExperimental</em> figuring out the right
								abstractions. Navigation on mobile is a challenging task, and
								having different flavors is, in my opinion, only healthier as
								the community weighs the pros and cons of each approach rather
								than second guessing best-practices.
							</p>
							<p>
								As for <em>React Router Native</em>, it is also at a very early
								stage and it’s intentional. I’m hoping to get the community
								involved to shape the direction of the project. A number of
								community members have already jumped in to help, and you should
								too.
							</p>
							<p>
								Finally, <em>React Router Native</em> may or may not be the
								right venue for you. But if you use it and find it works for
								you, please take a moment to send a thank you note to the
								following members of the awesome React community who made all
								this possible:
							</p>
							<p>
								<strong>Ryan Florence</strong>{" "}
								<a
									href="https://x.com/ryanflorence"
									target="_blank"
									rel="noopener noreferrer"
								>
									@ryanflorence
								</a>
								, <strong>Michael Jackson</strong>{" "}
								<a
									href="https://x.com/mjackson"
									target="_blank"
									rel="noopener noreferrer"
								>
									@mjackson
								</a>
								, <strong>Eric Vicenti</strong> @ericvicenti and{" "}
								<strong>Hedger Wang</strong>{" "}
								<a
									href="https://x.com/hedgerwang"
									target="_blank"
									rel="noopener noreferrer"
								>
									@hedgerwang
								</a>
							</p>
							<p>
								If you have any questions, feel free to get in touch on Twitter,{" "}
								<a
									href="https://x.com/jmurzy"
									target="_blank"
									rel="noopener noreferrer"
								>
									@jmurzy
								</a>
								.
							</p>
							<p>
								You can also jump in{" "}
								<a
									href="https://github.com/jmurzy/react-router-native/issues"
									target="_blank"
									rel="noopener noreferrer"
								>
									Github issues
								</a>{" "}
								and start a conversation.
							</p>
							<p className={styles.signoff}>🍺</p>
							<p>—Jake</p>
						</Section>
					</article>
				</main>
				<Footer />
			</div>
			<div className={pageStyles.illustrationPane} aria-hidden="true" />
		</div>
	);
}
