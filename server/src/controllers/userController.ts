import { pool } from "../db/pool";

export const getUsersByQuery = async (query: string, user_id: string) => {
  try {
    const sql_query = `
        SELECT
          u.id,
          u.username,
          u.display_name,
          GREATEST(
            similarity(u.username, $1),
            similarity(u.display_name, $1)
          ) AS sim,
          CASE
            WHEN f.follower_id IS NOT NULL THEN true
            ELSE false
          END AS is_following
        FROM users u    
        LEFT JOIN follows f ON f.followee_id = u.id AND f.follower_id = $2
        WHERE
          (u.username % $1 OR u.display_name % $1)
        ORDER BY sim DESC
        LIMIT 10;
      `;

    const response = await pool.query(sql_query, [query, user_id]);
    return response.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
