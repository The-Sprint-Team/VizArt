import styles from "./style.module.scss";

type Props = {
  name: string;
  isPressed: boolean;
  onClick: () => void;
  fontSize?: number;
  width?: number;
};

export default function Button({
  name,
  fontSize,
  onClick,
  isPressed,
  width,
}: Props) {
  return (
    <button
      className={styles.button}
      data-pressed={isPressed}
      // style={fontSize ? { fontSize: fontSize } : {}}
      style={{ fontSize: fontSize, width: width }}
      onClick={() => onClick()}
    >
      <span className={styles.top}>{name}</span>
    </button>
  );
}
