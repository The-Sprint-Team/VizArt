import styles from "./style.module.scss";

type Props = {
  name: string;
  isPressed: boolean;
  onClick: () => void;
  fontSize?: number;
};

export default function Button({ name, fontSize, onClick, isPressed }: Props) {
  return (
    <button
      className={styles.button}
      data-pressed={isPressed}
      style={fontSize ? { fontSize: fontSize } : {}}
      onClick={() => onClick()}
    >
      <span className={styles.top}>{name}</span>
    </button>
  );
}
