import sharp from "sharp";
import path from "path";
import config from "../config";

export async function createThumbnail(file:Express.Multer.File, uuid:string) {
  const thumbnailPath = path.join(config.thumbnailDir, `${uuid}.jpg`);

  try {
    await sharp(file.path)
      .resize(200, 200, { fit: "cover" })
      .toFile(thumbnailPath);
    return thumbnailPath;
  } catch (ex) {
    const err = ex as Error;
    throw new Error("Failed to create thumbnail: " + err.message);
  }
}
