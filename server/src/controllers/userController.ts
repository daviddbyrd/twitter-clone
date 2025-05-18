import { pool } from "../db/pool";
import { Request, Response } from "express";

export const changeProfile = async (req: Request, res: Response) => {
  const { id, display_name, description, backgroundPicture } = req.body;

  const currentFilenames = await pool.query(
    "SELECT profile_picture_url, background_picture_url FROM users WHERE id = $1",
    [id]
  );

  // To add: error checking for not found user

  let profilePictureFilename = currentFilenames.rows[0].profile_picture_url;
  let backgroundPictureFilename =
    currentFilenames.rows[0].background_picture_url;

  if (req.files && !Array.isArray(req.files)) {
    const profilePicture = req.files["profilePicture"]?.[0];
    const backgroundPicture = req.files["backgroundPicture"]?.[0];

    if (profilePicture) {
      profilePictureFilename = profilePicture.filename;
    }

    if (backgroundPicture) {
      backgroundPictureFilename = backgroundPicture.filename;
    }
  }

  const sql_query = `
      UPDATE users
      SET 
        display_name = $2, 
        description = $3, 
        profile_picture_url = $4,
        background_picture_url = $5
      WHERE id = $1
    `;
  const response = await pool.query(sql_query, [
    id,
    display_name,
    description,
    profilePictureFilename,
    backgroundPictureFilename,
  ]);
  res.status(201).json({ message: "Profile updated successfully." });
};

export const changeDescription = async (req: Request, res: Response) => {
  const { id, description } = req.body;
  const sql_query = `
      UPDATE users
      SET description = $2
      WHERE id = $1;  
    `;
  const response = await pool.query(sql_query, [id, description]);
  res.status(201).json({ message: "Description added successfully." });
};

export const getUserInfo = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("id: ", id);
  const sql_query = `
      WITH user_stats AS (
        SELECT
          u.id,
          COUNT(DISTINCT following.followee_id) AS following_count,
          COUNT(DISTINCT followers.follower_id) AS follower_count,
          COUNT(DISTINCT p.id) AS post_count
        FROM users u
        LEFT JOIN follows following ON following.follower_id = u.id
        LEFT JOIN follows followers ON followers.followee_id = u.id 
        LEFT JOIN posts p ON p.user_id = u.id 
        WHERE u.id = $1
        GROUP BY u.id
      )
      SELECT 
        u.id,
        u.display_name,
        u.username,
        u.dob,
        u.created_at,
        u.description,
        u.profile_picture_url,
        u.background_picture_url,
        us.following_count,
        us.follower_count,
        us.post_count
      FROM users u
      LEFT JOIN user_stats us ON us.id = u.id
      WHERE u.id = $1;
    `;
  const response = await pool.query(sql_query, [id]);
  console.log(response.rows[0]);
  let profilePictureFullURL = "";
  let backgroundPictureFullURL = "";

  if (response.rows[0].profile_picture_url) {
    profilePictureFullURL = `${req.protocol}://${req.get("host")}/uploads/${
      response.rows[0].profile_picture_url
    }`;
  }

  if (response.rows[0].background_picture_url) {
    backgroundPictureFullURL = `${req.protocol}://${req.get("host")}/uploads/${
      response.rows[0].background_picture_url
    }`;
  }

  console.log(backgroundPictureFullURL);
  res.status(200).json({
    id: response.rows[0].id,
    displayName: response.rows[0].display_name,
    username: response.rows[0].username,
    dob: response.rows[0].dob,
    createdAt: response.rows[0].created_at,
    isFollowing: response.rows[0].is_following,
    profileDescription: response.rows[0].description,
    numPosts: response.rows[0].post_count,
    numFollowing: response.rows[0].following_count,
    numFollowers: response.rows[0].follower_count,
    profilePicURL: profilePictureFullURL,
    backgroundPicURL: backgroundPictureFullURL,
  });
};

export const getUsersByQuery = async (req: Request, res: Response) => {
  const { query, user_id } = req.params;

  const sql_query = `
  SELECT
    u.id,
    u.username,
    u.display_name,
    u.profile_picture_url,
    u.background_picture_url,
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
  const users = response.rows.map((row) => {
    if (row.profile_picture_url) {
      row.profile_picture_url = `${req.protocol}://${req.get("host")}/uploads/${
        row.profile_picture_url
      }`;
    }
    return row;
  });
  console.log("response: ", users);
  if (!users) throw new Error("Error getting users by query");
  res.status(200).json(users);
};

export const unfollow = async (req: Request, res: Response) => {
  const { follower_id, followee_id } = req.body;
  const sql_query = `
      DELETE FROM follows f WHERE f.follower_id = $1 AND f.followee_id = $2;
    `;
  await pool.query(sql_query, [follower_id, followee_id]);
  res.status(201).json({ message: "Follow successful." });
};

export const follow = async (req: Request, res: Response) => {
  const { follower_id, followee_id } = req.body;
  try {
    const sql_query = `
      INSERT INTO follows (follower_id, followee_id)
      VALUES ($1, $2)
      ON CONFLICT (follower_id, followee_id) DO NOTHING;
    `;
    await pool.query(sql_query, [follower_id, followee_id]);
    res.status(201).json({ message: "Follow successful." });
  } catch (err) {
    console.error(err);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
    [username, email, password]
  );
  res.status(201).json(result.rows[0]);
};
