import * as THREE from 'three';

import Home from './Home';
import Project from './Project';

export default class Canvas {
  constructor({ template }) {
    this.template = template;

    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createGeometry();

    this.onResize();
  }

  /**
   * THREE.
   */
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

  /**
   * Home.
   */
  createHome() {
    this.home = new Home({
      scene: this.scene,
      viewport: this.viewport,
      screen: this.screen,
      geometry: this.geometry,
    });
  }

  destroyHome() {
    if (!this.home) return;

    this.home.destroy();
    this.home = null;
  }

  /**
   * Project.
   */
  createProject() {
    this.project = new Project({
      scene: this.scene,
      viewport: this.viewport,
      screen: this.screen,
      geometry: this.geometry,
    });
  }

  destroyProject() {
    if (!this.project) return;

    this.project.destroy();
    this.project = null;
  }

  /**
   * Events.
   */
  onPreloaded() {
    this.onChangeEnd(this.template);
  }

  onLoaded(template) {
    this.onChangeEnd(template);
  }

  onChangeStart() {
    if (this.home) {
      this.home.hide();
    }

    if (this.project) {
      this.project.hide();
    }
  }

  onChangeEnd(template) {
    if (template === 'home') {
      if (this.home) {
        this.destroyHome();
      }

      this.createHome();
    } else if (this.home) {
      this.destroyHome();
    }

    if (template === 'project') {
      if (this.project) {
        this.destroyProject();
      }

      this.createProject();
    } else if (this.project) {
      this.destroyProject();
    }
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

    if (this.home && this.home.onResize) {
      this.home.onResize({ viewport: this.viewport, screen: this.screen });
    }

    if (this.project && this.project.onResize) {
      this.project.onResize({ viewport: this.viewport, screen: this.screen });
    }
  }

  /**
   * Loop.
   */
  update({ scroll, velocity }) {
    if (this.home && this.home.update) {
      this.home.update({ scroll, velocity });
    }

    if (this.project && this.project.update) {
      this.project.update({ scroll, velocity });
    }

    this.renderer.render(this.scene, this.camera);
  }
}
