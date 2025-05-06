import User from "./User.tsx";

interface UserProps {
  id: string;
  username: string;
  display_name: string;
  sim: number;
  is_following: boolean;
}

interface SearchFeedProps {
  handleFollow: (id: string) => void;
  results: UserProps[];
}

const SearchFeed = ({ handleFollow, results }: SearchFeedProps) => {
  return (
    <div>
      {results.map((user) => {
        return (
          <User
            key={user.id}
            id={user.id}
            username={user.username}
            displayName={user.display_name}
            handleFollow={handleFollow}
            isFollowing={user.is_following}
          />
        );
      })}
    </div>
  );
};

export default SearchFeed;
