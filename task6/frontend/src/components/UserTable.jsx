import React from 'react';
import { Edit3, Trash2, UserX, Calendar, Mail, Hash } from 'lucide-react';

function UserTable({ users, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <span>Fetching users from MySQL database...</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
        <UserX size={44} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>No Users Found</h3>
        <p style={{ fontSize: '0.85rem' }}>Try adjusting your search criteria or add a new user record.</p>
      </div>
    );
  }

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="table-responsive">
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User Info</th>
            <th>Email</th>
            <th>Age</th>
            <th>Role</th>
            <th>Created At</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ fontWeight: '700', color: 'var(--text-dim)' }}>#{user.id}</td>
              <td>
                <div className="user-info-cell">
                  <div className="avatar-circle">
                    {getInitial(user.name)}
                  </div>
                  <span style={{ fontWeight: '600' }}>{user.name}</span>
                </div>
              </td>
              <td style={{ color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} className="text-dim" />
                  <span>{user.email}</span>
                </div>
              </td>
              <td>
                <span style={{ background: 'var(--bg-input)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '600' }}>
                  {user.age} yrs
                </span>
              </td>
              <td>
                <span className={`role-badge ${user.role ? user.role.toLowerCase() : 'user'}`}>
                  {user.role || 'User'}
                </span>
              </td>
              <td style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={13} />
                  <span>{formatDate(user.created_at)}</span>
                </div>
              </td>
              <td>
                <div className="action-group" style={{ justifyContent: 'flex-end' }}>
                  <button
                    className="icon-btn edit"
                    onClick={() => onEdit(user)}
                    title="Edit User"
                    aria-label="Edit User"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => onDelete(user)}
                    title="Delete User"
                    aria-label="Delete User"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
