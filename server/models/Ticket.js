const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true
  },
  qrCode: {
    type: String,
    required: true
  },
  pdfUrl: {
    type: String, // Cloudinary URL
  },
  status: {
    type: String,
    enum: ['Active', 'Cancelled', 'Used'],
    default: 'Active'
  },
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkedInAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
