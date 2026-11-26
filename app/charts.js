// Charts: small SVG charts drawn from the household's own figures.
// No library, no network — plain SVG built from numbers.

import { money, shortMonth } from './store.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Donut of spending by category. `parts` are {label, amount, color} sorted desc.
export function donut(parts, size = 220) {
  const total = parts.reduce((s, p) => s + p.amount, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r - 30;
  let angle = -Math.PI / 2;
  const slices = [];
  for (const p of parts) {
    const frac = p.amount / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    if (frac <= 0) continue;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    slices.push(
      `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${p.color}"><title>${esc(p.label)} — ${money(p.amount)} (${Math.round(frac * 100)}%)</title></path>`,
    );
  }
  const top = parts.slice(0, 6);
  const legend = top
    .map(
      (p) =>
        `<li><span class="dot" style="background:${p.color}"></span>${esc(p.label)}<strong>${money(p.amount)}</strong><span class="muted">${Math.round((p.amount / total) * 100)}%</span></li>`,
    )
    .join('');
  return `
    <div class="donut-wrap">
      <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category, total ${money(total)}">
        ${slices.join('')}
        <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donut-total">${money(total)}</text>
        <text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-sub">spent in November</text>
      </svg>
      <ul class="legend">${legend}</ul>
    </div>`;
}

// Grouped bars: income vs spending per month.
export function monthBars(series, width = 640, height = 260) {
  const max = Math.max(...series.map((m) => Math.max(m.income, m.spending)), 1);
  const padL = 52;
  const padB = 28;
  const padT = 14;
  const plotW = width - padL - 12;
  const plotH = height - padT - padB;
  const n = series.length;
  const slot = plotW / n;
  const barW = Math.min(26, (slot - 18) / 2);
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padT + plotH - f * plotH;
    return `<line x1="${padL}" y1="${y}" x2="${width - 12}" y2="${y}" class="grid-line"/><text x="${padL - 8}" y="${y + 4}" text-anchor="end" class="axis-label">$${Math.round((max * f) / 1000)}k</text>`;
  }).join('');
  const bars = series
    .map((m, i) => {
      const x = padL + i * slot + (slot - barW * 2 - 6) / 2;
      const hi = (m.income / max) * plotH;
      const hs = (m.spending / max) * plotH;
      return `
        <rect x="${x.toFixed(1)}" y="${(padT + plotH - hi).toFixed(1)}" width="${barW}" height="${hi.toFixed(1)}" rx="3" class="bar-income"><title>${shortMonth(m.month)} income ${money(m.income)}</title></rect>
        <rect x="${(x + barW + 6).toFixed(1)}" y="${(padT + plotH - hs).toFixed(1)}" width="${barW}" height="${hs.toFixed(1)}" rx="3" class="bar-spend"><title>${shortMonth(m.month)} spending ${money(m.spending)}</title></rect>
        <text x="${(padL + i * slot + slot / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" class="axis-label">${shortMonth(m.month)}</text>`;
    })
    .join('');
  return `
    <svg viewBox="0 0 ${width} ${height}" class="chart-svg" role="img" aria-label="Income and spending by month">
      ${grid}${bars}
    </svg>
    <p class="chart-key"><span class="key-swatch income"></span> Income <span class="key-swatch spend"></span> Spending</p>`;
}
