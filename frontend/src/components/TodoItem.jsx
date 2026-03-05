import { useState, useRef, useEffect } from 'react';

const PRIORITY_CONFIG = {
  high:   { emoji: '🔴', label: 'High',   class: 'priority--high'   },
  medium: { emoji: '🟡', label: 'Medium', class: 'priority--medium' },
  low:    { emoji: '🟢', label: 'Low',    class: 'priority--low'    },
};

// Tính trạng thái deadline
function getDeadlineInfo(deadline, completed) {
  if (!deadline) return null;
  const now      = new Date();
  const due      = new Date(deadline);
  const diffMs   = due - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (completed) return { label: formatDate(due), status: 'done' };
  if (diffMs < 0) return { label: `Overdue by ${Math.abs(diffDays)}d`, status: 'overdue' };
  if (diffDays === 0) return { label: 'Due today',   status: 'today'   };
  if (diffDays === 1) return { label: 'Due tomorrow', status: 'soon'   };
  if (diffDays <= 3) return { label: `${diffDays}d left`, status: 'soon' };
  return { label: formatDate(due), status: 'normal' };
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing,  setEditing]  = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef                = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function handleEditSave() {
    const trimmed = editText.trim();
    if (!trimmed) { setEditing(false); setEditText(todo.text); return; }
    if (trimmed !== todo.text) onEdit(todo.id, { text: trimmed });
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter')  handleEditSave();
    if (e.key === 'Escape') { setEditing(false); setEditText(todo.text); }
  }

  const deadlineInfo = getDeadlineInfo(todo.deadline, todo.completed);
  const priority     = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.medium;
  const isOverdue    = deadlineInfo?.status === 'overdue';

  return (
    <li className={[
      'todo-item',
      todo.completed ? 'todo-item--done'    : '',
      isOverdue      ? 'todo-item--overdue' : '',
    ].join(' ')}>

      {/* Priority bar (left edge) */}
      <div className={`todo-item__bar ${priority.class}`}></div>

      {/* Checkbox */}
      <button
        className="todo-check"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="1.5,6 4.5,9 10.5,3"/>
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="todo-item__content">
        {editing ? (
          <input
            ref={inputRef}
            className="todo-edit-input"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span
            className="todo-text"
            onDoubleClick={() => !todo.completed && setEditing(true)}
            title={todo.completed ? '' : 'Double-click to edit'}
          >
            {todo.text}
          </span>
        )}

        {/* Meta row */}
        <div className="todo-item__meta">
          {/* Priority badge */}
          <span className={`priority-badge ${priority.class}`}>
            {priority.emoji} {priority.label}
          </span>

          {/* Deadline */}
          {deadlineInfo && (
            <span className={`deadline-badge deadline-badge--${deadlineInfo.status}`}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
              </svg>
              {deadlineInfo.label}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="todo-actions">
        {!todo.completed && !editing && (
          <button
            className="todo-btn todo-btn--edit"
            onClick={() => setEditing(true)}
            title="Edit"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        )}
        <button
          className="todo-btn todo-btn--delete"
          onClick={() => onDelete(todo.id)}
          title="Delete"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      </div>

    </li>
  );
}