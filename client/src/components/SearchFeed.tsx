import User from "./User.tsx";
import { useParams, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LargeSearchBox from "./LargeSearchBox.tsx";

interface UserProps {
  id: string;
  username: string;
  display_name: string;
  profile_picture_url: string;
  is_following: boolean;
}

interface ContextType {
  id: string;
}

const SearchFeed = () => {
  const { query } = useParams<{ query: string }>();
  const [results, setResults] = useState<UserProps[]>([]);
  const { id } = useOutletContext<ContextType>();

  useEffect(() => {
    fetchResults();
  }, [query]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${query}/${id}`
      );
      console.log(response);
      if (response) {
        setResults(response.data);
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
          />
        );
      })}
    </div>
  );
};

export default SearchFeed;
