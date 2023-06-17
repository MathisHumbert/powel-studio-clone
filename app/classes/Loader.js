import imagesLoaded from 'imagesloaded';
import * as THREE from 'three';
import map from 'lodash/map';

export class Loader {
  constructor() {
    this.loadedTextureUrl = [];
    window.TEXTURES = {};

    this.textureLoader = new THREE.TextureLoader();
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
