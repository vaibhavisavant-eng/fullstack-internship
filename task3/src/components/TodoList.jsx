import React from 'react';
import TodoItem from './TodoItem.jsx';
import { CheckCircle2, ClipboardList, ListCheck } from 'lucide-react';

/**
 * TodoList Component
 * Renders the list of TodoItem components or a responsive empty state
 * tailored to the currently selected filter.
 */
function TodoList({ todos, currentFilter, onToggleComplete, onEditTodo, onDeleteTodo }) {
  if (todos.length === 0) {
    let icon = <ClipboardList className="empty-icon" />;
    let title = "No tasks found";
    let desc = "Add a task using the input form above to get started.";

    if (currentFilter === 'active') {
      icon = <CheckCircle2 className="empty-icon" />;
      title = "All caught up!";
      desc = "You have no active pending tasks right now.";
    } else if (currentFilter === 'completed') {
      icon = <ListCheck className="empty-icon" />;
      title = "No completed tasks yet";
      desc = "Completed tasks will appear here once marked done.";
    }

    return (
      <div className="empty-state">
        {icon}
        <div className="empty-title">{title}</div>
        <div className="empty-desc">{desc}</div>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onEditTodo={onEditTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
