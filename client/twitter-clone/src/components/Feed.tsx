import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Post from "./Post";

interface Post {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  content: string;
  created_at: string;
}

const Feed = () => {
  const { user, isLoggedIn, setUser, setIsLoggedIn } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  console.log(`user start: ${user}`);

  useEffect(() => {
    getPosts();
  }, [isLoggedIn]);

  const getPosts = async () => {
    try {
      console.log(`user in getPosts: ${user}`);
      if (user) {
        const response = await axios.get(
          `http://localhost/posts-from-followees/${user.id}`
        );
        console.log(`response: ${response}`);
        if (response.status === 200) {
          setPosts(response.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-4/10 h-full flex flex-col">
      {posts.map((post) => {
        return (
          <Post
            id={post.id}
            user_id={post.user_id}
            key={post.id}
            displayName={post.display_name}
            username={post.username}
            content={post.content}
          />
        );
      })}
    </div>
  );
};

export default Feed;
