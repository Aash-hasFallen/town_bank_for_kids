import { createStore } from './state/store.js';
import { createInitialGameState } from './state/gameState.js';
import { createRouter } from './router.js';
import { hudChip, toast, coinPop } from './ui/components.js';

import { TownScene } from './scenes/town.js';
import { BankScene } from './scenes/bank.js';
import { ShopScene } from './scenes/shop.js';

const sceneRoot = document.getElementById('sceneRoot');
const toastRoot = document.getElementById('toastRoot');
const hud = document.getElementById('hud');

if (!sceneRoot || !toastRoot || !hud) {
  // Fail loudly so a missing DOM hook doesn't look like "nothing happens".
  throw new Error('Missing required DOM nodes (#sceneRoot, #toastRoot, #hud).');
}

const store = createStore(createInitialGameState());

const router = createRouter({ root: sceneRoot });
router.register(TownScene.id, TownScene);
router.register(BankScene.id, BankScene);
router.register(ShopScene.id, ShopScene);

function renderHud() {
  const s = store.getState();
  hud.innerHTML = '';
  hud.appendChild(hudChip('🪙', `${s.walletCash}c`));
  hud.appendChild(hudChip('🏦', `${s.bankBalance}c`));
  hud.appendChild(hudChip('🌟', `${s.progress}%`));
}

function navigate(id) {
  router.go(id, { root: sceneRoot, store, navigate });
}

// Bottom nav
for (const btn of document.querySelectorAll('[data-nav]')) {
  btn.addEventListener('click', () => navigate(btn.dataset.nav));
}

// Global coin pop event
window.addEventListener('coinpop', (e) => {
  const { text, x, y } = e.detail;
  coinPop(text, x, y);
});

// One-line toast feedback on every event
let lastEventT = 0;
store.subscribe((s) => {
  renderHud();

  const ev = s.lastEvent;
  if (!ev || !ev.t || ev.t === lastEventT) return;
  lastEventT = ev.t;

  toast(toastRoot, ev.text || 'OK!', ev.tone || 'warn');

  // Re-render current scene to reflect new values.
  const current = router.currentScene() || 'town';
  navigate(current);
});

// Initial paint
renderHud();
navigate('town');
