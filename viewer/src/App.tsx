import {
  Button,
  Card,
  CircularProgress,
  Grid2 as Grid,
  IconButton,
  LinearProgress,
  Modal,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const BASE_URL = "http://localhost:3000/images" as const;

let nextImageTimeout: NodeJS.Timeout;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [playing, setPlaying] = useState(true);

  const nextImage = useCallback(() => {
    setCurrent((prev) => {
      let next = prev + 1;
      if (next >= images.length) next = 0;
      return next;
    });
  }, [images.length]);

  const initialNextImage = useCallback(() => {
    const timeout = (nextImageTimeout = setTimeout(() => {
      setProgress((prev) => {
        let next = prev + 10;
        if (next > 100) {
          next = 0;
          nextImage();
        }
        return next;
      });
    }, 1000));
    return timeout;
  }, [nextImage]);

  useEffect(() => {
    const timeout = initialNextImage();
    return () => clearTimeout(timeout);
  }, [initialNextImage, nextImage, progress]);

  const getImages = useCallback(async () => {
    setLoading(true);
    const { data } = await axios.get<string[]>(BASE_URL);
    setImages(data);
    setLoading(false);
  }, []);

  const handlePausePlay = useCallback(() => {
    const state = !playing;
    setPlaying(state);
    if (!state) {
      clearTimeout(nextImageTimeout);
    } else {
      initialNextImage();
    }
  }, [initialNextImage, playing]);

  useEffect(() => void getImages(), [getImages]);

  if (loading) return <CircularProgress />;

  return (
    <div
      onMouseOver={() => setShowControls(true)}
      onMouseOut={() => setShowControls(false)}
    >
      <Modal open={showControls}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <IconButton onClick={handlePausePlay}>
            {!playing && <PlayCircleOutlineIcon sx={{ fontSize: "10em" }} />}
            {playing && <PauseCircleOutlineIcon sx={{ fontSize: "10em" }} />}
          </IconButton>
          {/* <IconButton>
            <SettingsIcon sx={{ fontSize: "10em" }} />
          </IconButton> */}
        </div>
      </Modal>
      <LinearProgress
        value={progress}
        variant="determinate"
        sx={{ height: 5 }}
      />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "calc(100vh - 5px)" }}
      >
        <img
          src={`${BASE_URL}/${images[current]}`}
          style={{ maxHeight: "100%", objectFit: "contain" }}
        />
      </Grid>
    </div>
  );
}
