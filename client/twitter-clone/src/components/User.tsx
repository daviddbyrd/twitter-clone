interface UserProps {
  id: string;
  username: string;
  displayName: string;
  handleFollow: (id: string) => void;
}

const User = ({ id, username, displayName, handleFollow }: UserProps) => {
  return (
    <div>
      <h1>{username}</h1>
      <h1>{displayName}</h1>
      <button onClick={() => handleFollow(id)}>Follow</button>
    </div>
  );
};

export default User;
