const mongoose = require('mongoose');
require('dotenv').config();

// Environment variables was defined in Render.com dashboard
// MONGODB_URI was defined in Render 
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017');

module.exports = mongoose.connection;
