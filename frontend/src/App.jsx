import { useState } from 'react';
import { getCurrentUser } from './services/api';
import AuthPage from './components/AuthPage';
import TodoApp  from './components/TodoApp';

export default function App() {
  // Kiểm tra đã login chưa (giữ session khi reload)
  const [user, setUser] = useState(() => getCurrentUser());

  return user
    ? <TodoApp  user={user} onLogout={() => setUser(null)} />
    : <AuthPage onAuth={(u) => setUser(u)} />;
}
