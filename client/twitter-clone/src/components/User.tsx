interface UserProps {
  id: string;
  username: string;
  displayName: string;
  handleFollow: (id: string) => void;
}

const User = ({ id, username, displayName, handleFollow }: UserProps) => {
  return (
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
      <div className="ml-auto mr-5">
        <button
          onClick={() => handleFollow(id)}
          className="bg-black text-white rounded-md h-10 w-20"
        >
          Follow
        </button>
      </div>
    </div>
  );
};

export default User;
