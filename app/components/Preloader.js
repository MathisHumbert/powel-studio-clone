import imagesLoaded from 'imagesloaded';
import * as THREE from 'three';
import map from 'lodash/map';

import Component from 'classes/Component';
import { gsap } from 'gsap';

export default class Preloader extends Component {
  constructor() {
    super({
      element: '.preloader',
      elements: {
        layer: '.preloader__layer',
        title: '.preloader__title',
        number: '.preloader__number',
        circle: '.preloader__logo__circle',
      },
    });

    this.loadedTextureUrl = [];
    window.TEXTURES = {};

    this.textureLoader = new THREE.TextureLoader();
  }

  preload(content, onLoaded) {
    const images = content.querySelectorAll('img');

    this.loadedTextureUrl.push(window.location.pathname);

    const loadImages = new Promise((resolve) => {
      imagesLoaded(content, resolve);
    });

    const loadTextures = Promise.all(
      map(images, (image) => {
        return new Promise((res) => {
          const src = image.getAttribute('src');
          this.textureLoader.load(src, (texture) => {
            window.TEXTURES[src] = texture;

            res();
          });
        });
      })
    );

    Promise.all([loadImages, loadTextures]).then(() => {
      gsap.set(this.element, { autoAlpha: 0 });
      onLoaded();

      // const tl = gsap.timeline({
      //   onStart: () => {
      //     this.elements.number.innerText = `0%`;
      //   },
      // });

      // tl.to(this.elements.layer, { scaleY: 0, duration: 3, ease: 'linear' })
      //   .to(
      //     this.elements.number,
      //     {
      //       innerText: 100,
      //       duration: 3,
      //       ease: 'linear',
      //       modifiers: {
      //         innerText: function (innerText) {
      //           return gsap.utils.snap(1, innerText).toString() + '%';
      //         },
      //       },
      //     },
      //     0
      //   )
      //   .set(
      //     [this.elements.title, this.elements.number],
      //     { color: '#fff' },
      //     1.5
      //   )
      //   .set(
      //     this.elements.circle,
      //     {
      //       borderColor: '#fff #fff transparent transparent',
      //     },
      //     1.5
      //   )
      //   .to(this.element, { autoAlpha: 0, duration: 0.5 }, '+=0.1')
      //   .call(() => onLoaded(), null, '+=0.1');
    });
  }

  load(content, onLoaded) {
    const images = content.querySelectorAll('img');

    if (!this.loadedTextureUrl.includes(window.location.pathname)) {
      this.loadedTextureUrl.push(window.location.pathname);

      const loadTextures = Promise.all(
        map(images, (image) => {
          return new Promise((res) => {
            const src = image.getAttribute('src');
            this.textureLoader.load(src, (texture) => {
              window.TEXTURES[src] = texture;

              res();
            });
          });
        })
      );

      const loadImages = new Promise((resolve) => {
        imagesLoaded(content, resolve);
      });

      Promise.all([loadImages, loadTextures]).then(() => {
        onLoaded();
      });
    } else {
      const imgLoaded = imagesLoaded(content);

      imgLoaded.on('done', () => {
        onLoaded();
      });
    }
  }
}
