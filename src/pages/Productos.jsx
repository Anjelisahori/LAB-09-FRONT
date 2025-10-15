import { useEffect, useState } from "react";
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  hacerBackup,
  restaurarBackup,
} from "../services/productosService";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: null,
  });
  const [modoEditar, setModoEditar] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const data = await listarProductos();
    setProductos(data);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!modoEditar) {
        const formData = new FormData();
        Object.keys(form).forEach((key) => {
          if (form[key]) formData.append(key, form[key]);
        });
        await crearProducto(formData);
      } else {
        await actualizarProducto(form.id, {
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: form.precio,
          stock: form.stock,
        });
        setModoEditar(false);
      }
      setForm({ id: "", nombre: "", descripcion: "", precio: "", stock: "", imagen: null });
      await cargarProductos();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      alert("❌ Error al guardar producto");
    }
  };

  const handleEdit = (producto) => {
    setForm(producto);
    setModoEditar(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Deseas eliminar este producto?")) {
      try {
        await eliminarProducto(id);
        await cargarProductos();
      } catch (err) {
        console.error("Error al eliminar producto:", err);
        alert("❌ Error al eliminar producto");
      }
    }
  };

  const handleBackup = async () => {
    try {
      const data = await hacerBackup();
      alert(`✅ Backup realizado correctamente. Archivos copiados: ${data.copied}`);
    } catch (err) {
      console.error("Error al hacer backup:", err);
      alert("❌ Error al hacer backup");
    }
  };

  const handleRestore = async () => {
    try {
      const data = await restaurarBackup();
      alert(`✅ Restauración completa. Archivos restaurados: ${data.restored}`);
      await cargarProductos(); // refresca la lista
    } catch (err) {
      console.error("Error al restaurar backup:", err);
      alert("❌ Error al restaurar backup");
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h1 className="fw-bold text-primary">🛍️ CRUD de Productos con AWS S3</h1>
            <p className="text-muted">
              Administra tus productos, precios, stock e imágenes almacenadas en AWS S3.
            </p>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Nombre</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ej: Laptop Dell Inspiron"
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Precio (S/.)</label>
                <input
                  name="precio"
                  value={form.precio}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ej: 2500"
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Stock</label>
                <input
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ej: 10"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Imagen</label>
                <input
                  type="file"
                  name="imagen"
                  onChange={handleChange}
                  className="form-control"
                  accept="image/*"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ej: Laptop de alto rendimiento con 16GB RAM y SSD 512GB"
                  rows="2"
                ></textarea>
              </div>
            </div>

            <div className="mt-4 d-flex flex-wrap gap-2">
              <button type="submit" className="btn btn-primary">
                {modoEditar ? "Actualizar Producto" : "Agregar Producto"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm({ id: "", nombre: "", descripcion: "", precio: "", stock: "", imagen: null })
                }
                className="btn btn-secondary"
              >
                Limpiar
              </button>
              <button type="button" onClick={handleBackup} className="btn btn-warning text-white">
                Hacer Backup
              </button>
              <button type="button" onClick={handleRestore} className="btn btn-success">
                Restaurar Backup
              </button>
            </div>
          </form>

          {/* TABLA */}
          <div className="mt-5">
            <h4 className="fw-bold mb-3 text-center text-secondary">📦 Lista de Productos</h4>
            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center">
                <thead className="table-primary">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-muted">
                        No hay productos registrados aún.
                      </td>
                    </tr>
                  ) : (
                    productos.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.nombre}</td>
                        <td>S/. {p.precio}</td>
                        <td>{p.stock}</td>
                        <td>
                          <img
                            src={p.imagen_url}
                            alt={p.nombre}
                            style={{ height: "60px", borderRadius: "8px" }}
                          />
                        </td>
                        <td>
                          <button
                            onClick={() => handleEdit(p)}
                            className="btn btn-sm btn-warning text-white me-2"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="btn btn-sm btn-danger"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
