import User from "./User.tsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface UserProps {
  id: string;
  username: string;
  displayName: string;
  profilePicURL: string;
  isFollowing: string;
}

const SearchFeed = () => {
  const { query } = useParams<{ query: string }>();
  const [results, setResults] = useState<UserProps[]>([]);

  useEffect(() => {
    fetchResults();
  }, [query]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${query}/${user.id}`
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
        return <User key={user.id} />;
      })}
    </div>
  );
};

export default SearchFeed;
