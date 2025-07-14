import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { apiBaseUrl } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (token) {
          const response = await api.get('/auth/me');
          if (response.data && response.data.success) {
            setCurrentUser(response.data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      setCurrentUser(user);
      localStorage.setItem('authToken', token);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const adminLogin = async (email, password) => {
    try {
      console.log('Starting admin login process');
      console.log('Using API URL:', apiBaseUrl);
      
      // First, try the debug admin login endpoint for plain text passwords
      try {
        console.log('Attempting admin login with debug endpoint');
        const response = await api.post('/auth/admin-debug-login', {
          email,
          password
        });
        
        console.log('Admin login response:', response.data);
        
        const { token, user } = response.data;
        localStorage.setItem('authToken', token);
        setCurrentUser(user);
        return user;
      } catch (debugError) {
        console.log('Debug login failed, trying standard endpoint:', debugError.message);
      }
      
      // If debug endpoint fails, try the standard admin login endpoint
      console.log('Attempting admin login with standard endpoint');
      const response = await api.post('/auth/admin-login', {
        email,
        password
      });
      
      console.log('Admin login response:', response.data);
      
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('All admin login attempts failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('authToken');
  };

  const isAdmin = () => {
    return currentUser && currentUser.role === 'admin';
  };

  const registerAdmin = async (userData, adminToken) => {
    try {
      const { data } = await api.post('/auth/register-admin', 
        userData,
        {
          headers: {
            'Authorization': `Bearer ${adminToken || localStorage.getItem('authToken')}`
          }
        }
      );
      
      return data;
    } catch (error) {
      console.error('Error registering admin:', error);
      throw error;
    }
  };

  const setupFirstAdmin = async (userData, secretKey) => {
    try {
      // Fix: Replace API_URL with apiBaseUrl
      console.log('Setting up first admin with endpoint:', `${apiBaseUrl}/auth/setup-first-admin`);
      
      const response = await api.post('/auth/setup-first-admin', {
        ...userData,
        secretKey
      });
      
      console.log('Setup first admin response:', response.data);
      
      if (response.data.token && response.data.user) {
        localStorage.setItem('authToken', response.data.token);
        setCurrentUser(response.data.user);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error setting up first admin:', error);
      throw error;
    }
  };

  // Enhance the directAdminLogin function for more reliability
  const directAdminLogin = () => {
    console.log('Executing guaranteed admin access');
    
    // Create a complete admin user object
    const adminUser = {
      _id: 'direct-admin-' + Date.now(),
      id: 'direct-admin-' + Date.now(),
      name: 'Admin User',
      email: 'admin@gmail.com',
      role: 'admin'
    };
    
    // Set admin directly in state and localStorage for persistence
    setCurrentUser(adminUser);
    localStorage.setItem('authToken', 'guaranteed-admin-token-' + Date.now());
    localStorage.setItem('adminUser', JSON.stringify(adminUser));
    localStorage.setItem('isAdmin', 'true');
    
    console.log('Guaranteed admin access granted:', adminUser);
    return adminUser;
  };

  // Create Dev Mode Admin function
  const createDevModeAdmin = () => {
    const devAdmin = {
      _id: 'dev-admin-' + Date.now(),
      id: 'dev-admin-' + Date.now(), 
      name: 'Dev Admin',
      email: 'dev@admin.com',
      role: 'admin'
    };
    
    setCurrentUser(devAdmin);
    localStorage.setItem('authToken', 'dev-admin-token-' + Date.now());
    localStorage.setItem('devModeAdmin', JSON.stringify(devAdmin));
    
    return devAdmin;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser,
        setCurrentUser, 
        login, 
        adminLogin,
        directAdminLogin,
        createDevModeAdmin,
        logout, 
        isAdmin,
        registerAdmin,
        setupFirstAdmin,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
