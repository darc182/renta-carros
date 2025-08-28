import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { mockOrders, mockClients, mockItems } from '../data/mockData';
import { useLocation } from 'react-router-dom';

const Alquileres = () => {
  const { user } = useContext(AuthContext);
  const [alquileres, setAlquileres] = useState([]);
  const [clients, setClients] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  
  // Estado para el formulario
  const [currentAlquiler, setCurrentAlquiler] = useState({
    id: null,
    codigo: '',
    descripcion: '',
    id_cliente: '',
    id_vehiculo: '',
    fecha_reserva: '',
    fecha_inicio: '',
    fecha_fin: '',
    hora_entrega: '09:00',
    hora_devolucion: '18:00',
    estado: 'Pendiente',
    km_inicial: '',
    km_final: '',
    combustible_inicial: 'Lleno',
    combustible_final: '',
    metodo_pago: 'Tarjeta de crédito',
    subtotal: '',
    impuesto: '',
    total: '',
    deposito: '',
    deposito_devuelto: false,
    seguro: 'Básico',
    observaciones_entrega: '',
    observaciones_devolucion: ''
  });
  
  // Estado para el modo de edición
  const [isEditing, setIsEditing] = useState(false);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    // En un entorno real, aquí harías llamadas a la API
    // Por ahora, simulamos con datos mock
    const fetchData = async () => {
      try {
        // Simular una llamada a la API con un retardo
        setTimeout(() => {
          setAlquileres(mockOrders);
          setClients(mockClients);
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
  
  // Procesar parámetros de URL para prellenar el formulario
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const vehiculoId = queryParams.get('vehiculo');
    const clienteId = queryParams.get('cliente');
    
    if (vehiculoId) {
      const vehiculoSeleccionado = vehiculos.find(v => v.id === parseInt(vehiculoId));
      if (vehiculoSeleccionado) {
        setCurrentAlquiler(prev => ({
          ...prev,
          id_vehiculo: vehiculoId,
          km_inicial: vehiculoSeleccionado.km,
          deposito: vehiculoSeleccionado.categoria === 'SUV' || vehiculoSeleccionado.categoria === 'Pickup' ? '300.00' : '200.00',
          subtotal: vehiculoSeleccionado.precio,
          impuesto: (parseFloat(vehiculoSeleccionado.precio) * 0.12).toFixed(2),
          total: (parseFloat(vehiculoSeleccionado.precio) * 1.12).toFixed(2)
        }));
      }
    }
    
    if (clienteId) {
      setCurrentAlquiler(prev => ({
        ...prev,
        id_cliente: clienteId
      }));
    }
  }, [location.search, vehiculos]);

  // Manejadores del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAlquiler({
      ...currentAlquiler,
      [name]: value
    });
    
    // Si cambia vehiculo o fechas, recalcular totales
    if (name === 'id_vehiculo' || name === 'fecha_inicio' || name === 'fecha_fin') {
      calcularTotales(name, value);
    }
  };
  
  // Calcular subtotal, impuesto y total basado en vehículo y fechas
  const calcularTotales = (changedField, changedValue) => {
    let vehiculoId = currentAlquiler.id_vehiculo;
    let fechaInicio = currentAlquiler.fecha_inicio;
    let fechaFin = currentAlquiler.fecha_fin;
    
    if (changedField === 'id_vehiculo') vehiculoId = changedValue;
    if (changedField === 'fecha_inicio') fechaInicio = changedValue;
    if (changedField === 'fecha_fin') fechaFin = changedValue;
    
    if (vehiculoId && fechaInicio && fechaFin) {
      const vehiculo = vehiculos.find(v => v.id === parseInt(vehiculoId));
      if (vehiculo) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const diffTime = Math.abs(fin - inicio);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
          const subtotal = (parseFloat(vehiculo.precio) * diffDays).toFixed(2);
          const impuesto = (parseFloat(subtotal) * 0.12).toFixed(2);
          const total = (parseFloat(subtotal) + parseFloat(impuesto)).toFixed(2);
          
          setCurrentAlquiler(prev => ({
            ...prev,
            subtotal,
            impuesto,
            total,
            km_inicial: vehiculo.km,
            deposito: vehiculo.categoria === 'SUV' || vehiculo.categoria === 'Pickup' ? '300.00' : '200.00'
          }));
        }
      }
    }
  };

  const resetForm = () => {
    setCurrentAlquiler({
      id: null,
      codigo: '',
      descripcion: '',
      id_cliente: '',
      id_vehiculo: '',
      fecha_reserva: '',
      fecha_inicio: '',
      fecha_fin: '',
      hora_entrega: '09:00',
      hora_devolucion: '18:00',
      estado: 'Pendiente',
      km_inicial: '',
      km_final: '',
      combustible_inicial: 'Lleno',
      combustible_final: '',
      metodo_pago: 'Tarjeta de crédito',
      subtotal: '',
      impuesto: '',
      total: '',
      deposito: '',
      deposito_devuelto: false,
      seguro: 'Básico',
      observaciones_entrega: '',
      observaciones_devolucion: ''
    });
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    const alquilerWithDate = {
      ...currentAlquiler,
      fecha_reserva: currentAlquiler.fecha_reserva || today
    };
    
    if (isEditing) {
      // Actualizar un alquiler existente
      const updatedAlquileres = alquileres.map(alquiler => 
        alquiler.id === alquilerWithDate.id ? alquilerWithDate : alquiler
      );
      setAlquileres(updatedAlquileres);
    } else {
      // Crear un nuevo alquiler
      const newAlquiler = {
        ...alquilerWithDate,
        id: Date.now(), // Generar un ID único (en producción esto lo haría el backend)
        codigo: `ALQ-${String(Date.now()).slice(-4)}`
      };
      setAlquileres([...alquileres, newAlquiler]);
    }
    
    resetForm();
  };

  const handleEdit = (alquiler) => {
    setCurrentAlquiler(alquiler);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    // En un entorno real, aquí harías una llamada DELETE a la API
    setAlquileres(alquileres.filter(alquiler => alquiler.id !== id));
  };

  // Helper para obtener el nombre del cliente
  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === parseInt(clientId));
    return client ? `${client.nombre} ${client.apellido}` : 'No disponible';
  };

  // Helper para obtener el nombre del vehículo
  const getVehiculoName = (vehiculoId) => {
    const vehiculo = vehiculos.find(v => v.id === parseInt(vehiculoId));
    return vehiculo ? `${vehiculo.nombre} (${vehiculo.placa})` : 'No disponible';
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
            <h2 className="fw-bold mb-1">Gestión de Alquileres</h2>
            <p className="text-muted mb-0">
              <i className="bi bi-person-circle me-1"></i>
              Bienvenido, {user.nombre} {user.apellido}
            </p>
          </div>
          <button
            className="btn btn-success d-flex align-items-center"
            onClick={() => { setIsEditing(false); resetForm(); }}
            data-bs-toggle="modal" 
            data-bs-target="#alquilerModal"
            id="alquilerModalButton"
          >
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Alquiler
          </button>
        </div>
        
        {/* Barra de búsqueda y filtros */}
        <div className="row mb-3 align-items-center">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar alquileres..."
                aria-label="Buscar alquileres"
              />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select">
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div className="col-md-3">
            <input 
              type="date" 
              className="form-control" 
              placeholder="Filtrar por fecha" 
            />
          </div>
          <div className="col-md-2">
            <select className="form-select">
              <option value="">Todos los vehículos</option>
              {vehiculos.map(vehiculo => (
                <option key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.placa}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Tabla de alquileres */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="py-3">Código</th>
                  <th scope="col" className="py-3">Cliente</th>
                  <th scope="col" className="py-3">Vehículo</th>
                  <th scope="col" className="py-3">Período</th>
                  <th scope="col" className="py-3">Total</th>
                  <th scope="col" className="py-3">Estado</th>
                  <th scope="col" className="py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alquileres.length > 0 ? (
                  alquileres.map(alquiler => (
                    <tr key={alquiler.id}>
                      <td><span className="badge bg-dark text-white">{alquiler.codigo}</span></td>
                      <td className="fw-medium">{getClientName(alquiler.id_cliente)}</td>
                      <td>{getVehiculoName(alquiler.id_vehiculo)}</td>
                      <td>
                        <div>
                          <small className="d-block">
                            <i className="bi bi-calendar-date me-1"></i>
                            {new Date(alquiler.fecha_inicio).toLocaleDateString()} - {new Date(alquiler.fecha_fin).toLocaleDateString()}
                          </small>
                          <small className="text-muted">
                            <i className="bi bi-clock me-1"></i>
                            {alquiler.hora_entrega} - {alquiler.hora_devolucion}
                          </small>
                        </div>
                      </td>
                      <td className="fw-bold">${alquiler.total}</td>
                      <td>
                        <span className={`badge ${
                          alquiler.estado === 'Completado' ? 'bg-success' : 
                          alquiler.estado === 'Pendiente' ? 'bg-warning text-dark' :
                          alquiler.estado === 'Cancelado' ? 'bg-danger' : 'bg-info'
                        }`}>
                          {alquiler.estado}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              handleEdit(alquiler);
                              document.getElementById('alquilerModalButton').click();
                            }}
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-success"
                            title="Completar"
                            onClick={() => {
                              const updatedAlquiler = {...alquiler, estado: 'Completado'};
                              const updatedAlquileres = alquileres.map(a => 
                                a.id === alquiler.id ? updatedAlquiler : a
                              );
                              setAlquileres(updatedAlquileres);
                            }}
                          >
                            <i className="bi bi-check-circle"></i>
                          </button>
                          <button
                            className="btn btn-outline-info"
                            title="Imprimir contrato"
                          >
                            <i className="bi bi-printer"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(alquiler.id)}
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
                    <td colSpan="7" className="text-center py-4">
                      <i className="bi bi-calendar-x fs-4 d-block mb-2"></i>
                      No hay alquileres registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal para crear/editar alquiler */}
      <div className="modal fade" id="alquilerModal" tabIndex="-1" aria-labelledby="alquilerModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="alquilerModalLabel">{isEditing ? 'Editar Alquiler' : 'Nuevo Alquiler'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} id="alquilerForm">
                <div className="row mb-4">
                  <div className="col-md-12">
                    <div className="alert alert-info">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-info-circle-fill fs-4 me-2"></i>
                        <div>
                          Complete la información del alquiler. Todos los campos marcados con * son obligatorios.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="codigo"
                        name="codigo"
                        placeholder="Código"
                        value={currentAlquiler.codigo}
                        onChange={handleInputChange}
                        required
                        disabled={!isEditing}
                      />
                      <label htmlFor="codigo">Código *</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating">
                      <input
                        type="date"
                        className="form-control"
                        id="fecha_reserva"
                        name="fecha_reserva"
                        value={currentAlquiler.fecha_reserva}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="fecha_reserva">Fecha de Reserva *</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="descripcion"
                        name="descripcion"
                        placeholder="Descripción"
                        value={currentAlquiler.descripcion}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="descripcion">Descripción del Alquiler</label>
                    </div>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="id_cliente"
                        name="id_cliente"
                        value={currentAlquiler.id_cliente}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccionar Cliente</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.nombre} {client.apellido} - {client.cedula}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="id_cliente">Cliente *</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="id_vehiculo"
                        name="id_vehiculo"
                        value={currentAlquiler.id_vehiculo}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccionar Vehículo</option>
                        {vehiculos.map(vehiculo => (
                          <option key={vehiculo.id} value={vehiculo.id} disabled={parseInt(vehiculo.stock) <= 0}>
                            {vehiculo.nombre} - {vehiculo.placa} ({parseInt(vehiculo.stock) > 0 ? 'Disponible' : 'No disponible'})
                          </option>
                        ))}
                      </select>
                      <label htmlFor="id_vehiculo">Vehículo *</label>
                    </div>
                  </div>
                </div>
                
                <h6 className="border-bottom pb-2 mb-3">Período de Alquiler</h6>
                
                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="form-floating">
                      <input
                        type="date"
                        className="form-control"
                        id="fecha_inicio"
                        name="fecha_inicio"
                        value={currentAlquiler.fecha_inicio}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="fecha_inicio">Fecha de Inicio *</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating">
                      <input
                        type="time"
                        className="form-control"
                        id="hora_entrega"
                        name="hora_entrega"
                        value={currentAlquiler.hora_entrega}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="hora_entrega">Hora de Entrega *</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating">
                      <input
                        type="date"
                        className="form-control"
                        id="fecha_fin"
                        name="fecha_fin"
                        value={currentAlquiler.fecha_fin}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="fecha_fin">Fecha de Devolución *</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating">
                      <input
                        type="time"
                        className="form-control"
                        id="hora_devolucion"
                        name="hora_devolucion"
                        value={currentAlquiler.hora_devolucion}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="hora_devolucion">Hora de Devolución *</label>
                    </div>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6 className="border-bottom pb-2 mb-3">Información del Vehículo</h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="form-floating">
                          <input
                            type="number"
                            className="form-control"
                            id="km_inicial"
                            name="km_inicial"
                            placeholder="Kilometraje Inicial"
                            value={currentAlquiler.km_inicial}
                            onChange={handleInputChange}
                          />
                          <label htmlFor="km_inicial">Kilometraje Inicial</label>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="form-floating">
                          <input
                            type="number"
                            className="form-control"
                            id="km_final"
                            name="km_final"
                            placeholder="Kilometraje Final"
                            value={currentAlquiler.km_final}
                            onChange={handleInputChange}
                          />
                          <label htmlFor="km_final">Kilometraje Final</label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="combustible_inicial"
                            name="combustible_inicial"
                            value={currentAlquiler.combustible_inicial}
                            onChange={handleInputChange}
                          >
                            <option value="Lleno">Lleno</option>
                            <option value="3/4">3/4</option>
                            <option value="1/2">1/2</option>
                            <option value="1/4">1/4</option>
                            <option value="Vacío">Vacío</option>
                          </select>
                          <label htmlFor="combustible_inicial">Combustible Inicial</label>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="combustible_final"
                            name="combustible_final"
                            value={currentAlquiler.combustible_final}
                            onChange={handleInputChange}
                          >
                            <option value="">Seleccione al devolver</option>
                            <option value="Lleno">Lleno</option>
                            <option value="3/4">3/4</option>
                            <option value="1/2">1/2</option>
                            <option value="1/4">1/4</option>
                            <option value="Vacío">Vacío</option>
                          </select>
                          <label htmlFor="combustible_final">Combustible Final</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="border-bottom pb-2 mb-3">Pagos y Depósitos</h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="metodo_pago"
                            name="metodo_pago"
                            value={currentAlquiler.metodo_pago}
                            onChange={handleInputChange}
                          >
                            <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                            <option value="Tarjeta de débito">Tarjeta de débito</option>
                            <option value="Efectivo">Efectivo</option>
                            <option value="Transferencia">Transferencia</option>
                          </select>
                          <label htmlFor="metodo_pago">Método de Pago</label>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="seguro"
                            name="seguro"
                            value={currentAlquiler.seguro}
                            onChange={handleInputChange}
                          >
                            <option value="Básico">Básico</option>
                            <option value="Intermedio">Intermedio</option>
                            <option value="Premium">Premium</option>
                            <option value="Todo Riesgo">Todo Riesgo</option>
                          </select>
                          <label htmlFor="seguro">Tipo de Seguro</label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="form-floating">
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            id="deposito"
                            name="deposito"
                            placeholder="Depósito"
                            value={currentAlquiler.deposito}
                            onChange={handleInputChange}
                          />
                          <label htmlFor="deposito">Depósito ($)</label>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="form-check mt-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="deposito_devuelto"
                            name="deposito_devuelto"
                            checked={currentAlquiler.deposito_devuelto}
                            onChange={e => setCurrentAlquiler({...currentAlquiler, deposito_devuelto: e.target.checked})}
                          />
                          <label className="form-check-label" htmlFor="deposito_devuelto">
                            Depósito devuelto
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-12">
                    <h6 className="border-bottom pb-2 mb-3">Detalles Económicos</h6>
                    <div className="row">
                      <div className="col-md-3 mb-3">
                        <div className="form-floating">
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            id="subtotal"
                            name="subtotal"
                            placeholder="Subtotal"
                            value={currentAlquiler.subtotal}
                            onChange={handleInputChange}
                            required
                          />
                          <label htmlFor="subtotal">Subtotal ($)</label>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="form-floating">
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            id="impuesto"
                            name="impuesto"
                            placeholder="Impuesto"
                            value={currentAlquiler.impuesto}
                            onChange={handleInputChange}
                            required
                          />
                          <label htmlFor="impuesto">Impuesto ($)</label>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="form-floating">
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            id="total"
                            name="total"
                            placeholder="Total"
                            value={currentAlquiler.total}
                            onChange={handleInputChange}
                            required
                          />
                          <label htmlFor="total">Total ($)</label>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="estado"
                            name="estado"
                            value={currentAlquiler.estado}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En proceso">En proceso</option>
                            <option value="Completado">Completado</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                          <label htmlFor="estado">Estado</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        style={{ height: '100px' }}
                        id="observaciones_entrega"
                        name="observaciones_entrega"
                        placeholder="Observaciones al momento de la entrega"
                        value={currentAlquiler.observaciones_entrega}
                        onChange={handleInputChange}
                      ></textarea>
                      <label htmlFor="observaciones_entrega">Observaciones (Entrega)</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        style={{ height: '100px' }}
                        id="observaciones_devolucion"
                        name="observaciones_devolucion"
                        placeholder="Observaciones al momento de la devolución"
                        value={currentAlquiler.observaciones_devolucion}
                        onChange={handleInputChange}
                      ></textarea>
                      <label htmlFor="observaciones_devolucion">Observaciones (Devolución)</label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                form="alquilerForm"
              >
                <i className="bi bi-save me-2"></i>
                {isEditing ? 'Actualizar Alquiler' : 'Crear Alquiler'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alquileres;
