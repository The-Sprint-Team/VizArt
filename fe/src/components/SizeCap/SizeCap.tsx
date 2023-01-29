import { useState, useEffect } from "react";

import styles from "./style.module.scss";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

type Props = {
  width: number;
  alternate?: React.ReactNode;
  children: React.ReactNode;
};

export default function SizeCap({ width, alternate, children }: Props) {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (windowDimensions.width < width) {
    if (alternate) {
      return <>{alternate}</>;
    } else {
      return (
        <div className={styles.container}>
          <p className={styles.text}>
            Please use a bigger device to create drawings using VizArt AI
          </p>
        </div>
      );
    }
  } else {
    return <>{children}</>;
  }
}
