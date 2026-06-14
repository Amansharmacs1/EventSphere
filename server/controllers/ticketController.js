const Ticket = require('../models/Ticket');
const Certificate = require('../models/Certificate');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get my tickets
// @route   GET /api/tickets/my
// @access  Private/Student
exports.getMyTickets = asyncHandler(async (req, res, next) => {
  const Certificate = require('../models/Certificate');
  const tickets = await Ticket.find({ student: req.user.id })
    .populate('event', 'title date time venue banner')
    .lean(); // Use lean so we can attach properties

  const certificates = await Certificate.find({ student: req.user.id }).lean();
  
  // Attach certificate to ticket if exists
  const ticketsWithCerts = tickets.map(ticket => {
    const cert = certificates.find(c => c.event.toString() === ticket.event._id.toString());
    return {
      ...ticket,
      certificateUrl: cert ? `/api/users/certificates/${cert._id}/download` : null
    };
  });

  res.status(200).json({ success: true, count: ticketsWithCerts.length, data: ticketsWithCerts });
});

// @desc    Get all tickets (for an event)
// @route   GET /api/tickets/event/:eventId
// @access  Private/Admin
exports.getTicketsForEvent = asyncHandler(async (req, res, next) => {
  const tickets = await Ticket.find({ event: req.params.eventId })
    .populate('student', 'name email');

  res.status(200).json({ success: true, count: tickets.length, data: tickets });
});

// @desc    Verify and Scan Ticket QR
// @route   POST /api/tickets/scan
// @access  Private/Admin
exports.verifyTicket = asyncHandler(async (req, res, next) => {
  const { ticketId } = req.body;

  const ticket = await Ticket.findOne({ ticketId })
    .populate('student', 'name email')
    .populate('event', 'title date venue status');

  if (!ticket) {
    res.status(404);
    throw new Error('Invalid Ticket: Not found');
  }

  if (ticket.status !== 'Active') {
    res.status(400);
    throw new Error(`Ticket is ${ticket.status}`);
  }

  if (ticket.checkedIn) {
    res.status(400).json({
      success: false,
      message: 'Already Checked In',
      data: ticket
    });
    return;
  }

  // Mark as checked in
  ticket.checkedIn = true;
  ticket.checkedInAt = Date.now();
  ticket.status = 'Used';
  await ticket.save();

  // Generate Certificate upon successful check-in
  let certificate = await Certificate.findOne({ student: ticket.student._id, event: ticket.event._id });
  
  if (!certificate) {
    certificate = await Certificate.create({
      student: ticket.student._id,
      event: ticket.event._id,
      certificateUrl: '' // We will update this right after creating to include the ID
    });
    
    certificate.certificateUrl = `/api/users/certificates/${certificate._id}/download`;
    await certificate.save();
  }

  res.status(200).json({ 
    success: true, 
    message: 'Check-in successful! Certificate generated.',
    data: ticket,
    certificate
  });
});

// @desc    Download Ticket PDF
// @route   GET /api/tickets/:id/download
// @access  Private/Student, Admin
exports.downloadTicketPDF = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('student', 'name')
    .populate('event', 'title date venue');

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  // Generate PDF buffer dynamically
  const { generateTicketPDF } = require('../utils/ticketGenerator');
  const pdfBuffer = await generateTicketPDF({
    eventName: ticket.event.title,
    studentName: ticket.student.name,
    ticketId: ticket.ticketId,
    date: new Date(ticket.event.date).toLocaleDateString(),
    time: ticket.event.time,
    venue: ticket.event.venue
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="Ticket-${ticket.ticketId}.pdf"`);
  res.send(pdfBuffer);
});
