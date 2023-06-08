import { Renderer, Camera, Transform, Plane } from 'ogl';

import * as THREE from 'three';

import Home from './Home';
import Project from './Project';

export default class Canvas {
  constructor({ template }) {
    this.template = template;

    this.createRender();
    this.createCamera();
    this.createScene();
    this.createGeometry();

    this.onResize();
  }

  /**
   * OGL.
   */
  createRender() {
    // this.renderer = new Renderer({
    //   alpha: true,
    //   antialias: true,
    // });
    // this.gl = this.renderer.gl;
    // document.body.appendChild(this.gl.canvas);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
  }

  createCamera() {
    // this.camera = new Camera(this.gl);
    // this.camera.position.z = 5;
    // this.camera.fov = 45;

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.z = 5;
  }

  createScene() {
    // this.scene = new Transform();
    this.scene = new THREE.Scene();
  }

  createGeometry() {
    // this.geometry = new Plane(this.gl, {
    //   widthSegments: 10,
    //   heightSegments: 10,
    // });

    this.geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
  }

  /**
   * Home.
   */
  createHome() {
    this.home = new Home({
      gl: this.gl,
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
      gl: this.gl,
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
      this.createHome();
    } else if (this.home) {
      this.destroyHome();
    }

    if (template === 'project') {
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

    // this.camera.perspective({
    //   aspect: this.gl.canvas.width / this.gl.canvas.height,
    // });

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
  update(scroll) {
    // this.renderer.render({ scene: this.scene, camera: this.camera });
    this.renderer.render(this.scene, this.camera);

    if (this.home && this.home.update) {
      this.home.update(scroll);
    }

    if (this.project && this.project.update) {
      this.project.update(scroll);
    }
  }
}
