import RightSideBar from "../components/RightSideBar";
import LeftSideBar from "../components/LeftSideBar";
import { Outlet } from "react-router-dom";

const MainPage = () => {
  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="fixed top-0 left-0 h-full w-1/4">
        <LeftSideBar />
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
