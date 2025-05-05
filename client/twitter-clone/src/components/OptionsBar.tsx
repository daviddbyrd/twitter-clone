interface OptionsBarProps {
  handleLogOut: () => void;
}

const OptionsBar: React.FC<OptionsBarProps> = ({ handleLogOut }) => {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="mt-auto mb-10 mr-auto ml-10">
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
