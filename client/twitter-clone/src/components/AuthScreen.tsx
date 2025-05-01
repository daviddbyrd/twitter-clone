import { Link } from "react-router-dom";

const AuthScreen = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="h-70 w-70 rounded-lg border-2 border-black bg-gray-200 flex flex-col items-center justify-around">
        <div>
          <Link to="/signup">
            <button className="bg-blue-100 rounded-md border-2 border-blue-300 h-8 w-40">
              Create Account
            </button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-around h-3/10">
          <p>Already have an Account?</p>
          <Link to="/login">
            <button className="bg-blue-100 rounded-md border-2 border-blue-300 h-8 w-40">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
