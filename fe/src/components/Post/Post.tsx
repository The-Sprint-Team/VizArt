import Button from "../Button/Button";

import { convertTime } from "../../utils";

import { useNavigate } from "react-router-dom";

import styles from "./style.module.scss";

type Props = {
  title: string;
  date: Date;
  // thumbnail: string;
  uid: string;
};

export default function Post({ title, date, uid }: Props) {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/explore/${uid}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <img className={styles.thumbnail} />
      <p className={styles.date}>{convertTime(date)}</p>
      <div className={styles.view}>
        <Button name="View" isPressed={false} onClick={onClick} />
      </div>
    </div>
  );
}
