import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Feed from "./Feed";
import LargePost from "./LargePost";
import InlineReplyBox from "./InlineReplyBox";

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

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<PostModel | null>(null);
  const [replies, setReplies] = useState<PostModel[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfoModel>(emptyUser);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [postId, user]);

  const fetchData = async () => {
    getPost();
    getReplies();
    getUserInfo();
  };

  const getPost = async () => {
    if (user?.id && postId) {
      const response = await axios.get(
        `http://localhost:3001/get-post/${user?.id}/${postId}`
      );
      console.log("post: ", response.data);
      if (response.status === 200) {
        setPost(response.data);
      }
    }
  };

  const getReplies = async () => {
    if (user?.id && postId) {
      const response = await axios.get(
        `http://localhost:3001/get-replies/${user.id}/${postId}`
      );
      console.log("replies: ", response);
      if (response.status === 200) {
        setReplies(response.data);
      }
    }
  };

  const getUserInfo = async () => {
    try {
      if (user?.id) {
        const response = await axios.get(
          `http://localhost:3001/user-info/${user.id}`
        );
        setUserInfo(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const back = () => {
    navigate(-1);
  };

  return (
    <div className="border-x border-gray-100">
      <div className="fixed backdrop-blur top-0 z-10 bg-white/80 flex flex-row justify-start items-center w-5/10 h-12 border-b border-gray-100">
        <button
          className="h-10 w-10 ml-3 flex items-center justify-center cursor-pointer"
          onClick={back}
        >
          <AiOutlineArrowLeft className="text-3xl text-gray-400" />
        </button>
        <div className="flex flex-col items-start justify-center h-full ml-8">
          <div className="font-bold text-lg">Post</div>
        </div>
      </div>
      {post && (
        <div className="mt-12">
          <LargePost post={post} userInfo={userInfo} onUpdate={fetchData} />
          <InlineReplyBox
            post={post}
            userInfo={userInfo}
            onUpdate={fetchData}
          />
        </div>
      )}
      <Feed posts={replies} userInfo={userInfo} onUpdate={fetchData} />
    </div>
  );
};

export default PostPage;
