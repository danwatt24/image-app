import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { createThumbnail } from "../utils/thumbnail";
import meta from "../db/meta";
import config from "../config";
import { DbImage } from "../db/tables";

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(config.imageDir));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({ storage });

// POST route for file upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { quote, author } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname: fileName, filename: image } = file;
    // Generate thumbnail
    const uuid = path.basename(file.filename, path.extname(file.filename));
    const thumb = await createThumbnail(file, uuid);

    // Save metadata and file info to the database
    const metadata:Partial<DbImage> = {
      uuid,
      fileName,
      image,
      thumb: path.basename(thumb),
      author,
      quote,
    };
    await meta.insert(metadata as DbImage);

    res.status(201).json({ message: "File uploaded successfully", metadata });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process the file" });
  }
});

export const uploadRouter = router;
