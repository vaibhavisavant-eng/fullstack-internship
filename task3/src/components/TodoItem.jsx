import React, { useState, useRef, useEffect } from 'react';
import { Check, Edit2, Trash2, X, CheckSquare, Square } from 'lucide-react';

/**
 * TodoItem Component
 * Renders an individual task item with support for completion toggle,
 * inline editing (with state & keyboard navigation), priority tag, and deletion.
 */
function TodoItem({ todo, onToggleComplete, onEditTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef(null);

  // Focus input field when entering inline edit mode
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    if (editText.trim() && editText.trim() !== todo.text) {
      onEditTodo(todo.id, editText.trim());
    } else {
      setEditText(todo.text); // revert if empty or unchanged
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-item-content">
        {/* Toggle Complete Checkbox Button */}
        <button
          className={`checkbox-btn ${todo.completed ? 'checked' : ''}`}
          onClick={() => onToggleComplete(todo.id)}
          aria-label={todo.completed ? 'Mark task incomplete' : 'Mark task complete'}
        >
          {todo.completed ? <Check size={14} /> : null}
        </button>

        {/* View Mode vs Inline Edit Mode */}
        {isEditing ? (
          <div className="inline-edit-form">
            <input
              ref={editInputRef}
              type="text"
              className="inline-edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="icon-btn save-btn"
              onClick={handleSaveEdit}
              title="Save changes (Enter)"
            >
              <Check size={16} />
            </button>
            <button
              className="icon-btn cancel-btn"
              onClick={handleCancelEdit}
              title="Cancel (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <span
              className="todo-text"
              onDoubleClick={() => setIsEditing(true)}
              title="Double-click to edit inline"
            >
              {todo.text}
            </span>

            {todo.priority && (
              <span className={`item-badge ${todo.priority}`}>
                {todo.priority}
              </span>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      {!isEditing && (
        <div className="item-actions">
          <button
            className="icon-btn edit-btn"
            onClick={() => setIsEditing(true)}
            title="Edit task inline"
            aria-label="Edit task"
          >
            <Edit2 size={16} />
          </button>

          <button
            className="icon-btn delete-btn"
            onClick={() => onDeleteTodo(todo.id)}
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </li>
  );
}

export default TodoItem;
