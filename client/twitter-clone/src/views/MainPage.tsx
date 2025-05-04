import { useState, useEffect } from "react";
import CreatePostBox from "../components/CreatePostBox";
import Feed from "../components/Feed";
import SearchBox from "../components/SearchBox";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export interface PostModel {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  content: string;
  created_at: string;
}

export interface makePostParams {
  post: string;
}

const MainPage = () => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      console.log(`user in getPosts: ${user}`);
      if (user) {
        const response = await axios.get(
          `http://localhost:3001/posts-from-followees/${user.id}`
        );
        console.log("response", response.data);
        if (response.status === 200) {
          setPosts(response.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const makePost = async ({ post }: makePostParams): Promise<void> => {
    console.log("user", user);
    console.log("content", post);
    const response = await axios.post("http://localhost:3001/make-post", {
      userId: user.id,
      content: post,
    });
    console.log(response.data.message);
    await getPosts();
  };

  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="h-full w-2/10"></div>
      <div className="h-full w-4/10 flex flex-col">
        <div>
          <CreatePostBox makePost={makePost} />
        </div>
        <div>
          <Feed posts={posts} />
        </div>
      </div>
      <div className="h-full w-2/10 flex flex-col">
        <SearchBox />
      </div>
    </div>
  );
};

export default MainPage;
