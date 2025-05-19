import { Request, Response } from "express";
import { pool } from "../db/pool";

export const getPostsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const sql_query = `
      WITH post_stats AS (
      SELECT 
        p.id,
        COUNT(DISTINCT l.user_id) AS like_count,
        COUNT(DISTINCT r.user_id) AS repost_count,
        COUNT(DISTINCT reply.id) AS reply_count
      FROM posts p
      LEFT JOIN likes l ON l.post_id = p.id
      LEFT JOIN reposts r ON r.post_id = p.id
      LEFT JOIN posts reply ON reply.parent_id = p.id
      GROUP BY p.id
      )
      SELECT 
      p.id, 
      p.content,
      p.parent_id,
      p.user_id, 
      p.created_at, 
      u.username, 
      u.display_name, 
      ps.like_count,
      ps.repost_count,
      ps.reply_count,
      (ul.user_id IS NOT NULL) AS user_liked,
      (ur.user_id IS NOT NULL) AS user_reposted
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN post_stats ps ON ps.id = p.id
      LEFT JOIN likes ul ON ul.post_id = p.id AND ul.user_id = $1 
      LEFT JOIN reposts ur ON ur.post_id = p.id AND ur.user_id = $1 
      WHERE p.user_id = $1 OR ur.user_id IS NOT NULL
      ORDER BY p.created_at DESC
      LIMIT 20;
    `;
  const response = await pool.query(sql_query, [id]);
  if (response) {
    res.status(200).json(response.rows);
  }
};

export const makeReply = async (req: Request, res: Response) => {
  const { userId, postId, content } = req.body;
  let sql_query = `
      INSERT INTO posts (user_id, content, parent_id)
      VALUES ($1, $2, $3)
    `;
  const response = await pool.query(sql_query, [userId, content, postId]);
  res.status(201).json({ message: "Reply added successfully" });
};

export const removeRepost = async (req: Request, res: Response) => {
  const { user_id, post_id } = req.body;
  let sql_query = `
      SELECT * FROM reposts
      WHERE user_id = $1 AND post_id = $2;
    `;
  let response = await pool.query(sql_query, [user_id, post_id]);
  if (response.rows.length === 0) {
    res.status(201).json({ message: "User has not reposted" });
    return;
  }
  sql_query = `
    DELETE FROM reposts 
    WHERE user_id = $1 AND post_id = $2;
    `;
  await pool.query(sql_query, [user_id, post_id]);
  res.status(201).json({ message: "Repost removed" });
};

export const repost = async (req: Request, res: Response) => {
  const { user_id, post_id } = req.body;
  let sql_query = `
      SELECT * FROM reposts
      WHERE user_id = $1 AND post_id = $2;
    `;
  let response = await pool.query(sql_query, [user_id, post_id]);
  if (response.rows.length !== 0) {
    res.status(201).json({ message: "User already reposted" });
    return;
  }
  sql_query = `
    INSERT INTO reposts (user_id, post_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, post_id) DO NOTHING;
    `;
  await pool.query(sql_query, [user_id, post_id]);
  res.status(201).json({ message: "Repost added" });
};

export const like = async (req: Request, res: Response) => {
  const { user_id, post_id } = req.body;
  let sql_query = `
    SELECT * FROM likes 
    WHERE user_id = $1 AND post_id = $2;
    `;
  let response = await pool.query(sql_query, [user_id, post_id]);
  if (response.rows.length !== 0) {
    res.status(201).json({ message: "User already liked" });
    return;
  }
  sql_query = `
    INSERT INTO likes (user_id, post_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, post_id) DO NOTHING;
    `;
  await pool.query(sql_query, [user_id, post_id]);
  res.status(201).json({ message: "Like added" });
};

export const unlike = async (req: Request, res: Response) => {
  const { user_id, post_id } = req.body;
  let sql_query = `
    SELECT * FROM likes 
    WHERE user_id = $1 AND post_id = $2;
    `;
  let response = await pool.query(sql_query, [user_id, post_id]);
  if (response.rows.length === 0) {
    res.status(201).json({ message: "User had not liked" });
    return;
  }
  sql_query = `
    DELETE FROM likes
    WHERE user_id = $1 AND post_id = $2;
    `;
  await pool.query(sql_query, [user_id, post_id]);
  res.status(201).json({ message: "Like removed" });
};

