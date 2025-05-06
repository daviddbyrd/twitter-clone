interface UserProps {
  id: string;
  username: string;
  displayName: string;
  handleFollow: (id: string) => void;
  isFollowing: boolean;
}

const User = ({
  id,
  username,
  displayName,
  handleFollow,
  isFollowing,
}: UserProps) => {
  return (
    <div className="w-full h-24 bg-white border-b-1 border-x-1 border-gray-100 y-divide flex flex-row items-center p-4">
      <div className="w-20 h-20 flex items-center justify-center">
        <img
          src="/images/profilepic.png"
          alt="Profile picture"
          className="w-12 h-12 rounded-full mr-auto ml-2"
        />
      </div>
      <div className="flex flex-col">
        <div>
          <h1 className="text-lg font-bold">{username}</h1>
        </div>
        <div>
          <h2>{`@${displayName}`}</h2>
        </div>
      </div>
      <div className="ml-auto mr-5">
        {isFollowing ? (
          <button
            onClick={() => handleFollow(id)}
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
