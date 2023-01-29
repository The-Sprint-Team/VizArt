import { useState, useEffect } from "react";

import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";

import styles from "./style.module.scss";

import { convertTime } from "../../utils";

import { useLocation, useNavigate } from "react-router-dom";

import api, { BASE_URL } from "../../api";

type PostContent = {
  title: string;
  date: Date;
  video: string;
  uid: string;
};

export default function Share() {
  const navigation = useNavigate();
  const location = useLocation();
  const uid = location.pathname.split("/")[2];
  const [post, setPost] = useState<PostContent>();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = () => {
    navigation("/explore");
  };

  const onShare = () => {
    //open share dialog on iOS
    if (navigator.share) {
      navigator
        .share({
          title: "Share",
          text: "Share",
          url: "https://www.youtube.com/watch?v=Z1BCujX3pw8",
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  };

  useEffect(() => {
    api
      .listVideos()
      .then((res) => {
        if (Object.keys(res).includes(uid)) {
          const video = res[uid];
          setPost({
            title: video.name,
            date: video.time,
            video: BASE_URL + "/" + video.vid,
            uid: uid,
          });
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      {!isLoading && post ? (
        <>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.date}>{convertTime(post.date)}</p>
          <video
            src={post.video}
            className={styles.video}
            playsInline
            autoPlay
            muted
            loop
          />
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
