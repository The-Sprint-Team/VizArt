import Header from "../Header/Header";
import { Outlet } from "react-router-dom";

import styles from "./style.module.scss";

export default function Layout() {
  return (
    <div className={styles.app}>
      <Header />
      <Outlet />
    </div>
  );
}
