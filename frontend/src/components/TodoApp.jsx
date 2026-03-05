import { useState, useEffect, useMemo } from 'react';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../services/api';
import TodoItem  from './TodoItem';

const PRIORITIES = [
  { value: 'high',   label: 'High',   emoji: '🔴' },
  { value: 'medium', label: 'Medium', emoji: '🟡' },
  { value: 'low',    label: 'Low',    emoji: '🟢' },
];

export default function TodoApp({ user, list, lists }) {
  const [todos,    setTodos]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  // Add form state
  const [input,    setInput]    = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Filter state
  const [search,      setSearch]      = useState('');
  const [filterStatus,   setFilterStatus]   = useState('all');    // all | active | done
  const [filterPriority, setFilterPriority] = useState('all');    // all | high | medium | low

  useEffect(() => {
    setLoading(true);
    getTodos(user.id).then(data => {
      setTodos(data.filter(t => t.listId === list.id));
      setLoading(false);
    });
  }, [user.id, list.id]);

  // ── Filtered + searched todos ──────────────────────────
  const filtered = useMemo(() => {
    return todos
      .filter(t => {
        if (filterStatus === 'active') return !t.completed;
        if (filterStatus === 'done')   return  t.completed;
        return true;
      })
      .filter(t => {
        if (filterPriority !== 'all') return t.priority === filterPriority;
        return true;
      })
      .filter(t => {
        if (!search.trim()) return true;
        return t.text.toLowerCase().includes(search.toLowerCase());
      });
  }, [todos, filterStatus, filterPriority, search]);

  const counts = {
    all:    todos.length,
    active: todos.filter(t => !t.completed).length,
    done:   todos.filter(t =>  t.completed).length,
    overdue: todos.filter(t => !t.completed && t.deadline && new Date(t.deadline) < new Date()).length,
  };

  // ── Handlers ───────────────────────────────────────────
  async function handleAdd(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const newTodo = await addTodo(user.id, {
      text:     trimmed,
      priority,
      deadline: deadline || null,
      listId:   list.id,
    });
    setTodos(prev => [newTodo, ...prev]);
    setInput('');
    setDeadline('');
    setPriority('medium');
    setShowForm(false);
  }

  async function handleToggle(id) {
    const todo = todos.find(t => t.id === id);
    await updateTodo(user.id, id, { completed: !todo.completed });
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  async function handleDelete(id) {
    await deleteTodo(user.id, id);
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  async function handleEdit(id, changes) {
    await updateTodo(user.id, id, changes);
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t));
  }

  async function handleClearDone() {
    const done = todos.filter(t => t.completed);
    await Promise.all(done.map(t => deleteTodo(user.id, t.id)));
    setTodos(prev => prev.filter(t => !t.completed));
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="todo-page">

      {/* Page header */}
      <div className="todo-page__header">
        <div className="todo-page__title">
          <span className="todo-page__icon">{list.icon}</span>
          <h1>{list.name}</h1>
        </div>
        <div className="todo-page__meta">
          <span className="meta-badge">{counts.active} active</span>
          {counts.overdue > 0 && (
            <span className="meta-badge meta-badge--overdue">⚠ {counts.overdue} overdue</span>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>×</button>
        )}
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          {['all','active','done'].map(s => (
            <button
              key={s}
              className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span className="filter-btn__count">{counts[s]}</span>
            </button>
          ))}
        </div>
        <div className="filter-group">
          <button
            className={`filter-btn ${filterPriority === 'all' ? 'active' : ''}`}
            onClick={() => setFilterPriority('all')}
          >All priority</button>
          {PRIORITIES.map(p => (
            <button
              key={p.value}
              className={`filter-btn ${filterPriority === p.value ? 'active' : ''}`}
              onClick={() => setFilterPriority(p.value)}
            >
              {p.emoji} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add task button / form */}
      {showForm ? (
        <form className="add-form" onSubmit={handleAdd}>
          <input
            autoFocus
            className="add-input"
            placeholder="Task name..."
            value={input}
            onChange={e => setInput(e.target.value)}
            maxLength={200}
          />
          <div className="add-form__row">
            {/* Priority selector */}
            <div className="add-form__field">
              <label>Priority</label>
              <div className="priority-select">
                {PRIORITIES.map(p => (
                  <button
                    type="button"
                    key={p.value}
                    className={`priority-opt ${priority === p.value ? 'active' : ''}`}
                    onClick={() => setPriority(p.value)}
                  >
                    {p.emoji} {p.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Deadline */}
            <div className="add-form__field">
              <label>Deadline</label>
              <input
                type="date"
                className="date-input"
                value={deadline}
                min={today}
                onChange={e => setDeadline(e.target.value)}
              />
            </div>
          </div>
          <div className="add-form__actions">
            <button type="submit" className="btn-add" disabled={!input.trim()}>
              Add Task
            </button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button className="btn-new-task" onClick={() => setShowForm(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5"  y1="12" x2="19" y2="12"/>
          </svg>
          New Task
        </button>
      )}

      {/* Todo list */}
      {loading ? (
        <div className="state-empty">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="state-empty">
          {search ? `No tasks matching "${search}"` : 'No tasks here. Add one!'}
        </div>
      ) : (
        <ul className="todo-list">
          {filtered.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
              lists={lists}
            />
          ))}
        </ul>
      )}

      {/* Footer */}
      {counts.done > 0 && (
        <div className="todo-footer">
          <button className="btn-clear-done" onClick={handleClearDone}>
            Clear {counts.done} completed
          </button>
        </div>
      )}

    </div>
  );
}