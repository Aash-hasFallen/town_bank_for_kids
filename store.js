/**
 * Tiny pub/sub state store.
 * - Centralizes game state
 * - Scenes subscribe to updates and re-render
 * - Keeps prototype modular and easy to extend
 */

export function createStore(initialState) {
  // Some mobile/embedded browsers may not support structuredClone.
  // This fallback is sufficient for our small, plain-object game state.
  const clone =
    typeof globalThis.structuredClone === 'function'
      ? (v) => globalThis.structuredClone(v)
      : (v) => JSON.parse(JSON.stringify(v));

  let state = clone(initialState);

  /** @type {Set<(state:any, prev:any, meta:any)=>void>} */
  const subs = new Set();

  function getState() {
    return state;
  }

  function setState(patch, meta = {}) {
    const prev = state;
    const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
    state = next;
    for (const fn of subs) fn(state, prev, meta);
  }

  function subscribe(fn) {
    subs.add(fn);
    return () => subs.delete(fn);
  }

  return { getState, setState, subscribe };
}
