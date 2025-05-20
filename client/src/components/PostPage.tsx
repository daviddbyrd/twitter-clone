import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Feed from "./Feed";
import LargePost from "./LargePost";
import InlineReplyBox from "./InlineReplyBox";
import ReplyBox from "./ReplyBox";

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
  const [isReplying, setIsReplying] = useState<boolean>(false);
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

  const close = () => {
    setIsReplying(false);
  };

  return (
    <div className="border-x border-gray-100">
      <div className="fixed backdrop-blur top-0 z-10 bg-white/80 flex flex-row justify-start items-center w-5/10 h-14 border-b border-gray-100">
        <button
          className="h-10 w-10 ml-3 flex items-center justify-center cursor-pointer"
          onClick={back}
        >
          <AiOutlineArrowLeft className="text-3xl text-gray-400" />
        </button>
        <div className="flex flex-col items-start justify-center h-full ml-8">
          <div className="font-bold text-lg">Post</div>
        </div>
        <span onClick={(e) => e.stopPropagation()}>
          <div className="w-20 h-full absolute right-3 top-2">
            <button
              className="bg-black text-white rounded-full h-9 w-20 cursor-pointer"
              onClick={() => setIsReplying(true)}
            >
              Reply
            </button>
          </div>
        </span>
      </div>
      {post && (
        <div className="mt-12">
          <LargePost post={post} userInfo={userInfo} onUpdate={fetchData} />
          <InlineReplyBox
            post={post}
            userInfo={userInfo}
            onUpdate={fetchData}
          />
          <Feed posts={replies} userInfo={userInfo} onUpdate={fetchData} />
        </div>
      )}

      {isReplying && post && (
        <ReplyBox
          close={close}
          userId={post.user_id}
          postId={post.id}
          displayName={post.display_name}
          username={post.username}
          posterProfilePicURL={post.profile_picture_url}
          userProfilePicURL={userInfo.profilePicURL}
          content={post.content}
          createdAt={post.created_at}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
};

export default PostPage;
