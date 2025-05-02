import { useState, useEffect } from "react";
import axios from "axios";

const Feed = () => {
  const [postText, setPostText] = useState<string>("");
  const [data, setData] = useState();

  const fetchData = () => {
    axios.get("http://localhost:3001/posts").then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  };

  const sendPostToDB = async () => {
    console.log(postText);
    try {
      await axios.post("http://localhost:3001/posts", {
        post: postText,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const makePost = async () => {
    await sendPostToDB();
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
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
};

export default Feed;
