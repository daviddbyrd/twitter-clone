import Post from "./Post";
import { PostModel } from "../views/MainPage";

interface FeedProps {
  posts: PostModel[];
}

const Feed: React.FC<FeedProps> = ({ posts }) => {
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
            />
          );
        })}
    </div>
  );
};

export default Feed;
