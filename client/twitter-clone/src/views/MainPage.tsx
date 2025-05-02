import CreatePostBox from "../components/CreatePostBox";
import Feed from "../components/Feed";

const MainPage = () => {
  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="h-full w-6/10 flex flex-col">
        <div>
          <CreatePostBox />
        </div>
        <div>
          <Feed />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
