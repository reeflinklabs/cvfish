import Note from '../models/noteModel.js';
import mongoose from 'mongoose';

// Create a new note for a job
export const createNote = async (req, res) => {
  const { jobId, content } = req.body;
  const userId = req.user._id;

  try {
    const newNote = await Note.create({
      jobId,
      userId,
      content,
    });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing note
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Note not found' });
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Note not found' });
  }

  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all notes for a job
export const getAllNotesForJob = async (req, res) => {
  const { jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(404).json({ message: 'Job not found' });
  }

  try {
    const notes = await Note.find({ jobId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single note by ID
export const getNoteById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Note not found' });
  }

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
