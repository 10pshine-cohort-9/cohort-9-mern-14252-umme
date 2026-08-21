import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NoteCard from '../components/NoteCard';

const baseNote = {
  id: 1,
  title: 'Grocery list',
  content: '<p>Milk, eggs, bread</p>',
  pinned: false,
  updatedAt: '2026-07-10T12:00:00Z',
};

describe('NoteCard', () => {
  it('renders the title and a stripped preview of the content', () => {
    render(<NoteCard note={baseNote} onOpen={() => {}} onDelete={() => {}} onTogglePin={() => {}} />);

    expect(screen.getByText('Grocery list')).toBeInTheDocument();
    expect(screen.getByText(/Milk, eggs, bread/)).toBeInTheDocument();
  });

  it('calls onOpen when the card body is clicked', () => {
    const onOpen = jest.fn();
    render(<NoteCard note={baseNote} onOpen={onOpen} onDelete={() => {}} onTogglePin={() => {}} />);

    fireEvent.click(screen.getByText('Grocery list'));
    expect(onOpen).toHaveBeenCalledWith(baseNote);
  });

  it('calls onDelete when the delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<NoteCard note={baseNote} onOpen={() => {}} onDelete={onDelete} onTogglePin={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /delete grocery list/i }));
    expect(onDelete).toHaveBeenCalledWith(baseNote);
  });

  it('calls onTogglePin when the pin button is clicked', () => {
    const onTogglePin = jest.fn();
    render(<NoteCard note={baseNote} onOpen={() => {}} onDelete={() => {}} onTogglePin={onTogglePin} />);

    fireEvent.click(screen.getByRole('button', { name: /pin note/i }));
    expect(onTogglePin).toHaveBeenCalledWith(baseNote);
  });

  it('shows a pinned style hint when the note is pinned', () => {
    render(<NoteCard note={{ ...baseNote, pinned: true }} onOpen={() => {}} onDelete={() => {}} onTogglePin={() => {}} />);
    expect(screen.getByRole('button', { name: /unpin note/i })).toBeInTheDocument();
  });
});
