import { useState } from "react";
import { validateSignUp } from "../utils/SignUpValidation";
import axios from "axios";

const SignUpScreen = () => {
  const [logInForm, setLogInForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogInForm({ ...logInForm, [e.target.name]: e.target.value });
  };

  const checkAvailability = async () => {
    try {
      let response = await axios.post(
        "http://localhost:3001/check-unique-email",
        {
          email: logInForm.email,
        }
      );
      if (response.status !== 200) {
        return false;
      }
      response = await axios.post(
        "http://localhost:3001/check-unique-username",
        {
          username: logInForm.username,
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
      await axios.post("http://localhost:3001/users", {
        username: logInForm.username,
        email: logInForm.email,
        password: logInForm.password,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignUp = async () => {
    const errors = validateSignUp(logInForm);
    if (errors.length > 0) {
      console.log(errors);
      return;
    }
    const response = await checkAvailability();
    if (response) {
      await addUserToDB();
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="h-100 w-70 rounded-lg border-2 border-black bg-gray-200 flex flex-col items-center justify-around">
        <div className="p-2">
          <h1>Username:</h1>
          <input
            className="bg-white w-full rounded-md px-2"
            name="username"
            value={logInForm.username}
            onChange={handleChange}
          />
        </div>
        <div className="p-2">
          <h1>Email address:</h1>
          <input
            className="bg-white w-full rounded-md px-2"
            name="email"
            value={logInForm.email}
            onChange={handleChange}
          />
        </div>
        <div className="p-2">
          <h1>Password:</h1>
          <input
            className="bg-white w-full rounded-md px-2"
            name="password"
            value={logInForm.password}
            onChange={handleChange}
          />
        </div>
        <div className="p-2">
          <h1>Confirm Password:</h1>
          <input
            className="bg-white w-full rounded-md px-2"
            name="confirmPassword"
            value={logInForm.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button
          className="p-2 border-2 border-blue-300 rounded-md bg-blue-100"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUpScreen;
