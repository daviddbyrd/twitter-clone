import SearchFeed from "../components/SearchFeed";
import SearchBox from "../components/SearchBox";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MainPage = () => {
  const { query } = useParams<{ query: string }>();
  const { user, isLoggedIn, setUser, setIsLoggedIn } = useAuth();

  const handleFollow = (id: string) => {
    console.log(`user with id ${user} wants to follow user with id ${id}`);
  };

  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="h-full w-6/10"></div>
      <div className="h-full w-6/10 flex flex-col">
        <SearchFeed query={query} handleFollow={handleFollow} />
      </div>
      <div className="h-full w-6/10 flex flex-col">
        <SearchBox />
      </div>
    </div>
  );
};

export default MainPage;
