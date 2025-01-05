import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import api, { Thumbnail } from "./utils/api";
import ThumbnailCard from "./components/ThumbnailCard";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function App() {
  const [loading, setLoading] = useState(false);
  const [thumbs, setThumbs] = useState<Thumbnail[]>([]);

  const getThumbs = useCallback(async () => {
    const resp = await api.getThumbnails();
    setThumbs(resp.data);
  }, []);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resp = await api.uploadImage(file);
      console.log("--------------data", resp.data);
    } catch (ex) {
      console.error("------------err", ex);
    }
    e.target.value = "";
    await getThumbs();
  };

  useEffect(() => {
    getThumbs();
  }, [getThumbs]);

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 2000));
      const resp = await api.deleteImage(id);
      console.log("-----------delete", resp);
    } catch (ex) {
      console.error("--------------err", ex);
    }
    await getThumbs();
    setLoading(false);
  };

  const handleEdit = (id: number) => {
    console.log("-------------edit", id);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Welcome to Manager App</h1>
      <Button
        component="label"
        role="button"
        variant="contained"
        color="primary"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload File
        <VisuallyHiddenInput
          type="file"
          onChange={handleUpload}
          accept="image/*"
        />
      </Button>
      <Grid container direction="row" spacing={3} padding={3}>
        {thumbs.map((t) => (
          <Grid key={t.id}>
            <ThumbnailCard
              model={{ ...t }}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
