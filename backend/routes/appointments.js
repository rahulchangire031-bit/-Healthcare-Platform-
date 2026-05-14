const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const auth = require('../middleware/auth');

// Book appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, date, time, notes } = req.body;
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([{
        patient_id: req.user.id,
        doctor_id: doctorId,
        date,
        time,
        notes,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user appointments
router.get('/', auth, async (req, res) => {
  try {
    let appointments = [];
    
    if (req.user.role === 'patient') {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:users!patient_id(id, name, email, phone),
          doctor:doctors!doctor_id(id, user:users!user_id(id, name, email, phone))
        `)
        .eq('patient_id', req.user.id);
        
      if (error) throw error;
      appointments = data;
    } else if (req.user.role === 'doctor') {
      // Find doctor profile
      const { data: doctor } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', req.user.id)
        .maybeSingle();
        
      if (doctor) {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:users!patient_id(id, name, email, phone),
            doctor:doctors!doctor_id(id, user:users!user_id(id, name, email, phone))
          `)
          .eq('doctor_id', doctor.id);
          
        if (error) throw error;
        appointments = data;
      }
    }

    // Transform to match previous Mongoose populate structure
    const formattedAppointments = appointments.map(a => ({
      ...a,
      patientId: a.patient,
      doctorId: {
        ...a.doctor,
        userId: a.doctor?.user
      }
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();
      
    if (error) throw error;
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
