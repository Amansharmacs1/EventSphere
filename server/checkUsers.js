require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const check = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find();
  if (users.length === 0) {
    console.log('Seeding initial users...');
    await User.create([
      { name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'admin' },
      { name: 'Student User', email: 'student@test.com', password: 'password123', role: 'student' }
    ]);
    console.log('Users seeded!');
  } else {
    console.log('Users already exist:', users.length);
  }
  process.exit();
};
check();
