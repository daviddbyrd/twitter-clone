import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { AiOutlineArrowLeft } from "react-icons/ai";

const LargeSearchBox = () => {
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

  const back = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-row items-center w-full h-full mt-5 mb-5 border-b-1 border-gray-100">
      <button
        className="h-10 ml-3 w-10 flex items-center justify-center cursor-pointer"
        onClick={back}
      >
        <AiOutlineArrowLeft className="text-3xl text-gray-400" />
      </button>
      <div className="h-12 ml-auto mr-10 w-8/10 rounded-full border-2 border-gray-200 flex flex-row items-center justify-center">
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
    </div>
  );
};

export default LargeSearchBox;
