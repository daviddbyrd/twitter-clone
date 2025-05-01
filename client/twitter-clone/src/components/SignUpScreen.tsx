import { useState } from "react";

const SignUpScreen = () => {
  const [logInForm, setLogInForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLogInForm({ ...logInForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="h-70 w-70 rounded-lg border-2 border-black bg-gray-200 flex flex-col items-center justify-around">
        <div className="bg-blue-100 p-4 border-2 border-black rounded-md">
          <h1>Username:</h1>
          <input
            className="bg-white w-full rounded-md px-2"
            name="username"
            value={logInForm.username}
            onChange={handleChange}
          />
        </div>
        <div className="bg-blue-100 p-4 border-2 border-black rounded-md">
          <h1>Email address:</h1>
          <input
            className="bg-white w-full rounded-md px-2"
            name="username"
            value={logInForm.email}
            onChange={handleChange}
          />
        </div>
        <div className="bg-blue-100 p-4 border-2 border-black rounded-md">
          <h1>Password</h1>
          <input
            className="bg-white w-full rounded-md px-2"
            name="password"
            value={logInForm.password}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
