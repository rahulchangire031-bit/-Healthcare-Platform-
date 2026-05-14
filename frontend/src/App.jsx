import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DoctorList from './pages/DoctorList';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="container flex-center" style={{ minHeight: '80vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="doctors" 
          element={
            <ProtectedRoute>
              <DoctorList />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
};

export default App;
