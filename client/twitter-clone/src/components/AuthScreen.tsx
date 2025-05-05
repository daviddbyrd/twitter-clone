import { Link } from "react-router-dom";

const AuthScreen = () => {
  return (
    <div className="flex flex-row w-full h-full">
      <div className="flex-1">
        <div className="flex items-center justify-center h-full ml-30 pb-20">
          <img src="/images/logo.svg" alt="logo" className="w-80 h-80" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col m-20 h-full">
          <h1 className="text-7xl font-bold pb-5">Happening now</h1>
          <div className="pb-20">
            <h2 className="text-3xl font-bold py-8">Join today.</h2>
            <Link to="/signup">
              <button className="bg-sky-500 text-white rounded-full h-9 w-70 cursor-pointer font-bold text-sm">
                Create Account
              </button>
            </Link>
          </div>
          <div>
            <h2 className="text-md font-bold py-2">Already have an Account?</h2>
            <Link to="/login">
              <button className="text-sky-500 rounded-full h-9 w-70 cursor-pointer border-2 border-gray-200 font-bold text-sm">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
