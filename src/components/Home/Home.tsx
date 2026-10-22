import {
	Link,
	useLoaderData,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useVisits } from "../../hooks/useVisits";
import type { HardcoverBook } from "../../server/hardcover";
import HardcoverPreview from "../HardcoverPreview/HardcoverPreview";
import {
	Footer,
	Section,
	Strip,
	scrollToId,
	styles,
} from "../PageLayout/PageLayout";
import AsciiIllustration from "./AsciiIllustration";
import homeStyles from "./Home.module.css";

function Nav() {
	return (
		<nav className={styles.nav}>
			<ol>
				<li>
					<Link to="/" search={{ s: "greeting" }} resetScroll={false}>
						About
					</Link>
					{", "}
				</li>
				<li>
					<Link to="/" search={{ s: "ai" }} resetScroll={false}>
						AI
					</Link>
					{", "}
				</li>
				<li>
					<Link to="/" search={{ s: "code" }} resetScroll={false}>
						Code
					</Link>
					{", "}
				</li>
				<li>
					<Link to="/" search={{ s: "design" }} resetScroll={false}>
						Design
					</Link>
					{", "}
				</li>
				<li>
					<Link to="/" search={{ s: "product" }} resetScroll={false}>
						Product
					</Link>
					{", "}
				</li>
				<li>
					<Link to="/" search={{ s: "startup" }} resetScroll={false}>
						Startup
					</Link>
					{", "}
				</li>
				<li>
					<Link to="/" search={{ s: "writing" }} resetScroll={false}>
						Writing
					</Link>
					{", "}
				</li>
				<li>
					<Link to="/" search={{ s: "mentorship" }} resetScroll={false}>
						Mentorship
					</Link>
					{", "}
				</li>
				<li>
					<Link to="/" search={{ s: "angelinvesting" }} resetScroll={false}>
						Angel Investing
					</Link>
					{", "}
				</li>
				<li>
					<Link to="/" search={{ s: "travel" }} resetScroll={false}>
						Travel
					</Link>
					{", "}
				</li>
				<li>
					<Link to="/" search={{ s: "snow" }} resetScroll={false}>
						Snowboarding
					</Link>
				</li>
			</ol>
			<Strip />
		</nav>
	);
}

function SocialNav({ books }: { books: HardcoverBook[] }) {
	return (
		<nav className={styles.nav}>
			<ol>
				<li>
					<a href="https://x.com/jmurzy" target="_blank" rel="noreferrer">
						X
					</a>
					{", "}
				</li>
				<li>
					<a href="https://github.com/jmurzy" target="_blank" rel="noreferrer">
						GitHub
					</a>
					{", "}
				</li>
				<li>
					<a
						href="https://linkedin.com/in/jmurzy"
						target="_blank"
						rel="noreferrer"
					>
						LinkedIn
					</a>
					{", "}
				</li>
				<li>
					<a
						href="https://hardcover.app/@jmurzy/books/library"
						target="_blank"
						rel="noreferrer"
					>
						Hardcover
					</a>
					<HardcoverPreview books={books} />
				</li>
			</ol>
			<Strip dark />
		</nav>
	);
}

function VisitorNotice() {
	return (
		<div className={styles.notice}>
			<div className={styles.noticeHeading}>Wait! You've been here before!</div>
			<p className={homeStyles.noticeQuote}>
				“Insanity is doing the same thing over and over again and expecting
				different results.”
			</p>
			<div>
				<a href="https://cal.com/jmurzy">Let's meet over coffee?</a>
			</div>
			<Strip />
		</div>
	);
}

