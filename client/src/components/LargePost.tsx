import { format } from "date-fns";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineRetweet } from "react-icons/ai";
import { AiOutlineComment } from "react-icons/ai";
import ReplyBox from "./ReplyBox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostModel, UserInfoModel } from "./UserProfile";
import {
  likePost,
  unLikePost,
  repost,
  removeRepost,
} from "../utils/Interactions";
import { useAuth } from "../context/AuthContext";

interface LargePostProps {
  post: PostModel;
  userInfo: UserInfoModel;
  onUpdate: () => void;
}

const LargePost = ({ post, userInfo, onUpdate }: LargePostProps) => {
  const timestamp = new Date(post.created_at);
  const createdAt = format(timestamp, "h:mm a '·' MMM d, yyyy");
  const [isReplying, setIsReplying] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToProfile = (e: React.MouseEvent<HTMLDivElement>) => {
    navigate(`/${post.user_id}`, { replace: true });
    console.log("clicked");
    e.stopPropagation();
  };

  const close = () => {
    setIsReplying(false);
  };

  const handleClick = () => {
    navigate(`/${post.user_id}/status/${post.id}`);
  };

  return (
    <div
      className="w-full bg-white border-gray-100 border-b flex flex-col items-center cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-full h-20 flex flex-row items-center">
        <div className="w-20 h-20 flex items-center justify-center">
          <span onClick={goToProfile} className="cursor-pointer">
            <img
              src={post.profile_picture_url || "/images/default.jpg"}
              alt="Profile picture"
              className="w-12 h-12 rounded-full mr-auto ml-5"
            />
          </span>
        </div>
        <div className="flex flex-col ml-2">
          <div>
            <span onClick={goToProfile} className="cursor-pointer">
              <h1 className="text-lg font-bold">{post.display_name}</h1>
            </span>
          </div>
          <div>
            <span onClick={goToProfile} className="cursor-pointer">
              <h2 className="text-md text-gray-500">{`@${post.username}`}</h2>
            </span>
          </div>
        </div>
      </div>
      <div className="w-full px-4 text-lg">{post.content}</div>
      <div className="w-full px-4 text-md py-4 text-gray-500">{createdAt}</div>
      <div className="flex flex-row h-12 w-full items-center justify-between px-10 border-t border-x border-gray-100">
        <div className="w-15 h-full flex flex-row items-center justify-center">
          <h3 className="mr-2 text-md">{post.reply_count}</h3>
          <span onClick={(e) => e.stopPropagation()}>
            <button
              className="cursor-pointer flex items-center justify-center"
              onClick={() => setIsReplying(true)}
            >
              <AiOutlineComment className="w-6 h-6 text-gray-500" />
            </button>
          </span>
        </div>
        <div className="w-15 h-full flex flex-row items-center justify-center">
          <h3 className="mr-2 text-md">{post.repost_count}</h3>
          {post.user_reposted ? (
            <span onClick={(e) => e.stopPropagation()}>
              <button
                className="cursor-pointer flex items-center justify-center"
                onClick={() =>
                  removeRepost({
                    postId: post.id,
                    userId: user?.id,
                    onSuccess: onUpdate,
                  })
                }
              >
                <AiOutlineRetweet className="w-6 h-6 text-red-500" />
              </button>
            </span>
          ) : (
            <span onClick={(e) => e.stopPropagation()}>
              <button
                className="cursor-pointer flex items-center justify-center"
                onClick={() =>
                  repost({
                    postId: post.id,
                    userId: user?.id,
                    onSuccess: onUpdate,
                  })
                }
              >
                <AiOutlineRetweet className="w-6 h-6 text-black" />
              </button>
            </span>
          )}
        </div>
        <div className="w-15 h-full flex flex-row items-center justify-center">
          <h3 className="mr-2 text-md">{post.like_count}</h3>
          {post.user_liked ? (
            <span onClick={(e) => e.stopPropagation()}>
              <button
                className="cursor-pointer flex items-center justify-center"
                onClick={() =>
                  unLikePost({
                    postId: post.id,
                    userId: user?.id,
                    onSuccess: onUpdate,
                  })
                }
              >
                <AiFillHeart className="w-5 h-5 text-red-500" />
              </button>
            </span>
          ) : (
            <span onClick={(e) => e.stopPropagation()}>
              <button
                className="cursor-pointer flex items-center justify-center"
                onClick={() =>
                  likePost({
                    postId: post.id,
                    userId: user?.id,
                    onSuccess: onUpdate,
                  })
                }
              >
                <AiFillHeart className="w-6 h-6 text-black" />
              </button>
            </span>
          )}
        </div>
      </div>
      {isReplying && (
        <ReplyBox
          close={close}
          userId={post.user_id}
          postId={post.id}
          displayName={post.display_name}
          username={post.username}
          posterProfilePicURL={post.profile_picture_url}
          userProfilePicURL={userInfo.profilePicURL}
          content={post.content}
          createdAt={post.created_at}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};
``;
export default LargePost;
