import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useVisits } from "../../hooks/useVisits";
import {
	Footer,
	Section,
	Strip,
	scrollToId,
	styles,
} from "../PageLayout/PageLayout";
import cofounderStyles from "./Cofounder.module.css";
import ernestShackletonUrl from "./images/ernestshackleton.webp";

function MainNav() {
	return (
		<nav className={styles.nav}>
			<ol>
				<li>
					<a href="/">Back to jakemurzy.com</a>
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
			<div>
				<a href="https://cal.com/jmurzy">Let's talk business?</a>
			</div>
			<Strip />
		</div>
	);
}

export default function Cofounder() {
	const { s: section } = useSearch({ from: "/cofounder" });
	const navigate = useNavigate({ from: "/cofounder" });
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
				<MainNav />

				{visits && Object.keys(visits).length > 1 ? <VisitorNotice /> : null}

				<main>
					<Section
						path="/cofounder"
						id="intro"
						dimmed={Boolean(section && section !== "intro")}
						selected={section === "intro"}
						onClickOutside={resetUri}
					>
						<img
							className={cofounderStyles.portrait}
							src={ernestShackletonUrl}
							alt="This but gender neutral."
						/>

						<p className={styles.text}>Hi, I’m Jake.</p>

						<div className={styles.text}>
							If you landed here from my <a href="/">About Me</a>, you already
							know how I think and what I care about. This page is narrower.
							It’s about building a company together.
						</div>
						<div className={styles.text}>
							I’m looking for a co-founder who cares deeply about craft,
							judgment, and doing things the right way. Technical, go-to-market,
							or a rare hybrid. Titles matter less than taste and
							follow-through.
						</div>

						<div className={styles.text}>
							My current focus is AI, specifically human-centered systems and
							new interaction models. Through{" "}
							<a
								href="https://flightdouble.com"
								target="_blank"
								rel="noreferrer"
							>
								FlightDouble
							</a>
							, I’m building and testing cockpit workflows that explore how
							multimodal models and new interfaces can genuinely help pilots
							under pressure. This is not demos for demos’ sake. It’s real
							software, used in real contexts, with high expectations for UX and
							correctness.
						</div>
						<p className={styles.text}>
							I work in high-fidelity prototypes early. I think better with
							something concrete on the table, and I expect real opinions in
							return. If we meet, I’ll show up with something built. We’ll talk
							plainly about the problem, the approach, and whether we should
							keep going together.
						</p>
						<p className={styles.text}>
							I’m based in San Francisco and spend a lot of time in the Bay
							Area. Coffee works. Whiteboards work. Long walks where we argue
							about tradeoffs also work.
						</p>

						<p className={styles.text}>
							Working style wise, I’m direct, collaborative, and low ego. I like
							honest feedback early. I assume good intent. I optimize for long
							term trust.
						</p>

						<p className={styles.text}>
							If this resonates and you’re curious,{" "}
							<a href="mailto:jake@murzy.com">reach out</a>.
						</p>

						<p className={styles.text}>
							If someone comes to mind in your network, I’d really appreciate an
							intro.
						</p>

						<p className={styles.text}>
							What I’m looking for in a partner is pretty simple, but not easy.
						</p>

						<p className={styles.text}>The bar is high, on purpose.</p>

						<p className={styles.text}>If it clicks, it’ll be worth it.</p>

						<p className={styles.text}>
							Without getting more specific, here’s a blunt snapshot of what I
							bring, and what I’m looking for in a partner, so we can quickly
							tell if this is worth exploring:
						</p>
					</Section>

					<Section
						path="/cofounder"
						id="me"
						dimmed={Boolean(section && section !== "me")}
						selected={section === "me"}
						onClickOutside={resetUri}
					>
						<div className={styles.text}>
							Me:
							<ul>
								<li>live in San Francisco;</li>
								<li>can pitch anything;</li>
								<li>have bias towards action;</li>
								<li>
									work extremely hard and have massive learning rate; can find,
									exploit, and sustain technical advantage; wrote a patent
									application with no prior experience in drafting patents;
								</li>
								<li>
									full-stack engineer in the truest sense of the term (Figma,
									Frontend, Backend, Mobile, AI/ML, MLOps, DevOps, Distributed
									Systems, Build Systems, Platform);
								</li>
								<li>
									have many years of experience in UI/UX/DX design; can rapidly
									create high-fidelity prototypes;
								</li>
								<li>
									love creating interactive UI animations, spring physics;
								</li>
								<li>
									can build, teams and code, from small to large. I led the
									effort to build and launch many software products from zero to
									one — in industries ranging from fintech, future of work,
									legal tech, edtech and social media;
								</li>
								<li>Love cross-pollinating ideas across different fields;</li>
								<li>
									my long-term role is{" "}
									<a
										href="https://medium.com/initialized-capital/should-you-be-the-ceo-5a79e34e835"
										target="_blank"
										rel="noopener"
									>
										CEO
									</a>{" "}
									unless you have a proven record of execution and performance -
									in that case, I'm willing to move out of your way and support
									you however I can;
								</li>
								<li>
									value people and bits, quality and speed, and ultimately
									motivated by mission;
								</li>
								<li>excited to aim big and start something new;</li>
								<li>
									love to mentor; taught{" "}
									<a href="https://julia.dev" target="_blank" rel="noopener">
										my wife
									</a>
									, who came from a non-technical background, how to design,
									code and build products. She is currently an engineering
									leader at{" "}
									<a href="https://netflix.com" target="_blank" rel="noopener">
										Netflix
									</a>
									. I also coach others who had similar success stories.
								</li>
								{/* <li>
                  am most like <a href="https://principlesyou.com/share/RqjVZ5cXW_SIq9A" target="_blank">The Shaper</a>.
                </li> */}
							</ul>
						</div>
					</Section>

					<Section
						path="/cofounder"
						id="you"
						dimmed={Boolean(section && section !== "you")}
						selected={section === "you"}
						onClickOutside={resetUri}
					>
						<div className={styles.text}>
							You:
							<ul>
								<li>
									live in San Francisco/Bay Area and plan to stay (
									<a
										href="https://danco.substack.com/p/the-social-subsidy-of-angel-investing"
										target="_blank"
										rel="noopener"
									>
										here's why
									</a>
									);
								</li>
								<li>
									show up on time (being late is disrespectful at best and
									signals a lack of seriousness about building something
									together);
								</li>
								<li>have bias towards action;</li>
								<li>
									are technical—as in you can write production-ready JavaScript
									code and have a good mathematical intuition{" "}
									<strong>— OR —</strong> are strong in B2B SaaS sales
									preferably with a network;
								</li>
								<li>
									excel at written communication, oral communication,
									team-building, leadership, and organizational skills;
								</li>
								<li>work hard;</li>
								<li>are ruthless about moving the company forward;</li>
								<li>
									understand that overnight success typically takes about 5 to
									10 years;
								</li>
								<li>
									are self-confident and have the confidence to influence and
									lead a team;
								</li>
								<li>are not an asshole, or a brilliant jerk;</li>
								<li>
									are excited about many disciplines and are extraordinary at
									one;
								</li>
								<li>identify as an extrovert;</li>
								<li>no addiction to video games, alcohol, or drugs</li>
							</ul>
						</div>

						<div className={styles.text}>
							Bonus Points:
							<ul>
								<li>
									You drive a Tesla and treat every FSD decision like a live
									experiment… running your own mental tests mid-drive to reverse
									engineer the model or at least wishing you could peek at the
									training data;
								</li>
								<li>Your X (aka Twitter) game is fire;</li>
								<li>Work-life balance is the least of your concerns;</li>
								<li>You believe in meritocracy;</li>
								<li>You write a blog;</li>
								<li>
									If you're technical, you get{" "}
									<a
										href="http://bit.ly/2C4igzM"
										target="_blank"
										rel="noopener"
									>
										what this guy's saying
									</a>
									;
								</li>
								<li>
									You've read{" "}
									<a
										href="https://www.amazon.com/Play-Bigger-Dreamers-Innovators-Dominate/dp/0062407619"
										target="_blank"
										rel="noopener"
									>
										Play Bigger
									</a>{" "}
									and align with the goal of becoming a category king;
								</li>
								<li>
									You enjoy hiring/working with people better than you are;
								</li>
								<li>You contribute to Open Source;</li>
								<li>
									You act on a vision of what can be. Money isn't your biggest
									motivator;
								</li>
								<li>
									Company culture and the team are the most important to you;
								</li>
								<li>You snowboard (skiing is alright—lame but alright);</li>
								<li>You're a coffee person.</li>
							</ul>
						</div>
					</Section>

					<Section
						path="/cofounder"
						id="fin"
						noLink
						rotate="0deg"
						dimmed={Boolean(section && section !== "fin")}
						selected={section === "fin"}
						onClickOutside={resetUri}
					>
						<p className={styles.text}>
							If you've read this far, you should say{" "}
							<a href="https://cal.com/jmurzy" target="_blank" rel="noopener">
								hi
							</a>
							.
						</p>

						<p className={styles.text}>Looking forward to the conversation!</p>
					</Section>
				</main>
				<Footer />
			</div>
			<div className={styles.illustrationPane}>
				<div className={styles.illustrationContainer} />
			</div>
		</div>
	);
}
