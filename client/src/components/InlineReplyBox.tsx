import { useNavigate } from "react-router-dom";
import { PostModel } from "./PostPage";
import { useState, ChangeEvent } from "react";
import { makeReply } from "../utils/Interactions";
import { UserInfoModel } from "./UserProfile";
import TextareaAutosize from "react-textarea-autosize";

interface InlineReplyBoxProps {
  post: PostModel;
  userInfo: UserInfoModel;
  onUpdate: () => void;
}

const InlineReplyBox = ({ post, userInfo, onUpdate }: InlineReplyBoxProps) => {
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState<string>("");

  const goToProfile = (e: React.MouseEvent<HTMLDivElement>) => {
    navigate(`/${post.user_id}`, { replace: true });
    console.log("clicked");
    e.stopPropagation();
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  };

  const handleReply = async () => {
    await makeReply({
      userId: userInfo.id,
      postId: post.id,
      content: replyText,
      onSuccess: onUpdate,
    });
    setReplyText("");
  };

  return (
    <div className="w-full h-min-15 flex flex-row items-start justify-start border-b border-gray-100 p-3">
      <div className="w-15 h-15 flex flex-col items-center justify-start">
        <span onClick={goToProfile} className="cursor-pointer">
          <img
            src={post.profile_picture_url || "/images/default.jpg"}
            alt="Profile picture"
            className="w-12 h-12 rounded-full mr-auto"
          />
        </span>
      </div>
      <div className="w-full h-full ml-auto pl-5 h-24">
        <TextareaAutosize
          className="w-full focus:outline-none resize-none"
          placeholder="Post your reply"
          value={replyText}
          onChange={(e) => handleChange(e)}
        />
      </div>
      <div className="w-20 h-15 flex items-center justify-center">
        <button
          className="bg-black text-white rounded-full h-10 w-20 cursor-pointer"
          onClick={handleReply}
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default InlineReplyBox;
