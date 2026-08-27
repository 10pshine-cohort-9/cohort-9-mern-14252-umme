const asyncHandler = require('../utils/asyncHandler');
const noteService = require('../services/noteService');
const logger = require('../config/logger');

const listNotes = asyncHandler(async (req, res) => {
  const notes = await noteService.getNotesForUser(req.user.id, { search: req.query.search });
  res.status(200).json({ success: true, data: { notes } });
});

const getNote = asyncHandler(async (req, res) => {
  const note = await noteService.getNoteById(req.user.id, req.params.id);
  res.status(200).json({ success: true, data: { note } });
});

const createNote = asyncHandler(async (req, res) => {
  const note = await noteService.createNote(req.user.id, req.body);
  logger.info({ userId: req.user.id, noteId: note.id }, 'Note created');
  res.status(201).json({ success: true, data: { note } });
});

const updateNote = asyncHandler(async (req, res) => {
  const note = await noteService.updateNote(req.user.id, req.params.id, req.body);
  logger.info({ userId: req.user.id, noteId: note.id }, 'Note updated');
  res.status(200).json({ success: true, data: { note } });
});

const deleteNote = asyncHandler(async (req, res) => {
  const result = await noteService.deleteNote(req.user.id, req.params.id);
  logger.info({ userId: req.user.id, noteId: result.id }, 'Note deleted');
  res.status(200).json({ success: true, data: result });
});

module.exports = { listNotes, getNote, createNote, updateNote, deleteNote };
