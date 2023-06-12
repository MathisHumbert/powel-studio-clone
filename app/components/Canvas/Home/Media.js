import * as THREE from 'three';
import { gsap } from 'gsap';

import vertex from 'shaders/gallery-vertex.glsl';
import fragment from 'shaders/gallery-fragment.glsl';

export default class Media {
  constructor({ element, index, scene, viewport, screen, geometry }) {
    this.element = element;
    this.index = index;
    this.scene = scene;
    this.viewport = viewport;
    this.screen = screen;
    this.geometry = geometry;

    this.scroll = 0;

    this.createTexture();
    this.createMaterial();
    this.createMesh();
    this.onMouseEnter();
    this.onMouseLeave();
  }

  /**
   * Create.
   */
  createTexture() {
    this.imageElement = this.element.querySelector('img');

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(this.imageElement.getAttribute('src'), (texture) => {
      this.material.uniforms.uTexture.value = texture;
    });
  }

  createMaterial() {
    this.material = new THREE.RawShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        uTexture: { value: null },
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
    const rect = this.element.getBoundingClientRect();

    this.bounds = {
      left: rect.left,
      top: rect.top + this.scroll,
      width: rect.width,
      height: rect.height,
    };

    this.updateScale();
    this.updateX();
    this.updateY(this.scroll);

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
  }

  onMouseEnter() {
    this.element.addEventListener('mouseenter', () => {
      gsap.to(this.material.uniforms.uHover, { value: 1 });
    });
  }

  onMouseLeave() {
    this.element.addEventListener('mouseleave', () => {
      console.log;
      gsap.to(this.material.uniforms.uHover, { value: 0 });
    });
  }

  /**
   * Loop.
   */
  update({ scroll, velocity }) {
    this.scroll = scroll;

    this.material.uniforms.uVelocity.value = velocity;

    this.updateY(scroll);
  }
}
