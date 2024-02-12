import express from "express";
import cors from "cors";
import { promises as fs } from "fs";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import database from "./database.js";
import utils from "./utils.js";

const IMAGES = "./images";
const THUMB = "./thumbs";
const imageList = [];

const app = express();
const port = 3001;

app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // this part defines where the files need to be saved
    // console.log("dest file", file);
    cb(null, IMAGES);
  },
  filename: (req, file, cb) => {
    // this part sets the file name of the file
    // console.log("filename", file);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  const { filename, path: filepath } = req.file;
  // console.log("file", req.file);
  const { author, quote } = req.body;
  if (!author || !quote || !req.file)
    return res.status(400).send("missing image, author and or quote");

  try {
    const fileHash = await utils.checksum(filepath);
    const exists = await database.getByAuthorQuoteOrHash(
      author,
      quote,
      fileHash
    );
    if (exists) return res.status(400).send("quote already exists");

    await sharp(filepath)
      .resize(64, 64)
      .withMetadata()
      .toFile(
        path.resolve("./thumbs", filename.replace(/\.(jpeg|png)$/, `.jpg`))
      );
    const id = await database.insert(filename, author, quote, fileHash);
    return res.send(id.toString());
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
});

app.listen(port, async () => {
  await Promise.all(
    [IMAGES, THUMB].map((folder) => fs.mkdir(folder, { recursive: true }))
  );

  await database.init("./images.db");
  console.log(`Example app listening on port ${port}`);
});
