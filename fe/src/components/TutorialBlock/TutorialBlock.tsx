import styles from "./style.module.scss";
import demoDraw from "../../assets/demoDraw.png";

type Props = {
  title: string;
  description: string;
  image: string;
};

export default function TutorialBlock({ title, description, image }: Props) {
  return (
    <div className={styles.tutorialBlock}>
          <div className={styles.imageContainer}>
            <img src={demoDraw} alt="demo-draw" />
          </div>

          <div className={styles.descriptionContainer}>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
      </div>
  );
}
