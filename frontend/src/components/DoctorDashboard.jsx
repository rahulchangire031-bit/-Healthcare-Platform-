import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User as UserIcon, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState({ specialization: '', experience: '' });
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    fetchAppointments();
    // fetch doctor profile could be added here
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('/api/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/appointments/${id}`, { status });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/doctors', profile);
      setEditingProfile(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Professional Profile</h2>
          <button className="btn btn-secondary" onClick={() => setEditingProfile(!editingProfile)}>
            {editingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editingProfile ? (
          <form onSubmit={handleProfileSave} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
              <label>Specialization</label>
              <input 
                type="text" 
                className="input-field" 
                value={profile.specialization} 
                onChange={(e) => setProfile({...profile, specialization: e.target.value})} 
                placeholder="Cardiologist"
                required
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
              <label>Years of Experience</label>
              <input 
                type="number" 
                className="input-field" 
                value={profile.experience} 
                onChange={(e) => setProfile({...profile, experience: e.target.value})} 
                placeholder="10"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        ) : (
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Specialization</p>
              <p style={{ fontWeight: 600 }}>{profile.specialization || 'Not set'}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Experience</p>
              <p style={{ fontWeight: 600 }}>{profile.experience ? `${profile.experience} Years` : 'Not set'}</p>
            </div>
          </div>
        )}
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Patient Appointments</h2>
      
      {appointments.length === 0 ? (
        <div className="glass-card flex-center" style={{ padding: '4rem', flexDirection: 'column', gap: '1rem' }}>
          <Calendar size={48} color="var(--text-muted)" />
          <p style={{ color: 'var(--text-muted)' }}>No appointments scheduled.</p>
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
                  {format(new Date(apt.date), 'MMM dd, yyyy')} at {apt.time}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <UserIcon size={24} color="var(--secondary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', margin: 0 }}>{apt.patientId?.name || 'Unknown Patient'}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>{apt.patientId?.phone || 'No phone'}</p>
                </div>
              </div>

              {apt.status === 'pending' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => updateStatus(apt._id, 'confirmed')} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>
                    <CheckCircle size={16} /> Confirm
                  </button>
                  <button onClick={() => updateStatus(apt._id, 'cancelled')} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', color: '#F87171', borderColor: '#F87171' }}>
                    <XCircle size={16} /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
