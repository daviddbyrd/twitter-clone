import { AiOutlineUser } from "react-icons/ai";

interface OptionsBarProps {
  handleLogOut: () => void;
}

const OptionsBar: React.FC<OptionsBarProps> = ({ handleLogOut }) => {
  return (
    <div className="flex flex-col justify-end h-full w-full">
      <button className="cursor-pointer flex flex-row mb-10 ml-10 mr-auto items-center w-full">
        <AiOutlineUser size={30} />
        <span className="text-black font-bold text-lg ml-5">Profile</span>
      </button>
      <div className="mb-10 mr-auto ml-10">
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

export default OptionsBar;
