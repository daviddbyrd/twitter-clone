import CreatePostBox from "./CreatePostBox";
import Feed from "./Feed";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

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

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfoModel | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await getPostsFromFollowees();
    await getUserInfo();
  };

  const getPostsFromFollowees = async () => {
    try {
      if (user) {
        const response = await axios.get(
          `http://localhost:3001/posts-from-followees/${user.id}`
        );
        console.log("posts from followees: ", response.data);
        if (response.status === 200) {
          setPosts(response.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getUserInfo = async () => {
    try {
      if (user?.id) {
        const response = await axios.get(
          `http://localhost:3001/user-info/${user?.id}`
        );
        setUserInfo(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const makePost = async ({ post }: makePostParams): Promise<void> => {
    await axios.post("http://localhost:3001/make-post", {
      userId: user?.id,
      content: post,
    });
    await getPostsFromFollowees();
  };

  return (
    <div className="h-full w-full flex flex-col">
      {userInfo && (
        <>
          <div>
            <CreatePostBox
              makePost={makePost}
              profilePicURL={userInfo.profilePicURL}
            />
          </div>
          <div className="min-h-screen">
            <Feed posts={posts} userInfo={userInfo} onUpdate={fetchData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
