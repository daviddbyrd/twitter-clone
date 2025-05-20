import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useMemo, useEffect } from "react";
import Feed from "./Feed";
import axios from "axios";
import EditProfileBox from "./EditProfileBox";
import { handleFollow, handleUnfollow } from "../utils/Interactions";

interface GetPostsFromUserProps {
  userId: string;
}

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

export interface SubmitProfileChangeParams {
  id: string;
  displayName: string;
  description: string;
  profilePicture: File | null;
  backgroundPicture: File | null;
}

export interface MakeReplyParams {
  userId: string;
  postId: string;
  content: string;
}

export interface LikePostParams {
  post_id: string;
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

const UserProfile = () => {
  const [mode, setMode] = useState<"posts" | "replies" | "media">("posts");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userId } = useParams();
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfoModel>(emptyUser);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    await getPosts();
    await getUserInfo();
  };

  const getPosts = async () => {
    if (userId) {
      const response = await getPostsFromUser({ userId });
      if (response) {
        setPosts(response);
      }
      console.log(response);
    }
  };

  const getUserInfo = async () => {
    try {
      if (userId) {
        const response = await axios.get(
          `http://localhost:3001/user-info/${userId}`
        );
        setUserInfo(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = useMemo(() => {
    console.log(posts);
    switch (mode) {
      case "posts":
        return posts.filter((post) => !post.parent_id);
      case "replies":
        return posts.filter((post) => post.parent_id);
      case "media":
        return posts;
      default:
        return posts;
    }
  }, [posts, mode]);

  const getPostsFromUser = async ({
    userId,
  }: GetPostsFromUserProps): Promise<PostModel[] | null> => {
    try {
      const response = await axios.get(`http://localhost:3001/posts/${userId}`);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const stopEditing = () => {
    setIsEditing(false);
  };

  const submitProfileChange = async ({
    id,
    displayName,
    description,
    profilePicture,
    backgroundPicture,
  }: SubmitProfileChangeParams) => {
    try {
      console.log(backgroundPicture);
      const formData = new FormData();
      formData.append("id", id);
      formData.append("display_name", displayName);
      formData.append("description", description);

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }
      if (backgroundPicture) {
        formData.append("backgroundPicture", backgroundPicture);
      }

      console.log("profilePicture type:", typeof profilePicture);
      console.log("backgroundPicture type:", typeof backgroundPicture);

      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(
        "http://localhost:3001/change-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("response alright: ", response);

      if (response.status === 201) {
        await getUserInfo();
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const back = () => {
    navigate("/home", { replace: true });
  };

  return (
    <div className="relative flex flex-col w-full h-full border-x border-gray-100">
      <div className="fixed backdrop-blur top-0 z-10 bg-white/80 flex flex-row justify-start items-center w-5/10 h-12 border-b border-gray-100">
        <button
          className="h-10 w-10 ml-3 flex items-center justify-center cursor-pointer"
          onClick={back}
        >
          <AiOutlineArrowLeft className="text-3xl text-gray-400" />
        </button>
        <div className="flex flex-col items-start justify-center h-full ml-8">
          <div className="font-bold text-lg">{userInfo.displayName}</div>
          <div className="text-gray-400 text-sm">{`${userInfo.numPosts} posts`}</div>
        </div>
      </div>
      <div className="w-full h-40 relative mt-12">
        <img
          className="w-full h-full"
          src={userInfo.backgroundPicURL || "images/defaultBackground.png"}
        />
        <img
          src={userInfo.profilePicURL || "images/default.jpg"}
          alt="Profile picture"
          className="rounded-full w-36 h-36 flex items-center justify-center absolute left-12 bottom-0 transform translate-y-1/2 border-white border-4"
        />

        <div className="w-full h-15 flex flex-row justify-end items-center pt-2 pr-10">
          {userInfo.id === user?.id ? (
            <button
              onClick={startEditing}
              className="text-black font-bold text-md border-1 border-gray-200 rounded-full h-10 w-32 cursor-pointer"
            >
              Edit Profile
            </button>
          ) : userInfo.isFollowing ? (
            <button
              onClick={() =>
                handleUnfollow({
                  followerId: user?.id,
                  followeeId: userInfo.id,
                  onSuccess: fetchData,
                })
              }
              className="text-black font-bold text-md border-1 border-gray-200 rounded-full h-10 w-32 cursor-pointer"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={() =>
                handleFollow({
                  followerId: user?.id,
                  followeeId: userInfo.id,
                  onSuccess: fetchData,
                })
              }
              className="bg-black font-bold text-md text-white rounded-full h-10 w-32 cursor-pointer"
            >
              Follow
            </button>
          )}
        </div>
        <div className="w-full mt-5">
          <div className="flex flex-col h-full w-50 ml-5">
            <h1 className="font-bold text-2xl">{userInfo.displayName}</h1>
            <h1 className="text-gray-400 text-md">{`@${userInfo.username}`}</h1>
          </div>
        </div>
        <div className="w-full px-5 pt-5 text-md">
          {userInfo.profileDescription}
        </div>
        <div className="w-full h-15 flex flex-row justify-start items-center text-md">
          <span className="font-bold ml-5">{userInfo.numFollowing}</span>
          <span className="text-gray-400 ml-1">Following</span>
          <span className="font-bold ml-5">{userInfo.numFollowers}</span>
          <span className="text-gray-400 ml-1"> Followers</span>
        </div>
        <div className="w-full h-15 grid grid-cols-3 border-b border-gray-100">
          <button
            className={`cursor-pointer text-lg hover:bg-gray-100 ${
              mode === "posts" && "font-bold border-b-3 border-sky-400"
            }`}
            onClick={() => setMode("posts")}
          >
            Posts
          </button>
          <button
            className={`cursor-pointer text-lg hover:bg-gray-100 ${
              mode === "replies" && "font-bold border-b-3 border-sky-400"
            }`}
            onClick={() => setMode("replies")}
          >
            Replies
          </button>
          <button
            className={`cursor-pointer text-lg hover:bg-gray-100 ${
              mode === "media" && "font-bold border-b-3 border-sky-400"
            }`}
            onClick={() => setMode("media")}
          >
            Media
          </button>
        </div>
        <Feed posts={filteredPosts} userInfo={userInfo} onUpdate={fetchData} />
      </div>
      {isEditing && (
        <EditProfileBox
          close={stopEditing}
          id={userInfo.id}
          displayName={userInfo.displayName}
          description={userInfo.profileDescription}
          profilePicURL={userInfo.profilePicURL}
          backgroundPicURL={userInfo.backgroundPicURL}
          submitProfileChange={submitProfileChange}
        />
      )}
    </div>
  );
};

export default UserProfile;
