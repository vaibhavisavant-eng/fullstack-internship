import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';

/**
 * TodoForm Component
 * Renders an input field and submit button to add new tasks with priority selection.
 * Uses useState for controlled form input.
 */
function TodoForm({ onAddTodo }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAddTodo({
      text: text.trim(),
      priority: priority
    });

    // Reset input field after submission
    setText('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-input-group">
          <Sparkles className="input-icon" size={18} />
          <input
            type="text"
            className="todo-input"
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
        </div>
        <button type="submit" className="btn-add" disabled={!text.trim()}>
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="priority-selector">
        <span className="priority-label">Priority:</span>
        <button
          type="button"
          className={`priority-chip ${priority === 'low' ? 'active-low' : ''}`}
          onClick={() => setPriority('low')}
        >
          Low
        </button>
        <button
          type="button"
          className={`priority-chip ${priority === 'medium' ? 'active-medium' : ''}`}
          onClick={() => setPriority('medium')}
        >
          Medium
        </button>
        <button
          type="button"
          className={`priority-chip ${priority === 'high' ? 'active-high' : ''}`}
          onClick={() => setPriority('high')}
        >
          High
        </button>
      </div>
    </form>
  );
}

export default TodoForm;
