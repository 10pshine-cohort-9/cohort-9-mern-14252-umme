import React, { useState, useEffect, useCallback, useRef } from 'react';
import { notesApi } from '../services/api';
import NoteCard from './NoteCard';
import NoteEditor from './NoteEditor';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [editingNote, setEditingNote] = useState(null); // null = closed, {} = new note
  const [saving, setSaving] = useState(false);
  const latestRequest = useRef(0);

  const fetchNotes = useCallback(async (query) => {
    const requestId = ++latestRequest.current;

    setLoading(true);
    setError(null);

    try {
      const { data } = await notesApi.list(query);

      if (requestId !== latestRequest.current) return;

      setNotes(data.data.notes);
    } catch (err) {
      if (requestId !== latestRequest.current) return;

      setError('Could not load your notes. Please try again.');
    } finally {
      if (requestId === latestRequest.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchNotes(search), 300);
    return () => clearTimeout(timeout);
  }, [search, fetchNotes]);

  const handleSave = async ({ title, content }) => {
    setSaving(true);
    try {
      if (editingNote?.id) {
        await notesApi.update(editingNote.id, { title, content });
      } else {
        await notesApi.create({ title, content });
      }
      setEditingNote(null);
      fetchNotes(search);
    } catch (err) {
      setError('Could not save the note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (note) => {
    if (!window.confirm(`Delete "${note.title}"? This cannot be undone.`)) return;
    try {
      await notesApi.remove(note.id);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
    } catch (err) {
      setError('Could not delete the note. Please try again.');
    }
  };

  const handleTogglePin = async (note) => {
    try {
      const { data } = await notesApi.update(note.id, { pinned: !note.pinned });
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? data.data.note : n)).sort((a, b) => b.pinned - a.pinned)
      );
    } catch (err) {
      setError('Could not update the note. Please try again.');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard__toolbar">
        <input
          className="dashboard__search"
          type="search"
          placeholder="Search your notes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search notes"
        />
        <button className="btn btn--primary" onClick={() => setEditingNote({})}>
          + New note
        </button>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      {loading ? (
        <p className="dashboard__status">Loading your notes…</p>
      ) : notes.length === 0 ? (
        <div className="dashboard__empty">
          <p>No notes yet. Start with your first one.</p>
          <button className="btn btn--primary" onClick={() => setEditingNote({})}>
            Write a note
          </button>
        </div>
      ) : (
        <div className="dashboard__grid">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onOpen={setEditingNote}
              onDelete={handleDelete}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      )}

      {editingNote !== null && (
        <NoteEditor
          note={editingNote}
          saving={saving}
          onSave={handleSave}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;