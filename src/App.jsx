import { Header } from "./components/Header"
import { Main } from "./components/Main"
import styles from "./meme-generator.module.css";

export default function App() {
  return (
    <div className={styles.mainMemeContainer}>
      <Header />
      <Main />
    </div>
  );
}
