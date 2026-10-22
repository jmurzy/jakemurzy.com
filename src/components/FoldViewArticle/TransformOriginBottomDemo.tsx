import styles from "./TransformOriginBottomDemo.module.css";

export function TransformOriginBottomDemo() {
	return (
		<figure>
			<div className={styles.container}>
				<div className={styles.base}>
					<figure className={`${styles.card} ${styles.spin}`} />
				</div>
			</div>
			<figcaption>Rotation occurs at the bottom of object</figcaption>
		</figure>
	);
}
