import styles from "./style.module.scss";

type Props = {
  setValue: (value: string) => void;
  value: string;
  fontSize?: number;
  placeholder?: string;
};

export default function Input({
  setValue,
  value,
  fontSize,
  placeholder,
}: Props) {
  return (
    <div
      className={styles.input}
      style={fontSize ? { fontSize: fontSize } : {}}
    >
      <input
        className={styles.top}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        placeholder={placeholder}
        type="text"
        autoComplete="off"
        data-lpignore="true"
        data-form-type="other"
      />
    </div>
  );
}
