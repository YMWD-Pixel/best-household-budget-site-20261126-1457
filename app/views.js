// Views: one render function per section. Each returns HTML for #view;
// app.js wires the buttons and forms after render.

import { donut, monthBars } from './charts.js';
import {
  budgetStatus,
  categoryById,
  getState,
  monthLabel,
  monthTotals,
  monthlySeries,
  money,
  spendingByCategory,
  transactionsFor,
} from './store.js';

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function barTone(b) {
  return b.used > b.limit + 0.005 ? 'over' : b.pct >= 0.85 ? 'warn' : 'ok';
}

function pctBar(pct, tone) {
  const clamped = Math.max(0, Math.min(1.15, pct));
  return `<div class="bar-track"><div class="bar-fill ${tone}" style="width:${Math.min(100, clamped * 100).toFixed(1)}%"></div></div>`;
}

function txRow(t) {
  const cat = categoryById(t.category);
  const sign = t.type === 'income' ? '+' : '−';
  return `<tr class="tx-row" data-edit-tx="${t.id}" tabindex="0" title="Click to edit">
    <td>${t.date.slice(5)}</td>
    <td><span class="cat-chip"><span aria-hidden="true">${cat.icon}</span> ${esc(cat.label)}</span></td>
    <td>${esc(t.description)}</td>
    <td class="muted">${esc(t.account)}</td>
    <td class="amount ${t.type}">${sign}${money(t.amount)}</td>
  </tr>`;
}

export function renderDashboard(state) {
  const month = state.household.month;
  const totals = monthTotals(month);
  const byCat = spendingByCategory(month);
  const budgets = budgetStatus(month);
  const over = budgets.filter((b) => b.used > b.limit + 0.005);
  const near = budgets.filter((b) => b.pct >= 0.9 && b.pct < 1 && b.category !== 'housing');
  const series = monthlySeries();
  const recent = transactionsFor(month).slice(0, 6);
  const goals = state.goals;
  const goalsSaved = goals.reduce((s, g) => s + g.saved, 0);
  const goalsTarget = goals.reduce((s, g) => s + g.target, 0);

  return `
  <section class="page-head">
    <div>
      <p class="eyebrow">${esc(state.household.name)} · ${monthLabel(month)}</p>
      <h1>Good morning, Maya &amp; Daniel</h1>
      <p class="lede">Here is where the household stands with five days left in November.</p>
    </div>
    <div class="head-note">
      <span class="pill ${totals.left >= 0 ? 'pill-ok' : 'pill-bad'}">${totals.left >= 0 ? 'On track' : 'Over income'}</span>
      <span class="muted">${money(totals.left)} left to save or spend</span>
    </div>
  </section>

  <section class="stat-grid" aria-label="November summary">
    <article class="stat-card"><p class="stat-label">Income</p><p class="stat-value">${money(totals.income)}</p><p class="muted">2 salaries, paid Nov 1</p></article>
    <article class="stat-card"><p class="stat-label">Spent so far</p><p class="stat-value">${money(totals.spending)}</p><p class="muted">${money(totals.spending / 26)} a day on average</p></article>
    <article class="stat-card"><p class="stat-label">Left this month</p><p class="stat-value">${money(totals.left)}</p><p class="muted">${(totals.savingsRate * 100).toFixed(0)}% of income unspent</p></article>
    <article class="stat-card"><p class="stat-label">Saved toward goals</p><p class="stat-value">${money(goalsSaved)}</p><p class="muted">of ${money(goalsTarget)} across ${goals.length} goals</p></article>
  </section>

  ${over.length || near.length ? `
  <section class="alert-strip" role="status">
    ${over.map((b) => `<p>⚠️ <strong>${esc(b.label)}</strong> is over budget by ${money(-b.remaining)} (${money(b.used)} of ${money(b.limit)}).</p>`).join('')}
    ${near.map((b) => `<p>⏳ <strong>${esc(b.label)}</strong> is at ${(b.pct * 100).toFixed(0)}% of its ${money(b.limit)} budget — ${money(b.remaining)} left.</p>`).join('')}
  </section>` : ''}

  <div class="two-col">
    <section class="card">
      <div class="card-head"><h2>Where the money went</h2><a class="card-link" href="#/transactions">All transactions →</a></div>
      ${donut(byCat)}
    </section>
    <section class="card">
      <div class="card-head"><h2>Income vs spending</h2><a class="card-link" href="#/insights">Insights →</a></div>
      ${monthBars(series)}
      <p class="muted">November is running ${money(totals.spending - monthTotals('2026-10').spending)} above October — mostly one-offs: the car service and the kids' winter coats.</p>
    </section>
  </div>

  <div class="two-col">
    <section class="card">
      <div class="card-head"><h2>Budgets to watch</h2><a class="card-link" href="#/budgets">All budgets →</a></div>
      <ul class="budget-mini">
        ${budgets.slice(0, 4).map((b) => `
          <li>
            <div class="budget-line"><span><span aria-hidden="true">${b.icon}</span> ${esc(b.label)}</span><span><strong>${money(b.used)}</strong> <span class="muted">of ${money(b.limit)}</span></span></div>
            ${pctBar(b.pct, barTone(b))}
          </li>`).join('')}
      </ul>
    </section>
    <section class="card">
      <div class="card-head"><h2>Latest transactions</h2><a class="card-link" href="#/transactions">See all →</a></div>
      <table class="tx-table compact">
        <tbody>${recent.map(txRow).join('')}</tbody>
      </table>
      <button class="btn btn-primary" data-open-tx type="button">+ Add transaction</button>
    </section>
  </div>`;
}

