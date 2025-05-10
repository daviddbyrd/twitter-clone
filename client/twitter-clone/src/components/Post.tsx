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
  likePost: (params: LikePostParams) => Promise<void>;
}

const Post = ({
  id,
  user_id,
  displayName,
  username,
  content,
  createdAt,
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
        <button
          className="w-20 h-20 rounded-full cursor-pointer ml-auto"
          onClick={() => likePost({ post_id: id })}
        >
          <AiFillHeart className="w-7 h-7 black" />
        </button>
      </div>
    </div>
  );
};

export default Post;
