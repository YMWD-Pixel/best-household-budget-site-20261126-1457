// App: hash router and the wiring that makes every control do what it says.
// Views render HTML; this file owns navigation, dialogs, forms and toasts.

import { getState, addTransaction, updateTransaction, deleteTransaction, setBudget, addToGoal, addGoal, resetDemo, monthLabel } from './store.js';
import { renderDashboard, renderTransactions, renderBudgets, renderGoals, renderInsights } from './views.js';

const view = document.getElementById('view');
const monthPill = document.getElementById('monthPill');
const toastEl = document.getElementById('toast');
const txDialog = document.getElementById('txDialog');
const txForm = document.getElementById('txForm');
const goalDialog = document.getElementById('goalDialog');
const goalForm = document.getElementById('goalForm');

let toastTimer = null;
let editingTxId = null;
let goalTargetId = null;

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
}

function route() {
  const hash = location.hash || '#/dashboard';
  const [path, queryString] = hash.slice(2).split('?');
  const query = new URLSearchParams(queryString || '');
  const state = getState();
  monthPill.textContent = monthLabel(state.household.month);
  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === path);
    if (a.dataset.nav === path) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const renders = {
    dashboard: renderDashboard,
    transactions: (s) => renderTransactions(s, query),
    budgets: renderBudgets,
    goals: renderGoals,
    insights: renderInsights,
  };
  const render = renders[path] || renderDashboard;
  view.innerHTML = render(state);
  wireView(state);
  window.scrollTo(0, 0);
}

function wireView(state) {
  view.querySelectorAll('[data-open-tx]').forEach((b) => b.addEventListener('click', () => openTxDialog(null)));
  view.querySelectorAll('[data-edit-tx]').forEach((row) => {
    row.addEventListener('click', () => openTxDialog(row.dataset.editTx));
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTxDialog(row.dataset.editTx); }
    });
  });
  view.querySelectorAll('[data-add-goal]').forEach((b) => b.addEventListener('click', () => openGoalDialog(b.dataset.addGoal)));
  view.querySelectorAll('[data-budget-input]').forEach((input) => {
    input.addEventListener('change', () => {
      const limit = Math.max(0, Number(input.value) || 0);
      setBudget(input.dataset.budgetInput, limit);
      toast('Budget updated.');
      route();
    });
  });
  const filters = document.getElementById('txFilters');
  if (filters) {
    filters.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(filters);
      const params = new URLSearchParams();
      if (data.get('q')) params.set('q', data.get('q'));
      if (data.get('cat') && data.get('cat') !== 'all') params.set('cat', data.get('cat'));
      if (data.get('type') && data.get('type') !== 'all') params.set('type', data.get('type'));
      location.hash = '#/transactions' + (params.toString() ? '?' + params.toString() : '');
    });
  }
  const newGoal = document.getElementById('newGoalForm');
  if (newGoal) {
    newGoal.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(newGoal);
      addGoal({
        name: String(data.get('name')).trim(),
        target: Number(data.get('target')),
        saved: 0,
        note: String(data.get('note') || '').trim() || 'A new goal for the household.',
      });
      toast('Goal created.');
      route();
    });
  }
}

function fillCategorySelect(select, selected) {
  const state = getState();
  select.innerHTML = state.categories
    .map((c) => `<option value="${c.id}" ${c.id === selected ? 'selected' : ''}>${c.icon} ${c.label}</option>`)
    .join('');
}

function openTxDialog(id) {
  const state = getState();
  editingTxId = id;
  const title = document.getElementById('txDialogTitle');
  const delBtn = document.getElementById('txDeleteBtn');
  const typeEl = document.getElementById('txType');
  const amountEl = document.getElementById('txAmount');
  const dateEl = document.getElementById('txDate');
  const catEl = document.getElementById('txCategory');
  const descEl = document.getElementById('txDescription');
  const acctEl = document.getElementById('txAccount');
  if (id) {
    const tx = state.transactions.find((t) => t.id === id);
    if (!tx) return;
    title.textContent = 'Edit transaction';
    delBtn.classList.remove('hidden');
    typeEl.value = tx.type;
    amountEl.value = tx.amount;
    dateEl.value = tx.date;
    fillCategorySelect(catEl, tx.category);
    descEl.value = tx.description;
    acctEl.value = tx.account;
  } else {
    title.textContent = 'Add transaction';
    delBtn.classList.add('hidden');
    typeEl.value = 'expense';
    amountEl.value = '';
    dateEl.value = '2026-11-26';
    fillCategorySelect(catEl, 'groceries');
    descEl.value = '';
    acctEl.value = 'Joint checking';
  }
  if (typeof txDialog.showModal === 'function') txDialog.showModal();
}

function openGoalDialog(goalId) {
  const state = getState();
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;
  goalTargetId = goalId;
  document.getElementById('goalDialogTitle').textContent = 'Add to ' + goal.name;
  document.getElementById('goalDialogSub').textContent =
    'Saved so far: $' + goal.saved.toLocaleString('en-US') + ' of $' + goal.target.toLocaleString('en-US') + '. The contribution is also recorded as a savings transaction.';
  document.getElementById('goalAmount').value = '';
  document.getElementById('goalDate').value = '2026-11-26';
  if (typeof goalDialog.showModal === 'function') goalDialog.showModal();
}

txForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(txForm);
  const tx = {
    type: data.get('type'),
    amount: Math.round(Number(data.get('amount')) * 100) / 100,
    date: data.get('date'),
    category: data.get('category'),
    description: String(data.get('description')).trim(),
    account: data.get('account'),
  };
  if (!tx.amount || tx.amount <= 0 || !tx.date || !tx.description) return;
  if (editingTxId) {
    updateTransaction(editingTxId, tx);
    toast('Transaction updated.');
  } else {
    addTransaction(tx);
    toast('Transaction added.');
  }
  txDialog.close();
  route();
});

document.getElementById('txCancelBtn').addEventListener('click', () => txDialog.close());
document.getElementById('txDeleteBtn').addEventListener('click', () => {
  if (editingTxId) {
    deleteTransaction(editingTxId);
    toast('Transaction deleted.');
    txDialog.close();
    route();
  }
});

goalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(goalForm);
  const amount = Math.round(Number(data.get('amount')) * 100) / 100;
  if (!amount || amount <= 0 || !goalTargetId) return;
  addToGoal(goalTargetId, amount, data.get('date'));
  toast('Contribution added.');
  goalDialog.close();
  route();
});

document.getElementById('goalCancelBtn').addEventListener('click', () => goalDialog.close());
document.getElementById('quickAddBtn').addEventListener('click', () => openTxDialog(null));
document.getElementById('resetDemoBtn').addEventListener('click', () => {
  if (window.confirm('Reset all figures back to the original demo data? Your edits will be lost.')) {
    resetDemo();
    toast('Demo data reset.');
    route();
  }
});

window.addEventListener('hashchange', route);
route();