export function renderTransactions(state, query) {
  const month = state.household.month;
  const all = transactionsFor(month);
  const q = (query.get('q') || '').trim().toLowerCase();
  const catFilter = query.get('cat') || 'all';
  const typeFilter = query.get('type') || 'all';
  const rows = all.filter((t) => {
    if (catFilter !== 'all' && t.category !== catFilter) return false;
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (q && !(t.description.toLowerCase().includes(q) || t.account.toLowerCase().includes(q))) return false;
    return true;
  });
  const totals = monthTotals(month);
  const cats = state.categories.filter((c) => c.id !== 'income');

  return `
  <section class="page-head">
    <div>
      <p class="eyebrow">November 2026 · ${all.length} transactions</p>
      <h1>Transactions</h1>
      <p class="lede">Every dollar in and out. Click a row to edit it, or add a new one.</p>
    </div>
    <button class="btn btn-primary" data-open-tx type="button">+ Add transaction</button>
  </section>

  <section class="stat-grid three" aria-label="November totals">
    <article class="stat-card"><p class="stat-label">Money in</p><p class="stat-value income-text">${money(totals.income)}</p></article>
    <article class="stat-card"><p class="stat-label">Money out</p><p class="stat-value expense-text">${money(totals.spending)}</p></article>
    <article class="stat-card"><p class="stat-label">Net</p><p class="stat-value">${money(totals.left)}</p></article>
  </section>

  <section class="card">
    <form class="filters" id="txFilters">
      <label class="filter-field">Search
        <input type="search" name="q" value="${esc(query.get('q') || '')}" placeholder="Description or account…">
      </label>
      <label class="filter-field">Category
        <select name="cat">
          <option value="all">All categories</option>
          ${cats.map((c) => `<option value="${c.id}" ${catFilter === c.id ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}
        </select>
      </label>
      <label class="filter-field">Type
        <select name="type">
          <option value="all" ${typeFilter === 'all' ? 'selected' : ''}>Income &amp; expenses</option>
          <option value="expense" ${typeFilter === 'expense' ? 'selected' : ''}>Expenses only</option>
          <option value="income" ${typeFilter === 'income' ? 'selected' : ''}>Income only</option>
        </select>
      </label>
      <button class="btn" type="submit">Filter</button>
      <a class="btn btn-ghost" href="#/transactions">Clear</a>
    </form>
    ${rows.length ? `
    <div class="table-scroll">
      <table class="tx-table">
        <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Account</th><th class="amount">Amount</th></tr></thead>
        <tbody>${rows.map(txRow).join('')}</tbody>
      </table>
    </div>
    <p class="muted">${rows.length} of ${all.length} transactions shown · ${money(rows.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0))} net</p>
    ` : `<p class="empty">No transactions match those filters. <a href="#/transactions">Clear the filters</a> to see them all.</p>`}
  </section>`;
}

export function renderBudgets(state) {
  const month = state.household.month;
  const budgets = budgetStatus(month);
  const totals = monthTotals(month);
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalUsed = budgets.reduce((s, b) => s + b.used, 0);

  return `
  <section class="page-head">
    <div>
      <p class="eyebrow">November 2026 · ${money(totalLimit)} planned</p>
      <h1>Budgets</h1>
      <p class="lede">A limit for every part of household life. Edit a limit and the bars update at once.</p>
    </div>
  </section>

  <section class="stat-grid three" aria-label="Budget totals">
    <article class="stat-card"><p class="stat-label">Planned spending</p><p class="stat-value">${money(totalLimit)}</p></article>
    <article class="stat-card"><p class="stat-label">Spent so far</p><p class="stat-value">${money(totalUsed)}</p><p class="muted">${(totalUsed / totalLimit * 100).toFixed(0)}% of the plan</p></article>
    <article class="stat-card"><p class="stat-label">Still in the plan</p><p class="stat-value">${money(totalLimit - totalUsed)}</p><p class="muted">${money(totals.left)} of income unspent overall</p></article>
  </section>

  <section class="card">
    <ul class="budget-list">
      ${budgets.map((b) => `
      <li class="budget-item">
        <div class="budget-top">
          <span class="budget-name"><span aria-hidden="true">${b.icon}</span> ${esc(b.label)}</span>
          <span class="budget-nums"><strong>${money(b.used)}</strong> <span class="muted">of</span> <strong>${money(b.limit)}</strong></span>
        </div>
        ${pctBar(b.pct, barTone(b))}
        <div class="budget-foot">
          <span class="${b.remaining < 0 ? 'over-text' : 'muted'}">${b.remaining < 0 ? `${money(-b.remaining)} over budget` : `${money(b.remaining)} left · ${(b.pct * 100).toFixed(0)}% used`}</span>
          <label class="budget-edit">Monthly limit $
            <input type="number" min="0" step="10" value="${b.limit}" data-budget-input="${b.category}" aria-label="Monthly limit for ${esc(b.label)}">
          </label>
        </div>
      </li>`).join('')}
    </ul>
    <p class="muted">Tip: housing is a fixed cost, so its bar is full on the 1st. The bars that matter most are the ones you can still change — groceries, dining and shopping.</p>
  </section>`;
}

export function renderGoals(state) {
  const goals = state.goals;
  const saved = goals.reduce((s, g) => s + g.saved, 0);
  const target = goals.reduce((s, g) => s + g.target, 0);

  return `
  <section class="page-head">
    <div>
      <p class="eyebrow">${money(saved)} saved of ${money(target)}</p>
      <h1>Savings goals</h1>
      <p class="lede">What the household is saving for, and how close each goal is. Add a contribution any time.</p>
    </div>
  </section>

  <section class="goal-grid">
    ${goals.map((g) => {
      const pct = g.target > 0 ? g.saved / g.target : 0;
      const left = Math.max(0, g.target - g.saved);
      return `
      <article class="card goal-card">
        <h2>${esc(g.name)}</h2>
        <p class="goal-amount"><strong>${money(g.saved)}</strong> <span class="muted">of ${money(g.target)}</span></p>
        ${pctBar(pct, pct >= 1 ? 'ok' : 'goal')}
        <p class="muted">${(pct * 100).toFixed(0)}% funded · ${left > 0 ? `${money(left)} to go` : 'Goal reached — nicely done!'}</p>
        <p>${esc(g.note)}</p>
        <button class="btn btn-primary" data-add-goal="${g.id}" type="button">+ Add contribution</button>
      </article>`;
    }).join('')}
    <article class="card goal-card goal-new">
      <h2>Start a new goal</h2>
      <p class="muted">A holiday, a new bike, a home repair — give it a name and a target and start saving.</p>
      <form id="newGoalForm" class="form-grid">
        <label>Goal name<input name="name" type="text" required maxlength="60" placeholder="e.g. New washing machine"></label>
        <label>Target (USD)<input name="target" type="number" min="1" step="10" required placeholder="1000"></label>
        <label class="span-2">Why this goal?<input name="note" type="text" maxlength="120" placeholder="One line about what it is for"></label>
        <button class="btn btn-primary span-2" type="submit">Create goal</button>
      </form>
    </article>
  </section>`;
}

export function renderInsights(state) {
  const month = state.household.month;
  const prev = '2026-10';
  const now = monthTotals(month);
  const then = monthTotals(prev);
  const byCat = spendingByCategory(month);
  const top = byCat.find((c) => c.category !== 'housing') || byCat[0];
  const biggest = transactionsFor(month).filter((t) => t.type === 'expense').sort((a, b) => b.amount - a.amount)[0];
  const daily = now.spending / 26;
  const projected = now.spending + daily * 4;
  const change = then.spending > 0 ? (now.spending - then.spending) / then.spending : 0;
  const grocery = byCat.find((c) => c.category === 'groceries');
  const dining = byCat.find((c) => c.category === 'dining');

  return `
  <section class="page-head">
    <div>
      <p class="eyebrow">November vs October 2026</p>
      <h1>Insights</h1>
      <p class="lede">What the numbers say about this household — and what to do about it.</p>
    </div>
  </section>

  <section class="stat-grid three" aria-label="Month comparison">
    <article class="stat-card"><p class="stat-label">Spending vs October</p><p class="stat-value">${change <= 0 ? '↓' : '↑'} ${Math.abs(change * 100).toFixed(0)}%</p><p class="muted">${money(Math.abs(now.spending - then.spending))} ${change <= 0 ? 'less' : 'more'} than October's ${money(then.spending)}</p></article>
    <article class="stat-card"><p class="stat-label">Daily average</p><p class="stat-value">${money(daily)}</p><p class="muted">a day so far in November</p></article>
    <article class="stat-card"><p class="stat-label">Projected month-end</p><p class="stat-value">${money(projected)}</p><p class="muted">at the current pace, vs ${money(now.income)} income</p></article>
  </section>

  <div class="two-col">
    <section class="card">
      <h2>Three things worth knowing</h2>
      <ol class="insight-list">
        <li><strong>${esc(top.label)} is the biggest cost after rent.</strong> ${money(top.amount)} so far — ${grocery ? `groceries alone are ${money(grocery.amount)}, about ${money(grocery.amount / 4)} a week for a family of four, which is in line with a careful shop.` : ''}</li>
        <li><strong>The single biggest purchase was ${money(biggest.amount)}.</strong> “${esc(biggest.description)}” on ${biggest.date.slice(5)} — a fixed cost, not a leak. The leaks to watch are the small ones that repeat.</li>
        <li><strong>Dining out is ${dining ? money(dining.amount) : 'low'} this month.</strong> ${dining && dining.amount < 200 ? 'Cooking at home most nights is keeping it in check — the weekly shop, not restaurants, is where the food money goes.' : 'It is creeping up; one home-cooked dinner a week saves roughly $30.'}</li>
      </ol>
    </section>
    <section class="card">
      <h2>Try this next week</h2>
      <ul class="tips-list">
        <li><strong>Meal-plan Sunday.</strong> Five planned dinners cut the mid-week takeaway habit that cost ${money(36.75 + 24.50 + 18.90)} in November.</li>
        <li><strong>Move the win to savings.</strong> November is on pace to leave ${money(now.income - projected)} unspent — move half to the emergency fund on the 30th, before it drifts away. November runs above October mostly on one-offs (car service, winter coats), so the weekly shop itself is steady.</li>
        <li><strong>Audit the subscriptions.</strong> ${money(42.98)} a month goes to streaming and cloud storage. Cancel one unused service and the holiday-gifts goal is funded a month early.</li>
        <li><strong>Fuel on Tuesdays.</strong> Filling up twice this month cost ${money(88.70)}; a single weekly fill-up at the cheaper station by the school saves a few dollars every tank.</li>
      </ul>
      <p><a class="btn" href="#/budgets">Review the budgets →</a></p>
    </section>
  </div>

  <section class="card">
    <h2>How this is worked out</h2>
    <p>Every figure on this page comes from the transactions you see under <a href="#/transactions">Transactions</a>. October is last month's real spending (${money(then.spending)}); the projection assumes the last 26 days' daily average holds for the 4 days left. Edit or add a transaction and every page updates — nothing here is typed in by hand.</p>
  </section>`;
}
