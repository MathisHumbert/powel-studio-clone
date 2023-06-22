import * as THREE from 'three';
import { gsap } from 'gsap';

import vertex from 'shaders/gallery-vertex.glsl';
import fragment from 'shaders/gallery-fragment.glsl';

export default class Media {
  constructor({ element, index, scene, viewport, screen, geometry, onClick }) {
    this.element = element;
    this.index = index;
    this.scene = scene;
    this.viewport = viewport;
    this.screen = screen;
    this.geometry = geometry;
    this.onClick = onClick;

    this.createTexture();
    this.createMaterial();
    this.createMesh();
    this.onMouseEnter();
    this.onMouseLeave();
    this.onMouseClick();
  }

  /**
   * Create.
   */
  createTexture() {
    this.imageElement = this.element.querySelector('img');

    const src = this.imageElement.getAttribute('src');

    this.texture = window.TEXTURES[src];
  }

  createMaterial() {
    this.material = new THREE.RawShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      transparent: true,
      uniforms: {
        uTexture: { value: this.texture },
        uImageSizes: {
          value: new THREE.Vector2(
            this.imageElement.naturalWidth,
            this.imageElement.naturalHeight
          ),
        },
        uPlaneSizes: { value: new THREE.Vector2(0, 0) },
        uVelocity: { value: 0 },
        uHover: { value: 0 },
        uAlpha: { value: 0 },
      },
    });
  }

  createMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  createBounds() {
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
    this.updateY(0);

    this.material.uniforms.uPlaneSizes.value = new THREE.Vector2(
      this.mesh.scale.x,
      this.mesh.scale.y
    );
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
    gsap.fromTo(
      this.material.uniforms.uAlpha,
      { value: 0 },
      { value: 1, duration: 0.6, ease: 'custom-ease' }
    );
  }

  hide() {
    gsap.to(this.material.uniforms.uAlpha, {
      value: 0,
      duration: 0.6,
      ease: 'custom-ease',
    });
  }

  /**
   * Events.
   */
  onResize({ viewport, screen }) {
    this.viewport = viewport;
    this.screen = screen;

    this.createBounds();
  }

  onMouseEnter() {
    this.element.addEventListener('mouseenter', () => {
      gsap.to(this.material.uniforms.uHover, { value: 1 });
    });
  }

  onMouseLeave() {
    this.element.addEventListener('mouseleave', () => {
      gsap.to(this.material.uniforms.uHover, { value: 0 });
    });
  }

  onMouseClick() {
    if (this.onClick !== undefined) {
      this.element.addEventListener('click', () => {
        this.onClick(this);
      });
    }
  }

  /**
   * Loop.
   */
  update({ scroll, velocity }) {
    this.material.uniforms.uVelocity.value = velocity;

    this.updateY(scroll);
  }
}
