const { mongoose, connectDB } = require('../config/db');
const User = require('./User');
const Note = require('./Note');

module.exports = { mongoose, connectDB, User, Note };
