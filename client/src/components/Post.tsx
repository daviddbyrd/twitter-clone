import { formatDistanceToNow } from "date-fns";
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

interface PostProps {
  post: PostModel;
  userInfo: UserInfoModel;
  onUpdate: () => void;
}

const Post = ({ post, userInfo, onUpdate }: PostProps) => {
  const timestamp = new Date(post.created_at);
  const relativeTime = formatDistanceToNow(timestamp, { addSuffix: true });
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
      className="w-full bg-white border-gray-100 border-b flex flex-col items-center cursor-pointer hover:bg-gray-50"
      onClick={handleClick}
    >
      <div className="w-full flex flex-row items-start justify-start pt-1 pr-5">
        <div className="w-15 h-15 flex flex-col items-center justify-start m-3">
          <span onClick={goToProfile} className="cursor-pointer">
            <img
              src={post.profile_picture_url || "/images/default.jpg"}
              alt="Profile picture"
              className="w-12 h-12 rounded-full mr-auto"
            />
          </span>
        </div>
        <div className="flex flex-col w-full justify-start h-full mt-2">
          <div>
            <span
              onClick={goToProfile}
              className="cursor-pointer text-lg font-bold"
            >
              {post.display_name}
            </span>
            <span
              onClick={goToProfile}
              className="cursor-pointer text-md text-gray-500 ml-3"
            >
              {`@${post.username} • ${relativeTime}`}
            </span>
          </div>
          <div className="mt-1">{post.content}</div>
          <div className="flex flex-row h-12 w-full items-center justify-between pr-20">
            <div className="w-15 h-full flex flex-row items-center justify-center">
              <h3 className="mr-2 text-xl">{post.reply_count}</h3>
              <span onClick={(e) => e.stopPropagation()}>
                <button
                  className="rounded-full cursor-pointer"
                  onClick={() => setIsReplying(true)}
                >
                  <AiOutlineComment className="w-7 h-7 text-gray-500" />
                </button>
              </span>
            </div>
            <div className="w-15 h-full flex flex-row items-center justify-center">
              <h3 className="mr-2 text-xl">{post.repost_count}</h3>
              {post.user_reposted ? (
                <span onClick={(e) => e.stopPropagation()}>
                  <button
                    className="rounded-full cursor-pointer"
                    onClick={() =>
                      removeRepost({
                        postId: post.id,
                        userId: user?.id,
                        onSuccess: onUpdate,
                      })
                    }
                  >
                    <AiOutlineRetweet className="w-7 h-7 text-red-500" />
                  </button>
                </span>
              ) : (
                <span onClick={(e) => e.stopPropagation()}>
                  <button
                    className="cursor-pointer"
                    onClick={() =>
                      repost({
                        postId: post.id,
                        userId: user?.id,
                        onSuccess: onUpdate,
                      })
                    }
                  >
                    <AiOutlineRetweet className="w-7 h-7 text-black" />
                  </button>
                </span>
              )}
            </div>
            <div className="w-15 h-full flex flex-row items-center justify-center">
              <h3 className="mr-2 text-xl">{post.like_count}</h3>
              {post.user_liked ? (
                <span onClick={(e) => e.stopPropagation()}>
                  <button
                    className="rounded-full cursor-pointer"
                    onClick={() =>
                      unLikePost({
                        postId: post.id,
                        userId: user?.id,
                        onSuccess: onUpdate,
                      })
                    }
                  >
                    <AiFillHeart className="w-7 h-7 text-red-500" />
                  </button>
                </span>
              ) : (
                <span onClick={(e) => e.stopPropagation()}>
                  <button
                    className="cursor-pointer"
                    onClick={() =>
                      likePost({
                        postId: post.id,
                        userId: user?.id,
                        onSuccess: onUpdate,
                      })
                    }
                  >
                    <AiFillHeart className="w-7 h-7 text-black" />
                  </button>
                </span>
              )}
            </div>
          </div>
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
export default Post;
