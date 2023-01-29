import { useEffect, useState } from "react";

import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Post from "../../components/Post/Post";

import { useNavigate } from "react-router-dom";

import styles from "./style.module.scss";
import Loader from "../../components/Loader/Loader";

import api, { BASE_URL } from "../../api";

type PostContent = {
  title: string;
  thumbnail: string;
  date: Date;
  uid: string;
};

export default function Explore() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("Recent Posts");
  const [posts, setPosts] = useState(new Array<PostContent>());

  const onSearch = () => {};

  useEffect(() => {
    api
      .listVideos()
      .then((res) => {
        const tempPosts = new Array<PostContent>();
        for (const [uid, video] of Object.entries(res)) {
          tempPosts.push({
            title: video.name,
            thumbnail: BASE_URL + "/" + video.thumb,
            date: video.time,
            uid: uid,
          });
        }
        setPosts(tempPosts);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <p className={styles.bannerText}>Competition is LIVE</p>
        <Button
          name="Compete"
          isPressed={false}
          onClick={() => navigate("/compete")}
        />
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <Input
            value={search}
            setValue={setSearch}
            placeholder="Search for art..."
          />
          <Button name="Search" isPressed={false} onClick={onSearch} />
        </div>
        <p className={styles.searchTitle}>{searchTitle}</p>
        {isLoading && (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        )}
        <div className={styles.posts}>
          {posts.map((post, index) => {
            return (
              <Post
                title={post.title}
                thumbnail={post.thumbnail}
                date={post.date}
                uid={post.uid}
                key={index}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
