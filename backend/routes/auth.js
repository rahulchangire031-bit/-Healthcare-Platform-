const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (Name, Email, Password).' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const { data: existingUser } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (existingUser) return res.status(400).json({ message: 'An account with this email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const { error } = await supabase.from('users').insert([{ 
      name, email, phone, password: hashedPassword, role: role || 'patient' 
    }]);

    if (error) throw error;

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (!user) return res.status(400).json({ message: 'Invalid email address. No account found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password. Please try again.' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login. Please try again later.' });
  }
});

module.exports = router;
