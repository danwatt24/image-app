import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useState } from "react";
import api, { Thumbnail } from "./utils/api";
import ThumbnailCard from "./components/ThumbnailCard";
import ImageUploadCard from "./components/ImageUploadCard";

export default function App() {
  const [thumbs, setThumbs] = useState<Thumbnail[]>([]);

  const getThumbs = useCallback(async () => {
    const resp = await api.getThumbnails();
    setThumbs(resp.data);
  }, []);

  useEffect(() => {
    getThumbs();
  }, [getThumbs]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Welcome to Manager App</h1>
      <Grid container direction="row" spacing={3} padding={3}>
        <Grid>
          <ImageUploadCard changed={getThumbs} />
        </Grid>
        {thumbs.map((t) => (
          <Grid key={t.id}>
            <ThumbnailCard model={{ ...t }} onChange={getThumbs} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
