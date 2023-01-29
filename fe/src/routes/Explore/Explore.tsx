import { useState } from "react";

import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Post from "../../components/Post/Post";

import { useNavigate } from "react-router-dom";

import styles from "./style.module.scss";
import Loader from "../../components/Loader/Loader";

type PostContent = {
  title: string;
  // thumbnail: string;
  date: Date;
  // thumbnail: string;
  uid: string;
};

export default function Explore() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState("Recent Posts");
  const [posts, setPosts] = useState(new Array<PostContent>());

  posts.push({ title: "Post 1", date: new Date(), uid: "1" });
  posts.push({ title: "Post 2", date: new Date(), uid: "2" });
  posts.push({ title: "Post 2", date: new Date(), uid: "2" });
  posts.push({ title: "Post 2", date: new Date(), uid: "2" });
  posts.push({ title: "Post 2", date: new Date(), uid: "2" });
  posts.push({ title: "Post 2", date: new Date(), uid: "2" });
  posts.push({ title: "Post 2", date: new Date(), uid: "2" });

  const onSearch = () => {};

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
