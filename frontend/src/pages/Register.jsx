import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', role: 'patient'
  });
  const [error, setError] = useState('');
  const { register, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card auth-card"
        style={{ maxWidth: '500px' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Create Account</h2>
        {error && <div style={{ color: '#F87171', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name"
              className="input-field" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="John Doe"
            />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              className="input-field" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="you@example.com"
            />
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              className="input-field" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+1 234 567 8900"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              className="input-field" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="••••••••"
            />
          </div>
          <div className="input-group">
            <label>I am a...</label>
            <select 
              name="role" 
              className="input-field" 
              value={formData.role} 
              onChange={handleChange}
              style={{ cursor: 'pointer' }}
            >
              <option value="patient" style={{ color: '#000' }}>Patient</option>
              <option value="doctor" style={{ color: '#000' }}>Doctor</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Register
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', textDecoration: 'none' }}>Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
