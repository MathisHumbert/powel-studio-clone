import { each } from 'lodash';
import * as THREE from 'three';

import Media from '../Gallery/Media';
import Logo from '../Gallery/Logo';

export default class M13 {
  constructor({ scene, viewport, screen, geometry }) {
    this.scene = scene;
    this.viewport = viewport;
    this.screen = screen;
    this.geometry = geometry;

    this.mediaListElements = document.querySelectorAll('.m13__project__list');
    this.logoElement = document.querySelector('.m13__header svg');
    this.headerElement = document.querySelector('.m13__header');

    this.allowParallax = this.screen.width > 992;

    this.createGallery();
    this.createLogo();

    this.onResize({ viewport, screen });

    this.show();
  }

  /**
   * Create.
   */
  createGallery() {
    this.medias = [];

    this.groups = [];

    each(this.mediaListElements, (list) => {
      const group = new THREE.Group();

      this.groups.push(group);

      const mediaElements = list.querySelectorAll('.m13__project__media');

      each(mediaElements, (element, index) => {
        const media = new Media({
          element,
          index,
          scene: group,
          viewport: this.viewport,
          screen: this.screen,
          geometry: this.geometry,
        });

        this.medias.push(media);
      });

      this.scene.add(group);
    });
  }

  createLogo() {
    this.logo = new Logo({
      element: this.logoElement,
      headerElement: this.headerElement,
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

    if (this.logo && this.logo.show) {
      this.logo.show();
    }
  }

  hide() {
    each(this.medias, (media) => {
      if (media && media.hide) {
        media.hide();
      }
    });

    if (this.logo && this.logo.hide) {
      this.logo.hide();
    }
  }

  /**
   * Events.
   */
  onResize({ viewport, screen }) {
    this.viewport = viewport;
    this.screen = screen;

    this.allowParallax = this.screen.width > 992;

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

    if (this.logo && this.logo.update) {
      this.logo.update({ scroll, velocity });
    }

    if (this.allowParallax) {
      each(this.groups, (group, index) => {
        const updatedScroll =
          (scroll / this.screen.height) * this.viewport.height;

        if (index === 0 || index === 2) {
          group.position.y = -updatedScroll * 0.082;
        }
      });
    }
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
