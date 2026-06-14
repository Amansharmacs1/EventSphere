const Event = require('../models/Event');
const asyncHandler = require('../middleware/asyncHandler');
const { GoogleGenAI } = require('@google/genai');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = Event.find(JSON.parse(queryStr));

  // Search by title
  if (req.query.search) {
    query = query.find({ title: { $regex: req.query.search, $options: 'i' } });
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Event.countDocuments(query);

  query = query.skip(startIndex).limit(limit);

  const events = await query;

  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.status(200).json({
    success: true,
    count: events.length,
    pagination,
    data: events
  });
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.status(200).json({ success: true, data: event });
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const event = await Event.create(req.body);

  res.status(201).json({ success: true, data: event });
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: event });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  await event.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Generate AI Event Description
// @route   POST /api/events/ai-description
// @access  Private/Admin
exports.generateAIDescription = asyncHandler(async (req, res, next) => {
  const { title, category, speaker } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    res.status(500);
    throw new Error('Gemini API key not configured');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `Write a professional, engaging event description for a college event named "${title}". The category is ${category}. The main speaker is ${speaker}. The description should be 3-4 paragraphs, exciting, and formatted nicely.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.status(200).json({ success: true, data: response.text });
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500);
    throw new Error('Failed to generate AI description');
  }
});
