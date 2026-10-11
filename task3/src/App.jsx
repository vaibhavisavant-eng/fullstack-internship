import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import TodoFilter from './components/TodoFilter.jsx';
import { CheckCircle, Zap } from 'lucide-react';

const STORAGE_KEY = 'taskflow_todos_v1';

// Initial sample tasks if user visits for the first time
const DEFAULT_TODOS = [
  { id: '1', text: 'Build React To-Do Application with Vite', completed: true, priority: 'high' },
  { id: '2', text: 'Implement inline task editing & localStorage persistence', completed: true, priority: 'medium' },
  { id: '3', text: 'Add priority badges and responsive CSS animations', completed: false, priority: 'high' },
  { id: '4', text: 'Review README.md documentation and React concepts summary', completed: false, priority: 'low' }
];

/**
 * Main App Component
 * Demonstrates useState, useEffect, props passing, functional component architecture,
 * and localStorage integration.
 */
function App() {
  // 1. Initialize State with localStorage Lazy Evaluator
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = localStorage.getItem(STORAGE_KEY);
      if (savedTodos) {
        return JSON.parse(savedTodos);
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    }
    return DEFAULT_TODOS;
  });

  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  // 2. useEffect Hook to Persist Tasks on State Change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, [todos]);

  // 3. Handler Functions for Task CRUD Operations
  const handleAddTodo = ({ text, priority }) => {
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    };
    setTodos([newTodo, ...todos]);
  };

  const handleToggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleEditTodo = (id, newText) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  // 4. Derived Values & Filtering Logic
  const remainingCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div className="brand-badge">
          <Zap size={14} />
          <span>React + Vite Task App</span>
        </div>
        <h1 className="app-title">TaskFlow</h1>
        <p className="app-subtitle">Stay organized, focused, and productive.</p>
      </header>

      {/* Main Card */}
      <main className="card">
        {/* Form Component */}
        <TodoForm onAddTodo={handleAddTodo} />

        {/* Filter & Progress Toolbar Component */}
        <TodoFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          remainingCount={remainingCount}
          totalCount={totalCount}
          completedCount={completedCount}
          onClearCompleted={handleClearCompleted}
        />

        {/* Todo List Component */}
        <TodoList
          todos={filteredTodos}
          currentFilter={filter}
          onToggleComplete={handleToggleComplete}
          onEditTodo={handleEditTodo}
          onDeleteTodo={handleDeleteTodo}
        />

        {/* Footer Actions inside Card */}
        {completedCount > 0 && (
          <div className="card-footer">
            <span style={{ color: 'var(--text-muted)' }}>
              {completedCount} completed {completedCount === 1 ? 'task' : 'tasks'}
            </span>
            <button className="btn-clear-completed" onClick={handleClearCompleted}>
              Clear Completed
            </button>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="app-footer-text">
        <p>Built with React, Vite & localStorage • Clean Functional Architecture</p>
      </footer>
    </div>
  );
}

export default App;