function TravelNotice() {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className={homeStyles.travelNoticeDisclosure} data-expanded={expanded}>
			<div className={homeStyles.travelNotices} id="travel-notices">
				<section
					className={`${styles.notice} ${homeStyles.travelNotice}`}
					data-kind="upcoming"
				>
					<h3 className={homeStyles.travelNoticeHeading}>
						Upcoming travel plans:
					</h3>
					<p>
						<u>Winter 2026:</u> Dublin 🇮🇪, Edinburgh 🇬🇧, Oslo 🇳🇴, Stockholm 🇸🇪,
						Helsinki 🇫🇮, Tallinn 🇪🇪, Riga 🇱🇻, Copenhagen 🇩🇰, Zagreb 🇭🇷
					</p>
					<p>
						<u>Summer 2027:</u> Panama 🇵🇦, São Paulo 🇧🇷, Buenos Aires 🇦🇷,
						Santiago 🇨🇱, Nevado 🇨🇱🏂, Lima 🇵🇪, Bogotá 🇨🇴, San Salvador 🇸🇻
					</p>
					<p>
						<u>Winter 2027:</u> Beijing 🇨🇳, Chongqing 🇨🇳, Chengdu 🇨🇳, Hong Kong
						🇭🇰, Seoul 🇰🇷, Tokyo 🇯🇵, Bangkok 🇹🇭, Phuket 🇹🇭
					</p>
					<p>Let me know if our paths might cross!</p>
					<Strip />
				</section>

				<section
					className={`${styles.notice} ${homeStyles.travelNotice}`}
					data-kind="recent"
				>
					<h3 className={homeStyles.travelNoticeHeading}>My recent trips:</h3>
					<p>
						<u>Summer 2026:</u> Sydney 🇦🇺, Melbourne 🇦🇺, Auckland 🇳🇿, Kuala
						Lumpur 🇲🇾, Jakarta 🇮🇩, Manila 🇵🇭, Hong Kong 🇭🇰, Guangzhou 🇨🇳
					</p>
					<p>
						<u>Winter 2025:</u> Hong Kong 🇭🇰, Shenzhen 🇨🇳, Zhuhai 🇨🇳, Seoul 🇰🇷,
						Niseko 🇯🇵🏂, Tokyo 🇯🇵
					</p>
					<p>
						<u>Fall 2025:</u> NYC 🇺🇸
					</p>
					<p>
						<u>Summer 2025:</u> Barcelona 🇪🇸, Madrid 🇪🇸, Rome 🇮🇹, Venice 🇮🇹,
						Warsaw 🇵🇱, Zurich 🇨🇭, Athens 🇬🇷
					</p>
					<p>
						<u>Spring 2025:</u> NYC 🇺🇸
					</p>
					<p>
						<u>Winter 2024:</u> Abu Dhabi 🇦🇪, Dubai 🇦🇪, Cappadocia 🇹🇷, Istanbul
						🇹🇷, Lisbon 🇵🇹, Porto 🇵🇹
					</p>
					<p>
						<u>Summer 2024:</u> Frankfurt 🇩🇪, Berlin 🇩🇪, Prague 🇨🇿, Vienna 🇦🇹,
						Budapest 🇭🇺
					</p>
					<p>
						<u>Winter 2023:</u> Hong Kong 🇭🇰, Hanoi 🇻🇳, Singapore 🇸🇬, Taipei 🇹🇼
					</p>
					<p>
						<u>Summer 2023:</u> Cabo San Lucas 🇲🇽, London 🇬🇧, Paris 🇫🇷, Brussels
						🇧🇪, Amsterdam 🇳🇱
					</p>
					<Strip />
				</section>
			</div>
			<button
				aria-controls="travel-notices"
				aria-expanded={expanded}
				className={homeStyles.travelNoticeToggle}
				onClick={() => setExpanded((current) => !current)}
				type="button"
			>
				{expanded ? "Show less" : "Show all trips"}
			</button>
		</div>
	);
}

