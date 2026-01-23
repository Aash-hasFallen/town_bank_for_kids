import { Panel, Button, el } from '../ui/components.js';
import { CONFIG } from '../config.js';
import { earnCoins } from '../state/gameState.js';

export const TownScene = {
  id: 'town',
  render({ root, store, navigate }) {
    const s = store.getState();

    const earnBtn = Button({
      icon: CONFIG.ui.buttons.earn.icon,
      text: CONFIG.ui.buttons.earn.text,
      ariaLabel: 'Earn coins',
      tone: 'primary',
      onClick: (e) => {
        const amount = earnCoins(store);
        const r = e.currentTarget.getBoundingClientRect();
        window.dispatchEvent(new CustomEvent('coinpop', { detail: { text: `+${amount}c`, x: r.left + r.width / 2, y: r.top } }));
      },
    });

    const quickNext = Button({
      icon: '🏦',
      text: 'Bank',
      ariaLabel: 'Go to bank',
      tone: 'good',
      onClick: () => navigate('bank'),
    });

    const panel = Panel({
      title: CONFIG.ui.titles.town,
      subtitle: CONFIG.ui.subtitles.town,
      children: [
        el('div', { class: 'row row--spread' },
          el('div', { class: 'card' },
            el('div', { class: 'card__emoji', text: '🪙' }),
            el('div', { class: 'card__name', text: `Wallet: ${s.walletCash}c` }),
            el('div', { class: 'card__meta', text: CONFIG.ui.oneLine.tip }),
            el('div', { class: 'row', style: 'margin-top:10px;' }, earnBtn, quickNext),
          ),
        ),
      ],
    });

    root.appendChild(el('div', { class: 'grid' }, panel));
  },
};
