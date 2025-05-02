import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./views/AuthPage";
import LogInPage from "./views/LogInPage";
import SignUpPage from "./views/SignUpPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="login" element={<LogInPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
