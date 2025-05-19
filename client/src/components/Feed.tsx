import Post from "./Post";
import { PostModel } from "../components/UserProfile";

interface FeedProps {
  posts: PostModel[];
  onUpdate: () => void;
}

const Feed = ({ posts, onUpdate }: FeedProps) => {
  return (
    <div className="w-full min-h-screen flex flex-col border-x-1 border-gray-100">
      {posts
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((post) => {
          return <Post key={post.id} post={post} onUpdate={onUpdate} />;
        })}
    </div>
  );
};

export default Feed;
