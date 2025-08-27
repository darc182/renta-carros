import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { mockClients } from '../data/mockData';

const Clientes = () => {
  const { user } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el formulario
  const [currentClient, setCurrentClient] = useState({
    id: null,
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    ciudad: '',
    direccion: '',
    licencia: '',
    fecha_emision_licencia: '',
    fecha_vencimiento_licencia: '',
    fecha_nacimiento: '',
    tipo_cliente: 'Regular',
    notas: ''
  });
  
  // Estado para el modo de edición
  const [isEditing, setIsEditing] = useState(false);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    // En un entorno real, aquí harías una llamada a la API
    // Por ahora, simulamos con datos mock
    const fetchData = async () => {
      try {
        // Simular una llamada a la API con un retardo
        setTimeout(() => {
          setClients(mockClients);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Error al cargar los datos');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Manejadores del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClient({
      ...currentClient,
      [name]: value
    });
  };

  const resetForm = () => {
    setCurrentClient({
      id: null,
      nombre: '',
      apellido: '',
      cedula: '',
      email: '',
      telefono: '',
      ciudad: '',
      direccion: '',
      licencia: '',
      fecha_emision_licencia: '',
      fecha_vencimiento_licencia: '',
      fecha_nacimiento: '',
      tipo_cliente: 'Regular',
      notas: ''
    });
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Actualizar un cliente existente
      const updatedClients = clients.map(client => 
        client.id === currentClient.id ? currentClient : client
      );
      setClients(updatedClients);
    } else {
      // Crear un nuevo cliente
      const newClient = {
        ...currentClient,
        id: Date.now() // Generar un ID único (en producción esto lo haría el backend)
      };
      setClients([...clients, newClient]);
    }
    
    resetForm();
  };

  const handleEdit = (client) => {
    setCurrentClient(client);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    // En un entorno real, aquí harías una llamada DELETE a la API
    setClients(clients.filter(client => client.id !== id));
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="bg-light rounded-3 p-4 mb-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold mb-1">Gestión de Clientes</h2>
            <p className="text-muted mb-0">
              <i className="bi bi-person-circle me-1"></i>
              Bienvenido, {user.nombre} {user.apellido}
            </p>
          </div>
          <button
            className="btn btn-success d-flex align-items-center"
            onClick={() => setIsEditing(false)}
            data-bs-toggle="modal" 
            data-bs-target="#clientModal"
          >
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Cliente
          </button>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="row mb-3 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar clientes por nombre, cédula o teléfono..."
                aria-label="Buscar clientes"
              />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select">
              <option value="">Todos los tipos</option>
              <option value="Regular">Regular</option>
              <option value="Premium">Premium</option>
              <option value="Corporativo">Corporativo</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select">
              <option value="">Todas las ciudades</option>
              <option value="Guayaquil">Guayaquil</option>
              <option value="Quito">Quito</option>
              <option value="Cuenca">Cuenca</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Tabla de clientes */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="py-3">Cédula</th>
                  <th scope="col" className="py-3">Cliente</th>
                  <th scope="col" className="py-3">Contacto</th>
                  <th scope="col" className="py-3">Licencia</th>
                  <th scope="col" className="py-3">Tipo</th>
                  <th scope="col" className="py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.length > 0 ? (
                  clients.map(client => (
                    <tr key={client.id}>
                      <td><span className="badge bg-dark text-white">{client.cedula}</span></td>
                      <td>
                        <div className="fw-medium">{client.nombre} {client.apellido}</div>
                        <small className="text-muted">{client.ciudad}</small>
                      </td>
                      <td>
                        <div>{client.email}</div>
                        <small className="text-muted">{client.telefono}</small>
                      </td>
                      <td>
                        <div className="fw-medium">{client.licencia}</div>
                        <small className="text-muted">
                          Exp: {client.fecha_vencimiento_licencia 
                            ? new Date(client.fecha_vencimiento_licencia).toLocaleDateString() 
                            : 'No registrada'}
                        </small>
                      </td>
                      <td>
                        <span className={`badge ${
                          client.tipo_cliente === 'Premium' ? 'bg-warning text-dark' : 
                          client.tipo_cliente === 'Corporativo' ? 'bg-info text-dark' : 
                          'bg-success'
                        }`}>
                          {client.tipo_cliente || 'Regular'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              handleEdit(client);
                              document.getElementById('clientModalButton').click();
                            }}
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-success"
                            title="Nuevo alquiler"
                            onClick={() => window.location.href = `/alquileres?cliente=${client.id}`}
                          >
                            <i className="bi bi-calendar-plus"></i>
                          </button>
                          <button
                            className="btn btn-outline-info"
                            title="Historial"
                            onClick={() => window.location.href = `/alquileres?historial=${client.id}`}
                          >
                            <i className="bi bi-clock-history"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(client.id)}
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
                      <i className="bi bi-people fs-4 d-block mb-2"></i>
                      No hay clientes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal para crear/editar cliente */}
      <div className="modal fade" id="clientModal" tabIndex="-1" aria-labelledby="clientModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="clientModalLabel">{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} id="clientForm">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        placeholder="Nombre"
                        value={currentClient.nombre}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="nombre">Nombre</label>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="apellido"
                        name="apellido"
                        placeholder="Apellido"
                        value={currentClient.apellido}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="apellido">Apellido</label>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="cedula"
                        name="cedula"
                        placeholder="Cédula/ID"
                        value={currentClient.cedula}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="cedula">Cédula/ID</label>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={currentClient.email}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="email">Email</label>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="tel"
                        className="form-control"
                        id="telefono"
                        name="telefono"
                        placeholder="Teléfono"
                        value={currentClient.telefono}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="telefono">Teléfono</label>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="date"
                        className="form-control"
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        value={currentClient.fecha_nacimiento}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="ciudad"
                        name="ciudad"
                        placeholder="Ciudad"
                        value={currentClient.ciudad}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="ciudad">Ciudad</label>
                    </div>
                  </div>
                  <div className="col-md-8 mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="direccion"
                        name="direccion"
                        placeholder="Dirección"
                        value={currentClient.direccion}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="direccion">Dirección</label>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="licencia"
                        name="licencia"
                        placeholder="Número de Licencia"
                        value={currentClient.licencia}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="licencia">Número de Licencia</label>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="date"
                        className="form-control"
                        id="fecha_emision_licencia"
                        name="fecha_emision_licencia"
                        value={currentClient.fecha_emision_licencia}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="fecha_emision_licencia">Fecha de Emisión</label>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="date"
                        className="form-control"
                        id="fecha_vencimiento_licencia"
                        name="fecha_vencimiento_licencia"
                        value={currentClient.fecha_vencimiento_licencia}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="fecha_vencimiento_licencia">Fecha de Vencimiento</label>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="tipo_cliente"
                        name="tipo_cliente"
                        value={currentClient.tipo_cliente}
                        onChange={handleInputChange}
                      >
                        <option value="Regular">Regular</option>
                        <option value="Premium">Premium</option>
                        <option value="Corporativo">Corporativo</option>
                      </select>
                      <label htmlFor="tipo_cliente">Tipo de Cliente</label>
                    </div>
                  </div>
                  <div className="col-md-8 mb-3">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        id="notas"
                        name="notas"
                        placeholder="Notas"
                        style={{ height: '100px' }}
                        value={currentClient.notas}
                        onChange={handleInputChange}
                      ></textarea>
                      <label htmlFor="notas">Notas Adicionales</label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" form="clientForm" className="btn btn-success">
                {isEditing ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botón oculto para abrir el modal */}
      <button id="clientModalButton" className="d-none" data-bs-toggle="modal" data-bs-target="#clientModal"></button>
      
      {/* Resumen estadístico */}
      <div className="mt-4 row g-3">
        <div className="col-md-4">
          <div className="card bg-success text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Total de Clientes</h5>
                <small className="opacity-75">Base de datos de clientes</small>
              </div>
              <div className="fs-2 fw-bold">{clients.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Clientes Premium</h5>
                <small className="opacity-75">Miembros destacados</small>
              </div>
              <div className="fs-2 fw-bold">
                {clients.filter(client => client.tipo_cliente === 'Premium').length}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-dark border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Clientes Corporativos</h5>
                <small className="opacity-75">Cuentas empresariales</small>
              </div>
              <div className="fs-2 fw-bold">
                {clients.filter(client => client.tipo_cliente === 'Corporativo').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
