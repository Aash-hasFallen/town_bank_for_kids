/**
 * Single place to tune the prototype.
 * Goal: under-2-minute loop that demonstrates banking through actions.
 */

export const CONFIG = {
  starting: {
    walletCash: 10,
    bankBalance: 0,
    debitUnlocked: false,
    digitalUnlocked: false,
    progress: 0,
  },

  economy: {
    earnTapCoins: 6,
    suggestedDeposit: 6,
    maxDepositStep: 1,
    minMeaningfulDepositToUnlock: 1,
  },

  progress: {
    needGain: 25, // 4 good choices reaches 100
    wantGain: 0,
    max: 100,
  },

  shop: {
    items: [
      { id: 'snack', name: 'Snack', emoji: '🥪', price: 6, tag: 'need' },
      { id: 'notebook', name: 'Notebook', emoji: '📒', price: 8, tag: 'need' },
      { id: 'toy', name: 'Toy', emoji: '🧸', price: 6, tag: 'want' },
      { id: 'ice', name: 'Ice', emoji: '🍦', price: 4, tag: 'want' },
    ],
  },

  ui: {
    titles: {
      town: 'Town',
      bank: 'Bank',
      shop: 'Shop',
    },
    subtitles: {
      town: 'Tap to earn.',
      bank: 'Save it safe.',
      shop: 'Need or want?',
    },
    buttons: {
      earn: { icon: '🪙', text: 'Earn' },
      deposit: { icon: '🏦', text: 'Deposit' },
      all: { icon: '➡️', text: 'All' },
      choose: { icon: '✅', text: 'Choose' },
      chosen: { icon: '✅', text: 'Chosen' },
      payCard: { icon: '💳', text: 'Pay' },
      payPhone: { icon: '📱', text: 'Pay' },
    },
    oneLine: {
      tip: 'Deposit to use the card.',

      pickCoins: 'Pick coins!',
      ready: 'Ready!',
      useCardFirst: 'Use card first!',

      deposited: 'Safe in bank!',
      cardUnlocked: 'Card unlocked!',
      phoneUnlocked: 'Phone pay unlocked!',

      pickItem: 'Pick 1 item!',
      unlockCard: 'Deposit first!',
      notEnough: 'Not enough in bank!',

      paidCard: 'Paid with card!',
      paidPhone: 'Paid with phone!',

      needGood: 'Need = progress!',
      wantOk: 'Want = fun!',

      goal: 'Goal reached!',
    },
    labels: {
      need: 'NEED',
      want: 'WANT',
    },
  },
};
