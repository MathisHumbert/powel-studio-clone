import { each, map } from 'lodash';
import * as THREE from 'three';

import Media from './Media';
import Logo from './Logo';
export default class Home {
  constructor({ scene, viewport, screen, geometry }) {
    this.scene = scene;
    this.viewport = viewport;
    this.screen = screen;
    this.geometry = geometry;

    this.mediasElements = document.querySelectorAll('.home__project__media');
    this.logoElement = document.querySelector('.home__header svg');

    // create group for each and add different transform to it

    // this.createGallery();
    this.createLogo();
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
      });
    });
  }

  createLogo() {
    this.logo = new Logo({
      element: this.logoElement,
      scene: this.scene,
      viewport: this.viewport,
      screen: this.screen,
      geometry: this.geometry,
    });
  }

  /**
   * Animations.
   */
  show() {
    each(this.medias, (media) => {
      if (media && media.show) {
        media.show();
      }
    });
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

    if (this.logo && this.logo.onResize) {
      this.logo.onResize({ viewport, screen });
    }
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