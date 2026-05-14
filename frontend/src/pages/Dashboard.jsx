import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PatientDashboard from '../components/PatientDashboard';
import DoctorDashboard from '../components/DoctorDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>
        Welcome, <span className="text-gradient">{user.name}</span>
      </h1>
      
      {user.role === 'patient' && <PatientDashboard />}
      {user.role === 'doctor' && <DoctorDashboard />}
      {user.role === 'admin' && <div>Admin Dashboard (Coming soon)</div>}
    </div>
  );
};

export default Dashboard;
