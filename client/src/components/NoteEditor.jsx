import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link'],
    ['clean'],
  ],
};

const NoteEditor = ({ note, onSave, onClose, saving }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), content });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Note editor">
      <div className="modal">
        <input
          className="modal__title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled note"
          autoFocus
        />

        <div className="modal__editor">
          <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} />
        </div>

        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? 'Saving…' : 'Save note'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
