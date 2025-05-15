import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { UserInfoModel } from "../views/MainPage";
import { useState, useMemo, useEffect } from "react";
import Feed from "./Feed";
import { PostModel, LikePostParams, MakeReplyParams } from "../views/MainPage";

interface UserProfileProps {
  id: string;
  userInfo: UserInfoModel;
  handleFollow: (id: string) => void;
  handleUnfollow: (id: string) => void;
  posts: PostModel[];
  likePost: (params: LikePostParams) => Promise<void>;
  unLikePost: (params: LikePostParams) => Promise<void>;
  repost: (params: LikePostParams) => Promise<void>;
  removeRepost: (params: LikePostParams) => Promise<void>;
  makeReply: (params: MakeReplyParams) => Promise<void>;
  startEditing: () => void;
}

const UserProfile = ({
  id,
  userInfo,
  handleFollow,
  handleUnfollow,
  posts,
  likePost,
  unLikePost,
  repost,
  removeRepost,
  makeReply,
  startEditing,
}: UserProfileProps) => {
  const [mode, setMode] = useState<"posts" | "replies" | "media">("posts");
  const navigate = useNavigate();

  const filteredPosts = useMemo(() => {
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
          {userInfo.id === id ? (
            <button
              onClick={startEditing}
              className="text-black font-bold text-md border-1 border-gray-200 rounded-full h-10 w-32 cursor-pointer"
            >
              Edit Profile
            </button>
          ) : userInfo.isFollowing ? (
            <button
              onClick={() => handleUnfollow(userInfo.id)}
              className="text-black font-bold text-md border-1 border-gray-200 rounded-full h-10 w-32 cursor-pointer"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={() => handleFollow(userInfo.id)}
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
        <Feed
          posts={filteredPosts}
          likePost={likePost}
          unLikePost={unLikePost}
          repost={repost}
          removeRepost={removeRepost}
          makeReply={makeReply}
        />
      </div>
    </div>
  );
};

export default UserProfile;
