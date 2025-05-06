import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const SearchBox = () => {
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    navigate(`/search/${encodeURIComponent(query)}`);
  };

  return (
    <div className="mt-5 h-8 w-60 rounded-full border-2 border-gray-200 flex flex-row items-center justify-center">
      <FaSearch className="w-5 h-5 text-gray-300 mr-auto ml-2" />
      <input
        className="w-full pl-2 focus:outline-none"
        type="text"
        value={query}
        placeholder="Search"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchBox;
