import * as THREE from 'three';
import { each, map } from 'lodash';

import Media from './Media';

export default class Project {
  constructor({ scene, viewport, screen, geometry, transition }) {
    this.scene = scene;
    this.viewport = viewport;
    this.screen = screen;
    this.geometry = geometry;
    this.transition = transition;

    this.mediasElements = document.querySelectorAll('.project__gallery__media');

    this.createGallery();

    this.onResize({ viewport, screen });

    this.show();
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
      });
    });
  }

  /**
   * Animations.
   */
  show() {
    if (this.transition) {
      this.transition.animate(this.medias[0].mesh, () => {
        each(this.medias, (media) => {
          if (media && media.show) {
            media.show();
          }
        });
      });
    } else {
      each(this.medias, (media) => {
        if (media && media.show) {
          media.show();
        }
      });
    }
  }

  hide() {
    each(this.medias, (media) => {
      if (media && media.hide) {
        media.hide();
      }
    });
  }

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
  update({ scroll, velocity }) {
    each(this.medias, (media) => {
      if (media && media.update) {
        media.update({ scroll, velocity });
      }
    });
  }

  /**
   * Destroy.
   */
  destroy() {
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
