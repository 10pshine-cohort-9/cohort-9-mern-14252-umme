import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__mark">N</span>
        <span className="navbar__title">Notes</span>
      </div>
      {user && (
        <div className="navbar__user">
          <span className="navbar__greeting">{user.name}</span>
          <button className="btn btn--ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
