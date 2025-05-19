import CreatePostBox from "./CreatePostBox";
import Feed from "./Feed";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export interface PostModel {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  content: string;
  created_at: string;
  like_count: number;
  user_liked: boolean;
  repost_count: number;
  user_reposted: boolean;
  reply_count: number;
  parent_id: string;
  profile_picture_url: string;
}

export interface makePostParams {
  post: string;
}

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostModel[]>([]);

  useEffect(() => {
    getPostsFromFollowees();
  }, []);

  const makePost = async ({ post }: makePostParams): Promise<void> => {
    await axios.post("http://localhost:3001/make-post", {
      userId: user?.id,
      content: post,
    });
    await getPostsFromFollowees();
  };

  const getPostsFromFollowees = async () => {
    try {
      if (user) {
        const response = await axios.get(
          `http://localhost:3001/posts-from-followees/${user.id}`
        );
        console.log(response);
        if (response.status === 200) {
          setPosts(response.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div>
        <CreatePostBox makePost={makePost} />
      </div>
      <div className="min-h-screen">
        <Feed posts={posts} setPosts={setPosts} />
      </div>
    </div>
  );
};

export default Home;
