import { Footer, Strip, styles } from "../PageLayout/PageLayout";

import { articles } from "./articles";
import blogStyles from "./Blog.module.css";

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

export default function Blog() {
	return (
		<div className={`${styles.container} ${blogStyles.container}`}>
			<div className={`${styles.pane} ${blogStyles.pane}`}>
				<MainNav />
				<main>
					<ul className={blogStyles.list}>
						{articles.map((article) => (
							<li className={blogStyles.item} key={article.slug}>
								<a className={blogStyles.link} href={`/blog/${article.slug}`}>
									<time
										className={blogStyles.date}
										dateTime={article.published}
									>
										{article.label}
									</time>
									<span className={blogStyles.title}>{article.title}</span>
								</a>
							</li>
						))}
					</ul>
				</main>
				<Footer />
			</div>
			<div className={styles.illustrationPane} aria-hidden="true" />
		</div>
	);
}
