import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PostModel } from "../views/MainPage";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

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

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<PostModel>();
  const [replies, setReplies] = useState<PostModel[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    getPost();
    getReplies();
  }, [postId, user]);

  const getPost = async () => {
    if (user?.id && postId) {
      const response = await axios.get(
        `http://localhost:3001/get-post/${user?.id}/${postId}`
      );
      console.log(response);
    }
  };

  const getReplies = async () => {
    if (user?.id && postId) {
      const response = await axios.get(
        `http://localhost:3001/get-replies/${user.id}/${postId}`
      );
      setReplies(response.data);
      console.log("replies: ", response);
    }
  };

  const back = () => {
    navigate(-1);
  };

  return (
    <div>
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
    </div>
  );
};

export default PostPage;
