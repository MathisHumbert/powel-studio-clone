import * as THREE from 'three';

import vertex from 'shaders/plane-vertex.glsl';
import fragment from 'shaders/plane-fragment.glsl';

export default class Media {
  constructor({
    element,
    index,
    textures,
    scene,
    geometry,
    screen,
    viewport,
    scroll,
  }) {
    this.element = element;
    this.index = index;
    this.textures = textures;
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;
    this.scroll = scroll;

    this.img = this.element.querySelector('img');

    this.texture = textures[this.index];

    this.createMesh();
    this.createBounds();
  }

  createMesh() {
    this.material = new THREE.RawShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        uTexture: { value: this.texture },
        uImageSizes: {
          value: new THREE.Vector2(
            this.img.naturalWidth,
            this.img.naturalHeight
          ),
        },
        uPlaneSizes: { value: new THREE.Vector2(0, 0) },
      },
    });

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
    this.updateY();

    this.material.uniforms.uPlaneSizes.value = new THREE.Vector2(
      this.mesh.scale.x,
      this.mesh.scale.y
    );
  }

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

  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;

    this.createBounds();
  }

  onScroll({ scroll }) {
    this.scroll = scroll;

    this.updateY(scroll);
  }

  update() {}
}
