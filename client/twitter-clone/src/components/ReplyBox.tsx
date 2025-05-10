import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import { MakeReplyParams } from "../views/MainPage";

interface ReplyBoxProps {
  close: () => void;
  userId: string;
  postId: string;
  displayName: string;
  username: string;
  content: string;
  relativeTime: string;
  makeReply: (params: MakeReplyParams) => Promise<void>;
}

const ReplyBox = ({
  close,
  userId,
  postId,
  displayName,
  username,
  content,
  relativeTime,
  makeReply,
}: ReplyBoxProps) => {
  const [query, setQuery] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      await makeReply({ postId, userId, content });
      close();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen h-screen">
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative z-50 h-140 w-130 rounded-xl bg-white flex flex-col items-center justify-start">
        <div className="flex flex-col h-full w-full items-center">
          <button
            onClick={close}
            className="absolute top-3 left-5 w-10 h-10 cursor-pointer"
          >
            <AiOutlineClose size={20} />
          </button>

          <div className="w-full flex flex-row px-1 mt-15">
            <div className="w-20 flex flex-col mt-1">
              <div className="w-20 h-20 flex items-center justify-center">
                <img
                  src="/images/profilepic.png"
                  alt="Profile picture"
                  className="w-12 h-12 rounded-full mr-auto ml-5"
                />
              </div>
              <div className="w-full h-full relative mt-2">
                <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-gray-300"></div>
              </div>
            </div>

            <div className="w-full flex flex-col">
              <div className="text-base">
                <span className="text-lg font-bold inline align-baseline">
                  {displayName}
                </span>
                <span className="text-md text-gray-500 pl-2 align-baseline">{`@${username} • ${relativeTime}`}</span>
              </div>
              <div className="w-full">{content}</div>
              <div className="w-full mt-5 mb-5">
                <span className="text-gray-500 align-baseline">
                  Replying to{" "}
                </span>
                <span className="text-sky-500 text-md align-baseline">{`@${username}`}</span>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row px-1">
            <div className="w-20 flex flex-col">
              <div className="w-20 h-20 flex items-center justify-center">
                <img
                  src="/images/profilepic.png"
                  alt="Profile picture"
                  className="w-12 h-12 rounded-full mr-auto ml-5"
                />
              </div>
            </div>

            <div className="w-full h-full mt-5 mr-10 ml-5">
              <textarea
                className="w-full h-60 focus:outline-none resize-none pr-5"
                placeholder="Post your reply"
                value={query}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
        </div>
        <button
          className="text-white bg-black rounded-full h-10 w-20 cursor-pointer font-bold text-md absolute bottom-5 right-5"
          onClick={handleSubmit}
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default ReplyBox;
