import { useState } from "react";

const Feed = () => {
  const [postText, setPostText] = useState<string>("");
  const [posts, setPosts] = useState<string[]>([]);

  const makePost = () => {
    setPosts((oldPosts) => [...oldPosts, postText]);
    setPostText("");
  };

  return (
    <div>
      <input value={postText} onChange={(e) => setPostText(e.target.value)} />
      <button onClick={makePost}>Post</button>
      <div>
        {posts.map((post) => {
          return <div>{post}</div>;
        })}
      </div>
    </div>
  );
};

export default Feed;
