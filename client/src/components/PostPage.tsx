import { AiOutlineArrowLeft } from "react-icons/ai";
import { useOutletContext } from "react-router-dom";

interface ContextType {
  back: () => void;
}

const PostPage = () => {
  const { back } = useOutletContext<ContextType>();

  return (
    <div>
      <div className="fixed backdrop-blur top-0 z-10 bg-white/80 flex flex-row justify-start items-center w-5/10 h-12 border-b border-gray-100">
        <button
          className="h-10 w-10 ml-3 flex items-center justify-center cursor-pointer"
          onClick={back}
        >
          <AiOutlineArrowLeft className="text-3xl text-gray-400" />
        </button>
        <div className="flex flex-col items-start justify-center h-full ml-8">
          <div className="font-bold text-lg">Post</div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
