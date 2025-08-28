import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';

// Componentes
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Vehiculos from './pages/Vehiculos'; // Autos
import Clientes from './pages/Clientes'; // Clientes
import Alquileres from './pages/Alquileres'; // Alquileres

// Contexto
import AuthProvider from './context/AuthContext';

function App() {
  // Cargar Bootstrap JS al montar el componente
  useEffect(() => {
    const loadBootstrapJs = async () => {
      try {
        const bootstrap = await import('bootstrap');
      } catch (error) {
        console.error('Error loading Bootstrap JS:', error);
      }
    };
    
    loadBootstrapJs();
  }, []);

  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        
        <main className="flex-grow-1 py-3">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas */}
            <Route path="/vehiculos" element={
              <ProtectedRoute>
                <Vehiculos />
              </ProtectedRoute>
            } />
            
            <Route path="/clientes" element={
              <ProtectedRoute>
                <Clientes />
              </ProtectedRoute>
            } />
            
            <Route path="/alquileres" element={
              <ProtectedRoute>
                <Alquileres />
              </ProtectedRoute>
            } />
            
            <Route path="/reportes" element={
              <ProtectedRoute>
                <div className="container mt-4">
                  <div className="alert alert-info">
                    <h4 className="alert-heading">Módulo de Reportes</h4>
                    <p>Esta funcionalidad estará disponible próximamente.</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Ruta por defecto - redirige a inicio */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="bg-dark text-white text-center py-3">
          <div className="container">
            <p className="m-0">RentaCarros - Sistema de Gestión de Alquiler de Vehículos &copy; {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  )
}

export default App
