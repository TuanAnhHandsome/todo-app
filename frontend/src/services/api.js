// ============================================================
//  api.js — connected to Spring Boot backend
// ============================================================

const BASE_URL = 'http://localhost:8080/api';

// ── Helper: lấy token từ localStorage ───────────────────────
function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Something went wrong');
  }
  // 204 No Content không có body
  if (res.status === 204) return null;
  return res.json();
}

// ── AUTH ────────────────────────────────────────────────────

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await handleResponse(res);
  localStorage.setItem('token', data.token);
  localStorage.setItem('currentUser', JSON.stringify({ id: data.id, username: data.username }));
  return { id: data.id, username: data.username };
}

export async function register(username, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await handleResponse(res);
  localStorage.setItem('token', data.token);
  localStorage.setItem('currentUser', JSON.stringify({ id: data.id, username: data.username }));
  return { id: data.id, username: data.username };
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
}

export function getCurrentUser() {
  const u = localStorage.getItem('currentUser');
  const token = localStorage.getItem('token');

  // Nếu không có cả 2 → chưa đăng nhập
  if (!u || !token) return null;

  return JSON.parse(u);
}

// ── LISTS ───────────────────────────────────────────────────
// Backend lưu listId trong todos, frontend quản lý list metadata
// trong localStorage (tên, icon, màu) — chỉ listId đồng bộ với backend

const LIST_META_KEY = (userId) => `list_meta_${userId}`;

export async function getLists(userId) {
  // Lấy metadata từ localStorage
  const stored = localStorage.getItem(LIST_META_KEY(userId));
  const meta = stored ? JSON.parse(stored) : null;

  if (meta) return meta;

  // Lần đầu: tạo defaults
  const defaults = [
    { id: 'personal', name: 'Personal', icon: '👤', color: '#6366f1' },
    { id: 'work', name: 'Work', icon: '💼', color: '#f59e0b' },
    { id: 'study', name: 'Study', icon: '📚', color: '#10b981' },
  ];
  localStorage.setItem(LIST_META_KEY(userId), JSON.stringify(defaults));
  return defaults;
}

export async function createList(userId, name, icon = '📁', color = '#6366f1') {
  const lists = await getLists(userId);
  const newList = { id: `list_${Date.now()}`, name, icon, color };
  lists.push(newList);
  localStorage.setItem(LIST_META_KEY(userId), JSON.stringify(lists));
  return newList;
}

export async function deleteList(userId, listId) {
  // Xóa metadata
  let lists = await getLists(userId);
  lists = lists.filter(l => l.id !== listId);
  localStorage.setItem(LIST_META_KEY(userId), JSON.stringify(lists));

  // Xóa tất cả todos thuộc list đó trên backend
  await fetch(`${BASE_URL}/todos/list/${listId}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
}

// ── TODOS ───────────────────────────────────────────────────

export async function getTodos(userId, listId) {
  const url = listId
    ? `${BASE_URL}/todos?listId=${listId}`
    : `${BASE_URL}/todos`;

  const res = await fetch(url, {
    headers: { ...authHeader() },
  });
  return handleResponse(res);
}

export async function addTodo(userId, { text, priority = 'medium', deadline = null, listId = 'personal' }) {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ text, priority, deadline, listId }),
  });
  return handleResponse(res);
}

export async function updateTodo(userId, id, changes) {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(changes),
  });
  return handleResponse(res);
}

export async function deleteTodo(userId, id) {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  return handleResponse(res);
}