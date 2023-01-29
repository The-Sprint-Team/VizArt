import styles from "./style.module.scss";
import ReactModal from "react-modal";
import { ReactElement } from "react";

type Props = {
  isVisible: boolean;
  width: number;
  height: number;
  children: ReactElement;
};

export default function Tutorial({ isVisible, width, height, children }: Props) {
  return (
    <ReactModal
      isOpen={isVisible}
      style={{ content: { width: width, height: height } }}
      overlayClassName={styles.overlay}
      className={styles.content}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      preventScroll={true}
      parentSelector={() => document.body}
    >
      {children}
    </ReactModal>

  );
}
