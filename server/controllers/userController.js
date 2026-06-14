const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const asyncHandler = require('../middleware/asyncHandler');
const { GoogleGenAI } = require('@google/genai');

// @desc    Get recommended events (AI Powered)
// @route   GET /api/users/recommendations
// @access  Private/Student
exports.getRecommendations = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('bookmarks');
  const pastRegistrations = await Registration.find({ student: req.user.id }).populate('event');
  
  // Get all upcoming published events
  const upcomingEvents = await Event.find({ 
    status: 'Published', 
    date: { $gte: new Date() } 
  }).select('title category description');

  if (upcomingEvents.length === 0) {
    return res.status(200).json({ success: true, data: [] });
  }

  // Build context for AI
  const pastCategories = pastRegistrations.map(r => r.event.category).join(', ');
  const bookmarkedCategories = user.bookmarks.map(b => b.category).join(', ');
  
  const userProfileContext = `The student is interested in ${pastCategories} and has bookmarked events in ${bookmarkedCategories}.`;
  const eventsList = upcomingEvents.map(e => `ID: ${e._id}, Title: ${e.title}, Category: ${e.category}`).join('\n');

  if (!process.env.GEMINI_API_KEY) {
    // Fallback: Return random events if no API key
    const randomEvents = upcomingEvents.sort(() => 0.5 - Math.random()).slice(0, 3);
    return res.status(200).json({ success: true, data: randomEvents, source: 'fallback' });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `Based on the following user profile:\n${userProfileContext}\n\nHere are the upcoming events:\n${eventsList}\n\nSelect the 3 most relevant event IDs for this student. Return ONLY a comma-separated list of the 3 event IDs, no extra text.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const suggestedIds = response.text.split(',').map(id => id.trim());
    
    // Fetch full event details for the recommended IDs
    const recommendedEvents = await Event.find({ _id: { $in: suggestedIds } });
    
    res.status(200).json({ success: true, data: recommendedEvents, source: 'ai' });
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    // Fallback on error
    const randomEvents = upcomingEvents.sort(() => 0.5 - Math.random()).slice(0, 3);
    res.status(200).json({ success: true, data: randomEvents, source: 'fallback_error' });
  }
});

// @desc    Get student certificates
// @route   GET /api/users/certificates
// @access  Private/Student
exports.getCertificates = asyncHandler(async (req, res, next) => {
  const Certificate = require('../models/Certificate');
  const certificates = await Certificate.find({ student: req.user.id }).populate('event', 'title category');
  res.status(200).json({ success: true, count: certificates.length, data: certificates });
});

// @desc    Download Certificate PDF
// @route   GET /api/users/certificates/:id/download
// @access  Private/Student
exports.downloadCertificatePDF = asyncHandler(async (req, res, next) => {
  const Certificate = require('../models/Certificate');
  const certificate = await Certificate.findById(req.params.id)
    .populate('student', 'name')
    .populate('event', 'title');

  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  // Generate PDF buffer dynamically
  const { generateCertificatePDF } = require('../utils/certificateGenerator');
  const pdfBuffer = await generateCertificatePDF({
    studentName: certificate.student.name,
    eventName: certificate.event.title,
    date: new Date(certificate.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="Certificate-${certificate.student.name.replace(/ /g, '_')}.pdf"`);
  res.send(pdfBuffer);
});
