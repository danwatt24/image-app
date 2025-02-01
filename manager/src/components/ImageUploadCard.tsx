import Button from "@mui/material/Button";
import { Modal } from "@mui/material";
import { useState } from "react";
import AddEditQuote from "./AddEditQuote";

interface Props {
  changed: () => void;
}

export default function ImageUploadCard(props: Props) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        sx={{ height: "100%", width: 180, minHeight: 280 }}
        onClick={() => setShowAdd(true)}
      >
        Add Quote
      </Button>
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        sx={{ justifyItems: "center", alignContent: "center" }}
      >
        <div>
          <AddEditQuote
            onClose={() => setShowAdd(false)}
            onChange={props.changed}
          />
        </div>
      </Modal>
    </>
  );
}
