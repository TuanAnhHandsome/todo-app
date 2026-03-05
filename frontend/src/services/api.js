// ============================================================
//  api.js — Service layer
//  Hiện tại dùng localStorage (mock).
//  Khi có Spring Boot, chỉ cần bỏ comment phần API
//  và xóa phần localStorage bên dưới.
// ============================================================

const BASE_URL = 'http://localhost:8080/api';

// ---------- AUTH ----------

export async function login(username, password) {
  // --- Spring Boot ---
  // const res = await fetch(`${BASE_URL}/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ username, password }),
  // });
  // if (!res.ok) throw new Error('Invalid credentials');
  // const data = await res.json();
  // localStorage.setItem('token', data.token);
  // return data.user;

  // --- Mock ---
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user  = users.find(u => u.username === username && u.password === password);
  if (!user) throw new Error('Sai tên đăng nhập hoặc mật khẩu');
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
}

export async function register(username, password) {
  // --- Spring Boot ---
  // const res = await fetch(`${BASE_URL}/auth/register`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ username, password }),
  // });
  // if (!res.ok) throw new Error('Username already exists');
  // return res.json();

  // --- Mock ---
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

export function logout() {
  localStorage.removeItem('currentUser');
  // localStorage.removeItem('token');
}

export function getCurrentUser() {
  const u = localStorage.getItem('currentUser');
  return u ? JSON.parse(u) : null;
}

// ---------- TODOS ----------

function getKey(userId) {
  return `todos_${userId}`;
}

export async function getTodos(userId) {
  // --- Spring Boot ---
  // const res = await fetch(`${BASE_URL}/todos`, {
  //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  // });
  // return res.json();

  // --- Mock ---
  return JSON.parse(localStorage.getItem(getKey(userId)) || '[]');
}

export async function addTodo(userId, text) {
  // --- Spring Boot ---
  // const res = await fetch(`${BASE_URL}/todos`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${localStorage.getItem('token')}`,
  //   },
  //   body: JSON.stringify({ text }),
  // });
  // return res.json();

  // --- Mock ---
  const todos  = await getTodos(userId);
  const newTodo = { id: Date.now(), text, completed: false, createdAt: new Date().toISOString() };
  todos.unshift(newTodo);
  localStorage.setItem(getKey(userId), JSON.stringify(todos));
  return newTodo;
}

export async function updateTodo(userId, id, changes) {
  // --- Spring Boot ---
  // const res = await fetch(`${BASE_URL}/todos/${id}`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${localStorage.getItem('token')}`,
  //   },
  //   body: JSON.stringify(changes),
  // });
  // return res.json();

  // --- Mock ---
  let todos = await getTodos(userId);
  todos = todos.map(t => t.id === id ? { ...t, ...changes } : t);
  localStorage.setItem(getKey(userId), JSON.stringify(todos));
}

export async function deleteTodo(userId, id) {
  // --- Spring Boot ---
  // await fetch(`${BASE_URL}/todos/${id}`, {
  //   method: 'DELETE',
  //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  // });

  // --- Mock ---
  let todos = await getTodos(userId);
  todos = todos.filter(t => t.id !== id);
  localStorage.setItem(getKey(userId), JSON.stringify(todos));
}
