import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { UserInfoModel } from "../views/MainPage";

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
  const navigate = useNavigate();

  const back = () => {
    navigate("/home", { replace: true });
  };

  return (
    <div className="flex flex-col w-full h-full border-x border-gray-100">
      <div className="flex flex-row justify-start items-center w-full h-12 border-b border-gray-100">
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
      <div className="w-full h-40 relative">
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
      </div>
    </div>
  );
};

export default UserProfile;
