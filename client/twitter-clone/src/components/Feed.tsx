import Post from "./Post";
import { PostModel, LikePostParams } from "../views/MainPage";

interface FeedProps {
  posts: PostModel[];
  likePost: (params: LikePostParams) => Promise<void>;
}

const Feed: React.FC<FeedProps> = ({ posts, likePost }) => {
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
              id={post.id}
              user_id={post.user_id}
              key={post.id}
              displayName={post.display_name}
              username={post.username}
              content={post.content}
              createdAt={post.created_at}
              likeCount={post.like_count}
              userLiked={post.user_liked}
              likePost={likePost}
            />
          );
        })}
    </div>
  );
};

export default Feed;
