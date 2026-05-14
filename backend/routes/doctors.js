const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const auth = require('../middleware/auth');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { data: doctors, error } = await supabase
      .from('doctors')
      .select(`
        *,
        user:users!user_id(name, email, phone)
      `);
      
    if (error) throw error;

    // Transform to match previous structure
    const formattedDoctors = doctors.map(d => ({
      ...d,
      userId: d.user
    }));

    res.json(formattedDoctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create/Update doctor profile
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { specialization, experience, availability } = req.body;
    
    // Check if doctor profile already exists
    const { data: existingDoctor } = await supabase
      .from('doctors')
      .select('*')
      .eq('user_id', req.user.id)
      .maybeSingle();

    let doctor;
    if (existingDoctor) {
      const { data, error } = await supabase
        .from('doctors')
        .update({ specialization, experience, availability })
        .eq('id', existingDoctor.id)
        .select()
        .single();
        
      if (error) throw error;
      doctor = data;
    } else {
      const { data, error } = await supabase
        .from('doctors')
        .insert([{
          user_id: req.user.id,
          specialization,
          experience,
          availability
        }])
        .select()
        .single();
        
      if (error) throw error;
      doctor = data;
    }

    res.status(201).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
