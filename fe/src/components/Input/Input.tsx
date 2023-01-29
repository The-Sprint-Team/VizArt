import styles from "./style.module.scss";

type Props = {
  setValue: (value: string) => void;
  value: string;
  fontSize?: number;
  placeholder?: string;
  isLocked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  setValue,
  value,
  fontSize,
  placeholder,
  isLocked,
  onChange,
  ...rest
}: Props) {
  return (
    <div
      className={styles.input}
      style={fontSize ? { fontSize: fontSize } : {}}
    >
      <input
        className={styles.top}
        onChange={(e) => {
          setValue(e.target.value);
          if (onChange) onChange(e);
        }}
        value={value}
        placeholder={placeholder}
        type="text"
        autoComplete="off"
        data-lpignore="true"
        data-form-type="other"
        readOnly={isLocked ? true : false}
        disabled={isLocked ? true : false}
        data-disabled={isLocked ? true : false}
      />
    </div>
  );
}
