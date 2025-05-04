import SearchFeed from "../components/SearchFeed";
import SearchBox from "../components/SearchBox";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const MainPage = () => {
  const { query } = useParams<{ query: string }>();
  const { user, isLoggedIn, setUser, setIsLoggedIn } = useAuth();
  console.log(user);

  const handleFollow = async (id: string) => {
    if (user) {
      console.log(user.id);
      console.log(id);
      await axios.post("http://localhost:3001/follow", {
        follower_id: user.id,
        followee_id: id,
      });
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="h-full w-2/10"></div>
      <div className="h-full w-5/10 flex flex-col">
        {user && `user: ${user.id}`}
        <SearchFeed query={query} handleFollow={handleFollow} />
      </div>
      <div className="h-full w-2/10 flex flex-col">
        <SearchBox />
      </div>
    </div>
  );
};

export default MainPage;
