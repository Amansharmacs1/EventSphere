const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Certificate = require('../models/Certificate');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalEvents = await Event.countDocuments();
  
  // Today's registrations
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const todaysRegistrations = await Registration.countDocuments({
    createdAt: { $gte: startOfDay }
  });

  const totalCertificates = await Certificate.countDocuments();

  // Monthly Registrations (Last 6 months)
  const monthlyRegistrations = await Registration.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 5))
        }
      }
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Category Distribution
  const categoryDistribution = await Event.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 }
      }
    }
  ]);

  // Attendance Trend (simplification based on CheckedIn tickets)
  // To keep it simple, just sending basic stats
  const popularEvents = await Event.find()
    .sort('-registeredCount')
    .limit(5)
    .select('title registeredCount category maxSeats');

  res.status(200).json({
    success: true,
    data: {
      totalStudents,
      totalEvents,
      todaysRegistrations,
      totalCertificates,
      monthlyRegistrations,
      categoryDistribution,
      popularEvents
    }
  });
});
