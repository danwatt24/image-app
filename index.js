import express from "express";
import cors from "cors";
import { promises as fs } from "fs";
import path from "path";
import multer from "multer";
import sharp from "sharp";

const IMAGES = "./images";
const THUMB = "./thumbs";
const imageList = [];

const app = express();
const port = 3000;

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
  console.log("file", req.file);
  try {
    await sharp(req.file.path)
      .resize(64, 64)
      .withMetadata()
      .toFile(
        path.resolve(
          "./thumbs",
          req.file.filename.replace(/\.(jpeg|png)$/, `.jpg`)
        )
      );
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
  return res.sendStatus(200);
});

app.listen(port, async () => {
  await Promise.all(
    [IMAGES, THUMB].map((folder) => fs.mkdir(folder, { recursive: true }))
  );
  console.log(`Example app listening on port ${port}`);
});
