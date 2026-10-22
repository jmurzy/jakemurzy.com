import { Footer, Strip, styles } from "../PageLayout/PageLayout";

import notFoundStyles from "./NotFound.module.css";

export default function PageNotFound() {
	return (
		<div className={`${styles.container} ${notFoundStyles.container}`}>
			<div className={`${styles.pane} ${notFoundStyles.pane}`}>
				<div className={styles.notice}>
					<div className={styles.noticeHeading}>That page isn’t here.</div>
					<div>
						<a href="/">Back to jakemurzy.com</a>
					</div>
					<Strip />
				</div>
				<Footer />
			</div>
		</div>
	);
}
