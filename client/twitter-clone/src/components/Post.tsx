import { formatDistanceToNow } from "date-fns";

interface PostProps {
  id: string;
  user_id: string;
  displayName: string;
  username: string;
  content: string;
  createdAt: string;
}

const Post = ({
  id,
  user_id,
  displayName,
  username,
  content,
  createdAt,
}: PostProps) => {
  console.log("created at", createdAt);
  const timestamp = new Date(createdAt);
  const relativeTime = formatDistanceToNow(timestamp, { addSuffix: true });

  return (
    <div className="w-full bg-white border-3 border-gray-100 flex flex-col items-center rounded-lg m-4">
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
      <div className="w-full px-4 pb-4">
        <div>{content}</div>
      </div>
    </div>
  );
};

export default Post;
