import SearchFeed from "../components/SearchFeed";
import SearchBox from "../components/SearchBox";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OptionsBar from "../components/OptionsBar";

const MainPage = () => {
  const { query } = useParams<{ query: string }>();
  const { user, isLoggedIn, setUser, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

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

  const handleLogOut = () => {
    try {
      localStorage.removeItem("token");
      setUser(null);
      setIsLoggedIn(false);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="fixed top-0 left-0 h-full w-2/10">
        <OptionsBar handleLogOut={handleLogOut} />
      </div>
      <div className="h-full w-5/10 flex flex-col">
        {user && `user: ${user.id}`}
        <SearchFeed query={query} handleFollow={handleFollow} />
      </div>
      <div className="fixed top-0 right-0 h-full w-2/10">
        <SearchBox />
      </div>
    </div>
  );
};

export default MainPage;
