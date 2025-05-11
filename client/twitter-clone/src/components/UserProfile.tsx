import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface UserProfileProps {
  id: string;
}

const UserProfile = ({ id }: UserProfileProps) => {
  const navigate = useNavigate();

  const back = () => {
    navigate("/home", { replace: true });
  };

  console.log(id);
  return (
    <div className="flex flex-col w-full h-full border-x border-gray-100">
      <div className="flex flex-row justify-start items-center w-full h-15 p-2 border-b border-gray-100">
        <button
          className="h-10 w-10 ml-3 flex items-center justify-center cursor-pointer"
          onClick={back}
        >
          <AiOutlineArrowLeft className="text-3xl text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
