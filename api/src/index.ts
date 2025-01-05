import express from "express";
import cors from "cors";
import serveIndex from "serve-index";
import { uploadRouter } from "./routes/upload";
import { metaRouter } from "./routes/meta";
import { initializeDatabase } from "./db/database";
import config from "./config";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  console.log("Request URL:", req.method, req.url);
  next();
});

// Serve static files for images
app.use("/images", express.static(config.imageDir),serveIndex(config.imageDir));
app.use("/thumbnails", express.static(config.thumbnailDir), serveIndex(config.thumbnailDir));

// Routes
app.use("/upload", uploadRouter);
app.use("/meta", metaRouter);

// Initialize database and start server
initializeDatabase();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
