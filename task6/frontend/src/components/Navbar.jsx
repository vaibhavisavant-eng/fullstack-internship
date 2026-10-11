import React from 'react';
import { ShieldCheck, User, LogOut, LogIn, Sparkles } from 'lucide-react';

function Navbar({ currentUser, onOpenAuthModal, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <a href="#" className="brand-logo">
          <div className="brand-icon">
            <ShieldCheck size={22} />
          </div>
          <span>UserPulse</span>
        </a>

        <div className="nav-actions">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
                <User size={14} className="text-primary" />
                <span>{currentUser.name}</span>
                <span className={`role-badge ${currentUser.role?.toLowerCase() || 'user'}`}>
                  {currentUser.role || 'User'}
                </span>
              </div>
              <button className="btn-secondary" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={onOpenAuthModal} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <LogIn size={16} />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
