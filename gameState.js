/**
 * Bank Town core rules (ONLY these concepts):
 * 1) Bank is safe storage (cash -> bank)
 * 2) Account balance changes (deposit up, payments down)
 * 3) Debit cards & digital payments (pay from bank)
 * 4) Needs vs Wants (progress vs fun)
 */

import { CONFIG } from '../config.js';

export const ITEM_TAG = {
  NEED: 'need',
  WANT: 'want',
};

export const PAY_METHOD = {
  CARD: 'card',
  PHONE: 'phone',
};

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function emitEvent(store, event) {
  store.setState((s) => ({ ...s, lastEvent: { ...event, t: Date.now() } }));
}

export function createInitialGameState() {
  return {
    walletCash: CONFIG.starting.walletCash,
    bankBalance: CONFIG.starting.bankBalance,

    debitUnlocked: CONFIG.starting.debitUnlocked,
    digitalUnlocked: CONFIG.starting.digitalUnlocked,

    progress: CONFIG.starting.progress,

    pendingPurchase: null,
    lastEvent: null,
    loopsCompleted: 0,
  };
}

export function earnCoins(store) {
  const amount = CONFIG.economy.earnTapCoins;
  store.setState((s) => ({ ...s, walletCash: s.walletCash + amount }));
  emitEvent(store, { type: 'earn', tone: 'good', emoji: '🪙', text: `+${amount}c!` });
  return amount;
}

export function depositToBank(store, amount) {
  const before = store.getState();

  store.setState((s) => {
    const a = clamp(amount, 0, s.walletCash);
    const meaningful = a >= CONFIG.economy.minMeaningfulDepositToUnlock;

    const debitUnlocked = s.debitUnlocked || meaningful;

    return {
      ...s,
      walletCash: s.walletCash - a,
      bankBalance: s.bankBalance + a,
      debitUnlocked,
    };
  });

  if (amount <= 0) {
    emitEvent(store, { type: 'deposit', tone: 'warn', emoji: '🏦', text: CONFIG.ui.oneLine.pickCoins });
    return;
  }

  const after = store.getState();
  emitEvent(store, { type: 'deposit', tone: 'good', emoji: '🏦', text: CONFIG.ui.oneLine.deposited });

  if (!before.debitUnlocked && after.debitUnlocked) {
    emitEvent(store, { type: 'unlock', tone: 'good', emoji: '💳', text: CONFIG.ui.oneLine.cardUnlocked });
  }
}

export function chooseShopItem(store, item) {
  store.setState((s) => ({ ...s, pendingPurchase: item }));
  emitEvent(store, { type: 'choose', tone: 'warn', emoji: item.emoji, text: CONFIG.ui.oneLine.ready });
}

export function pay(store, method) {
  const s = store.getState();
  const item = s.pendingPurchase;

  if (!item) {
    emitEvent(store, { type: 'pay', tone: 'warn', emoji: '🧾', text: CONFIG.ui.oneLine.pickItem });
    return { ok: false };
  }

  if (!s.debitUnlocked) {
    emitEvent(store, { type: 'pay', tone: 'warn', emoji: '🔒', text: CONFIG.ui.oneLine.unlockCard });
    return { ok: false };
  }

  if (method === PAY_METHOD.PHONE && !s.digitalUnlocked) {
    emitEvent(store, { type: 'pay', tone: 'warn', emoji: '🔒', text: CONFIG.ui.oneLine.useCardFirst });
    return { ok: false };
  }

  if (s.bankBalance < item.price) {
    emitEvent(store, { type: 'pay', tone: 'bad', emoji: '😬', text: CONFIG.ui.oneLine.notEnough });
    return { ok: false };
  }

  store.setState((prev) => {
    const spent = item.price;

    const gain = item.tag === ITEM_TAG.NEED ? CONFIG.progress.needGain : CONFIG.progress.wantGain;
    const progress = clamp(prev.progress + gain, 0, CONFIG.progress.max);

    // Unlock digital payments after the first successful card payment.
    const digitalUnlocked = prev.digitalUnlocked || method === PAY_METHOD.CARD;

    return {
      ...prev,
      bankBalance: prev.bankBalance - spent,
      progress,
      digitalUnlocked,
      pendingPurchase: null,
      loopsCompleted: prev.loopsCompleted + 1,
    };
  });

  const after = store.getState();

  const paidLine = method === PAY_METHOD.PHONE ? CONFIG.ui.oneLine.paidPhone : CONFIG.ui.oneLine.paidCard;
  emitEvent(store, { type: 'pay', tone: 'good', emoji: method === PAY_METHOD.PHONE ? '📱' : '💳', text: paidLine, data: { item } });

  if (item.tag === ITEM_TAG.NEED) {
    emitEvent(store, { type: 'budget', tone: 'good', emoji: '✅', text: CONFIG.ui.oneLine.needGood });
  } else {
    emitEvent(store, { type: 'budget', tone: 'warn', emoji: '🎉', text: CONFIG.ui.oneLine.wantOk });
  }

  if (!s.digitalUnlocked && after.digitalUnlocked) {
    emitEvent(store, { type: 'unlock', tone: 'good', emoji: '📱', text: CONFIG.ui.oneLine.phoneUnlocked });
  }

  if (after.progress >= CONFIG.progress.max) {
    emitEvent(store, { type: 'goal', tone: 'good', emoji: '🌟', text: CONFIG.ui.oneLine.goal });
  }

  return { ok: true, item };
}
