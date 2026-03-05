import { useState, useEffect } from 'react';
import { getCurrentUser, getLists, createList, deleteList } from './services/api';
import AuthPage from './components/AuthPage';
import TodoApp  from './components/TodoApp';

export default function App() {
  const [user,        setUser]        = useState(() => getCurrentUser());
  const [lists,       setLists]       = useState([]);
  const [activeList,  setActiveList]  = useState(null);
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    if (!user) return;
    getLists(user.id).then(data => {
      setLists(data);
      setActiveList(data[0]?.id || null);
    });
  }, [user]);

  async function handleCreateList() {
    const name = newListName.trim();
    if (!name) return;
    const icons  = ['📁','🎯','💡','🏠','❤️','⚡','🌟','🎨'];
    const colors = ['#6366f1','#f59e0b','#10b981','#ef4444','#ec4899','#3b82f6'];
    const icon   = icons[Math.floor(Math.random() * icons.length)];
    const color  = colors[Math.floor(Math.random() * colors.length)];
    const list   = await createList(user.id, name, icon, color);
    setLists(prev => [...prev, list]);
    setActiveList(list.id);
    setNewListName('');
    setShowNewList(false);
  }

  async function handleDeleteList(listId) {
    if (lists.length <= 1) return; // giữ ít nhất 1 list
    await deleteList(user.id, listId);
    setLists(prev => prev.filter(l => l.id !== listId));
    if (activeList === listId) setActiveList(lists[0]?.id);
  }

  function handleLogout() {
    setUser(null);
    setLists([]);
    setActiveList(null);
  }

  if (!user) return <AuthPage onAuth={u => setUser(u)} />;

  const currentList = lists.find(l => l.id === activeList);

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar__top">
          <div className="sidebar__brand">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            MyTodo
          </div>
          <p className="sidebar__user">@{user.username}</p>
        </div>

        <div className="sidebar__section-label">My Lists</div>

        <ul className="sidebar__lists">
          {lists.map(list => (
            <li key={list.id}>
              <button
                className={`sidebar__list-item ${activeList === list.id ? 'active' : ''}`}
                onClick={() => setActiveList(list.id)}
                style={{ '--list-color': list.color }}
              >
                <span className="sidebar__list-icon">{list.icon}</span>
                <span className="sidebar__list-name">{list.name}</span>
              </button>
              {lists.length > 1 && (
                <button
                  className="sidebar__list-delete"
                  onClick={() => handleDeleteList(list.id)}
                  title="Delete list"
                >×</button>
              )}
            </li>
          ))}
        </ul>

        {/* New list */}
        {showNewList ? (
          <div className="sidebar__new-list">
            <input
              autoFocus
              placeholder="List name..."
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter')  handleCreateList();
                if (e.key === 'Escape') setShowNewList(false);
              }}
            />
            <button onClick={handleCreateList}>Add</button>
          </div>
        ) : (
          <button className="sidebar__add-list" onClick={() => setShowNewList(true)}>
            + New List
          </button>
        )}

        <button className="sidebar__logout" onClick={handleLogout}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        {activeList && (
          <TodoApp
            key={activeList}
            user={user}
            list={currentList}
            lists={lists}
          />
        )}
      </main>

    </div>
  );
}