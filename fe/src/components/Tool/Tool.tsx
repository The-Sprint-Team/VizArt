import { ReactNode, FunctionComponent } from "react";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

import styles from "./style.module.scss";

type Props = {
  icon: FontAwesomeIconProps["icon"];
  name: string;
  isActive: boolean;
};

export default function Tool({ icon, name, isActive }: Props) {
  return (
    <div className={styles.container} data-active={isActive}>
      <FontAwesomeIcon icon={icon} className={styles.icon} />
      <p className={styles.name}>{name}</p>
    </div>
  );
}
