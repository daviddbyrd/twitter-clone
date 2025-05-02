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

  const handleLogIn = async () => {
    try {
      let response = await axios.post("http://localhost:3001/login", {
        usernameOrEmail: logInForm.usernameOrEmail,
        password: logInForm.password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      console.log(token);
      console.log("Login successful, token stored!");
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
