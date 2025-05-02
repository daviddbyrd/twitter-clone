import { useState } from "react";
import axios from "axios";

const LogInScreen = () => {
  const [logInForm, setLogInForm] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogInForm({ ...logInForm, [e.target.name]: e.target.value });
  };

  const checkUsername = async () => {
    const response = await axios.post(
      "http://localhost:3001/check-valid-username-password",
      {
        username: logInForm.usernameOrEmail,
        password: logInForm.password,
      }
    );
    console.log(response.data);
    if (response.status === 201 && response.data.valid) {
      return true;
    }
    return false;
  };

  const checkEmail = async () => {
    const response = await axios.post(
      "http://localhost:3001/check-valid-email-password",
      {
        email: logInForm.usernameOrEmail,
        password: logInForm.password,
      }
    );
    console.log(response.data);
    if (response.status === 201 && response.data.valid) {
      return true;
    }
    return false;
  };

  const handleLogIn = async () => {
    try {
      let response = await checkUsername();
      if (response) {
        console.log("Successful login username");
        return;
      }

      response = await checkEmail();
      if (response) {
        console.log("Successful login email");
        return;
      }
      console.log("Unsuccesful login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="h-100 w-70 rounded-lg border-2 border-black bg-gray-200 flex flex-col items-center justify-around">
        <div className="p-2">
          <h1>Username or email address:</h1>
          <input
            className="bg-white w-full rounded-md px-2"
            name="usernameOrEmail"
            value={logInForm.usernameOrEmail}
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
        <button
          className="p-2 border-2 border-blue-300 rounded-md bg-blue-100"
          onClick={handleLogIn}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LogInScreen;
