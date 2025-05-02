import { useParams } from "react-router-dom";

const SearchPage = () => {
  const { query } = useParams<{ query: string }>();
  console.log(query);

  return (
    <div>
      <h2>Results for: {query}</h2>
    </div>
  );
};

export default SearchPage;
