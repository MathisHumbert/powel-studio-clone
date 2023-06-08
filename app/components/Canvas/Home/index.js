import { each, map } from 'lodash';

import Media from './Media';

export default class Home {
  constructor({ gl, scene, viewport, screen, geometry }) {
    this.gl = gl;
    this.scene = scene;
    this.viewport = viewport;
    this.screen = screen;
    this.geometry = geometry;

    this.mediasElements = document.querySelectorAll('.home__project__media');

    this.createGallery();
    this.show();
    this.onResize({ viewport, screen });
  }

  createGallery() {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        index,
        gl: this.gl,
        scene: this.scene,
        viewport: this.viewport,
        screen: this.screen,
        geometry: this.geometry,
      });
    });
  }

  /**
   * Animations.
   */
  show() {}

  hide() {}

  /**
   * Events.
   */
  onResize({ viewport, screen }) {
    each(this.medias, (media) => {
      if (media && media.onResize) {
        media.onResize({ viewport, screen });
      }
    });
  }

  /**
   * Loop.
   */
  update(scroll) {
    each(this.medias, (media) => {
      if (media && media.update) {
        media.update(scroll);
      }
    });
  }

  /**
   * Destroy.
   */
  destroy() {
    this.scene.removeChild(this.group);
  }
}
