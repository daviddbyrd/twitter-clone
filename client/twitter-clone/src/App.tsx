import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./views/AuthPage";
import MainPage from "./views/MainPage";
import SearchPage from "./views/SearchPage";
import RequireAuth from "./utils/RequireAuth";
import RequireLoggedOut from "./utils/RequireLoggedOut";
import UserPage from "./views/UserPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireLoggedOut>
                <AuthPage />
              </RequireLoggedOut>
            }
          />
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
          <Route
            path="/user/:userId"
            element={
              <RequireAuth>
                <UserPage />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
