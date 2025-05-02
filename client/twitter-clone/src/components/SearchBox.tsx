import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    navigate(`/search/${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <input type="text" value={query} onChange={handleChange} />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBox;
