import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Feed = () => {
  const auth = useContext(AuthContext);

  return (
    <div className="w-4/10 h-full flex flex-col">{JSON.stringify(auth)}</div>
  );
};

export default Feed;
