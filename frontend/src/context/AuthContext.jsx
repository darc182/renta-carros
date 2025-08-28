import { createContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar el usuario del localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Función de inicio de sesión usando el backend real
  const login = async (credentials) => {
    try {
      // Mapear email a username para el backend
      const loginData = {
        username: credentials.email,
        password: credentials.password
      };

      const response = await apiService.auth.login(loginData);
      
      if (response.token) {
        // Decodificar el token para obtener información del usuario
        const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
        
        const userData = {
          id: tokenPayload.id,
          username: loginData.username,
          rol: tokenPayload.rol
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.token);
        
        return { success: true, user: userData };
      } else {
        return { success: false, message: 'No se recibió token de autenticación' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.response) {
        errorMessage = error.response.data.msg || errorMessage;
      }
      
      return { success: false, message: errorMessage };
    }
  };

  // Función de cierre de sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
