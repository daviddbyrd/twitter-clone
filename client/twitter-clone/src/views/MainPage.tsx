import CreatePostBox from "../components/CreatePostBox";
import Feed from "../components/Feed";
import SearchBox from "../components/SearchBox";

const MainPage = () => {
  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="h-full w-2/10"></div>
      <div className="h-full w-4/10 flex flex-col">
        <div>
          <CreatePostBox />
        </div>
        <div>
          <Feed />
        </div>
      </div>
      <div className="h-full w-2/10 flex flex-col">
        <SearchBox />
      </div>
    </div>
  );
};

export default MainPage;
