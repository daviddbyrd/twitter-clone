import { useState, useContext, ChangeEvent } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const CreatePostBox = () => {
  const auth = useContext(AuthContext);
  const [postText, setPostText] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
    <div className="w-full bg-white border-3 border-gray-100 flex flex-col items-center rounded-lg m-4">
      <div className="w-full h-40 flex flex-row items-center items-start">
        <div className="w-20 h-20 flex items-center justify-center">
          <img
            src="/images/profilepic.png"
            alt="Profile picture"
            className="w-12 h-12 rounded-full mr-auto ml-5"
          />
        </div>
        <div className="w-full ml-auto mr-5 pl-5 pt-5 h-25">
          <textarea
            className="w-full h-30 focus:outline-none resize-none"
            placeholder="What happening?"
            value={postText}
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
      <div className="w-full px-4 pb-4 flex items-center">
        <div className="ml-auto mr-5">
          <button
            className="bg-black text-white rounded-full h-10 w-20 cursor-pointer"
            onClick={makePost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
    // <div>
    //   <input type="text" value={postText} onChange={(e) => handleChange(e)} />
    //   <button onClick={makePost}>Make Post</button>
    // </div>
  );
};

export default CreatePostBox;
