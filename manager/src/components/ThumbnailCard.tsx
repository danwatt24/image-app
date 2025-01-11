import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCallback, useMemo, useState } from "react";
import api from "../utils/api";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";

interface Props {
  model: {
    id: number;
    image: string;
    author: string;
    quote: string;
  };
  onChange: () => void;
}

export default function ThumbnailCard(props: Props) {
  const model = props.model;

  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [author, setAuthor] = useState(model.author);
  const [quote, setQuote] = useState(model.quote);

  const closeEdit = () => setEditOpen(false);
  const closeConfirm = () => setConfirmOpen(false);

  const handleEdit = useCallback(() => setEditOpen(true), []);
  const handleConfirm = useCallback(() => setConfirmOpen(true), []);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 2000));
      const resp = await api.deleteQuote(model.id);
      if (resp.status === 200) props.onChange();
    } catch (ex) {
      console.error("delete err", ex);
    }
    setLoading(false);
  }, [model, props]);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 2000));
      const resp = await api.updateQuote(model.id, author, quote);
      if (resp.status === 200) props.onChange();
    } catch (ex) {
      console.error("------------save err", ex);
    }
    setLoading(false);
  }, [author, model.id, props, quote]);

  const imageUrl = useMemo(
    () => `http://localhost:3000/thumbnails/${model.image}`,
    [model]
  );

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="140"
          image={imageUrl}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {model.author}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {model.quote}
          </Typography>
        </CardContent>
        <CardActions>
          <LoadingButton
            size="small"
            startIcon={<EditIcon />}
            loading={loading}
            onClick={handleEdit}
          >
            Edit
          </LoadingButton>
          <Button
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleConfirm}
          >
            Remove
          </Button>
        </CardActions>
      </Card>
      {/* ------------ DELETE ------------ */}
      <Modal
        open={confirmOpen}
        onClose={closeConfirm}
        sx={{ justifyItems: "center", alignContent: "center" }}
      >
        <Card sx={{ maxWidth: 300, justifyItems: "center" }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Are you sure you?
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => {
                closeConfirm();
                handleDelete();
              }}
            >
              Yes
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={closeConfirm}
            >
              No
            </Button>
          </CardActions>
        </Card>
      </Modal>
      {/* ------------  EDIT  ------------ */}
      <Modal
        open={editOpen}
        onClose={closeEdit}
        sx={{ justifyItems: "center", alignContent: "center" }}
      >
        <Card>
          <CardContent>
            <Grid container>
              <Grid size={12}>
                <Typography gutterBottom variant="h5" component="div">
                  Editing Image
                </Typography>
              </Grid>
              <Grid size={12} container spacing={1}>
                <Grid size="auto">
                  <img src={imageUrl} />
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
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={async () => {
                await handleSave();
                closeEdit();
              }}
            >
              Save
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={closeEdit}
            >
              Cancel
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  );
}
