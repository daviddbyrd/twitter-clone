import { formatDistanceToNow } from "date-fns";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineRetweet } from "react-icons/ai";
import { AiOutlineComment } from "react-icons/ai";
import ReplyBox from "./ReplyBox";
import { useState } from "react";
import { LikePostParams, MakeReplyParams } from "../views/MainPage";
import { useNavigate, useOutletContext } from "react-router-dom";
import { PostModel } from "./UserProfile";

interface PostProps {
  post: PostModel;
  likePost: (params: LikePostParams) => Promise<void>;
  unLikePost: (params: LikePostParams) => Promise<void>;
  repost: (params: LikePostParams) => Promise<void>;
  removeRepost: (params: LikePostParams) => Promise<void>;
  makeReply: (params: MakeReplyParams) => Promise<void>;
}

const Post = ({
  post,
  likePost,
  unLikePost,
  repost,
  removeRepost,
  makeReply,
}: PostProps) => {
  const timestamp = new Date(post.created_at);
  const relativeTime = formatDistanceToNow(timestamp, { addSuffix: true });
  const [isReplying, setIsReplying] = useState(false);
  const navigate = useNavigate();

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
      className="w-full bg-white border-gray-100 border-b flex flex-col items-center p-4 cursor-pointer"
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
              <h2 className="text-md text-gray-500">{`@${post.username} • ${relativeTime}`}</h2>
            </span>
          </div>
        </div>
      </div>
      <div className="w-full px-4">
        <div>{post.content}</div>
      </div>
      <div className="flex flex-row h-20 w-full items-center justify-end">
        <div className="w-40 h-20 flex flex-row items-center justify-center">
          <h3 className="mr-2 text-xl">{post.reply_count}</h3>
          <button
            className="rounded-full cursor-pointer"
            onClick={() => setIsReplying(true)}
          >
            <AiOutlineComment className="w-7 h-7 text-gray-500" />
          </button>
        </div>
        <div className="w-40 h-20 flex flex-row items-center justify-center">
          <h3 className="mr-2 text-xl">{post.repost_count}</h3>
          {post.user_reposted ? (
            <button
              className="rounded-full cursor-pointer"
              onClick={() => removeRepost({ post_id: post.id })}
            >
              <AiOutlineRetweet className="w-7 h-7 text-red-500" />
            </button>
          ) : (
            <button
              className="cursor-pointer"
              onClick={() => repost({ post_id: post.id })}
            >
              <AiOutlineRetweet className="w-7 h-7 text-black" />
            </button>
          )}
        </div>
        <div className="w-40 h-20 flex flex-row items-center justify-center">
          <h3 className="mr-2 text-xl">{post.like_count}</h3>
          {post.user_liked ? (
            <button
              className="rounded-full cursor-pointer"
              onClick={() => unLikePost({ post_id: post.id })}
            >
              <AiFillHeart className="w-7 h-7 text-red-500" />
            </button>
          ) : (
            <button
              className="cursor-pointer"
              onClick={() => likePost({ post_id: id })}
            >
              <AiFillHeart className="w-7 h-7 text-black" />
            </button>
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
          content={post.content}
          relativeTime={relativeTime}
          makeReply={makeReply}
        />
      )}
    </div>
  );
};

export default Post;
