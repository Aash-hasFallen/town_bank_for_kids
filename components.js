/** UI helpers: tiny, dependency-free, and easy to replace later. */

export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (k === 'class') node.className = v;
    else if (k === 'dataset') {
      for (const [dk, dv] of Object.entries(v)) node.dataset[dk] = dv;
    } else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'text') {
      node.textContent = v;
    } else if (v !== undefined) {
      node.setAttribute(k, String(v));
    }
  }

  for (const c of children.flat()) {
    if (c == null) continue;
    if (typeof c === 'string') node.appendChild(document.createTextNode(c));
    else node.appendChild(c);
  }

  return node;
}

export function Panel({ title, subtitle, children }) {
  return el(
    'section',
    { class: 'panel' },
    el('h2', { class: 'panel__title', text: title }),
    subtitle ? el('p', { class: 'panel__subtitle', text: subtitle }) : null,
    ...children
  );
}

/**
 * Kid-friendly button:
 * - Big tap target (CSS)
 * - Icon-first, text-second
 * - Accessible name via aria-label (fallbacks to text)
 */
export function Button({
  icon = '⭐',
  text = '',
  ariaLabel,
  tone = 'default',
  disabled = false,
  onClick,
}) {
  const cls = ['btn'];
  if (tone === 'primary') cls.push('btn--primary');
  if (tone === 'good') cls.push('btn--good');
  if (tone === 'warn') cls.push('btn--warn');
  if (tone === 'bad') cls.push('btn--bad');

  return el(
    'button',
    {
      class: cls.join(' '),
      disabled: disabled ? '' : undefined,
      'aria-label': ariaLabel || text || 'Button',
      onClick,
    },
    el('span', { class: 'btn__icon', text: icon, 'aria-hidden': 'true' }),
    text ? el('span', { class: 'btn__text', text }) : null
  );
}

export function hudChip(icon, valueText) {
  return el(
    'div',
    { class: 'hudChip' },
    el('span', { class: 'hudChip__icon', text: icon, 'aria-hidden': 'true' }),
    el('span', { class: 'hudChip__value', text: valueText })
  );
}

export function toast(toastRoot, text, tone = 'warn') {
  const node = el('div', { class: `toast toast--${tone}`, text });
  toastRoot.appendChild(node);
  window.setTimeout(() => node.remove(), 1500);
}

export function coinPop(text, x, y) {
  const node = el('div', { class: 'coinPop', text });
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  document.body.appendChild(node);
  window.setTimeout(() => node.remove(), 900);
}

export function pulse(node, tone) {
  if (!node) return;
  const cls = tone === 'good' ? 'pulseGood' : tone === 'bad' ? 'pulseBad' : 'pulseWarn';
  node.classList.remove('pulseGood', 'pulseWarn', 'pulseBad');
  // force reflow to restart animation
  void node.offsetWidth;
  node.classList.add(cls);
}
