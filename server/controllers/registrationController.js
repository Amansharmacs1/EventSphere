const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const asyncHandler = require('../middleware/asyncHandler');
const { generateTicketPDF } = require('../utils/ticketGenerator');
const cloudinary = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');

// @desc    Apply for an event (Register)
// @route   POST /api/registrations/:eventId
// @access  Private/Student
exports.applyForEvent = asyncHandler(async (req, res, next) => {
  const eventId = req.params.eventId;
  const event = await Event.findById(eventId);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.status !== 'Published') {
    res.status(400);
    throw new Error('Event is not open for registration');
  }

  // Check capacity
  if (event.registeredCount >= event.maxSeats) {
    res.status(400);
    throw new Error('Event is fully booked');
  }

  // Check deadline
  if (new Date() > new Date(event.registrationDeadline)) {
    res.status(400);
    throw new Error('Registration deadline has passed');
  }

  const existingRegistration = await Registration.findOne({
    student: req.user.id,
    event: eventId
  });

  if (existingRegistration) {
    res.status(400);
    throw new Error('You have already applied for this event');
  }

  const registration = await Registration.create({
    student: req.user.id,
    event: eventId,
    status: 'Pending'
  });

  res.status(201).json({ success: true, data: registration });
});

// @desc    Get all registrations for an event
// @route   GET /api/registrations/event/:eventId
// @access  Private/Admin
exports.getRegistrationsForEvent = asyncHandler(async (req, res, next) => {
  const registrations = await Registration.find({ event: req.params.eventId })
    .populate('student', 'name email college branch')
    .sort('-createdAt');

  res.status(200).json({ success: true, count: registrations.length, data: registrations });
});

// @desc    Get my registrations
// @route   GET /api/registrations/my
// @access  Private/Student
exports.getMyRegistrations = asyncHandler(async (req, res, next) => {
  const registrations = await Registration.find({ student: req.user.id })
    .populate('event', 'title date time venue banner status');

  res.status(200).json({ success: true, count: registrations.length, data: registrations });
});

// @desc    Approve or Reject registration
// @route   PUT /api/registrations/:id/status
// @access  Private/Admin
exports.updateRegistrationStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const registration = await Registration.findById(req.params.id)
    .populate('student')
    .populate('event');

  if (!registration) {
    res.status(404);
    throw new Error('Registration not found');
  }

  if (registration.status === status) {
    res.status(400);
    throw new Error(`Registration is already ${status}`);
  }

  registration.status = status;
  await registration.save();

  if (status === 'Approved') {
    // Generate Ticket
    const ticketId = `TKT-${uuidv4().split('-')[0].toUpperCase()}`;
    
    // Generate PDF
    const pdfBuffer = await generateTicketPDF({
      eventName: registration.event.title,
      studentName: registration.student.name,
      ticketId,
      date: new Date(registration.event.date).toLocaleDateString(),
      venue: registration.event.venue
    });

    // Upload to Cloudinary
    let pdfUrl = '';
    if (process.env.CLOUDINARY_API_KEY) {
      try {
        const uploadPromise = new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ resource_type: 'raw', format: 'pdf', folder: 'tickets' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(pdfBuffer);
        });
        const uploadResult = await uploadPromise;
        pdfUrl = uploadResult.secure_url;
      } catch (err) {
        console.error('Cloudinary upload failed, but ticket will still be generated:', err);
      }
    }

    // Create Ticket Record
    await Ticket.create({
      ticketId,
      student: registration.student._id,
      event: registration.event._id,
      registration: registration._id,
      qrCode: ticketId, // QRCode data, typically the ID which will be verified
      pdfUrl
    });

    // Increment registered count
    registration.event.registeredCount += 1;
    await registration.event.save();
  }

  res.status(200).json({ success: true, data: registration });
});
