import CreatePostBox from "./CreatePostBox";
import Feed from "./Feed";
import { useOutletContext } from "react-router-dom";
import { PostModel } from "../views/MainPage";

interface ContextType {
  posts: PostModel[];
}

const Home = () => {
  const { posts } = useOutletContext<ContextType>();

  return (
    <div className="h-full w-full flex flex-col">
      <div>
        <CreatePostBox />
      </div>
      <div className="min-h-screen">
        <Feed posts={posts} />
      </div>
    </div>
  );
};

export default Home;
