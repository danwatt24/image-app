import express from "express";
import fs from 'fs/promises';
import meta from "../db/meta";
import config from "../config";

const router = express.Router();

// GET route for image metadata by UUID
router.get("/image/:uuid", async (req, res) => {
  try {
    const { uuid } = req.params;
    const metadata = await meta.getByUUID(uuid);

    if (!metadata) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.json(metadata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve image metadata" });
  }
});

router.get("/thumbs", async (req, res) => {
  try {
    const data = await meta.listAll();
    const mapped = data.map(d => ({
      id: d.id,
      image: d.thumb,
      author: d.author,
      quote: d.quote
    }));
    res.status(200).json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve thumbnails " });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || Number.isNaN(id)) {
    return res.status(400).send("missing id");
  }
  try {
    const data = await meta.get(parseInt(id));
    if (!data) return res.sendStatus(404);

    const result = await meta.remove(data.id);
    if (result.affectedRows !== 1)
      return res.status(500).send(`Unexpected number of rows affected: '${result.affectedRows}'`);
    
    await fs.rm(`${config.imageDir}/${data.image}`);
    await fs.rm(`${config.thumbnailDir}/${data.thumb}`);
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

export const metaRouter = router;
