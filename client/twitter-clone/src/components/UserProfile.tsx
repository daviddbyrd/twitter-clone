import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { UserInfoModel } from "../views/MainPage";

interface UserProfileProps {
  userInfo: UserInfoModel;
}

const UserProfile = ({ userInfo }: UserProfileProps) => {
  const navigate = useNavigate();

  const back = () => {
    navigate("/home", { replace: true });
  };

  return (
    <div className="flex flex-col w-full h-full border-x border-gray-100">
      <div className="flex flex-row justify-start items-center w-full h-18 p-2 border-b border-gray-100">
        <button
          className="h-10 w-10 ml-3 flex items-center justify-center cursor-pointer"
          onClick={back}
        >
          <AiOutlineArrowLeft className="text-3xl text-gray-400" />
        </button>
        <div className="flex flex-col h-full w-50 ml-10">
          <h1 className="font-bold text-lg">{userInfo.displayName}</h1>
          <h1 className="text-sky-500">{`@${userInfo.username}`}</h1>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
