import { useNavigate } from "react-router-dom";
import { handleFollow, handleUnfollow } from "../utils/Interactions";
import { useAuth } from "../context/AuthContext";

interface UserProps {
  id: string;
  username: string;
  displayName: string;
  profilePicURL: string;
  isFollowing: boolean;
  onFollowChange: () => void;
}

const User = ({
  id,
  username,
  displayName,
  profilePicURL,
  isFollowing,
  onFollowChange,
}: UserProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
            onClick={() =>
              handleUnfollow({
                followerId: user?.id,
                followeeId: id,
                onSuccess: onFollowChange,
              })
            }
            className="text-black font-bold text-sm border-1 border-gray-100 rounded-md h-10 w-20 cursor-pointer"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={() =>
              handleFollow({
                followerId: user?.id,
                followeeId: id,
                onSuccess: onFollowChange,
              })
            }
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
