import axios from "axios";

interface GetPostsFromUserProps {
  userId: string;
}

interface PostModel {
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

export const getPostsFromUser = async ({
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
