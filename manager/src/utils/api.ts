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

export interface Quote {
  file?: File;
  author?: string;
  quote: string;
}

const addQuote = (data: Quote) => {
  const { file, author, quote } = data;
  if (!file) throw new Error("no file provided to add");
  const form = new FormData();
  form.append("image", file, file.name);
  form.append("author", author || "");
  form.append("quote", quote);

  return api.post("/upload", form);
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
