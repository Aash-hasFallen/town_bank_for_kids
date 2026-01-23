import { Panel, Button, el, pulse } from '../ui/components.js';
import { CONFIG } from '../config.js';
import { chooseShopItem, pay, PAY_METHOD } from '../state/gameState.js';

function tagPill(tag) {
  const isNeed = tag === 'need';
  const label = isNeed ? CONFIG.ui.labels.need : CONFIG.ui.labels.want;
  const bg = isNeed ? 'rgba(31,191,103,0.16)' : 'rgba(255,176,32,0.18)';
  const border = isNeed ? 'rgba(31,191,103,0.28)' : 'rgba(255,176,32,0.30)';
  return el('span', {
    style: `display:inline-block; padding:6px 10px; border-radius:999px; font-weight:1100; border:2px solid ${border}; background:${bg};`,
    text: label,
  });
}

export const ShopScene = {
  id: 'shop',
  render({ root, store, navigate }) {
    const s = store.getState();
    const ITEMS = CONFIG.shop.items;

    const cards = ITEMS.map((it) => {
      const isSelected = s.pendingPurchase?.id === it.id;
      const outline = isSelected ? 'outline: 4px solid rgba(43,123,255,0.35); outline-offset: 2px;' : '';

      return el('div', { class: 'card', style: outline },
        el('div', { class: 'row row--spread' },
          el('div', null,
            el('div', { class: 'card__emoji', text: it.emoji }),
            el('div', { class: 'card__name', text: it.name }),
            el('div', { class: 'row', style: 'margin-top:6px; gap:10px;' },
              tagPill(it.tag),
              el('div', { class: 'hudChip', style: 'padding:6px 10px; box-shadow:none;' },
                el('span', { text: '🪙' }),
                el('span', { text: `${it.price}c` })
              ),
            ),
          ),
          Button({
            icon: isSelected ? CONFIG.ui.buttons.chosen.icon : CONFIG.ui.buttons.choose.icon,
            text: isSelected ? CONFIG.ui.buttons.chosen.text : CONFIG.ui.buttons.choose.text,
            ariaLabel: `Choose ${it.name}`,
            tone: isSelected ? 'primary' : (it.tag === 'need' ? 'good' : 'warn'),
            onClick: () => chooseShopItem(store, it),
          })
        )
      );
    });

    const payCardBtn = Button({
      icon: CONFIG.ui.buttons.payCard.icon,
      text: CONFIG.ui.buttons.payCard.text,
      ariaLabel: 'Pay with debit card',
      tone: 'primary',
      onClick: () => {
        const res = pay(store, PAY_METHOD.CARD);
        pulse(panelEl, res.ok ? 'good' : 'bad');
      },
    });

    const payPhoneBtn = Button({
      icon: CONFIG.ui.buttons.payPhone.icon,
      text: CONFIG.ui.buttons.payPhone.text,
      ariaLabel: 'Pay with phone',
      tone: 'warn',
      disabled: !s.digitalUnlocked,
      onClick: () => {
        const res = pay(store, PAY_METHOD.PHONE);
        pulse(panelEl, res.ok ? 'good' : 'bad');
      },
    });

    const bankBtn = Button({
      icon: '🏦',
      text: 'Bank',
      ariaLabel: 'Go to bank',
      tone: 'good',
      onClick: () => navigate('bank'),
    });

    const panel = Panel({
      title: CONFIG.ui.titles.shop,
      subtitle: CONFIG.ui.subtitles.shop,
      children: [
        el('div', { class: 'row row--spread' },
          el('div', { class: 'hudChip' }, el('span', { text: '🏦' }), el('span', { text: `${s.bankBalance}c` })),
          el('div', { class: 'hudChip', title: 'Debit card' }, el('span', { text: '💳' }), el('span', { text: s.debitUnlocked ? 'Ready' : 'Locked' })),
          el('div', { class: 'hudChip', title: 'Phone pay' }, el('span', { text: '📱' }), el('span', { text: s.digitalUnlocked ? 'Ready' : 'Locked' })),
        ),

        el('div', { class: 'grid grid--two', style: 'margin-top:10px;' }, ...cards),

        el('div', { class: 'row', style: 'margin-top:10px;' },
          payCardBtn,
          payPhoneBtn,
          bankBtn,
        ),

        el('div', { class: 'small', style: 'margin-top:6px;' },
          s.pendingPurchase ? `Chosen: ${s.pendingPurchase.emoji} ${s.pendingPurchase.name}` : 'Choose 1.'
        ),
      ],
    });

    const panelEl = panel;
    root.appendChild(el('div', { class: 'grid' }, panel));
  },
};
