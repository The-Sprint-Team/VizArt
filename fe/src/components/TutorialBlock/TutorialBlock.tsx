import styles from "./style.module.scss";

type Props = {
  title: string;
  description: string;
  image: string;
};

export default function TutorialBlock({ title, description, image }: Props) {
  console.log(image);
  return (
    <div className={styles.tutorialBlock}>
      <div className={styles.imageContainer}>
        <img src={require(`../../assets/images/${image}`)} alt={title} />
      </div>

      <div className={styles.descriptionContainer}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
