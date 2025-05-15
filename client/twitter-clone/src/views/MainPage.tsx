import { useState, useEffect } from "react";
import CreatePostBox from "../components/CreatePostBox";
import Feed from "../components/Feed";
import SearchBox from "../components/SearchBox";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import OptionsBar from "../components/OptionsBar";
import { useNavigate, useParams } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import EditProfileBox from "../components/EditProfileBox";

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
  const { query } = useParams<{ query: string }>();
  const [userInfo, setUserInfo] = useState<UserInfoModel>(emptyUser);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (query === "home") {
      getPostsFromFollowees();
    } else {
      getUserInfo();
      getPostsFromUser();
    }
  }, [query]);

  useEffect(() => {
    document.body.style.overflow = isEditing ? "hidden" : "auto";
  }, [isEditing]);

  const handleFollow = async (id: string) => {
    if (user) {
      await axios.post("http://localhost:3001/follow", {
        follower_id: user.id,
        followee_id: id,
      });
      setUserInfo((prev) => ({ ...prev, isFollowing: true }));
    }
  };

  const handleUnfollow = async (id: string) => {
    if (user) {
      await axios.post("http://localhost:3001/unfollow", {
        follower_id: user.id,
        followee_id: id,
      });
      setUserInfo((prev) => ({ ...prev, isFollowing: false }));
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/user-info/${user.id}`
      );
      setUserInfo(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getPostsFromUser = async () => {
    try {
      if (user) {
        const response = await axios.get(
          `http://localhost:3001/posts/${user.id}`
        );
        if (response.status === 200) {
          setPosts(response.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const repost = async ({ post_id }: LikePostParams) => {
    try {
      console.log("hello");
      const response = await axios.post("http://localhost:3001/repost", {
        user_id: user.id,
        post_id: post_id,
      });
      console.log("repost response:", response);
      if (response.data.message === "Repost added") {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === post_id
              ? {
                  ...post,
                  repost_count: post.repost_count + 1,
                  user_reposted: true,
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeRepost = async ({ post_id }: LikePostParams) => {
    try {
      const response = await axios.post("http://localhost:3001/remove-repost", {
        user_id: user.id,
        post_id: post_id,
      });
      if (response.data.message === "Repost removed") {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === post_id
              ? {
                  ...post,
                  repost_count: post.repost_count - 1,
                  user_reposted: false,
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const likePost = async ({ post_id }: LikePostParams) => {
    try {
      const response = await axios.post("http://localhost:3001/like", {
        user_id: user.id,
        post_id: post_id,
      });
      if (response.data.message === "Like added") {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === post_id
              ? { ...post, like_count: post.like_count + 1, user_liked: true }
              : post
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unLikePost = async ({ post_id }: LikePostParams) => {
    try {
      const response = await axios.post("http://localhost:3001/unlike", {
        user_id: user.id,
        post_id: post_id,
      });
      if (response.data.message === "Like removed") {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === post_id
              ? { ...post, like_count: post.like_count - 1, user_liked: false }
              : post
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const makeReply = async ({ userId, postId, content }: MakeReplyParams) => {
    try {
      const response = await axios.post("http://localhost:3001/make-reply", {
        userId,
        postId,
        content,
      });
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileVisit = () => {
    console.log("user id:", user.id);
    navigate(`/${user.id}`);
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

  const stopEditing = () => {
    setIsEditing(false);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="fixed top-0 left-0 h-full w-1/4">
        <OptionsBar
          handleLogOut={handleLogOut}
          handleProfileVisit={handleProfileVisit}
        />
      </div>
      {query === "home" && (
        <div className="h-full w-5/10 flex flex-col">
          <div>
            <CreatePostBox makePost={makePost} />
          </div>
          <div className="min-h-screen">
            <Feed
              posts={posts}
              likePost={likePost}
              unLikePost={unLikePost}
              repost={repost}
              removeRepost={removeRepost}
              makeReply={makeReply}
            />
          </div>
        </div>
      )}
      {query && query !== "home" && (
        <div className="h-full w-5/10">
          <UserProfile
            id={user.id}
            userInfo={userInfo}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
            posts={posts}
            likePost={likePost}
            unLikePost={unLikePost}
            repost={repost}
            removeRepost={removeRepost}
            makeReply={makeReply}
            startEditing={startEditing}
          />
        </div>
      )}
      <div className="fixed top-0 right-0 h-full w-1/4">
        <SearchBox />
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

export default MainPage;
