import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import authRoutes from "./routes/authRoutes";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// To refactor, make it like this and change paths in frontend:
// app.use("/api/users", userRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/auth", authRoutes);
// Also, add a .env file to frontend with the base url

app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const PORT = parseInt(process.env.PORT || "3001");

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
