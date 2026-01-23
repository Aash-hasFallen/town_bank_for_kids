import { Panel, Button, el, pulse } from '../ui/components.js';
import { CONFIG } from '../config.js';
import { depositToBank } from '../state/gameState.js';

export const BankScene = {
  id: 'bank',
  render({ root, store, navigate }) {
    const s = store.getState();

    const max = Math.max(0, s.walletCash);
    const start = Math.min(CONFIG.economy.suggestedDeposit, max);

    const amountInput = el('input', {
      type: 'range',
      min: '0',
      max: String(max),
      step: String(CONFIG.economy.maxDepositStep),
      value: String(start),
      'aria-label': 'Deposit amount in coins',
      style: 'width:100%; accent-color: #2b7bff;',
    });

    const amountLabel = el('div', { style: 'font-weight:1100; font-size:20px; margin-top:10px;' });
    function syncLabel() {
      amountLabel.textContent = `${amountInput.value}c`;
    }
    amountInput.addEventListener('input', syncLabel);
    syncLabel();

    const depositBtn = Button({
      icon: CONFIG.ui.buttons.deposit.icon,
      text: CONFIG.ui.buttons.deposit.text,
      ariaLabel: 'Deposit coins to bank',
      tone: 'good',
      disabled: s.walletCash <= 0,
      onClick: () => {
        depositToBank(store, Number(amountInput.value));
        pulse(panelEl, 'good');
      },
    });

    const allBtn = Button({
      icon: CONFIG.ui.buttons.all.icon,
      text: CONFIG.ui.buttons.all.text,
      ariaLabel: 'Deposit all coins',
      tone: 'primary',
      disabled: s.walletCash <= 0,
      onClick: () => {
        amountInput.value = String(s.walletCash);
        syncLabel();
      },
    });

    const shopBtn = Button({
      icon: '🛒',
      text: 'Shop',
      ariaLabel: 'Go to shop',
      tone: 'primary',
      onClick: () => navigate('shop'),
    });

    const panel = Panel({
      title: CONFIG.ui.titles.bank,
      subtitle: CONFIG.ui.subtitles.bank,
      children: [
        el('div', { class: 'row row--spread' },
          el('div', { class: 'hudChip' }, el('span', { text: '🪙' }), el('span', { text: `${s.walletCash}c` })),
          el('div', { class: 'hudChip' }, el('span', { text: '🏦' }), el('span', { text: `${s.bankBalance}c` })),
        ),

        el('div', { style: 'margin-top:12px;' }, amountInput, amountLabel),

        el('div', { class: 'row', style: 'margin-top:10px;' }, depositBtn, allBtn, shopBtn),

        el('div', { class: 'row', style: 'margin-top:10px;' },
          el('div', { class: 'hudChip', title: 'Debit card' },
            el('span', { text: '💳' }),
            el('span', { text: s.debitUnlocked ? 'Ready' : 'Locked' })
          ),
        ),
      ],
    });

    const panelEl = panel;
    root.appendChild(el('div', { class: 'grid' }, panel));
  },
};
