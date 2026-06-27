import styles from "./transitionSection.module.css";

export default function TransitionSection() {
  return (
    <div className={styles.transition}>
      {/* Gradient background */}
      <div className={styles.gradient} />
      {/* Vignette overlay */}
      <div className={styles.vignette} />
    </div>
  );
}
