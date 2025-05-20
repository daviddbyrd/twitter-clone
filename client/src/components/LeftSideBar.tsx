import { AiOutlineUser, AiOutlineHome } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleHomeVisit = () => {
    navigate("/home");
  };

  const handleProfileVisit = () => {
    navigate(`/${user?.id}`);
  };

  const handleLogOut = () => {
    try {
      localStorage.removeItem("token");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-end h-full w-full">
      <button
        className="cursor-pointer flex flex-row p-4 my-2 ml-10 mr-auto items-center w-8/10 rounded-full hover:bg-gray-100"
        onClick={handleHomeVisit}
      >
        <AiOutlineHome size={30} />
        <span className="text-black font-bold text-lg ml-5">Home</span>
      </button>

      <button
        className="cursor-pointer flex flex-row p-4 my-2 ml-10 mr-auto items-center w-8/10 rounded-full hover:bg-gray-100"
        onClick={handleProfileVisit}
      >
        <AiOutlineUser size={30} />
        <span className="text-black font-bold text-lg ml-5">Profile</span>
      </button>
      <div className="my-10 mr-auto ml-10">
        <button
          className="bg-black text-white rounded-full h-10 w-25 cursor-pointer"
          onClick={handleLogOut}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default LeftSideBar;
