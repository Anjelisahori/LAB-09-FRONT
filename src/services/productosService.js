import axios from "axios";

const API_URL = "http://localhost:3000/productos"; // cambia por tu URL en Render

export const listarProductos = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const crearProducto = async (formData) => {
  const res = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const actualizarProducto = async (id, producto) => {
  const res = await axios.put(`${API_URL}/${id}`, producto);
  return res.data;
};

export const eliminarProducto = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

export const hacerBackup = async () => {
  const res = await axios.post(`${API_URL}/backup`);
  return res.data;
};

export const restaurarBackup = async () => {
  const res = await axios.post(`${API_URL}/restore`);
  return res.data;
};
