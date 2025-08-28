import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';

const Clientes = () => {
  const { user } = useContext(AuthContext);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para el formulario
  const [currentCliente, setCurrentCliente] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: ''
  });
  
  // Estado para el modo de edición
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAll('clientes');
      setClientes(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      setError('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar clientes por término de búsqueda
  const filteredClientes = clientes.filter(cliente => 
    cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefono?.includes(searchTerm)
  );

  // Manejadores del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCliente({
      ...currentCliente,
      [name]: value
    });
  };

  const resetForm = () => {
    setCurrentCliente({
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      fecha_nacimiento: ''
    });
    setIsEditing(false);
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await apiService.update('clientes', editingId, currentCliente);
      } else {
        await apiService.create('clientes', currentCliente);
      }
      
      await fetchClientes();
      resetForm();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      setError('Error al guardar el cliente');
    }
  };

  const handleEdit = (cliente) => {
    setCurrentCliente({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || '',
      fecha_nacimiento: cliente.fecha_nacimiento || ''
    });
    setEditingId(cliente._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await apiService.delete('clientes', id);
        await fetchClientes();
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        setError('Error al eliminar el cliente');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      {/* Header */}
      <div className="bg-light rounded-3 p-4 mb-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold mb-1">👥 Gestión de Clientes</h2>
            <p className="text-muted mb-0">
              <i className="bi bi-person-circle me-1"></i>
              Bienvenido, {user?.username || 'Usuario'}
            </p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
          >
            <i className={`bi ${showForm ? 'bi-dash-circle' : 'bi-plus-circle'} me-2`}></i>
            {showForm ? 'Cerrar Formulario' : 'Nuevo Cliente'}
          </button>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mensajes de error */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
          <button 
            type="button" 
            className="btn-close ms-auto" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}
      
      {/* Formulario */}
      {showForm && (
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-header bg-white">
            <h5 className="mb-0">{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre Completo *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={currentCliente.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={currentCliente.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="telefono"
                    name="telefono"
                    value={currentCliente.telefono}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="fecha_nacimiento" className="form-label">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fecha_nacimiento"
                    name="fecha_nacimiento"
                    value={currentCliente.fecha_nacimiento}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">Dirección</label>
                <textarea
                  className="form-control"
                  id="direccion"
                  name="direccion"
                  rows="3"
                  value={currentCliente.direccion}
                  onChange={handleInputChange}
                  placeholder="Dirección completa del cliente..."
                />
              </div>
              
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <i className={`bi ${isEditing ? 'bi-check-circle' : 'bi-save'} me-2`}></i>
                  {isEditing ? 'Actualizar' : 'Guardar'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                  <i className="bi bi-x-circle me-2"></i>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Tabla de clientes */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="py-3">Nombre</th>
                  <th scope="col" className="py-3">Email</th>
                  <th scope="col" className="py-3">Teléfono</th>
                  <th scope="col" className="py-3">Fecha Nacimiento</th>
                  <th scope="col" className="py-3">Registro</th>
                  <th scope="col" className="py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.length > 0 ? (
                  filteredClientes.map(cliente => (
                    <tr key={cliente._id}>
                      <td className="fw-medium">{cliente.nombre}</td>
                      <td>{cliente.email}</td>
                      <td>{cliente.telefono || 'N/A'}</td>
                      <td>
                        {cliente.fecha_nacimiento ? 
                          new Date(cliente.fecha_nacimiento).toLocaleDateString('es-ES') 
                          : 'N/A'
                        }
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(cliente.created_at).toLocaleDateString('es-ES')}
                        </small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleEdit(cliente)}
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-info"
                            title="Ver detalles"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(cliente._id)}
                            title="Eliminar"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      {searchTerm ? (
                        <div>
                          <i className="bi bi-search fs-4 d-block mb-2"></i>
                          No se encontraron clientes con los criterios de búsqueda
                        </div>
                      ) : (
                        <div>
                          <i className="bi bi-people fs-4 d-block mb-2"></i>
                          No hay clientes registrados
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Estadísticas */}
      <div className="mt-4 row g-3">
        <div className="col-md-4">
          <div className="card bg-primary text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Total Clientes</h5>
                <small className="opacity-75">Registrados</small>
              </div>
              <div className="fs-2 fw-bold">{clientes.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Con Teléfono</h5>
                <small className="opacity-75">Contactables</small>
              </div>
              <div className="fs-2 fw-bold">
                {clientes.filter(c => c.telefono).length}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Nuevos (Este mes)</h5>
                <small className="opacity-75">Registrados</small>
              </div>
              <div className="fs-2 fw-bold">
                {clientes.filter(c => {
                  const created = new Date(c.created_at);
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && 
                         created.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
