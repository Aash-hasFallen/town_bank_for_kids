/**
 * Minimal scene router.
 * Scenes are pure renderers: (ctx) => void
 */

export function createRouter({ root }) {
  /** @type {Map<string, any>} */
  const scenes = new Map();
  let current = null;

  function register(id, scene) {
    scenes.set(id, scene);
  }

  function go(id, ctx) {
    const scene = scenes.get(id);
    if (!scene) throw new Error(`Unknown scene: ${id}`);

    root.innerHTML = '';
    current = id;
    scene.render({ ...ctx, sceneId: id });
  }

  function currentScene() {
    return current;
  }

  return { register, go, currentScene };
}
