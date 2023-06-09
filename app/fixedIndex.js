import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';

import Media from './Media';
class App {
  constructor() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createGeometry();
    this.createScroll();
    this.update();

    this.load();
  }

  load() {
    const textureLoader = new THREE.TextureLoader();
    const images = [...document.querySelectorAll('img')];

    Promise.all(
      images.map((img) => {
        return new Promise((res) => {
          textureLoader.load(img.src, (texture) => {
            res(texture);
          });
        });
      })
    ).then((data) => {
      this.textures = data;
      document.querySelector('html').classList.add('loaded');
      this.init();
    });
  }

  init() {
    this.onResize();
    this.createMedias();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.z = 5;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(1);

    document.body.appendChild(this.renderer.domElement);
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 16, 16);
  }

  createScroll() {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on('scroll', (e) => {
      if (this.medias) {
        this.medias.forEach((media) =>
          media.onScroll({
            scroll: e.scroll,
          })
        );
      }
    });

    this.lenis = lenis;
  }

  createMedias() {
    const [...items] = document.querySelectorAll('.home__project__media');

    this.medias = items.map((element, index) => {
      return new Media({
        element,
        index,
        textures: this.textures,
        scene: this.scene,
        geometry: this.geometry,
        screen: this.screen,
        viewport: this.viewport,
        scroll: this.lenis.animatedScroll,
      });
    });
  }

  onResize() {
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.renderer.setSize(this.screen.width, this.screen.height);

    this.camera.aspect = this.screen.width / this.screen.height;
    this.camera.updateProjectionMatrix();

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = { width, height };

    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({
          screen: this.screen,
          viewport: this.viewport,
        })
      );
    }
  }

  update() {
    if (this.medias) {
      for (const media of this.medias) {
        media.update();
      }
    }

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => this.update());
  }
}

new App();
