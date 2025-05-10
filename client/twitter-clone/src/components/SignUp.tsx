import { useState, useEffect } from "react";
import { validateSignUp } from "../utils/SignUpValidation";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { User, useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface SignUpProps {
  close: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ close }) => {
  const [signUpForm, setLogInForm] = useState({
    email: "",
    username: "",
    displayName: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState<"info" | "password">("info");
  const { setUser, setIsLoggedIn, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/mainpage", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogInForm({ ...signUpForm, [e.target.name]: e.target.value });
  };

  const checkAvailability = async () => {
    try {
      let response = await axios.post(
        "http://localhost:3001/check-unique-email",
        {
          email: signUpForm.email,
        }
      );
      console.log(response);
      if (response.status !== 200) {
        return false;
      }
      response = await axios.post(
        "http://localhost:3001/check-unique-username",
        {
          username: signUpForm.username,
        }
      );
      if (response.status !== 200) {
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const addUserToDB = async () => {
    try {
      await axios.post("http://localhost:3001/register", {
        email: signUpForm.email,
        username: signUpForm.username,
        displayName: signUpForm.username,
        dob: signUpForm.dob,
        password: signUpForm.password,
      });
      console.log("Successfully added user.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleInfoStep = () => {
    if (signUpForm.username && signUpForm.email && signUpForm.dob) {
      setLogInForm({ ...signUpForm, displayName: signUpForm.username });
      setStep("password");
    }
  };

  const handleLogIn = async () => {
    try {
      let response = await axios.post("http://localhost:3001/login", {
        usernameOrEmail: signUpForm.username,
        password: signUpForm.password,
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

  const handleSignUp = async () => {
    const errors = validateSignUp(signUpForm);
    if (errors.length > 0) {
      console.log(errors);
      return;
    }
    const response = await checkAvailability();
    if (response) {
      await addUserToDB();
      handleLogIn();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen h-screen">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-50 h-140 w-130 rounded-xl bg-white flex flex-col items-center justify-start">
        {step === "info" && (
          <div className="flex flex-col h-full w-full items-center">
            <button onClick={close} className="absolute top-3 left-5 w-10 h-10">
              <AiOutlineClose size={20} />
            </button>
            <div className="flex items-center justify-center mt-5">
              <img src="/images/logo.svg" alt="logo" className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold mb-10 mt-10">
              Create an account
            </h1>
            <div className="relative mb-5">
              <input
                type="text"
                id="username"
                className="peer w-80 h-14 border border-gray-300 rounded-sm px-3 pt-5 pb-2 placeholder-transparent focus:outline-none focus:border-blue-500"
                name="username"
                placeholder="Username"
                value={signUpForm.username}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="username"
                className="absolute left-3 top-3 transform -translate-y-1/2 text-gray-200 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-3 peer-focus:text-xs peer-focus:text-sky-500"
              >
                Username
              </label>
            </div>
            <div className="relative mb-5">
              <input
                type="text"
                id="email"
                className="peer w-80 h-14 border border-gray-300 rounded-sm px-3 pt-5 pb-2 placeholder-transparent focus:outline-none focus:border-blue-500"
                name="email"
                placeholder="email"
                value={signUpForm.email}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="email"
                className="absolute left-3 top-3 transform -translate-y-1/2 text-gray-200 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-3 peer-focus:text-xs peer-focus:text-sky-500"
              >
                Email
              </label>
            </div>
            <div className="relative pb-5">
              <input
                type="date"
                id="dob"
                className="peer w-80 h-14 border border-gray-300 rounded-sm px-3 pt-5 pb-2 placeholder-transparent focus:outline-none focus:border-blue-500"
                name="dob"
                placeholder="Date of birth"
                value={signUpForm.dob}
                onChange={(e) => handleChange(e)}
              />
              <label className="absolute left-2 top-3 transform -translate-y-1/2 text-gray-400 text-xs">
                Date of birth
              </label>
            </div>
            <button
              className="text-white bg-black rounded-full mt-auto mb-20 h-10 w-80 cursor-pointer border-2 border-gray-200 font-bold text-sm"
              onClick={handleInfoStep}
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
            <div className="relative mb-5">
              <input
                type="password"
                id="password"
                className="peer w-80 h-14 border border-gray-300 rounded-sm px-3 pt-5 pb-2 placeholder-transparent focus:outline-none focus:border-blue-500"
                name="password"
                placeholder="Password"
                value={signUpForm.password}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-3 transform -translate-y-1/2 text-gray-200 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-3 peer-focus:text-xs peer-focus:text-sky-500"
              >
                Password
              </label>
            </div>
            <div className="relative mb-5">
              <input
                type="password"
                id="confirmPassword"
                className="peer w-80 h-14 border border-gray-300 rounded-sm px-3 pt-5 pb-2 placeholder-transparent focus:outline-none focus:border-blue-500"
                name="confirmPassword"
                placeholder="Confirm password"
                value={signUpForm.confirmPassword}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-3 top-3 transform -translate-y-1/2 text-gray-200 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-3 peer-focus:text-xs peer-focus:text-sky-500"
              >
                Confirm password
              </label>
            </div>

            <button
              name="signup"
              className="text-white bg-black rounded-full mt-auto mb-20 h-10 w-80 cursor-pointer border-2 border-gray-200 font-bold text-sm"
              onClick={handleSignUp}
            >
              Create Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
