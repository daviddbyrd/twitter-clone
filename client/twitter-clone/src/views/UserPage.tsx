import { useParams } from "react-router-dom";

const UserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  return <div>{userId}</div>;
};

export default UserPage;
