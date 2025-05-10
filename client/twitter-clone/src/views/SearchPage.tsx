import SearchFeed from "../components/SearchFeed";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LargeSearchBox from "../components/LargeSearchBox";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OptionsBar from "../components/OptionsBar";

interface UserProps {
  id: string;
  username: string;
  display_name: string;
  sim: number;
  is_following: boolean;
}

const SearchPage = () => {
  const { query } = useParams<{ query: string }>();
  const { user, setUser, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<UserProps[]>([]);

  useEffect(() => {
    fetchResults();
  }, [query]);

  const handleFollow = async (id: string) => {
    if (user) {
      await axios.post("http://localhost:3001/follow", {
        follower_id: user.id,
        followee_id: id,
      });
      setResults((prevResults) =>
        prevResults.map((user) =>
          user.id === id ? { ...user, is_following: true } : user
        )
      );
    }
  };

  const handleUnfollow = async (id: string) => {
    if (user) {
      await axios.post("http://localhost:3001/unfollow", {
        follower_id: user.id,
        followee_id: id,
      });
      setResults((prevResults) =>
        prevResults.map((user) =>
          user.id === id ? { ...user, is_following: false } : user
        )
      );
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${query}/${user.id}`
      );
      if (response) {
        setResults(response.data);
      }
    } catch (err) {
      console.error(err);
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

  const back = () => {
    navigate("/mainpage", { replace: true });
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="fixed top-0 left-0 h-full w-2/10">
        <OptionsBar handleLogOut={handleLogOut} />
      </div>
      <div className="h-full w-5/10 flex flex-col border-x-1 border-gray-100">
        <div className="w-full flex items-center justify-center">
          <LargeSearchBox back={back} />
        </div>
        <SearchFeed
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
          results={results}
        />
      </div>
      <div className="fixed top-0 right-0 h-full w-2/10"></div>
    </div>
  );
};

export default SearchPage;
