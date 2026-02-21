import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
//cors thing
app.use(
  cors({
    origin: ["*", "http://localhost:5173"],
    credentials: true,
  }),
);
//useless work
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB(); //database connection;
//healthCheck route
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
//Main Routes
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Playlistr backend is running",
  });
});
app.use("/api/users", userRoutes);
app.use("/api/playlists", playlistRoutes);
//other routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
//global error handler
app.use((err, req, res) => {
  const statusCode = err.statusCode || 500;
  console.error(err);
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
});
//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT}`);
});
