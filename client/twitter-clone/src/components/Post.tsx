import React from "react";

interface PostProps {
  id: string;
  user_id: string;
  displayName: string;
  username: string;
  content: string;
}

const Post = ({ id, user_id, displayName, username, content }: PostProps) => {
  return (
    <div>
      <div className="w-full h-20 bg-white border-3 border-gray-100 flex flex-row items-center rounded-lg m-4">
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
            <h2>{`@${displayName}`}</h2>
          </div>
        </div>
      </div>
      <div>{content}</div>
    </div>
  );
};

export default Post;
