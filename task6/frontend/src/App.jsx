import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import UserTable from './components/UserTable.jsx';
import UserModal from './components/UserModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import Toast from './components/Toast.jsx';
import { api } from './services/api.js';
import { UserPlus, Search, Users, Database, AlertCircle, RefreshCw } from 'lucide-react';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // User CRUD Modals State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  // Toast Feedback State
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch Users from Backend API
  const fetchUsers = useCallback(async (searchQuery = search) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getUsers(searchQuery);
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch users from server.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  // Check stored auth session on mount
  useEffect(() => {
    const token = localStorage.getItem('userpulse_token');
    if (token) {
      api.getMe()
        .then(res => setCurrentUser(res.data))
        .catch(() => localStorage.removeItem('userpulse_token'));
    }
    fetchUsers();
  }, []);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchUsers(val);
  };

  // Add or Update User Handler
  const handleSaveUser = async (formData) => {
    setSubmitting(true);
    try {
      if (editingUser) {
        const res = await api.updateUser(editingUser.id, formData);
        showToast(res.message || 'User updated successfully!');
      } else {
        const res = await api.createUser(formData);
        showToast(res.message || 'User created successfully!');
      }
      setIsUserModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Action failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete User Handler
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    setSubmitting(true);
    try {
      const res = await api.deleteUser(deletingUser.id);
      showToast(res.message || 'User deleted successfully!');
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to delete user.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Auth Submit Handler
  const handleAuthSubmit = async (type, payload) => {
    let res;
    if (type === 'login') {
      res = await api.login(payload);
    } else {
      res = await api.register(payload);
    }
    if (res.token) {
      localStorage.setItem('userpulse_token', res.token);
      setCurrentUser(res.data);
      showToast(res.message || 'Authentication successful!');
    }
    return res;
  };

  const handleLogout = () => {
    localStorage.removeItem('userpulse_token');
    setCurrentUser(null);
    showToast('Logged out successfully.');
  };

  return (
    <div className="app-wrapper">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="main-content">
        {/* Top Summary Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              User Directory
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Full Stack REST API Management System backed by Node, Express & MySQL
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => {
              setEditingUser(null);
              setIsUserModalOpen(true);
            }}
          >
            <UserPlus size={18} />
            <span>Add User</span>
          </button>
        </div>

        {/* Content Card Container */}
        <div className="content-card">
          {/* Toolbar */}
          <div className="toolbar">
            <div className="search-box">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search users by name or email..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Total Records: <strong style={{ color: 'var(--primary)' }}>{users.length}</strong></span>
              <button
                className="icon-btn"
                onClick={() => fetchUsers()}
                title="Refresh Table"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="error-alert" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Connection Error:</strong> {error}
                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#fca5a5' }}>
                  Make sure your backend server is running on port 5000 (`cd backend && npm run dev`) and MySQL database `fullstack_user_db` is initialized using `schema.sql`.
                </div>
              </div>
            </div>
          )}

          {/* User Table Component */}
          <UserTable
            users={users}
            loading={loading}
            onEdit={(user) => {
              setEditingUser(user);
              setIsUserModalOpen(true);
            }}
            onDelete={(user) => {
              setDeletingUser(user);
              setIsDeleteModalOpen(true);
            }}
          />
        </div>
      </main>

      {/* Modals */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSaveUser}
        editingUser={editingUser}
        submitting={submitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingUser(null);
        }}
        onConfirm={handleConfirmDelete}
        user={deletingUser}
        submitting={submitting}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleAuthSubmit}
      />

      {/* Toast Feedback */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Footer */}
      <footer className="footer">
        <p>Built with Node.js, Express, MySQL, React & Vite • Full Stack User Management System</p>
      </footer>
    </div>
  );
}

export default App;
