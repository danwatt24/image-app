import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCallback, useState } from "react";
import { Modal } from "@mui/material";

interface Props {
  model: {
    id: number;
    image: string;
    author: string;
    quote: string;
  };
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ThumbnailCard(props: Props) {
  const model = props.model;
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = useCallback(() => {}, []);
  const handleDelete = useCallback(() => setDeleteOpen(true), []);

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="140"
          image={`http://localhost:3000/thumbnails/${model.image}`}
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
            loading={props.loading}
            onClick={handleEdit}
          >
            Edit
          </LoadingButton>
          <Button
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Remove
          </Button>
        </CardActions>
      </Card>
      {/* ------------ DELETE ------------ */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
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
                setDeleteOpen(false);
                props.onDelete(model.id);
              }}
            >
              Yes
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => setDeleteOpen(false)}
            >
              No
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  );
}
