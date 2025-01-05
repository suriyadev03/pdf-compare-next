import { Html, Head, Main, NextScript } from "next/document";
import styles from '../styles/globals.module.css'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body id={styles.body}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
