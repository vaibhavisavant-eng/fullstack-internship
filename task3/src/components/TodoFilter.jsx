import React from 'react';

/**
 * TodoFilter Component
 * Controls filter tabs (All, Active, Completed), shows remaining task count,
 * progress bar, and clear completed action.
 */
function TodoFilter({
  currentFilter,
  onFilterChange,
  remainingCount,
  totalCount,
  completedCount,
  onClearCompleted
}) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="progress-container">
          <div className="progress-header">
            <span>Progress ({completedCount}/{totalCount})</span>
            <span>{percentage}% Done</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Toolbar with Filter Tabs and Counter */}
      <div className="toolbar">
        <div className="filter-group">
          <button
            className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All ({totalCount})
          </button>
          <button
            className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
            onClick={() => onFilterChange('active')}
          >
            Active ({remainingCount})
          </button>
          <button
            className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
            onClick={() => onFilterChange('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="stats-info">
          <span>
            <strong className="remaining-count">{remainingCount}</strong> {remainingCount === 1 ? 'task' : 'tasks'} remaining
          </span>
        </div>
      </div>
    </div>
  );
}

export default TodoFilter;
