import User from "./User.tsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LargeSearchBox from "./LargeSearchBox.tsx";
import { useAuth } from "../context/AuthContext.tsx";

interface UserProps {
  id: string;
  username: string;
  display_name: string;
  profile_picture_url: string;
  is_following: boolean;
}

const SearchFeed = () => {
  const { query } = useParams<{ query: string }>();
  const [results, setResults] = useState<UserProps[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchResults();
  }, [query]);

  const fetchResults = async () => {
    try {
      if (user?.id) {
        const response = await axios.get(
          `http://localhost:3001/users/${query}/${user.id}`
        );
        console.log(response);
        if (response) {
          setResults(response.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="w-full flex items-center justify-center h-20">
        <LargeSearchBox />
      </div>
      {results.map((user) => {
        return (
          <User
            key={user.id}
            id={user.id}
            username={user.username}
            displayName={user.display_name}
            profilePicURL={user.profile_picture_url}
            isFollowing={user.is_following}
            onFollowChange={fetchResults}
          />
        );
      })}
    </div>
  );
};

export default SearchFeed;
