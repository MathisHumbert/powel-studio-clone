import * as THREE from 'three';
import { gsap } from 'gsap';

import vertex from 'shaders/logo-vertex.glsl';
import fragment from 'shaders/logo-fragment.glsl';

export default class Logo {
  constructor({ element, headerElement, scene, viewport, screen, geometry }) {
    this.element = element;
    this.headerElement = headerElement;
    this.scene = scene;
    this.viewport = viewport;
    this.screen = screen;
    this.geometry = geometry;

    this.mouse = new THREE.Vector2(0, 0);

    this.createTexture();
    this.createMaterial();
    this.createMesh();

    this.onMouseMove();
    this.onMouseEnter();
    this.onMouseLeave();
  }

  /**
   * Create.
   */
  createTexture() {
    const textureLoader = new THREE.TextureLoader();

    const src = this.element.getAttribute('data-src');

    textureLoader.load(src, (texture) => {
      this.material.uniforms.uTexture.value = texture;
    });
  }

  createMaterial() {
    this.material = new THREE.RawShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        uTexture: { value: null },
        uMouse: { value: this.mouse },
        uAlpha: { value: 0 },
        uRes: {
          value: new THREE.Vector2(this.screen.width, this.screen.height),
        },
        uHover: { value: 0 },
      },
    });
  }

  createMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
    this.mesh.position.z += this.mesh.position.z - 0.01;
  }

  createBounds() {
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
    this.updateY();
  }

  /**
   * Update.
   */
  updateScale() {
    this.mesh.scale.x =
      (this.viewport.width * this.bounds.width) / this.screen.width;
    this.mesh.scale.y =
      (this.viewport.height * this.bounds.height) / this.screen.height;
  }

  updateX(x = 0) {
    this.mesh.position.x =
      -(this.viewport.width / 2) +
      this.mesh.scale.x / 2 +
      ((this.bounds.left - x) / this.screen.width) * this.viewport.width;
  }

  updateY(y = 0) {
    this.mesh.position.y =
      this.viewport.height / 2 -
      this.mesh.scale.y / 2 -
      ((this.bounds.top - y) / this.screen.height) * this.viewport.height;
  }

  /**
   * Animations.
   */
  show() {
    gsap.fromTo(this.material.uniforms.uAlpha, { value: 0 }, { value: 1 });
  }

  hide() {
    gsap.to(this.material.uniforms.uAlpha, { value: 0 });
  }

  /**
   * Events.
   */
  onResize({ viewport, screen }) {
    this.viewport = viewport;
    this.screen = screen;

    this.createBounds();

    this.material.uniforms.uRes.value = new THREE.Vector2(
      this.screen.width,
      this.screen.height
    );
  }

  onMouseMove() {
    this.headerElement.addEventListener('mousemove', (event) => {
      gsap.to(this.mouse, {
        x: (event.clientX / this.screen.width) * 2 - 1,
        y: -(event.clientY / this.screen.height) * 2 + 1,
      });
    });
  }

  onMouseEnter() {
    this.headerElement.addEventListener('mouseenter', () => {
      gsap.to(this.material.uniforms.uHover, { value: 1 });
    });
  }

  onMouseLeave() {
    this.headerElement.addEventListener('mouseleave', () => {
      gsap.to(this.material.uniforms.uHover, { value: 0 });
    });
  }

  /**
   * Loop.
   */
  update({ scroll }) {
    this.updateY(scroll);
  }
}
