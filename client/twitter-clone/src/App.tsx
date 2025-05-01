import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./views/AuthPage";
import LogInPage from "./views/LogInPage";
import SignUpPage from "./views/SignUpPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="login" element={<LogInPage />} />
        <Route path="signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
