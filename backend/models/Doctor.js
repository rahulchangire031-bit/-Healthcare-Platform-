const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  availability: [{
    day: { type: String }, // e.g., 'Monday', 'Tuesday'
    slots: [{ type: String }] // e.g., '09:00', '10:00'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
