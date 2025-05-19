import Post from "./Post";
import {
  PostModel,
  LikePostParams,
  MakeReplyParams,
} from "../components/UserProfile";

interface FeedProps {
  posts: PostModel[];
  likePost: (params: LikePostParams) => Promise<void>;
  unLikePost: (params: LikePostParams) => Promise<void>;
  repost: (params: LikePostParams) => Promise<void>;
  removeRepost: (params: LikePostParams) => Promise<void>;
  makeReply: (params: MakeReplyParams) => Promise<void>;
}

const Feed = ({
  posts,
  likePost,
  unLikePost,
  repost,
  removeRepost,
  makeReply,
}: FeedProps) => {
  return (
    <div className="w-full min-h-screen flex flex-col border-x-1 border-gray-100">
      {posts
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((post) => {
          return (
            <Post
              key={post.id}
              post={post}
              likePost={likePost}
              unLikePost={unLikePost}
              repost={repost}
              removeRepost={removeRepost}
              makeReply={makeReply}
            />
          );
        })}
    </div>
  );
};

export default Feed;
