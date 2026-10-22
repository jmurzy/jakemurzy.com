import styles from "./TransformOriginDemo.module.css";

export function TransformOriginDemo() {
	return (
		<figure>
			<div className={styles.container}>
				<div className={styles.base}>
					<figure className={`${styles.card} ${styles.spin}`} />
				</div>
			</div>
			<figcaption>Rotation occurs at the center of object</figcaption>
		</figure>
	);
}
