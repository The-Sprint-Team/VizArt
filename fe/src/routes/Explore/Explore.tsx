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

const vidAmount = 21;
const competitionName = "McHacks Tree Competition";

export default function Explore() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("Recent Posts");
  const [posts, setPosts] = useState(new Array<PostContent>());
  const [allPosts, setAllPosts] = useState(new Array<PostContent>());

  const onSearch = (val: string) => {
    setIsLoading(true);
    const tempPosts = new Array<PostContent>();
    for (let post of allPosts) {
      if (post.title.toLowerCase().includes(val.toLowerCase())) {
        tempPosts.push(post);
      }
    }
    //sort by most recent
    tempPosts.sort((a, b) => {
      return b.date.getTime() - a.date.getTime();
    });
    setPosts(tempPosts);
    setSearchTitle("Search Results");
    setIsLoading(false);
  };

  const searchForCompetition = () => {
    setIsLoading(true);
    const tempPosts = new Array<PostContent>();
    for (let post of allPosts) {
      if (post.title.toLowerCase().includes(competitionName.toLowerCase())) {
        tempPosts.push(post);
      }
    }
    //sort by most recent
    tempPosts.sort((a, b) => {
      return b.date.getTime() - a.date.getTime();
    });
    setPosts(tempPosts);
    setSearchTitle("Search Results");
    setIsLoading(false);
  };

  const refresh = async () => {
    setIsLoading(true);
    setPosts([]);
    //wait 0.5 seconds
    await new Promise((resolve) => setTimeout(resolve, 500));
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
        //sort by most recent
        tempPosts.sort((a, b) => {
          return b.date.getTime() - a.date.getTime();
        });
        setPosts(tempPosts);
        setAllPosts(tempPosts);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    refresh();
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
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search for art..."
          />
          <Button name="Refresh" isPressed={false} onClick={refresh} />
          <Button
            name="View Competition Posts"
            isPressed={false}
            onClick={searchForCompetition}
          />
        </div>
        <p className={styles.searchTitle}>{searchTitle}</p>
        {isLoading && (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        )}
        <div className={styles.posts}>
          {posts.slice(0, vidAmount).map((post, index) => {
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

          {posts.length === 0 && !isLoading && (
            <p className={styles.noPosts}>No posts found</p>
          )}
        </div>
      </div>
    </div>
  );
}
