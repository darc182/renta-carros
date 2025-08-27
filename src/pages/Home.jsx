import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container-fluid p-0">
      <div className="py-5" style={{ 
        background: 'linear-gradient(135deg, #1e5631, #3d8c40)',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
              <h1 className="display-3 fw-bold text-white mb-4">RentaCarros</h1>
              <p className="lead text-white mb-4">
                El sistema de gestión de alquiler de vehículos más completo del mercado.
                Administre su flota, clientes y reservas de manera eficiente y sencilla.
              </p>
              <Link to="/login" className="btn btn-light btn-lg px-5 py-3 rounded-pill">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión
              </Link>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div className="card border-0 shadow-lg rounded-4" style={{ maxWidth: '450px' }}>
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <div className="bg-success text-white rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                      <i className="bi bi-car-front-fill" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h3 className="fw-bold">Características principales</h3>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item border-0 py-3 d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <i className="bi bi-car-front text-success"></i>
                      </div>
                      <span>Control completo de su flota de vehículos</span>
                    </li>
                    <li className="list-group-item border-0 py-3 d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <i className="bi bi-people text-success"></i>
                      </div>
                      <span>Gestión integral de clientes</span>
                    </li>
                    <li className="list-group-item border-0 py-3 d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <i className="bi bi-calendar-check text-success"></i>
                      </div>
                      <span>Reservas y contratos de alquiler</span>
                    </li>
                    <li className="list-group-item border-0 py-3 d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <i className="bi bi-graph-up text-success"></i>
                      </div>
                      <span>Reportes detallados y estadísticas</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-speedometer2 text-success" style={{ fontSize: '2rem' }}></i>
                </div>
                <h4>Eficiencia en Gestión</h4>
                <p className="text-muted">Controle su flota de vehículos, mantenimientos y disponibilidad en tiempo real.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-calendar-week text-success" style={{ fontSize: '2rem' }}></i>
                </div>
                <h4>Reservas Simplificadas</h4>
                <p className="text-muted">Sistema de reservas intuitivo con calendarios, disponibilidad y gestión de contratos.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-cash-coin text-success" style={{ fontSize: '2rem' }}></i>
                </div>
                <h4>Control Financiero</h4>
                <p className="text-muted">Seguimiento de pagos, depósitos, multas y reportes financieros detallados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
