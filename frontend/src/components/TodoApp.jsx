import { useState, useEffect } from 'react';
import { getTodos, addTodo, updateTodo, deleteTodo, logout } from '../services/api';
import TodoItem  from './TodoItem';
import FilterBar from './FilterBar';

// TodoApp — màn hình chính sau khi đăng nhập
// Props:
//   user     — object { id, username }
//   onLogout — callback khi logout

export default function TodoApp({ user, onLogout }) {
  const [todos,   setTodos]   = useState([]);
  const [input,   setInput]   = useState('');
  const [filter,  setFilter]  = useState('all');   // 'all' | 'active' | 'done'
  const [loading, setLoading] = useState(true);

  // Load todos khi mount
  useEffect(() => {
    getTodos(user.id).then(data => {
      setTodos(data);
      setLoading(false);
    });
  }, [user.id]);

  // ---------- handlers ----------

  async function handleAdd(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const newTodo = await addTodo(user.id, trimmed);
    setTodos(prev => [newTodo, ...prev]);
    setInput('');
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

  async function handleEdit(id, newText) {
    await updateTodo(user.id, id, { text: newText });
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text: newText } : t));
  }

  async function handleClearDone() {
    const done = todos.filter(t => t.completed);
    await Promise.all(done.map(t => deleteTodo(user.id, t.id)));
    setTodos(prev => prev.filter(t => !t.completed));
  }

  function handleLogout() {
    logout();
    onLogout();
  }

  // ---------- filtered list ----------

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'done')   return t.completed;
    return true;
  });

  const counts = {
    all:    todos.length,
    active: todos.filter(t => !t.completed).length,
    done:   todos.filter(t =>  t.completed).length,
  };

  // ---------- render ----------

  return (
    <div className="app-wrapper">
      <div className="app-card">

        {/* Header */}
        <header className="app-header">
          <div className="app-header-left">
            <div className="app-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <div>
              <h1 className="app-title">My Tasks</h1>
              <p className="app-greeting">Hello, <strong>{user.username}</strong></p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Sign out">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </header>

        {/* Add todo form */}
        <form onSubmit={handleAdd} className="add-form">
          <input
            className="add-input"
            type="text"
            placeholder="Add a new task…"
            value={input}
            onChange={e => setInput(e.target.value)}
            maxLength={200}
          />
          <button type="submit" className="add-btn" disabled={!input.trim()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5"  y1="12" x2="19" y2="12"/>
            </svg>
            Add
          </button>
        </form>

        {/* Filter bar */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          counts={counts}
          onClearDone={handleClearDone}
        />

        {/* Todo list */}
        {loading ? (
          <div className="todo-empty">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="todo-empty">
            {filter === 'all'
              ? 'No tasks yet. Add one above!'
              : filter === 'active'
              ? 'No active tasks.'
              : 'No completed tasks.'}
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
              />
            ))}
          </ul>
        )}

        {/* Footer count */}
        {todos.length > 0 && (
          <div className="app-footer">
            {counts.active} task{counts.active !== 1 ? 's' : ''} remaining
          </div>
        )}

      </div>
    </div>
  );
}
