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
import AddEditQuote from "./AddEditQuote";

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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const closeConfirm = () => setConfirmOpen(false);
  const closeEdit = () => setEditOpen(false);

  const handleConfirm = useCallback(() => setConfirmOpen(true), []);
  const handleEdit = useCallback(() => setEditOpen(true), []);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 2000));
      const resp = await api.deleteQuote(model.id);
      if (resp.status === 204) props.onChange();
    } catch (ex) {
      console.error("delete err", ex);
    }
    setLoading(false);
  }, [model, props]);

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
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            disabled={isLoading}
          >
            Edit
          </Button>
          <LoadingButton
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleConfirm}
            loading={isLoading}
            disabled={isLoading}
          >
            Remove
          </LoadingButton>
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
        <div>
          <AddEditQuote
            model={model}
            onChange={props.onChange}
            onClose={closeEdit}
          />
        </div>
      </Modal>
    </>
  );
}
