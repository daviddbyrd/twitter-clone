import { useNavigate } from "react-router-dom";

interface UserProps {
  id: string;
  username: string;
  displayName: string;
  profilePicURL: string;
  handleFollow: (id: string) => void;
  handleUnfollow: (id: string) => void;
  isFollowing: boolean;
}

const User = ({
  id,
  username,
  displayName,
  profilePicURL,
  handleFollow,
  handleUnfollow,
  isFollowing,
}: UserProps) => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`/${id}`, { replace: true });
  };

  return (
    <div className="w-full h-24 bg-white border-b-1 border-gray-100 y-divide flex flex-row items-center p-4">
      <div className="w-20 h-20 flex items-center justify-center">
        <span onClick={goToProfile} className="cursor-pointer">
          <img
            src={profilePicURL || "/images/default.jpg"}
            alt="Profile picture"
            className="w-12 h-12 rounded-full mr-auto ml-2"
          />
        </span>
      </div>
      <div className="flex flex-col">
        <div>
          <span onClick={goToProfile} className="cursor-pointer">
            <h1 className="text-lg font-bold">{username}</h1>
          </span>
        </div>
        <div>
          <span onClick={goToProfile} className="cursor-pointer">
            <h2>{`@${displayName}`}</h2>
          </span>
        </div>
      </div>
      <div className="ml-auto mr-5">
        {isFollowing ? (
          <button
            onClick={() => handleUnfollow(id)}
            className="text-black font-bold text-sm border-1 border-gray-100 rounded-md h-10 w-20 cursor-pointer"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={() => handleFollow(id)}
            className="bg-black font-bold text-sm text-white rounded-md h-10 w-20 cursor-pointer"
          >
            Follow
          </button>
        )}
      </div>
    </div>
  );
};

export default User;
