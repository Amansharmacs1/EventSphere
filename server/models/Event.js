const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  banner: {
    type: String,
    default: 'no-photo.jpg'
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Technology', 'Business', 'Arts', 'Science', 'Sports', 'Other']
  },
  venue: {
    type: String,
    required: [true, 'Please add a venue']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  time: {
    type: String,
    required: [true, 'Please add a time']
  },
  speaker: String,
  schedule: [
    {
      time: String,
      activity: String
    }
  ],
  maxSeats: {
    type: Number,
    required: [true, 'Please specify maximum seats']
  },
  registeredCount: {
    type: Number,
    default: 0
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Please add a registration deadline']
  },
  status: {
    type: String,
    enum: ['Published', 'Draft', 'Cancelled', 'Completed'],
    default: 'Draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
