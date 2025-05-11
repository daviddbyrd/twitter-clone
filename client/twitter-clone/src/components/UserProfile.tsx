import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { UserInfoModel } from "../views/MainPage";
import { useState } from "react";

interface UserProfileProps {
  userInfo: UserInfoModel;
  handleFollow: (id: string) => void;
  handleUnfollow: (id: string) => void;
}

const UserProfile = ({
  userInfo,
  handleFollow,
  handleUnfollow,
}: UserProfileProps) => {
  const [mode, setMode] = useState<"posts" | "replies" | "media">("posts");
  const navigate = useNavigate();

  const back = () => {
    navigate("/home", { replace: true });
  };

  return (
    <div className="relative flex flex-col w-full h-full border-x border-gray-100">
      <div className="absolute top-0 z-50 bg-white opacity-80 flex flex-row justify-start items-center w-full h-12 border-b border-gray-100">
        <button
          className="h-10 w-10 ml-3 flex items-center justify-center cursor-pointer"
          onClick={back}
        >
          <AiOutlineArrowLeft className="text-3xl text-gray-400" />
        </button>
        <div className="flex flex-col items-start justify-center h-full ml-8">
          <div className="font-bold text-lg">{userInfo.displayName}</div>
          <div className="text-gray-400 text-sm">{`${userInfo.numPosts} posts`}</div>
        </div>
      </div>
      <div className="w-full h-40 relative mt-12">
        <img className="w-full h-full" src="/images/background.jpeg" />
        <div className="">
          <img
            src="/images/profilepic.png"
            alt="Profile picture"
            className="rounded-full w-36 h-36 flex items-center justify-center absolute left-12 bottom-0 transform translate-y-1/2 border-white border-4"
          />
        </div>
        <div className="w-full h-15 flex flex-row justify-end items-center pt-2 pr-10">
          {userInfo.isFollowing ? (
            <button
              onClick={() => handleUnfollow(userInfo.id)}
              className="text-black font-bold text-sm border-1 border-gray-100 rounded-full h-10 w-24 cursor-pointer"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={() => handleFollow(userInfo.id)}
              className="bg-black font-bold text-sm text-white rounded-full h-10 w-24 cursor-pointer"
            >
              Follow
            </button>
          )}
        </div>
        <div className="w-full mt-5">
          <div className="flex flex-col h-full w-50 ml-5">
            <h1 className="font-bold text-2xl">{userInfo.displayName}</h1>
            <h1 className="text-gray-400 text-md">{`@${userInfo.username}`}</h1>
          </div>
        </div>
        <div className="w-full px-5 pt-5 text-md">
          {userInfo.profileDescription}
        </div>
        <div className="w-full h-15 flex flex-row justify-start items-center text-md">
          <span className="font-bold ml-5">{userInfo.numFollowing}</span>
          <span className="text-gray-400 ml-1">Following</span>
          <span className="font-bold ml-5">{userInfo.numFollowers}</span>
          <span className="text-gray-400 ml-1"> Followers</span>
        </div>
        <div className="w-full h-15 grid grid-cols-3 border-b border-gray-100">
          <button
            className={`cursor-pointer text-lg hover:bg-gray-100 ${
              mode === "posts" && "font-bold border-b-3 border-sky-400"
            }`}
            onClick={() => setMode("posts")}
          >
            Posts
          </button>
          <button
            className={`cursor-pointer text-lg hover:bg-gray-100 ${
              mode === "replies" && "font-bold border-b-3 border-sky-400"
            }`}
            onClick={() => setMode("replies")}
          >
            Replies
          </button>
          <button
            className={`cursor-pointer text-lg hover:bg-gray-100 ${
              mode === "media" && "font-bold border-b-3 border-sky-400"
            }`}
            onClick={() => setMode("media")}
          >
            Media
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
