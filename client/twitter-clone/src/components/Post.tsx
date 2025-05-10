import { formatDistanceToNow } from "date-fns";
import { AiFillHeart } from "react-icons/ai";
import { LikePostParams } from "../views/MainPage";

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
}: PostProps) => {
  console.log("created at", createdAt);
  const timestamp = new Date(createdAt);
  const relativeTime = formatDistanceToNow(timestamp, { addSuffix: true });

  return (
    <div className="w-full bg-white border-gray-100 border-b-1 flex flex-col items-center p-4">
      <div className="w-full h-20 flex flex-row items-center">
        <div className="w-20 h-20 flex items-center justify-center">
          <img
            src="/images/profilepic.png"
            alt="Profile picture"
            className="w-12 h-12 rounded-full mr-auto ml-5"
          />
        </div>
        <div className="flex flex-col ml-2">
          <div>
            <h1 className="text-lg font-bold">{username}</h1>
          </div>
          <div>
            <h2 className="text-md text-gray-500">{`@${displayName} • ${relativeTime}`}</h2>
          </div>
        </div>
      </div>
      <div className="w-full px-4">
        <div>{content}</div>
      </div>
      <div className="flex flex-row h-20 w-full">
        <div className="w-40 h-20 ml-auto flex flex-row items-center justify-center">
          <h3 className="mr-2 text-xl">{likeCount}</h3>
          {userLiked ? (
            <button
              className="rounded-full cursor-pointer"
              onClick={() => likePost({ post_id: id })}
            >
              <AiFillHeart className="w-7 h-7 text-red-500" />
            </button>
          ) : (
            <button
              className="rounded-full cursor-pointer"
              onClick={() => likePost({ post_id: id })}
            >
              <AiFillHeart className="w-7 h-7 text-black" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
