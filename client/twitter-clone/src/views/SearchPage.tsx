import SearchFeed from "../components/SearchFeed";
import SearchBox from "../components/SearchBox";
import { useParams } from "react-router-dom";

const MainPage = () => {
  const { query } = useParams<{ query: string }>();

  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="h-full w-6/10"></div>
      <div className="h-full w-6/10 flex flex-col">
        <SearchFeed query={query} />
      </div>
      <div className="h-full w-6/10 flex flex-col">
        <SearchBox />
      </div>
    </div>
  );
};

export default MainPage;
