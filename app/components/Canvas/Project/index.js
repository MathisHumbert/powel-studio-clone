export default class Project {
  constructor({ gl, scene, viewport, screen, geometry }) {
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;
    this.geometry = geometry;

    this.show();
    this.onResize({ viewport, screen });
  }

  createGallery() {}

  /**
   * Animations.
   */
  show() {}

  hide() {}

  /**
   * Events.
   */
  onResize({ viewport, screen }) {}

  /**
   * Loop.
   */
  update() {}

  /**
   * Destroy.
   */
  destroy() {
    this.scene.removeChild(this.group);
  }
}
