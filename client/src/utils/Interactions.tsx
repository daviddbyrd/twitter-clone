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
  postId: string | undefined;
  userId: string | undefined;
  onSuccess?: () => void;
}

export interface MakeReplyParams {
  userId: string | undefined;
  postId: string | undefined;
  content: string;
}

export const likePost = async ({
  postId,
  userId,
  onSuccess,
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
      if (onSuccess) onSuccess();
    }
  } catch (err) {
    console.error(err);
  }
};

export const unLikePost = async ({
  postId,
  userId,
  onSuccess,
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
      if (onSuccess) onSuccess();
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

export const repost = async ({ postId, userId, onSuccess }: LikePostParams) => {
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
      if (onSuccess) onSuccess();
    }
  } catch (err) {
    console.error(err);
  }
};

export const removeRepost = async ({
  postId,
  userId,
  onSuccess,
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
      if (onSuccess) onSuccess();
    }
  } catch (err) {
    console.error(err);
  }
};

interface HandleFollowParams {
  followerId: string | undefined;
  followeeId: string | undefined;
  onSuccess?: () => void;
}

export const handleFollow = async ({
  followerId,
  followeeId,
  onSuccess,
}: HandleFollowParams) => {
  try {
    if (!followerId || !followeeId) {
      console.error("No userId or postId");
      return;
    }
    await axios.post("http://localhost:3001/follow", {
      follower_id: followerId,
      followee_id: followeeId,
    });
    if (onSuccess) onSuccess();
  } catch (err) {
    console.error(err);
  }
};

export const handleUnfollow = async ({
  followerId,
  followeeId,
  onSuccess,
}: HandleFollowParams) => {
  try {
    if (!followerId || !followeeId) {
      console.error("No userId or postId");
      return;
    }
    await axios.post("http://localhost:3001/unfollow", {
      follower_id: followerId,
      followee_id: followeeId,
    });
    if (onSuccess) onSuccess();
  } catch (err) {
    console.error(err);
  }
};
