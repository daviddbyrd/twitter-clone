import { useState, ChangeEvent } from "react";
import { makePostParams } from "./Home";

interface CreatePostBoxProps {
  makePost: (params: makePostParams) => Promise<void>;
  profilePicURL: string;
}

const CreatePostBox = ({ makePost, profilePicURL }: CreatePostBoxProps) => {
  const [postText, setPostText] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
  };

  const handleMakePost = async () => {
    await makePost({ post: postText });
    setPostText("");
  };

  return (
    <div className="w-full bg-white border-1 border-gray-100 flex flex-col items-center pl-3 pt-3">
      <div className="w-full h-28 flex flex-row items-center items-start">
        <div className="w-14 h-14 flex items-center justify-center">
          <img
            src={profilePicURL || "images/default.jpg"}
            alt="Profile picture"
            className="w-12 h-12 rounded-full"
          />
        </div>
        <div className="w-full ml-auto mr-5 pl-5 pt-5 h-24">
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
            onClick={handleMakePost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostBox;
