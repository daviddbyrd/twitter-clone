import { useState, useEffect } from "react";
import axios from "axios";

interface Result {
  id: string;
}

interface SearchFeedProps {
  query: string;
}

const SearchFeed = ({ query }: SearchFeedProps) => {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${query}`);
      console.log(response);
      if (response) {
        setResults(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return <div>{JSON.stringify(results)}</div>;
};

export default SearchFeed;
