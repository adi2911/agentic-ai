import axios from "axios";

export const uploadCall = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("audio", file);

  const res = await axios.post("/api/calls/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
  return res.data; // { id, status }
};

export const fetchCalls = async (page = 1, limit = 10) => {
  const res = await axios.get(`/api/calls?page=${page}&limit=${limit}`);
  return res.data; // { page, limit, total, data:[...] }
};

export const fetchCall = async (id) => {
  const res = await axios.get(`/api/calls/${id}`);
  return res.data; // full Call object with populated refs
};

export const deleteCall = async (id) => {
  await axios.delete(`/api/calls/${id}`);
};
