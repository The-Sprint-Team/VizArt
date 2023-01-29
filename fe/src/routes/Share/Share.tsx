import { useState, useEffect, useRef } from "react";

import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import SizeCap from "../../components/SizeCap/SizeCap";

import styles from "./style.module.scss";

import { convertTime } from "../../utils";

import { useLocation, useNavigate } from "react-router-dom";

import api, { BASE_URL } from "../../api";

import QRCode from "qrcode";

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
  const [isCopied, setIsCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const navigate = () => {
    navigation("/explore");
  };

  const copyLink = () => {
    const link = BASE_URL.replace("api.", "") + "/explore/" + post?.uid || " ";
    navigator.clipboard.writeText(link);
    //turn isCopied to true for 1 second
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
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

  useEffect(() => {
    if (post) {
      QRCode.toCanvas(
        canvasRef.current,
        // QR code doesn't work with an empty string
        // so we are using a blank space as a fallback
        BASE_URL.replace("api.", "") + "/explore/" + post?.uid || " ",
        (error) => error && console.error(error)
      );
    }
  }, [post]);

  return (
    <div className={styles.container}>
      {!isLoading && post ? (
        <>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.date}>{convertTime(post.date)}</p>
          <video
            className={styles.video}
            playsInline
            autoPlay
            muted
            loop
            controls={true}
            preload="yes"
          >
            <source src={post.video} type="video/webm" />
          </video>
          <SizeCap
            width={700}
            alternate={
              <p>
                Note: Videos may not work on mobile devices. Please view them on
                your laptop.
              </p>
            }
          >
            <></>
          </SizeCap>
          <div className={styles.share}>
            <Button
              name={isCopied ? "Copied!" : "Copy link"}
              onClick={copyLink}
              isPressed={false}
            />
            <canvas ref={canvasRef} />
          </div>
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
