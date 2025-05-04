import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./views/AuthPage";
import LogInPage from "./views/LogInPage";
import SignUpPage from "./views/SignUpPage";
import MainPage from "./views/MainPage";
import SearchPage from "./views/SearchPage";
import RequireAuth from "./utils/RequireAuth";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/mainpage"
            element={
              <RequireAuth>
                <MainPage />
              </RequireAuth>
            }
          />
          <Route
            path="/search/:query"
            element={
              <RequireAuth>
                <SearchPage />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
