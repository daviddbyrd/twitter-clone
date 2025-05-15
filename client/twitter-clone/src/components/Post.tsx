import { formatDistanceToNow } from "date-fns";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineRetweet } from "react-icons/ai";
import { LikePostParams } from "../views/MainPage";
import { AiOutlineComment } from "react-icons/ai";
import ReplyBox from "./ReplyBox";
import { useState } from "react";
import { MakeReplyParams } from "../views/MainPage";

interface PostProps {
  id: string;
  user_id: string;
  displayName: string;
  username: string;
  content: string;
  createdAt: string;
  likeCount: number;
  userLiked: boolean;
  likePost: (params: LikePostParams) => Promise<void>;
  unLikePost: (params: LikePostParams) => Promise<void>;
  repostCount: number;
  userReposted: boolean;
  repost: (params: LikePostParams) => Promise<void>;
  removeRepost: (params: LikePostParams) => Promise<void>;
  makeReply: (params: MakeReplyParams) => Promise<void>;
  replyCount: number;
  profilePicURL: string;
}

const Post = ({
  id,
  user_id,
  displayName,
  username,
  content,
  createdAt,
  likeCount,
  userLiked,
  likePost,
  unLikePost,
  repostCount,
  userReposted,
  repost,
  removeRepost,
  makeReply,
  replyCount,
  profilePicURL,
}: PostProps) => {
  const timestamp = new Date(createdAt);
  const relativeTime = formatDistanceToNow(timestamp, { addSuffix: true });
  const [isReplying, setIsReplying] = useState(false);

  const close = () => {
    setIsReplying(false);
  };

  return (
    <div className="w-full bg-white border-gray-100 border-b flex flex-col items-center p-4">
      <div className="w-full h-20 flex flex-row items-center">
        <div className="w-20 h-20 flex items-center justify-center">
          <img
            src={profilePicURL || "/images/default.jpg"}
            alt="Profile picture"
            className="w-12 h-12 rounded-full mr-auto ml-5"
          />
        </div>
        <div className="flex flex-col ml-2">
          <div>
            <h1 className="text-lg font-bold">{displayName}</h1>
          </div>
          <div>
            <h2 className="text-md text-gray-500">{`@${username} • ${relativeTime}`}</h2>
          </div>
        </div>
      </div>
      <div className="w-full px-4">
        <div>{content}</div>
      </div>
      <div className="flex flex-row h-20 w-full items-center justify-end">
        <div className="w-40 h-20 flex flex-row items-center justify-center">
          <h3 className="mr-2 text-xl">{replyCount}</h3>
          <button
            className="rounded-full cursor-pointer"
            onClick={() => setIsReplying(true)}
          >
            <AiOutlineComment className="w-7 h-7 text-gray-500" />
          </button>
        </div>
        <div className="w-40 h-20 flex flex-row items-center justify-center">
          <h3 className="mr-2 text-xl">{repostCount}</h3>
          {userReposted ? (
            <button
              className="rounded-full cursor-pointer"
              onClick={() => removeRepost({ post_id: id })}
            >
              <AiOutlineRetweet className="w-7 h-7 text-red-500" />
            </button>
          ) : (
            <button
              className="cursor-pointer"
              onClick={() => repost({ post_id: id })}
            >
              <AiOutlineRetweet className="w-7 h-7 text-black" />
            </button>
          )}
        </div>
        <div className="w-40 h-20 flex flex-row items-center justify-center">
          <h3 className="mr-2 text-xl">{likeCount}</h3>
          {userLiked ? (
            <button
              className="rounded-full cursor-pointer"
              onClick={() => unLikePost({ post_id: id })}
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
          userId={user_id}
          postId={id}
          displayName={displayName}
          username={username}
          content={content}
          relativeTime={relativeTime}
          makeReply={makeReply}
        />
      )}
    </div>
  );
};

export default Post;
