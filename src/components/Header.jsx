import trollFace from "../assets/troll-face.png";
import styles from "../meme-generator.module.css";

export function Header() {
  return (
    <header className={styles.memeHeader}>
      <img alt="" src={trollFace} />
      <h1>Meme Generator</h1>
    </header>
  );
}
