import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

export interface Thumbnail {
  id: number;
  image: string;
  author: string;
  quote: string;
};

const getThumbnails = async () => await api.get<Thumbnail[]>("/meta/thumbs");

const addQuote = (image:File) => {
  const data = new FormData();
  data.append("image", image, image.name);
  data.append("author", "blah");
  data.append("quote", "meh");

  return api.post("/upload", data);
};

const deleteQuote = (id: number) => api.delete(`/meta/${id}`);

const updateQuote = (id: number, author: string, quote: string) => api.patch("/meta", {
  id,
  author,
  quote
});

export default {
  getThumbnails,
  addQuote,
  deleteQuote,
  updateQuote
};
