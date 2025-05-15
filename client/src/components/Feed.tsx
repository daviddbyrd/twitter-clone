import Post from "./Post";
import { PostModel } from "../views/MainPage";

const Feed = ({ posts }: { posts: PostModel[] }) => {
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
              repostCount={post.repost_count}
              userReposted={post.user_reposted}
              replyCount={post.reply_count}
              profilePicURL={post.profile_picture_url}
            />
          );
        })}
    </div>
  );
};

export default Feed;
