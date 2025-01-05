import fs from "fs";

const imageDir = "images/original";
const thumbnailDir = "images/thumbnails";

// Ensure image directories exist
[imageDir, thumbnailDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export default {
  imageDir,
  thumbnailDir,
};
