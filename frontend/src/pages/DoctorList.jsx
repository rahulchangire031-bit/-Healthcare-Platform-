import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, User as UserIcon, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', time: '', notes: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('/api/doctors');
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/appointments', {
        doctorId: selectedDoctor.id,
        ...bookingData
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Find a Doctor</h1>
      
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Search color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search by name or specialization..." 
          style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '1rem' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="dashboard-grid">
        {filteredDoctors.map(doctor => (
          <motion.div 
            key={doctor.id} 
            className="glass-card" 
            style={{ padding: '1.5rem', cursor: 'pointer', border: selectedDoctor?.id === doctor.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)' }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedDoctor(doctor)}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <UserIcon size={32} color="var(--primary-light)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Dr. {doctor.userId?.name || 'Unknown'}</h3>
                <p style={{ color: 'var(--primary-light)', fontSize: '0.875rem', margin: '0.25rem 0' }}>{doctor.specialization}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>{doctor.experience} years experience</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedDoctor && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card" 
          style={{ marginTop: '2rem', padding: '2rem' }}
        >
          <h2 style={{ marginBottom: '1.5rem' }}>Book Appointment with Dr. {selectedDoctor.userId?.name}</h2>
          <form onSubmit={handleBook} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label><CalendarIcon size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}/> Date</label>
              <input 
                type="date" 
                className="input-field" 
                required 
                value={bookingData.date}
                onChange={e => setBookingData({...bookingData, date: e.target.value})}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label><Clock size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}/> Time</label>
              <input 
                type="time" 
                className="input-field" 
                required 
                value={bookingData.time}
                onChange={e => setBookingData({...bookingData, time: e.target.value})}
              />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
              <label>Additional Notes</label>
              <textarea 
                className="input-field" 
                rows="3" 
                placeholder="Reason for visit..."
                value={bookingData.notes}
                onChange={e => setBookingData({...bookingData, notes: e.target.value})}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}>
              Confirm Booking
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorList;
