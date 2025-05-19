import { useState } from "react";
import RightSideBar from "../components/RightSideBar";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import LeftSideBar from "../components/LeftSidesBar";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export interface PostModel {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  content: string;
  created_at: string;
  like_count: number;
  user_liked: boolean;
  repost_count: number;
  user_reposted: boolean;
  reply_count: number;
  parent_id: string;
  profile_picture_url: string;
}

export interface makePostParams {
  post: string;
}

export interface LikePostParams {
  post_id: string;
}

export interface MakeReplyParams {
  userId: string;
  postId: string;
  content: string;
}

export interface UserInfoModel {
  id: string;
  displayName: string;
  username: string;
  dob: string;
  createdAt: string;
  isFollowing: boolean;
  profileDescription: string;
  numPosts: number;
  numFollowing: number;
  numFollowers: number;
  profilePicURL: string;
  backgroundPicURL: string;
}

const emptyUser: UserInfoModel = {
  id: "",
  displayName: "",
  username: "",
  dob: "",
  createdAt: "",
  isFollowing: false,
  profileDescription: "",
  numPosts: 0,
  numFollowing: 0,
  numFollowers: 0,
  profilePicURL: "",
  backgroundPicURL: "",
};

export interface SubmitProfileChangeParams {
  id: string;
  displayName: string;
  description: string;
  profilePicture: File | null;
  backgroundPicture: File | null;
}

const MainPage = () => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const { user, setUser, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const getPostsFromFollowees = async () => {
    try {
      if (user) {
        const response = await axios.get(
          `http://localhost:3001/posts-from-followees/${user.id}`
        );
        console.log(response);
        if (response.status === 200) {
          setPosts(response.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const makePost = async ({ post }: makePostParams): Promise<void> => {
    const response = await axios.post("http://localhost:3001/make-post", {
      userId: user.id,
      content: post,
    });
    await getPostsFromFollowees();
  };

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

  const handleProfileVisit = () => {
    console.log("user id:", user?.id);
    navigate(`/${user?.id}`);
  };

  const back = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="fixed top-0 left-0 h-full w-1/4">
        <LeftSideBar
          handleLogOut={handleLogOut}
          handleProfileVisit={handleProfileVisit}
        />
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
