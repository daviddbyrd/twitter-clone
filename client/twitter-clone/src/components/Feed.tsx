import { useState, useEffect } from "react";

const Feed = () => {
  const [postText, setPostText] = useState<string>("");
  const [posts, setPosts] = useState<string[]>([]);
  const [data, setData] = useState();

  const fetchData = () => {
    fetch("http://localhost:3001/data")
      .then((res) => res.json())
      .then((resdata) => {
        setData(resdata);
        console.log(resdata);
      });
  };

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
      <button onClick={fetchData}>Fetch</button>
      <div>
        {posts.map((post) => {
          return <div>{post}</div>;
        })}
      </div>
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
};

export default Feed;
