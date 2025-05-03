interface UserProps {
  id: string;
  username: string;
  displayName: string;
}

const User = ({ id, username, displayName }: UserProps) => {
  return (
    <div>
      <h1>{id}</h1>
      <h1>{username}</h1>
      <h1>{displayName}</h1>
    </div>
  );
};

export default User;
