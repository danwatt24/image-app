import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ChangeEvent } from "react";
import api from "../utils/api";

interface Props {
  uploaded: () => void;
}

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

export default function ImageUploadCard(props: Props) {
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
    props.uploaded();
  };

  return (
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
  );
}
