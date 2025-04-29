import { useState } from "react";

const Feed = () => {
  const [postText, setPostText] = useState<string>("");
  const [posts, setPosts] = useState<string[]>([]);

  const makePost = () => {
    setPosts((oldPosts) => [...oldPosts, postText]);
    setPostText("");
  };

  return (
    <div className="w-4/10 h-full flex flex-col">
      <div>
        <input
          className="w-7/10 border-1 border-black rounded-xs"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
        <button onClick={makePost}>Post</button>
      </div>
      <div>
        {posts.map((post) => {
          return <div>{post}</div>;
        })}
      </div>
    </div>
  );
};

export default Feed;