export const postsFromFollowees = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const sql_query = `
      SELECT 
        p.id, 
        p.content, 
        p.user_id, 
        p.created_at, 
        p.parent_id,
        u.username, 
        u.display_name, 
        u.profile_picture_url,
        CAST(COUNT(l.user_id) AS INTEGER) AS like_count,
        CAST(COUNT(r.user_id) AS INTEGER) AS repost_count,
        CASE
          WHEN ul.user_id IS NOT NULL THEN TRUE
          ELSE FALSE
        END AS user_liked,
        CASE
          WHEN ur.user_id IS NOT NULL THEN TRUE
          ELSE FALSE
        END AS user_reposted,
        CAST(COUNT(reply.id) AS INTEGER) as reply_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON l.post_id = p.id
      LEFT JOIN likes ul ON ul.post_id = p.id AND ul.user_id = $1
      LEFT JOIN reposts r ON r.post_id = p.id
      LEFT JOIN reposts ur ON ur.post_id = p.id AND ur.user_id = $1
      LEFT JOIN posts reply ON reply.parent_id = p.id
      WHERE p.user_id = $1
        OR p.user_id IN (
          SELECT followee_id FROM follows WHERE follower_id = $1
        )
      GROUP BY p.id, p.content, p.user_id, p.created_at, u.username, u.display_name, u.profile_picture_url, user_liked, user_reposted 
      ORDER BY p.created_at
      LIMIT 20;
    `;
  const response = await pool.query(sql_query, [user_id]);

  const updatedRows = response.rows.map((row) => {
    if (row.profile_picture_url) {
      row.profile_picture_url = `${req.protocol}://${req.get("host")}/uploads/${
        row.profile_picture_url
      }`;
    }
    return row;
  });

  res.status(200).json(updatedRows);
};

export const makePost = async (req: Request, res: Response) => {
  const { userId, content } = req.body;
  await pool.query("INSERT INTO posts (user_id, content) VALUES ($1, $2)", [
    userId,
    content,
  ]);
  res.status(201).json({ message: "Post made successfully." });
};

export const getPost = async (req: Request, res: Response) => {
  const { userId, postId } = req.params;
  const sql_query = `
    SELECT * FROM posts 
    WHERE id = $1;
  `;
  const response = await pool.query(sql_query, [postId]);
  res.status(200).json(response.rows);
};

export const getReplies = async (req: Request, res: Response) => {
  const { userId, postId } = req.params;
  const sql_query = `
    WITH post_stats AS (
    SELECT 
      p.id,
      COUNT(DISTINCT l.user_id) AS like_count,
      COUNT(DISTINCT r.user_id) AS repost_count,
      COUNT(DISTINCT reply.id) AS reply_count
    FROM posts p
    LEFT JOIN likes l ON l.post_id = p.id
    LEFT JOIN reposts r ON r.post_id = p.id
    LEFT JOIN posts reply ON reply.parent_id = p.id
    GROUP BY p.id
    )
    SELECT 
    p.id, 
    p.content,
    p.parent_id,
    p.user_id, 
    p.created_at, 
    u.username, 
    u.display_name, 
    ps.like_count,
    ps.repost_count,
    ps.reply_count,
    (ul.user_id IS NOT NULL) AS user_liked,
    (ur.user_id IS NOT NULL) AS user_reposted
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN post_stats ps ON ps.id = p.id
    LEFT JOIN likes ul ON ul.post_id = p.id AND ul.user_id = $1 
    LEFT JOIN reposts ur ON ur.post_id = p.id AND ur.user_id = $1 
    WHERE p.parent_id = $2
    ORDER BY p.created_at DESC
    LIMIT 20;
  `;
  const response = await pool.query(sql_query, [userId, postId]);
  res.status(200).json(response.rows);
};
