import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./views/AuthPage";
import MainPage from "./views/MainPage";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import PostPage from "./components/PostPage";
import SearchFeed from "./components/SearchFeed";
import RequireAuth from "./utils/RequireAuth";
import RequireLoggedOut from "./utils/RequireLoggedOut";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={
              <RequireLoggedOut>
                <AuthPage />
              </RequireLoggedOut>
            }
          />
          <Route
            path="/"
            element={
              <RequireAuth>
                <MainPage />
              </RequireAuth>
            }
          >
            <Route path="home" element={<Home />} />
            <Route path=":query" element={<UserProfile />} />
            <Route path=":userId/status/:postId" element={<PostPage />} />
            <Route path="search/:query" element={<SearchFeed />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
