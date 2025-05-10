import { useState, useEffect } from "react";
import axios from "axios";
import { User, useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface LogInProps {
  close: () => void;
}

const LogIn: React.FC<LogInProps> = ({ close }) => {
  const [logInForm, setLogInForm] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const { setUser, setIsLoggedIn, isLoggedIn } = useAuth();
  const [step, setStep] = useState<"usernameOrEmail" | "password">(
    "usernameOrEmail"
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/mainpage", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogInForm({ ...logInForm, [e.target.name]: e.target.value });
  };

  const handleUsernameOrEmailInput = () => {
    if (logInForm.usernameOrEmail) {
      setStep("password");
    }
  };

  const handleLogIn = async () => {
    try {
      let response = await axios.post("http://localhost:3001/login", {
        usernameOrEmail: logInForm.usernameOrEmail,
        password: logInForm.password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      const decoded = jwtDecode<User>(token);
      setUser(decoded);
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen h-screen">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-50 h-140 w-130 rounded-xl bg-white flex flex-col items-center justify-start">
        {step === "usernameOrEmail" && (
          <div className="flex flex-col h-full w-full items-center">
            <button onClick={close} className="absolute top-3 left-5 w-10 h-10">
              <AiOutlineClose size={20} />
            </button>
            <div className="flex items-center justify-center mt-5">
              <img src="/images/logo.svg" alt="logo" className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold mb-15 mt-10 mr-50">Sign In</h1>
            <div className="relative">
              <input
                type="text"
                id="usernameOrEmail"
                className="peer w-80 h-14 border border-gray-300 rounded-sm px-3 pt-5 pb-2 placeholder-transparent focus:outline-none focus:border-blue-500"
                name="usernameOrEmail"
                placeholder="Username or email address"
                value={logInForm.usernameOrEmail}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="usernameOrEmail"
                className="absolute left-3 top-3 transform -translate-y-1/2 text-gray-200 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-3 peer-focus:text-xs peer-focus:text-sky-500"
              >
                Username or email
              </label>
            </div>
            <button
              className="text-white bg-black rounded-full my-8 h-10 w-80 cursor-pointer border-2 border-gray-200 font-bold text-sm"
              onClick={handleUsernameOrEmailInput}
            >
              Next
            </button>
          </div>
        )}
        {step === "password" && (
          <div className="relative flex flex-col h-full w-full items-center">
            <button
              onClick={close}
              className="absolute top-3 left-5 w-10 h-10 cursor-pointer"
            >
              <AiOutlineClose size={20} />
            </button>
            <div className="flex items-center justify-center mt-5">
              <img src="/images/logo.svg" alt="logo" className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold mb-15 mt-10 mr-15">
              Enter Password
            </h1>
            <div className="relative">
              <div className="w-80 h-14 rounded-sm px-2 pt-5 pb-2 mb-5 text-gray-300 bg-gray-50">
                {logInForm.usernameOrEmail}
              </div>
              <label className="absolute left-2 top-3 transform -translate-y-1/2 text-gray-200 text-xs">
                Username
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="peer w-80 h-14 border border-gray-300 rounded-sm px-3 pt-5 pb-2 placeholder-transparent focus:outline-none focus:border-blue-500"
                name="password"
                placeholder="Password"
                value={logInForm.password}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-3 transform -translate-y-1/2 text-gray-200 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-3 peer-focus:text-xs peer-focus:text-sky-500"
              >
                Password
              </label>
            </div>
            <button
              name="signup"
              className="text-white bg-black rounded-full my-8 h-10 w-80 cursor-pointer border-2 border-gray-200 font-bold text-sm"
              onClick={() => handleLogIn()}
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogIn;
