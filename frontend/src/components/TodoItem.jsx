import { useState, useRef, useEffect } from 'react';

// TodoItem — một dòng todo
// Props:
//   todo       — object { id, text, completed, createdAt }
//   onToggle   — đánh dấu hoàn thành
//   onDelete   — xoá
//   onEdit     — lưu text mới

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing]   = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef                = useRef(null);

  // Focus input khi bật edit mode
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function handleEditSave() {
    const trimmed = editText.trim();
    if (!trimmed) { setEditing(false); setEditText(todo.text); return; }
    if (trimmed !== todo.text) onEdit(todo.id, trimmed);
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter')  handleEditSave();
    if (e.key === 'Escape') { setEditing(false); setEditText(todo.text); }
  }

  return (
    <li className={`todo-item ${todo.completed ? 'todo-item--done' : ''}`}>

      {/* Checkbox */}
      <button
        className="todo-check"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1.5,6 4.5,9 10.5,3"/>
          </svg>
        )}
      </button>

      {/* Text hoặc input edit */}
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

      {/* Actions */}
      <div className="todo-actions">
        {!todo.completed && !editing && (
          <button
            className="todo-btn todo-btn--edit"
            onClick={() => setEditing(true)}
            aria-label="Edit"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        )}
        <button
          className="todo-btn todo-btn--delete"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
