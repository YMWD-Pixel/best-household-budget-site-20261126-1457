// Seed data for Hearth & Ledger: the Rivera household's November 2026 budget.
// Every figure is invented demo data for this site. Months are fixed (Oct–Nov 2026)
// so the site renders the same figures on any day it is opened.

export const HOUSEHOLD = {
  name: 'The Rivera Household',
  members: ['Maya', 'Daniel', 'Sofia (9)', 'Leo (6)'],
  month: '2026-11',
  currency: 'USD',
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', icon: '🏠', color: '#2f6f5e' },
  { id: 'groceries', label: 'Groceries', icon: '🛒', color: '#3e8e5a' },
  { id: 'utilities', label: 'Utilities', icon: '💡', color: '#b7791f' },
  { id: 'transport', label: 'Transport', icon: '🚗', color: '#4a6fa5' },
  { id: 'dining', label: 'Dining out', icon: '🍽️', color: '#c0564f' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#7c5cbf' },
  { id: 'health', label: 'Health', icon: '🩺', color: '#2e86ab' },
  { id: 'kids', label: 'Kids & family', icon: '🧒', color: '#d97b29' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#a34d7a' },
  { id: 'subscriptions', label: 'Subscriptions', icon: '📺', color: '#5b7c99' },
  { id: 'savings', label: 'Savings', icon: '🐖', color: '#2f6f5e' },
  { id: 'income', label: 'Income', icon: '💵', color: '#2f6f5e' },
  { id: 'other', label: 'Other', icon: '📦', color: '#8a8f98' },
];

// Monthly budget limits for November 2026 (USD).
export const BUDGETS = [
  { category: 'housing', limit: 1850 },
  { category: 'groceries', limit: 720 },
  { category: 'utilities', limit: 310 },
  { category: 'transport', limit: 420 },
  { category: 'dining', limit: 260 },
  { category: 'entertainment', limit: 150 },
  { category: 'health', limit: 220 },
  { category: 'kids', limit: 380 },
  { category: 'shopping', limit: 300 },
  { category: 'subscriptions', limit: 85 },
  { category: 'savings', limit: 900 },
];

export const GOALS = [
  { id: 'g-emergency', name: 'Emergency fund', target: 12000, saved: 8450, note: 'Six months of essentials, kept in a high-yield savings account.' },
  { id: 'g-vacation', name: 'Summer road trip', target: 2400, saved: 1735, note: 'Two weeks driving the coast — cabin, fuel, food and a little fun money.' },
  { id: 'g-car', name: 'Replace the family car', target: 9000, saved: 3210, note: 'Down payment for a used minivan before the old one gives up.' },
  { id: 'g-holidays', name: 'Holiday gifts', target: 800, saved: 640, note: 'Gifts for family and the kids, bought early to spread the cost.' },
];

// Transactions: [id, date, type, category, description, amount, account]
export const TRANSACTIONS = [
  ['t001', '2026-11-01', 'income', 'income', 'Maya — salary (Nov)', 3850.00, 'Joint checking'],
  ['t002', '2026-11-01', 'income', 'income', 'Daniel — salary (Nov)', 2980.00, 'Joint checking'],
  ['t003', '2026-11-01', 'expense', 'housing', 'Rent — Maple Street apartment', 1850.00, 'Joint checking'],
  ['t004', '2026-11-01', 'expense', 'subscriptions', 'Streaming bundle (video + music)', 32.99, 'Credit card ·· 4417'],
  ['t005', '2026-11-02', 'expense', 'groceries', 'Weekly shop — Green Mart', 148.62, 'Joint checking'],
  ['t006', '2026-11-03', 'expense', 'transport', 'Fuel — Shell, 11.4 gal', 46.80, 'Credit card ·· 4417'],
  ['t007', '2026-11-03', 'expense', 'kids', 'Sofia — piano lessons (Nov)', 120.00, 'Joint checking'],
  ['t008', '2026-11-04', 'expense', 'dining', 'Family dinner — Nonna’s trattoria', 68.40, 'Credit card ·· 4417'],
  ['t009', '2026-11-05', 'expense', 'utilities', 'Electricity — City Power', 132.47, 'Joint checking'],
  ['t010', '2026-11-06', 'expense', 'groceries', 'Weekly shop — Green Mart', 121.35, 'Joint checking'],
  ['t011', '2026-11-07', 'expense', 'entertainment', 'Movie night — cinema tickets x4', 54.00, 'Credit card ·· 4417'],
  ['t012', '2026-11-08', 'expense', 'transport', 'Bus passes — Maya & Daniel', 96.00, 'Joint checking'],
  ['t013', '2026-11-09', 'expense', 'groceries', 'Farmers market — vegetables & eggs', 43.20, 'Household cash'],
  ['t014', '2026-11-10', 'expense', 'health', 'Dentist — Leo check-up', 85.00, 'Joint checking'],
  ['t015', '2026-11-10', 'expense', 'shopping', 'Winter coats — Sofia & Leo', 132.90, 'Credit card ·· 4417'],
  ['t016', '2026-11-11', 'expense', 'utilities', 'Internet + phone (Nov)', 118.00, 'Joint checking'],
  ['t017', '2026-11-12', 'expense', 'dining', 'Lunch — Daniel & colleagues', 24.50, 'Household cash'],
  ['t018', '2026-11-13', 'expense', 'groceries', 'Weekly shop — Green Mart', 139.88, 'Joint checking'],
  ['t019', '2026-11-14', 'expense', 'kids', 'Leo — football club fees', 75.00, 'Joint checking'],
  ['t020', '2026-11-15', 'expense', 'savings', 'Transfer to emergency fund', 450.00, 'Joint checking'],
  ['t021', '2026-11-15', 'expense', 'entertainment', 'Board game — family game night', 38.99, 'Credit card ·· 4417'],
  ['t022', '2026-11-16', 'expense', 'transport', 'Fuel — Shell, 10.2 gal', 41.90, 'Credit card ·· 4417'],
  ['t023', '2026-11-17', 'expense', 'groceries', 'Weekly shop — Green Mart', 127.44, 'Joint checking'],
  ['t024', '2026-11-18', 'expense', 'health', 'Pharmacy — prescriptions', 42.60, 'Household cash'],
  ['t025', '2026-11-19', 'expense', 'dining', 'Takeaway pizza — Friday treat', 36.75, 'Credit card ·· 4417'],
  ['t026', '2026-11-20', 'expense', 'kids', 'School supplies & books', 58.40, 'Joint checking'],
  ['t027', '2026-11-21', 'expense', 'utilities', 'Water bill (Nov)', 54.30, 'Joint checking'],
  ['t028', '2026-11-22', 'expense', 'groceries', 'Weekly shop — Green Mart', 152.10, 'Joint checking'],
  ['t029', '2026-11-23', 'expense', 'shopping', 'Household — towels & bedding', 64.20, 'Credit card ·· 4417'],
  ['t030', '2026-11-24', 'expense', 'transport', 'Car service — oil & brakes', 189.00, 'Joint checking'],
  ['t031', '2026-11-25', 'expense', 'dining', 'Coffee & pastries — weekend', 18.90, 'Household cash'],
  ['t032', '2026-11-25', 'expense', 'subscriptions', 'Cloud storage family plan', 9.99, 'Credit card ·· 4417'],
  ['t033', '2026-11-26', 'expense', 'groceries', 'Top-up shop — milk, bread, fruit', 38.75, 'Household cash'],
  // October, for month-to-month comparison.
  ['t101', '2026-10-01', 'income', 'income', 'Maya — salary (Oct)', 3850.00, 'Joint checking'],
  ['t102', '2026-10-01', 'income', 'income', 'Daniel — salary (Oct)', 2980.00, 'Joint checking'],
  ['t103', '2026-10-01', 'expense', 'housing', 'Rent — Maple Street apartment', 1850.00, 'Joint checking'],
  ['t104', '2026-10-03', 'expense', 'groceries', 'Weekly shop — Green Mart', 161.20, 'Joint checking'],
  ['t105', '2026-10-06', 'expense', 'transport', 'Fuel — Shell', 52.10, 'Credit card ·· 4417'],
  ['t106', '2026-10-07', 'expense', 'dining', 'Anniversary dinner', 112.00, 'Credit card ·· 4417'],
  ['t107', '2026-10-09', 'expense', 'groceries', 'Weekly shop — Green Mart', 144.75, 'Joint checking'],
  ['t108', '2026-10-11', 'expense', 'entertainment', 'Theme park day — family', 186.00, 'Credit card ·· 4417'],
  ['t109', '2026-10-14', 'expense', 'utilities', 'Electricity — City Power', 148.90, 'Joint checking'],
  ['t110', '2026-10-15', 'expense', 'kids', 'Sofia — piano lessons (Oct)', 120.00, 'Joint checking'],
  ['t111', '2026-10-16', 'expense', 'groceries', 'Weekly shop — Green Mart', 138.40, 'Joint checking'],
  ['t112', '2026-10-18', 'expense', 'health', 'Optician — Maya new glasses', 210.00, 'Joint checking'],
  ['t113', '2026-10-20', 'expense', 'shopping', 'New shoes — Daniel', 89.95, 'Credit card ·· 4417'],
  ['t114', '2026-10-22', 'expense', 'groceries', 'Weekly shop — Green Mart', 155.60, 'Joint checking'],
  ['t115', '2026-10-24', 'expense', 'transport', 'Fuel — Shell', 48.30, 'Credit card ·· 4417'],
  ['t116', '2026-10-25', 'expense', 'dining', 'Takeaway — busy week', 44.20, 'Credit card ·· 4417'],
  ['t117', '2026-10-27', 'expense', 'utilities', 'Internet + phone (Oct)', 118.00, 'Joint checking'],
  ['t118', '2026-10-28', 'expense', 'kids', 'Halloween costumes', 67.50, 'Credit card ·· 4417'],
  ['t119', '2026-10-29', 'expense', 'groceries', 'Weekly shop — Green Mart', 149.85, 'Joint checking'],
  ['t120', '2026-10-30', 'expense', 'savings', 'Transfer to emergency fund', 400.00, 'Joint checking'],
];

// Monthly income / spending totals for the bar chart (Jun–Nov 2026).
export const MONTHLY = [
  { month: '2026-06', income: 6830, spending: 4920 },
  { month: '2026-07', income: 6830, spending: 5310 },
  { month: '2026-08', income: 7010, spending: 5640 },
  { month: '2026-09', income: 6830, spending: 5180 },
  { month: '2026-10', income: 6830, spending: 4197 },
  { month: '2026-11', income: 6830, spending: 0 }, // November spending is computed live from transactions.
];

export function seedState() {
  return {
    version: 1,
    household: HOUSEHOLD,
    categories: CATEGORIES,
    budgets: BUDGETS.map((b) => ({ ...b })),
    goals: GOALS.map((g) => ({ ...g })),
    transactions: TRANSACTIONS.map(([id, date, type, category, description, amount, account]) => ({
      id, date, type, category, description, amount, account,
    })),
    monthly: MONTHLY.map((m) => ({ ...m })),
  };
}
