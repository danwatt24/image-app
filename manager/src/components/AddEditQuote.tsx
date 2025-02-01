import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid2 as Grid,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import api from "../utils/api";
import placeholder from "../assets/placeholder.svg";

interface Props {
  model?: {
    id: number;
    image: string;
    author: string;
    quote: string;
  };
  onChange?: () => void;
  onClose: () => void;
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

export default function AddEditQuote(props: Props) {
  const model = (props.model || {}) as NonNullable<typeof props.model>;

  const [isSaving, setIsSaving] = useState(false);

  const [author, setAuthor] = useState(model.author || "");
  const [quote, setQuote] = useState(model.quote || "");
  const [image, setImage] = useState(model.image || "");
  const [selected, setSelected] = useState<File>();

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await new Promise((res) => setTimeout(res, 2000));
      const resp = await api.updateQuote(model.id, author, quote);
      if (resp.status === 200) props.onChange?.();
    } catch (ex) {
      console.error("------------save err", ex);
    }
    setIsSaving(false);
  }, [author, model.id, props, quote]);

  const handleUpload = useCallback(async () => {
    try {
      const resp = await api.addQuote({ file: selected, quote, author });
      if (resp.status === 201) props.onChange?.();
    } catch (ex) {
      console.error("------------upload err", ex);
    }
  }, [author, props, quote, selected]);

  const imageUrl = useMemo(() => {
    if (selected) {
      return URL.createObjectURL(selected);
    }
    if (image) return `http://localhost:3000/thumbnails/${image}`;
    return placeholder;
  }, [image, selected]);

  const canSave = (selected || model.id) && quote;

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid size={12}>
            <Typography gutterBottom variant="h5" component="div">
              {model.id ? "Editing" : "Adding"} Quote
            </Typography>
          </Grid>
          <Grid size={12} container spacing={1}>
            <Grid size="auto">
              <Button
                component="label"
                disabled={!!model.id}
                onClick={() => {}}
                sx={{ padding: 0 }}
              >
                <img
                  src={imageUrl}
                  style={{ maxWidth: "200px", height: "auto" }}
                />
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => {
                    setSelected(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                  accept="image/*"
                />
              </Button>
            </Grid>
            <Grid size="grow" container>
              <Grid size={12}>
                <TextField
                  label="Author"
                  placeholder="Unknown"
                  fullWidth
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Quote"
                  fullWidth
                  multiline
                  rows={4}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  error={!quote}
                  helperText={!quote ? "Quote must be provided" : " "}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <LoadingButton
          size="small"
          variant="contained"
          color="primary"
          onClick={async () => {
            await (model.id ? handleSave() : handleUpload());
            props.onClose();
          }}
          loading={isSaving}
          disabled={!canSave || isSaving}
        >
          Save
        </LoadingButton>
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={props.onClose}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </CardActions>
    </Card>
  );
}
