import { useState } from "react";

import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";

import styles from "./style.module.scss";

import { convertTime } from "../../utils";

import { useLocation, useNavigate } from "react-router-dom";

type PostContent = {
  title: string;
  date: Date;
  // thumbnail: string;
  uid: string;
};

export default function Share() {
  const navigation = useNavigate();
  const location = useLocation();

  const navigate = () => {
    navigation("/explore");
  };

  const uid = location.pathname.split("/")[2];
  console.log(uid);

  //fetech uid data

  const [post, setPost] = useState<PostContent>();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={styles.container}>
      {!isLoading && post ? (
        <>
          <h1 className={styles.title}>{post.title}</h1>
          <img className={styles.thumbnail} />
          <p className={styles.date}>{convertTime(post.date)}</p>
        </>
      ) : !isLoading && !post ? (
        <>
          <h1 className={styles.title}>Post not found</h1>
          <Button name="Go Back" isPressed={false} onClick={navigate} />
        </>
      ) : (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      )}
    </div>
  );
}
