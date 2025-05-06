import { useState, useEffect } from "react";
import axios from "axios";
import User from "./User.tsx";

interface UserProps {
  id: string;
  username: string;
  display_name: string;
  sim: number;
  is_following: boolean;
}

interface SearchFeedProps {
  query: string;
  user_id: string;
  handleFollow: (id: string) => void;
}

const SearchFeed = ({ query, user_id, handleFollow }: SearchFeedProps) => {
  const [results, setResults] = useState<UserProps[]>([]);

  useEffect(() => {
    fetchResults();
  }, [query]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${query}/${user_id}`
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
      {results.map((user) => {
        return (
          <User
            key={user.id}
            id={user.id}
            username={user.username}
            displayName={user.display_name}
            handleFollow={handleFollow}
            isFollowing={user.is_following}
          />
        );
      })}
    </div>
  );
};

export default SearchFeed;