export default function Home() {
	const { hardcoverBooks } = useLoaderData({ from: "/" });
	const { s: section } = useSearch({ from: "/" });
	const navigate = useNavigate({ from: "/" });
	const resetUri = () =>
		void navigate({ search: { s: undefined }, resetScroll: false });

	useEffect(() => {
		if (section) {
			scrollToId(section);
		}
	}, [section]);

	const visits = useVisits();

	return (
		<div className={styles.container}>
			<div className={styles.pane}>
				{visits && Object.keys(visits).length > 1 ? <VisitorNotice /> : null}

				<SocialNav books={hardcoverBooks} />

				<Nav />

				<main>
					<Section
						path="/"
						id="greeting"
						dimmed={Boolean(section && section !== "greeting")}
						selected={section === "greeting"}
						onClickOutside={resetUri}
					>
						<p className={styles.text}>
							Hi, I’m Jake. I split my time between San Francisco and Lake
							Tahoe, with frequent trips to the East Coast and wherever
							curiosity takes me next.
						</p>

						<p className={styles.text}>
							I’m married to{" "}
							<a href="https://julia.dev" target="_blank" rel="noreferrer">
								Julia Murzy
							</a>
							, my partner in crime and an inspiring engineering leader at{" "}
							<a href="https://netflix.com" target="_blank" rel="noreferrer">
								Netflix
							</a>
							. We push each other a lot, in the best way.
						</p>

						<p className={styles.text}>
							I’ve spent nearly 17 years building things at the intersection of
							code, design and product. Founder life shaped most of that. I’ve
							learned the most from experiments that broke, bent, or surprised
							me. I like problems that fight back, and I’m happiest when I can
							turn ambiguity into something real.
						</p>
					</Section>

					<Section
						path="/"
						id="code"
						rotate="-1deg"
						dimmed={Boolean(section && section !== "code")}
						selected={section === "code"}
						onClickOutside={resetUri}
					>
						<p className={styles.text}>
							Empowering teams and asking good questions are among the highest
							leverage uses of my time, but I still want to stay close to the
							craft. As AI takes on more of the typing, the work shifts toward
							framing the right problems, making good calls, and recognizing
							what is worth building. That makes proximity to the work more
							important, not less.
						</p>
						<p className={styles.text}>
							That’s why I still code. A lot. I just let LLMs do most of the
							typing. They’re tireless, fast, and blissfully unaware of their
							own bad ideas. Yet.
						</p>
						<p className={styles.text}>
							<a
								href="https://www.destroyallsoftware.com/talks/the-birth-and-death-of-javascript"
								target="_blank"
								rel="noreferrer"
							>
								JavaScript
							</a>{" "}
							used to be my favorite compile target. But AI has changed how I
							think about programming languages: English is increasingly the
							source language, and the LLM is the compiler. Anyone with a solid
							foundation in how systems work can now start in a new language and
							get productive immediately. I can now move from writing
							production-grade fine-tuning data pipelines in Python to building
							an entire{" "}
							<a
								href="https://github.com/jmurzy/groove-park/"
								target="_blank"
								rel="noreferrer"
							>
								retro arcade game
							</a>{" "}
							in GDScript to writing C++ ExecuTorch bindings for React Native
							that run custom voice models on-device in a TypeScript app, all in
							a single week.
						</p>
						<p className={styles.text}>
							AI makes it much easier to turn an idea into something real. If
							you’re a good engineer with a foundational understanding of the
							craft, good judgment, and taste, those qualities will increasingly
							set you apart. The limiting factor is increasingly your
							imagination.
						</p>
						<p className={styles.text}>
							My advice to anyone entering the industry: get really good at one
							language and its entire ecosystem. The ecosystem is the important
							part. Many core concepts carry across languages, and knowing one
							ecosystem deeply helps you transfer that understanding without
							outsourcing your judgment to LLMs.
						</p>
						<p className={styles.text}>
							This isn’t nostalgia for hand-writing code. Learning assembly
							teaches you how a machine works; learning an ecosystem teaches you
							how software is actually built, operated, and evolved. You don’t
							need to implement every layer yourself, but you do need enough
							understanding to judge what gets built, where it will fail, and
							when it is good enough to ship, regardless of who types the code.
						</p>
						<p className={styles.text}>
							Beyond that, I don’t have straight answers about what this shift
							means for the industry or for new engineers. The expectations are
							changing fast, and fundamentals matter more, not less. Still, it’s
							an unusually exciting time to be a software engineer.
						</p>
						<p className={styles.text}>
							I briefly dipped my toes into open source and wrote occasionally
							<sup>
								[
								<a
									href="https://commitocracy.com/implementing-foldview-in-react-native-e970011f98b8"
									target="_blank"
									rel="noreferrer"
								>
									1
								</a>
								][
								<a
									href="https://commitocracy.com/introducing-react-router-native-b02e76b8ca5d"
									target="_blank"
									rel="noreferrer"
								>
									2
								</a>
								]
							</sup>
							, mostly about UI architecture, interaction design, and the sharp
							edges you only find by shipping. Founder life got in the way, and
							I haven’t made as much time for either since.
						</p>
					</Section>

					<Section
						path="/"
						id="writing"
						rotate="-1.5deg"
						dimmed={Boolean(section && section !== "writing")}
						selected={section === "writing"}
						onClickOutside={resetUri}
					>
						<p className={styles.text}>
							My writing sometimes sounds academic because I like holding
							multiple opposing ideas in my head at once. That tension is
							usually the point. I’m not trying to sound clever. I’m trying to
							get to something solid. Exploring competing perspectives is how I
							pressure test ideas before committing to one. That habit has
							turned out to be unexpectedly useful for context engineering with
							LLMs. Better results often come from holding competing constraints
							in view long enough to give the model a clearer problem.
						</p>
					</Section>

					<Section
						path="/"
						id="startup"
						rotate="0.9deg"
						dimmed={Boolean(section && section !== "startup")}
						selected={section === "startup"}
						onClickOutside={resetUri}
					>
						<Section
							path="/"
							id="ai"
							rotate="0.9deg"
							dimmed={Boolean(section && section !== "ai")}
							selected={section === "ai"}
							onClickOutside={resetUri}
						>
							<p className={styles.text}>
								Most of my current energy goes into researching human-centered
								AI and turning those ideas into real, testable products. I’m
								using{" "}
								<a
									href="https://flightdouble.com"
									target="_blank"
									rel="noreferrer"
								>
									FlightDouble
								</a>{" "}
								to put ideas into practice, building and testing cockpit
								workflows that explore how multimodal models, new interfaces,
								and LLMs can make a real difference for pilots in high-pressure
								situations. My focus is on rapid experimentation, strong UX, and
								translating cutting-edge AI into intuitive, human-friendly
								tools.
							</p>
						</Section>

						<p className={styles.text}>
							I’m also{" "}
							<a href="/cofounder" target="_blank" rel="noreferrer">
								looking for a co-founder
							</a>{" "}
							who cares deeply about craft, judgment, and building things the
							right way. If someone comes to mind, I’d love an intro.
						</p>
					</Section>

					<Section
						path="/"
						id="product"
						rotate="-1deg"
						dimmed={Boolean(section && section !== "product")}
						selected={section === "product"}
						onClickOutside={resetUri}
					>
						<p className={styles.text}>
							I care a lot about taste. Great products are built through a
							series of small, compounding decisions. I’m drawn to teams that
							aim high, sweat details, and aren’t afraid to challenge
							conventions when it serves a real goal.
						</p>
						<p className={styles.text}>
							I’ve led products from rough sketches to enterprise scale, and I’m
							especially energized when design, engineering, and product
							thinking are truly integrated.
						</p>
					</Section>

					<Section
						path="/"
						id="design"
						rotate="0deg"
						dimmed={Boolean(section && section !== "design")}
						selected={section === "design"}
						onClickOutside={resetUri}
					>
						<p className={styles.text}>
							I’m not a designer by title, but I’m obsessive about design
							quality. I’ve built and maintained design systems, UI component
							libraries, and interaction patterns across web and mobile. I pay
							attention to how things feel, not just how they look. Motion,
							affordances, and tiny interaction details matter.
						</p>
						<p className={styles.text}>
							I shamelessly borrow from designers who share their thinking
							publicly, and I try to pass that generosity forward.
						</p>
					</Section>

					<Section
						path="/"
						id="mentorship"
						rotate="1deg"
						dimmed={Boolean(section && section !== "mentorship")}
						selected={section === "mentorship"}
						onClickOutside={resetUri}
					>
						<p className={styles.text}>
							Mentorship has been a constant through my career.
						</p>
						<p className={styles.text}>
							I’ve helped engineers grow from IC to senior to leadership roles,
							and coached career transitions from non-technical backgrounds into
							senior engineering and management positions. I tend to highlight
							what seems obvious to me, without assuming others see it too,
							because that's often where the biggest leverage is for someone
							learning.
						</p>
						<p className={styles.text}>
							I’m always looking for new mentors too. Learning compounds fastest
							when you stay uncomfortable.
						</p>
					</Section>

					<Section
						path="/"
						id="angelinvesting"
						rotate=".5deg"
						dimmed={Boolean(section && section !== "angelinvesting")}
						selected={section === "angelinvesting"}
						onClickOutside={resetUri}
					>
						<p className={styles.text}>
							I occasionally invest small checks in early stage startups,
							usually pre-seed or seed. I’m most interested in teams with strong
							taste, clear judgment, and the potential to{" "}
							<a href="https://amzn.to/3jDMY8z" target="_blank" rel="noopener">
								define a category
							</a>
							. I expect to do one to three of these a year.
						</p>
					</Section>

					<Section
						path="/"
						id="travel"
						rotate="0deg"
						dimmed={Boolean(section && section !== "travel")}
						selected={section === "travel"}
						onClickOutside={resetUri}
					>
						<p className={styles.text}>
							<a href="https://julia.dev" target="_blank" rel="noreferrer">
								Julia
							</a>{" "}
							and I are slowly working toward a long term goal of seeing the
							whole world together. We’ve visited 50+ countries so far.{" "}
							<a
								href="https://www.google.com/search?udm=2&q=Koh+Yao+Yai"
								target="_blank"
								rel="noreferrer"
							>
								Koh Yao Yai
							</a>{" "}
							is our current favorite escape. Quiet, off the grid, and a good
							reminder to zoom out and recalibrate before jumping back in.
						</p>

						<TravelNotice />
					</Section>

					<Section
						path="/"
						id="snow"
						rotate="1.5deg"
						dimmed={Boolean(section && section !== "snow")}
						selected={section === "snow"}
						onClickOutside={resetUri}
					>
						<p className={styles.text}>
							When I’m not working, I’m usually outside. Winter is my season.
							Snowboarding has been my reset button for years, and I recently
							picked up skiing too. Summers pull me toward the ocean, and
							surfing has become the perfect counterbalance. Moving through
							nature clears my head better than anything else.
						</p>
					</Section>

					<Section
						path="/"
						id="fin"
						noLink
						rotate="0deg"
						dimmed={Boolean(section && section !== "fin")}
						selected={section === "fin"}
						onClickOutside={resetUri}
					>
						<p className={styles.text}>
							At the end of the day, I care about the work, the people I do it
							with, and the impact of what we build.
						</p>
						<p className={styles.text}>
							I thrive on craft, clear judgment, and constant learning. The best
							problems challenge your taste and make the work feel worth it.
						</p>

						<p className={styles.text}>
							If any of that resonates, we’ll probably get along.
						</p>

						<p className={styles.text}>Fin.</p>
					</Section>
				</main>
				<Footer />
			</div>
			<div className={styles.illustrationPane}>
				<div className={styles.illustrationContainer}>
					<AsciiIllustration
						className={homeStyles.illustration}
						cellSize={8}
						rotationIntensity={0.5}
						floatIntensity={0.35}
						floatSpeed={1}
					/>
				</div>
			</div>
		</div>
	);
}
