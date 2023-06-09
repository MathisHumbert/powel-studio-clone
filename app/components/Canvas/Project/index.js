import * as THREE from 'three';
import { each, map } from 'lodash';

import Media from 'components/Canvas/Media';
import vertex from 'shaders/plane-vertex.glsl';
import fragment from 'shaders/plane-fragment.glsl';

export default class Project {
  constructor({ scene, viewport, screen, geometry }) {
    this.scene = scene;
    this.viewport = viewport;
    this.screen = screen;
    this.geometry = geometry;

    this.mediasElements = document.querySelectorAll('.project__gallery__media');

    this.createGallery();
    this.show();
    this.onResize({ viewport, screen });
  }

  createGallery() {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        index,
        scene: this.scene,
        viewport: this.viewport,
        screen: this.screen,
        geometry: this.geometry,
        vertex,
        fragment,
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
    console.log('destroy');
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];

          if (value && typeof value.dispose === 'function') {
            value.dispose();
          }
        }
      }
    });

    this.scene.children = [];
  }
}
