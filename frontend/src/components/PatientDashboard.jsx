import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User as UserIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('/api/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Your Appointments</h2>
        <Link to="/doctors" className="btn btn-primary">
          <Plus size={18} />
          Book Appointment
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="glass-card flex-center" style={{ padding: '4rem', flexDirection: 'column', gap: '1rem' }}>
          <Calendar size={48} color="var(--text-muted)" />
          <p style={{ color: 'var(--text-muted)' }}>You don't have any appointments yet.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {appointments.map(apt => (
            <div key={apt._id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className={`badge badge-${apt.status}`}>
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {format(new Date(apt.date), 'MMM dd, yyyy')}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <UserIcon size={24} color="var(--primary-light)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Dr. {apt.doctorId?.userId?.name || 'Unknown'}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>{apt.doctorId?.specialization || 'General'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-main)', fontSize: '0.875rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                <Clock size={16} color="var(--primary-light)" />
                <span>{apt.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
