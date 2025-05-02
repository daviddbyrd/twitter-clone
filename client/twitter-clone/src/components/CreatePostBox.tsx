import { useState, useContext, ChangeEvent } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const CreatePostBox = () => {
  const auth = useContext(AuthContext);
  const [postText, setPostText] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPostText(e.target.value);
  };

  const makePost = async () => {
    const response = await axios.post("http://localhost:3001/make-post", {
      userId: auth.user.id,
      content: postText,
    });
    console.log(response.data.message);
    setPostText("");
  };

  return (
    <div>
      <input type="text" value={postText} onChange={(e) => handleChange(e)} />
      <button onClick={makePost}>Make Post</button>
    </div>
  );
};

export default CreatePostBox;
