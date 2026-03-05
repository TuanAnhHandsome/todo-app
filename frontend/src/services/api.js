// ============================================================
//  api.js — Service layer (mock localStorage)
//  Khi có Spring Boot, bỏ comment phần fetch() và xóa mock
// ============================================================

const BASE_URL = 'http://localhost:8080/api';

// ── AUTH ────────────────────────────────────────────────────

export async function login(username, password) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user  = users.find(u => u.username === username && u.password === password);
  if (!user) throw new Error('Sai tên đăng nhập hoặc mật khẩu');
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
}

export async function register(username, password) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.find(u => u.username === username)) {
    throw new Error('Tên đăng nhập đã tồn tại');
  }
  const user = { id: Date.now(), username, password };
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
}

export function logout() { localStorage.removeItem('currentUser'); }
export function getCurrentUser() {
  const u = localStorage.getItem('currentUser');
  return u ? JSON.parse(u) : null;
}

// ── LISTS ───────────────────────────────────────────────────

function listKey(userId) { return `lists_${userId}`; }

export async function getLists(userId) {
  const stored = localStorage.getItem(listKey(userId));
  if (stored) return JSON.parse(stored);
  // Default lists
  const defaults = [
    { id: 'personal', name: 'Personal',  icon: '👤', color: '#6366f1' },
    { id: 'work',     name: 'Work',      icon: '💼', color: '#f59e0b' },
    { id: 'study',    name: 'Study',     icon: '📚', color: '#10b981' },
  ];
  localStorage.setItem(listKey(userId), JSON.stringify(defaults));
  return defaults;
}

export async function createList(userId, name, icon = '📁', color = '#6366f1') {
  const lists  = await getLists(userId);
  const newList = { id: `list_${Date.now()}`, name, icon, color };
  lists.push(newList);
  localStorage.setItem(listKey(userId), JSON.stringify(lists));
  return newList;
}

export async function deleteList(userId, listId) {
  let lists = await getLists(userId);
  lists = lists.filter(l => l.id !== listId);
  localStorage.setItem(listKey(userId), JSON.stringify(lists));
  // Xóa todos thuộc list đó
  let todos = await getTodos(userId);
  todos = todos.filter(t => t.listId !== listId);
  localStorage.setItem(todoKey(userId), JSON.stringify(todos));
}

// ── TODOS ───────────────────────────────────────────────────

function todoKey(userId) { return `todos_${userId}`; }

export async function getTodos(userId) {
  return JSON.parse(localStorage.getItem(todoKey(userId)) || '[]');
}

export async function addTodo(userId, { text, priority = 'medium', deadline = null, listId = 'personal' }) {
  const todos   = await getTodos(userId);
  const newTodo = {
    id:        Date.now(),
    text,
    completed: false,
    priority,             // 'high' | 'medium' | 'low'
    deadline,             // ISO string hoặc null
    listId,
    createdAt: new Date().toISOString(),
  };
  todos.unshift(newTodo);
  localStorage.setItem(todoKey(userId), JSON.stringify(todos));
  return newTodo;
}

export async function updateTodo(userId, id, changes) {
  let todos = await getTodos(userId);
  todos = todos.map(t => t.id === id ? { ...t, ...changes } : t);
  localStorage.setItem(todoKey(userId), JSON.stringify(todos));
}

export async function deleteTodo(userId, id) {
  let todos = await getTodos(userId);
  todos = todos.filter(t => t.id !== id);
  localStorage.setItem(todoKey(userId), JSON.stringify(todos));
}