import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

import vertex from 'shaders/logo-vertex.glsl';
import fragment from 'shaders/logo-fragment.glsl';

export default class Logo {
  constructor({ element, scene, viewport, screen, geometry }) {
    this.element = element;
    this.scene = scene;
    this.viewport = viewport;
    this.screen = screen;
    this.geometry = geometry;

    this.scroll = 0;

    this.createTexture();
    this.createMaterial();
    this.createMesh();
  }

  /**
   * Create.
   */
  createTexture() {
    // const loader = new SVGLoader();
    // loader.load('tiger.svg', (data) => {
    //   const paths = data.paths;
    //   const group = new THREE.Group();
    //   for (let i = 0; i < paths.length; i++) {
    //     const path = paths[i];
    //     const material = new THREE.MeshBasicMaterial({
    //       color: path.color,
    //       side: THREE.DoubleSide,
    //       depthWrite: false,
    //     });
    //     const shapes = SVGLoader.createShapes(path);
    //     for (let j = 0; j < shapes.length; j++) {
    //       const shape = shapes[j];
    //       const geometry = new THREE.ShapeGeometry(shape);
    //       const mesh = new THREE.Mesh(geometry, material);
    //       group.add(mesh);
    //     }
    //   }
    //   this.scene.add(group);
    //   console.log(this.scene);
    // });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('powell-studio.png', (texture) => {
      this.material.uniforms.uTexture.value = texture;
    });
  }

  createMaterial() {
    this.material = new THREE.RawShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      // wireframe: true,
      uniforms: {
        uTexture: { value: null },
        uImageSizes: {
          value: new THREE.Vector2(0, 0),
        },
        uPlaneSizes: { value: new THREE.Vector2(0, 0) },
        uVelocity: { value: 0 },
        uHover: { value: 0 },
        uAlpha: { value: 1 },
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
    // gsap.fromTo(this.material.uniforms.uAlpha, { value: 0 }, { value: 1 });
  }

  hide() {
    // gsap.to(this.material.uniforms.uAlpha, { value: 0 });
  }

  /**
   * Events.
   */
  onResize({ viewport, screen }) {
    this.viewport = viewport;
    this.screen = screen;

    this.createBounds();
  }
}
