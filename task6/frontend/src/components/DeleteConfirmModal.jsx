import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

function DeleteConfirmModal({ isOpen, onClose, onConfirm, user, submitting }) {
  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
            <AlertTriangle size={22} />
            <h3 className="modal-title">Confirm Delete</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
          Are you sure you want to delete user <strong style={{ color: 'var(--text-main)' }}>{user.name}</strong> (<span style={{ color: 'var(--primary)' }}>{user.email}</span>)?
          This action cannot be undone.
        </p>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={submitting}>
            {submitting ? 'Deleting...' : 'Delete User'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
