import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { mockItems } from '../data/mockData';

const Vehiculos = () => {
  const { user } = useContext(AuthContext);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'table' o 'cards'
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  
  // Estado para el formulario
  const [currentVehiculo, setCurrentVehiculo] = useState({
    id: null,
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    stock: '',
    fecha_ingreso: '',
    placa: '',
    modelo: '',
    color: '',
    transmision: '',
    combustible: '',
    km: ''
  });
  
  // Estado para el modo de edición
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    // En un entorno real, aquí harías una llamada a la API
    // Por ahora, simulamos con datos mock
    const fetchData = async () => {
      try {
        // Simular una llamada a la API con un retardo
        setTimeout(() => {
          setVehiculos(mockItems);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Error al cargar los datos');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Obtener categorías únicas para el filtro
  const categorias = [...new Set(vehiculos.map(vehiculo => vehiculo.categoria))];

  // Filtrar vehículos por término de búsqueda y categoría
  const filteredVehiculos = vehiculos.filter(vehiculo => {
    const matchesSearch = 
      vehiculo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = filtroCategoria === '' || vehiculo.categoria === filtroCategoria;
    
    return matchesSearch && matchesCategoria;
  });

  // Manejadores del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVehiculo({
      ...currentVehiculo,
      [name]: value
    });
  };

  const resetForm = () => {
    setCurrentVehiculo({
      id: null,
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: '',
      stock: '',
      fecha_ingreso: '',
      placa: '',
      modelo: '',
      color: '',
      transmision: '',
      combustible: '',
      km: ''
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Actualizar un vehículo existente
      const updatedVehiculos = vehiculos.map(vehiculo => 
        vehiculo.id === currentVehiculo.id ? currentVehiculo : vehiculo
      );
      setVehiculos(updatedVehiculos);
    } else {
      // Crear un nuevo vehículo
      const newVehiculo = {
        ...currentVehiculo,
        id: Date.now() // Generar un ID único (en producción esto lo haría el backend)
      };
      setVehiculos([...vehiculos, newVehiculo]);
    }
    
    resetForm();
  };

  const handleEdit = (vehiculo) => {
    setCurrentVehiculo(vehiculo);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    // En un entorno real, aquí harías una llamada DELETE a la API
    setVehiculos(vehiculos.filter(vehiculo => vehiculo.id !== id));
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

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="bg-light rounded-3 p-4 mb-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold mb-1">Gestión de Vehículos</h2>
            <p className="text-muted mb-0">
              <i className="bi bi-person-circle me-1"></i>
              Bienvenido, {user.nombre} {user.apellido}
            </p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={() => { setShowForm(!showForm); setIsEditing(false); }}
          >
            <i className={`bi ${showForm ? 'bi-dash-circle' : 'bi-plus-circle'} me-2`}></i>
            {showForm ? 'Cerrar Formulario' : 'Nuevo Vehículo'}
          </button>
        </div>
        
        {/* Barra de búsqueda y herramientas */}
        <div className="row mb-3 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar vehículos por nombre, placa o descripción..."
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
          <div className="col-md-3">
            <select
              className="form-select"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria, index) => (
                <option key={index} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <div className="btn-group" role="group">
              <button 
                type="button" 
                className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('table')}
              >
                <i className="bi bi-table me-1"></i> Tabla
              </button>
              <button 
                type="button" 
                className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('cards')}
              >
                <i className="bi bi-grid-3x3-gap me-1"></i> Tarjetas
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Formulario para crear/editar */}
      {showForm && (
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-header bg-white">
            <h5 className="mb-0">{isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      placeholder="Nombre/Modelo"
                      value={currentVehiculo.nombre}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="nombre">Nombre/Modelo</label>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="codigo"
                      name="codigo"
                      placeholder="Código"
                      value={currentVehiculo.codigo}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="codigo">Código</label>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="placa"
                      name="placa"
                      placeholder="Placa"
                      value={currentVehiculo.placa}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="placa">Placa</label>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-8 mb-3">
                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      style={{ height: '100px' }}
                      id="descripcion"
                      name="descripcion"
                      placeholder="Descripción"
                      value={currentVehiculo.descripcion}
                      onChange={handleInputChange}
                    ></textarea>
                    <label htmlFor="descripcion">Descripción</label>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="mb-3">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="categoria"
                        name="categoria"
                        value={currentVehiculo.categoria}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccione</option>
                        <option value="Sedán">Sedán</option>
                        <option value="SUV">SUV</option>
                        <option value="Pickup">Pickup</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Deportivo">Deportivo</option>
                        <option value="Van">Van</option>
                      </select>
                      <label htmlFor="categoria">Categoría</label>
                    </div>
                  </div>
                  <div className="form-floating">
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      id="precio"
                      name="precio"
                      placeholder="Precio diario ($)"
                      value={currentVehiculo.precio}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="precio">Precio diario ($)</label>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="modelo"
                      name="modelo"
                      placeholder="Año"
                      value={currentVehiculo.modelo}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="modelo">Año</label>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="color"
                      name="color"
                      placeholder="Color"
                      value={currentVehiculo.color}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="color">Color</label>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="transmision"
                      name="transmision"
                      value={currentVehiculo.transmision}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione</option>
                      <option value="Automática">Automática</option>
                      <option value="Manual">Manual</option>
                      <option value="CVT">CVT</option>
                    </select>
                    <label htmlFor="transmision">Transmisión</label>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="combustible"
                      name="combustible"
                      value={currentVehiculo.combustible}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione</option>
                      <option value="Gasolina">Gasolina</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Eléctrico">Eléctrico</option>
                    </select>
                    <label htmlFor="combustible">Combustible</label>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      id="km"
                      name="km"
                      placeholder="Kilometraje"
                      value={currentVehiculo.km}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="km">Kilometraje</label>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      id="stock"
                      name="stock"
                      placeholder="Cantidad disponible"
                      value={currentVehiculo.stock}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="stock">Cantidad disponible</label>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="date"
                      className="form-control"
                      id="fecha_ingreso"
                      name="fecha_ingreso"
                      value={currentVehiculo.fecha_ingreso}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="fecha_ingreso">Fecha de Ingreso</label>
                  </div>
                </div>
              </div>
              
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary d-flex align-items-center">
                  <i className={`bi ${isEditing ? 'bi-check-circle' : 'bi-save'} me-2`}></i>
                  {isEditing ? 'Actualizar' : 'Guardar'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-flex align-items-center"
                    onClick={resetForm}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Vista de tabla */}
      {viewMode === 'table' && (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="py-3">Placa</th>
                    <th scope="col" className="py-3">Modelo</th>
                    <th scope="col" className="py-3">Categoría</th>
                    <th scope="col" className="py-3">Año</th>
                    <th scope="col" className="py-3">Transmisión</th>
                    <th scope="col" className="py-3">Precio/Día</th>
                    <th scope="col" className="py-3">Estado</th>
                    <th scope="col" className="py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehiculos.length > 0 ? (
                    filteredVehiculos.map(vehiculo => (
                      <tr key={vehiculo.id}>
                        <td><span className="badge bg-dark text-white">{vehiculo.placa}</span></td>
                        <td className="fw-medium">{vehiculo.nombre}</td>
                        <td><span className="badge bg-light text-dark">{vehiculo.categoria}</span></td>
                        <td>{vehiculo.modelo}</td>
                        <td>{vehiculo.transmision}</td>
                        <td className="fw-bold">${vehiculo.precio}/día</td>
                        <td>
                          {parseInt(vehiculo.stock) > 0 ? (
                            <span className="badge bg-success">Disponible</span>
                          ) : (
                            <span className="badge bg-danger">No disponible</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleEdit(vehiculo)}
                              title="Editar"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-success"
                              title="Alquilar"
                              onClick={() => window.location.href = `/alquileres?vehiculo=${vehiculo.id}`}
                            >
                              <i className="bi bi-calendar-check"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(vehiculo.id)}
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
                      <td colSpan="8" className="text-center py-4">
                        {searchTerm || filtroCategoria ? 
                          <div>
                            <i className="bi bi-search fs-4 d-block mb-2"></i>
                            No se encontraron vehículos con los criterios de búsqueda
                          </div> 
                          : 
                          <div>
                            <i className="bi bi-car-front-fill fs-4 d-block mb-2"></i>
                            No hay vehículos registrados
                          </div>
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Vista de tarjetas */}
      {viewMode === 'cards' && (
        <div className="row g-4">
          {filteredVehiculos.length > 0 ? (
            filteredVehiculos.map(vehiculo => (
              <div key={vehiculo.id} className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 shadow-sm border-0">
                  <div className="position-relative">
                    <div className="ratio ratio-16x9 card-img-top overflow-hidden bg-light">
                      {vehiculo.imagen ? (
                        <img
                          src={vehiculo.imagen}
                          alt={vehiculo.nombre}
                          className="object-fit-cover"
                        />
                      ) : (
                        <div className="d-flex justify-content-center align-items-center bg-light text-secondary">
                          <i className="bi bi-car-front fs-1"></i>
                        </div>
                      )}
                    </div>
                    <div className="position-absolute top-0 start-0 p-2">
                      <span className="badge bg-dark">
                        {vehiculo.placa}
                      </span>
                    </div>
                    <div className="position-absolute top-0 end-0 p-2">
                      <span className="badge bg-primary">
                        {vehiculo.categoria}
                      </span>
                    </div>
                    {parseInt(vehiculo.stock) <= 0 && (
                      <div className="position-absolute top-50 start-50 translate-middle">
                        <span className="badge bg-danger fs-5 px-4 py-2 opacity-75">
                          No Disponible
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-truncate">{vehiculo.nombre}</h5>
                    <div className="mb-2">
                      <span className="d-block text-muted small mb-1 text-truncate">
                        <i className="bi bi-calendar-date me-1"></i> Modelo: {vehiculo.modelo}
                      </span>
                      <span className="d-block text-muted small mb-1 text-truncate">
                        <i className="bi bi-gear me-1"></i> Transmisión: {vehiculo.transmision}
                      </span>
                      <span className="d-block text-muted small text-truncate">
                        <i className="bi bi-fuel-pump me-1"></i> Combustible: {vehiculo.combustible}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold fs-5 text-primary">${vehiculo.precio}/día</span>
                        <span className="badge" style={{backgroundColor: vehiculo.color, color: '#fff'}}>
                          {vehiculo.color}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-white border-top-0">
                    <div className="d-grid gap-2">
                      <div className="btn-group">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleEdit(vehiculo)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Editar
                        </button>
                        <button
                          className="btn btn-outline-success"
                          title="Alquilar"
                          onClick={() => window.location.href = `/alquileres?vehiculo=${vehiculo.id}`}
                          disabled={parseInt(vehiculo.stock) <= 0}
                        >
                          <i className="bi bi-calendar-check me-1"></i>
                          Alquilar
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(vehiculo.id)}
                          title="Eliminar"
                        >
                          <i className="bi bi-trash me-1"></i>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              {searchTerm || filtroCategoria ? 
                <div>
                  <i className="bi bi-search fs-1 d-block mb-3 text-muted"></i>
                  <h5>No se encontraron vehículos con los criterios de búsqueda</h5>
                </div> 
                : 
                <div>
                  <i className="bi bi-car-front-fill fs-1 d-block mb-3 text-muted"></i>
                  <h5>No hay vehículos registrados</h5>
                </div>
              }
            </div>
          )}
        </div>
      )}
      
      {/* Resumen y estadísticas */}
      <div className="mt-4 row g-3">
        <div className="col-md-4">
          <div className="card bg-primary text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Total de Vehículos</h5>
                <small className="opacity-75">Flota completa</small>
              </div>
              <div className="fs-2 fw-bold">{filteredVehiculos.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Disponibles</h5>
                <small className="opacity-75">Vehículos para alquilar</small>
              </div>
              <div className="fs-2 fw-bold">
                {filteredVehiculos.filter(vehiculo => parseInt(vehiculo.stock || 0) > 0).length}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Ingresos Potenciales</h5>
                <small className="opacity-75">Por día (todos disponibles)</small>
              </div>
              <div className="fs-2 fw-bold">
                ${filteredVehiculos.reduce((sum, vehiculo) => sum + parseFloat(vehiculo.precio || 0) * parseInt(vehiculo.stock || 0), 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehiculos;
