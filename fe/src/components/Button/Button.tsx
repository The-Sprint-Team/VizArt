import styles from "./style.module.scss";

type Props = {
  name: string;
  isPressed: boolean;
  onClick: () => void;
  fontSize?: number;
  width?: number;
  disabled?: boolean;
};

export default function Button({
  name,
  fontSize,
  onClick,
  isPressed,
  width,
  disabled,
}: Props) {
  return (
    <button
      className={styles.button}
      data-pressed={isPressed}
      style={{ fontSize: fontSize, width: width }}
      disabled={disabled}
      onClick={() => onClick()}
    >
      <span className={styles.top}>{name}</span>
    </button>
  );
}
