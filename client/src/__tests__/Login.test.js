import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Login';
import { AuthProvider } from '../context/AuthContext';
import { authApi } from '../services/api';

jest.mock('../services/api', () => ({
  authApi: {
    login: jest.fn(),
    signup: jest.fn(),
    me: jest.fn(),
  },
}));

const renderLogin = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('submits credentials and stores the session on success', async () => {
    authApi.login.mockResolvedValueOnce({
      data: { data: { user: { id: 1, name: 'Jane', email: 'jane@example.com' }, token: 'abc123' } },
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(authApi.login).toHaveBeenCalledWith({
      email: 'jane@example.com',
      password: 'secret123',
    }));
    await waitFor(() => expect(localStorage.getItem('notes_app_token')).toBe('abc123'));
  });

  it('shows an error message when login fails', async () => {
    authApi.login.mockRejectedValueOnce({ response: { data: { message: 'Invalid email or password' } } });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid email or password/i);
  });
});
