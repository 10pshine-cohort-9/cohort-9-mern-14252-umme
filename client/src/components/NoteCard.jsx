import React from 'react';

const stripHtml = (html = '') => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const NoteCard = ({ note, onOpen, onDelete, onTogglePin }) => {
  const preview = stripHtml(note.content).slice(0, 140);

  return (
    <article className={`note-card${note.pinned ? ' note-card--pinned' : ''}`}>
      <button
        className="note-card__pin"
        onClick={() => onTogglePin(note)}
        aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
        title={note.pinned ? 'Unpin' : 'Pin'}
      >
        ★
      </button>

      <button className="note-card__body" onClick={() => onOpen(note)}>
        <h3 className="note-card__title">{note.title}</h3>
        <p className="note-card__preview">{preview || 'No content yet — click to write.'}</p>
      </button>

      <footer className="note-card__footer">
        <span className="note-card__date">{formatDate(note.updatedAt)}</span>
        <button
          className="note-card__delete"
          onClick={() => onDelete(note)}
          aria-label={`Delete ${note.title}`}
        >
          Delete
        </button>
      </footer>
    </article>
  );
};

export default NoteCard;
