import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';

const Vehiculos = () => {
  const { user } = useContext(AuthContext);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para el formulario
  const [currentVehiculo, setCurrentVehiculo] = useState({
    marca: '',
    modelo: '',
    año: '',
    color: '',
    precio_dia: '',
    disponible: true,
    imagen: ''
  });
  
  // Estado para el modo de edición
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    fetchVehiculos();
  }, []);

  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAll('carros');
      setVehiculos(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar vehículos:', err);
      setError('Error al cargar los vehículos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar vehículos por término de búsqueda
  const filteredVehiculos = vehiculos.filter(vehiculo => 
    vehiculo.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.año?.toString().includes(searchTerm)
  );

  // Manejadores del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentVehiculo({
      ...currentVehiculo,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const resetForm = () => {
    setCurrentVehiculo({
      marca: '',
      modelo: '',
      año: '',
      color: '',
      precio_dia: '',
      disponible: true,
      imagen: ''
    });
    setIsEditing(false);
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await apiService.update('carros', editingId, currentVehiculo);
      } else {
        await apiService.create('carros', currentVehiculo);
      }
      
      await fetchVehiculos();
      resetForm();
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
      setError('Error al guardar el vehículo');
    }
  };

  const handleEdit = (vehiculo) => {
    setCurrentVehiculo({
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      año: vehiculo.año,
      color: vehiculo.color,
      precio_dia: vehiculo.precio_dia,
      disponible: vehiculo.disponible,
      imagen: vehiculo.imagen || ''
    });
    setEditingId(vehiculo._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      try {
        await apiService.delete('carros', id);
        await fetchVehiculos();
      } catch (error) {
        console.error('Error al eliminar vehículo:', error);
        setError('Error al eliminar el vehículo');
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
            <h2 className="fw-bold mb-1">🚗 Gestión de Vehículos</h2>
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
            {showForm ? 'Cerrar Formulario' : 'Nuevo Vehículo'}
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
                placeholder="Buscar por marca, modelo, color o año..."
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
            <h5 className="mb-0">{isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="marca" className="form-label">Marca</label>
                  <input
                    type="text"
                    className="form-control"
                    id="marca"
                    name="marca"
                    value={currentVehiculo.marca}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="modelo" className="form-label">Modelo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="modelo"
                    name="modelo"
                    value={currentVehiculo.modelo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label htmlFor="año" className="form-label">Año</label>
                  <input
                    type="number"
                    className="form-control"
                    id="año"
                    name="año"
                    value={currentVehiculo.año}
                    onChange={handleInputChange}
                    min="1990"
                    max="2030"
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="color" className="form-label">Color</label>
                  <input
                    type="text"
                    className="form-control"
                    id="color"
                    name="color"
                    value={currentVehiculo.color}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="precio_dia" className="form-label">Precio por día ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="precio_dia"
                    name="precio_dia"
                    value={currentVehiculo.precio_dia}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="disponible"
                      name="disponible"
                      checked={currentVehiculo.disponible}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="disponible">
                      Disponible
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="imagen" className="form-label">URL de Imagen (opcional)</label>
                <input
                  type="url"
                  className="form-control"
                  id="imagen"
                  name="imagen"
                  value={currentVehiculo.imagen}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
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
      
      {/* Lista de vehículos */}
      <div className="row g-4">
        {filteredVehiculos.length > 0 ? (
          filteredVehiculos.map(vehiculo => (
            <div key={vehiculo._id} className="col-sm-6 col-lg-4 col-xl-3">
              <div className="card h-100 shadow-sm border-0">
                <div className="position-relative">
                  <div className="ratio ratio-16x9 card-img-top overflow-hidden bg-light">
                    {vehiculo.imagen ? (
                      <img
                        src={vehiculo.imagen}
                        alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                        className="object-fit-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="d-flex justify-content-center align-items-center bg-light text-secondary" style={{display: vehiculo.imagen ? 'none' : 'flex'}}>
                      <i className="bi bi-car-front fs-1"></i>
                    </div>
                  </div>
                  
                  {/* Badge de disponibilidad */}
                  <div className="position-absolute top-0 end-0 p-2">
                    <span className={`badge ${vehiculo.disponible ? 'bg-success' : 'bg-danger'}`}>
                      {vehiculo.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{vehiculo.marca} {vehiculo.modelo}</h5>
                  <div className="mb-2">
                    <small className="text-muted d-block">
                      <i className="bi bi-calendar me-1"></i>
                      Año: {vehiculo.año}
                    </small>
                    {vehiculo.color && (
                      <small className="text-muted d-block">
                        <i className="bi bi-palette me-1"></i>
                        Color: {vehiculo.color}
                      </small>
                    )}
                  </div>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-5 text-primary">
                        ${vehiculo.precio_dia}/día
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="card-footer bg-white border-top-0">
                  <div className="btn-group w-100">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEdit(vehiculo)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-outline-success btn-sm"
                      title="Alquilar"
                      disabled={!vehiculo.disponible}
                    >
                      <i className="bi bi-calendar-check"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(vehiculo._id)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div>
              <i className="bi bi-car-front-fill fs-1 d-block mb-3 text-muted"></i>
              <h5>
                {searchTerm ? 'No se encontraron vehículos' : 'No hay vehículos registrados'}
              </h5>
              {!searchTerm && (
                <p className="text-muted">
                  Agrega tu primer vehículo haciendo clic en "Nuevo Vehículo"
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Estadísticas */}
      <div className="mt-4 row g-3">
        <div className="col-md-4">
          <div className="card bg-primary text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Total Vehículos</h5>
                <small className="opacity-75">Flota completa</small>
              </div>
              <div className="fs-2 fw-bold">{vehiculos.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Disponibles</h5>
                <small className="opacity-75">Para alquilar</small>
              </div>
              <div className="fs-2 fw-bold">
                {vehiculos.filter(v => v.disponible).length}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Precio Promedio</h5>
                <small className="opacity-75">Por día</small>
              </div>
              <div className="fs-2 fw-bold">
                ${vehiculos.length > 0 ? 
                  (vehiculos.reduce((sum, v) => sum + parseFloat(v.precio_dia || 0), 0) / vehiculos.length).toFixed(0) 
                  : '0'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehiculos;
