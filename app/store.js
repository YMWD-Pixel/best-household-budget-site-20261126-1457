// Store: loads the household state, persists it in this browser only, and
// answers every question the views ask (totals, budgets, goals, history).
// Nothing here talks to a network: all figures come from data.js or the user.

import { seedState } from './data.js';

const KEY = 'hearth-and-ledger-v1';

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1 && Array.isArray(parsed.transactions)) return parsed;
    }
  } catch (_) { /* corrupted storage: fall through to the seed */ }
  const fresh = seedState();
  try { localStorage.setItem(KEY, JSON.stringify(fresh)); } catch (_) { /* storage full or blocked */ }
  return fresh;
}

function save(next) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* storage full or blocked */ }
}

export function resetDemo() {
  const fresh = seedState();
  save(fresh);
  return fresh;
}

export function getState() { return state; }

export function monthLabel(ym) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function shortMonth(ym) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short' });
}

export function money(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function categoryById(id) {
  return state.categories.find((c) => c.id === id) || { id, label: id, icon: '📦', color: '#8a8f98' };
}

export function transactionsFor(month) {
  return state.transactions
    .filter((t) => t.date.startsWith(month))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function monthTotals(month) {
  const rows = transactionsFor(month);
  let income = 0;
  let spending = 0;
  for (const t of rows) {
    if (t.type === 'income') income += t.amount;
    else spending += t.amount;
  }
  return { income, spending, left: income - spending, savingsRate: income > 0 ? (income - spending) / income : 0 };
}

export function spendingByCategory(month) {
  const totals = new Map();
  for (const t of transactionsFor(month)) {
    if (t.type !== 'expense') continue;
    totals.set(t.category, (totals.get(t.category) || 0) + t.amount);
  }
  return [...totals.entries()]
    .map(([category, amount]) => ({ category, amount, ...categoryById(category) }))
    .sort((a, b) => b.amount - a.amount);
}

export function budgetStatus(month) {
  const spent = new Map();
  for (const t of transactionsFor(month)) {
    if (t.type !== 'expense') continue;
    spent.set(t.category, (spent.get(t.category) || 0) + t.amount);
  }
  return state.budgets
    .map((b) => {
      const used = spent.get(b.category) || 0;
      return { ...b, ...categoryById(b.category), used, remaining: b.limit - used, pct: b.limit > 0 ? used / b.limit : 0 };
    })
    .sort((a, b) => b.pct - a.pct);
}

export function monthlySeries() {
  // November's spending is computed live; earlier months are the recorded totals.
  return state.monthly.map((m) => {
    if (m.month === state.household.month) {
      const t = monthTotals(m.month);
      return { ...m, income: t.income, spending: t.spending };
    }
    return m;
  });
}

export function addTransaction(tx) {
  const id = 't' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
  const next = { ...state, transactions: [...state.transactions, { ...tx, id }] };
  save(next);
  return id;
}

export function updateTransaction(id, patch) {
  const next = {
    ...state,
    transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)),
  };
  save(next);
}

export function deleteTransaction(id) {
  const next = { ...state, transactions: state.transactions.filter((t) => t.id !== id) };
  save(next);
}

export function setBudget(category, limit) {
  const next = {
    ...state,
    budgets: state.budgets.some((b) => b.category === category)
      ? state.budgets.map((b) => (b.category === category ? { ...b, limit } : b))
      : [...state.budgets, { category, limit }],
  };
  save(next);
}

export function addToGoal(goalId, amount, date) {
  const next = {
    ...state,
    goals: state.goals.map((g) => (g.id === goalId ? { ...g, saved: g.saved + amount } : g)),
    transactions: [
      ...state.transactions,
      {
        id: 't' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36),
        date,
        type: 'expense',
        category: 'savings',
        description: 'Contribution — ' + (state.goals.find((g) => g.id === goalId) || {}).name,
        amount,
        account: 'Joint checking',
      },
    ],
  };
  save(next);
}

export function addGoal(goal) {
  const id = 'g' + Date.now().toString(36);
  const next = { ...state, goals: [...state.goals, { ...goal, id }] };
  save(next);
  return id;
}
