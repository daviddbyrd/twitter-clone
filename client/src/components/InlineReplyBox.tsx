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
    <div className="w-full min-h-14 flex flex-row items-start justify-start border-b border-gray-100 relative">
      <div className="w-14 h-14 flex flex-col items-center justify-start m-3 shrink-0">
        <span onClick={goToProfile} className="cursor-pointer">
          <img
            src={post.profile_picture_url || "/images/default.jpg"}
            alt="Profile picture"
            className="w-12 h-12 rounded-full object-cover"
          />
        </span>
      </div>
      <div className="w-full h-full pt-3">
        <TextareaAutosize
          className="w-full focus:outline-none resize-none"
          placeholder="Post your reply"
          value={replyText}
          onChange={(e) => handleChange(e)}
        />
      </div>
      <div className="w-20 h-full flex flex-col items-center justify-end mr-3 absolute right-5 bottom-5">
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
