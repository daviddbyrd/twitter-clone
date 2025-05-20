import RightSideBar from "../components/RightSideBar";
import { useAuth } from "../context/AuthContext";
import LeftSideBar from "../components/LeftSideBar";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const MainPage = () => {
  const { user, setUser, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    try {
      localStorage.removeItem("token");
      setUser(null);
      setIsLoggedIn(false);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="fixed top-0 left-0 h-full w-1/4">
        <LeftSideBar handleLogOut={handleLogOut} />
      </div>
      <div className="h-full w-5/10 flex flex-col">
        <Outlet />
      </div>
      <div className="fixed top-0 right-0 h-full w-1/4">
        <RightSideBar />
      </div>
    </div>
  );
};

export default MainPage;
