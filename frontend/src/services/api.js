// ============================================================
//  api.js — connected to Spring Boot backend
// ============================================================

const BASE_URL = 'https://todo-app-production-7525.up.railway.app/api';

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
  if (!u || !token) return null;
  return JSON.parse(u);
}

// ── LISTS ───────────────────────────────────────────────────

export async function getLists() {
  const res = await fetch(`${BASE_URL}/lists`, {
    headers: { ...authHeader() },
  });
  return handleResponse(res);
}

export async function createList(userId, name, icon = '📁', color = '#6366f1') {
  const res = await fetch(`${BASE_URL}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ name, icon, color }),
  });
  return handleResponse(res);
}

export async function deleteList(userId, listId) {
  await fetch(`${BASE_URL}/lists/${listId}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  // Xóa todos thuộc list đó
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