const mongoose = require('mongoose');
const { Note } = require('../models');
const ApiError = require('../utils/ApiError');

const getNotesForUser = async (userId, { search } = {}) => {
  const query = { userId };

  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ title: regex }, { content: regex }];
  }

  return Note.find(query).sort({ pinned: -1, updatedAt: -1 });
};

const getNoteById = async (userId, noteId) => {
  if (!mongoose.isValidObjectId(noteId)) {
    throw ApiError.notFound('Note not found');
  }

  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) {
    throw ApiError.notFound('Note not found');
  }
  return note;
};

const createNote = async (userId, { title, content, pinned }) => {
  return Note.create({ title, content, pinned: !!pinned, userId });
};

const updateNote = async (userId, noteId, updates) => {
  const note = await getNoteById(userId, noteId);
  const allowed = ['title', 'content', 'pinned'];
  allowed.forEach((field) => {
    if (updates[field] !== undefined) note[field] = updates[field];
  });
  await note.save();
  return note;
};

const deleteNote = async (userId, noteId) => {
  const note = await getNoteById(userId, noteId);
  await note.deleteOne();
  return { id: noteId };
};

module.exports = { getNotesForUser, getNoteById, createNote, updateNote, deleteNote };
