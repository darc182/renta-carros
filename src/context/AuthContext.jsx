import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar el usuario del localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Función de inicio de sesión
  const login = async (credentials) => {
    try {
      // En un entorno real, aquí se haría una llamada a la API
      // Por ahora, simulamos la verificación con datos mock
      
      // Simulamos datos de usuarios para pruebas
      const mockUsers = [
        { id: 1, email: 'admin@example.com', password: '123456', nombre: 'Admin', apellido: 'Usuario' },
        { id: 2, email: 'user@example.com', password: '123456', nombre: 'Usuario', apellido: 'Prueba' }
      ];
      
      const foundUser = mockUsers.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );

      if (foundUser) {
        // Omitimos la contraseña por seguridad
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return { success: true, user: userWithoutPassword };
      } else {
        return { success: false, message: 'Usuario o contraseña incorrectos' };
      }
    } catch (error) {
      return { success: false, message: 'Error al iniciar sesión' };
    }
  };

  // Función de cierre de sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
