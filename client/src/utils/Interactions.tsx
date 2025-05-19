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

export interface LikePostParams {
  userId: string | undefined;
  postId: string | undefined;
  setPosts: React.Dispatch<React.SetStateAction<PostModel[]>>;
}

export interface MakeReplyParams {
  userId: string | undefined;
  postId: string | undefined;
  content: string;
}

export const likePost = async ({
  postId,
  userId,
  setPosts,
}: LikePostParams) => {
  try {
    if (!userId || !postId) {
      console.error("No userId or postId");
      return;
    }
    const response = await axios.post("http://localhost:3001/like", {
      user_id: userId,
      post_id: postId,
    });
    if (response.data.message === "Like added") {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, like_count: post.like_count + 1, user_liked: true }
            : post
        )
      );
    }
  } catch (err) {
    console.error(err);
  }
};

export const unLikePost = async ({
  postId,
  userId,
  setPosts,
}: LikePostParams) => {
  try {
    if (!userId || !postId) {
      console.error("No userId or postId");
      return;
    }
    const response = await axios.post("http://localhost:3001/unlike", {
      user_id: userId,
      post_id: postId,
    });
    if (response.data.message === "Like removed") {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, like_count: post.like_count - 1, user_liked: false }
            : post
        )
      );
    }
  } catch (err) {
    console.error(err);
  }
};

export const makeReply = async ({
  userId,
  postId,
  content,
}: MakeReplyParams) => {
  try {
    if (!userId || !postId) {
      console.error("No userId or postId");
      return;
    }
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

export const repost = async ({ postId, userId, setPosts }: LikePostParams) => {
  try {
    if (!userId || !postId) {
      console.error("No userId or postId");
      return;
    }
    console.log("hello");
    const response = await axios.post("http://localhost:3001/repost", {
      user_id: userId,
      post_id: postId,
    });
    console.log("repost response:", response);
    if (response.data.message === "Repost added") {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
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

export const removeRepost = async ({
  postId,
  userId,
  setPosts,
}: LikePostParams) => {
  try {
    if (!userId || !postId) {
      console.error("No userId or postId");
      return;
    }
    const response = await axios.post("http://localhost:3001/remove-repost", {
      user_id: userId,
      post_id: postId,
    });
    if (response.data.message === "Repost removed") {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
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
