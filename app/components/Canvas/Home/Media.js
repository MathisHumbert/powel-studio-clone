import { Program, Mesh, Texture } from 'ogl';

import * as THREE from 'three';

import vertex from 'shaders/plane-vertex.glsl';
import fragment from 'shaders/plane-fragment.glsl';

export default class Media {
  constructor({ element, index, gl, scene, viewport, screen, geometry }) {
    this.element = element;
    this.index = index;
    this.gl = gl;
    this.scene = scene;
    this.viewport = viewport;
    this.screen = screen;
    this.geometry = geometry;

    this.scroll = 0;

    this.createTexture();
    this.createProgram();
    this.createMesh();
  }

  createTexture() {
    // this.texture = new Texture(this.gl);

    // this.imageElement = this.element.querySelector('img');

    // this.image = new Image();
    // this.image.crossOrigin = 'anonymous';
    // this.image.src = this.imageElement.getAttribute('src');

    // this.image.onload = () => {
    //   this.texture.image = this.image;
    //   this.program.uniforms.uImageSizes = [
    //     this.image.naturalWidth,
    //     this.image.naturalHeight,
    //   ];
    // };

    this.imageElement = this.element.querySelector('img');

    const textureLoader = new THREE.TextureLoader();
    this.texture = textureLoader.load(
      this.imageElement.getAttribute('src'),
      (texture) => {
        this.material.uniforms.uTexture.value = texture;
      }
    );
  }

  createProgram() {
    // this.program = new Program(this.gl, {
    //   vertex,
    //   fragment,
    //   uniforms: {
    //     tMap: {
    //       value: this.texture,
    //     },
    //     uPlaneSizes: { value: [0, 0] },
    //     uImageSizes: {
    //       value: [0, 0],
    //     },
    //   },
    //   transparent: true,
    // });

    this.material = new THREE.RawShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTexture: { value: this.texture },
        uPlaneSizes: { value: new THREE.Vector2(0, 0) },
        uImageSizes: {
          value: new THREE.Vector2(
            this.imageElement.naturalWidth,
            this.imageElement.naturalHeight
          ),
        },
      },
      transparent: true,
    });
  }

  createMesh() {
    // this.mesh = new Mesh(this.gl, {
    //   geometry: this.geometry,
    //   program: this.program,
    // });

    // this.mesh.setParent(this.scene);

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  createBounds() {
    const elementBounds = this.element.getBoundingClientRect();

    this.bounds = {
      width: elementBounds.width,
      height: elementBounds.height,
      left: elementBounds.left,
      top: elementBounds.top + this.scroll,
    };

    this.updateScale();
    this.updateX();
    this.updateY();

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
      this.viewport.width * (this.bounds.width / this.screen.width);
    this.mesh.scale.y =
      this.viewport.height * (this.bounds.height / this.screen.height);
  }

  updateX() {
    this.mesh.position.x =
      -this.viewport.width / 2 +
      this.mesh.scale.x / 2 +
      (this.bounds.left / this.screen.width) * this.viewport.width;
  }

  updateY() {
    this.mesh.position.y =
      this.viewport.height / 2 -
      this.mesh.scale.y / 2 -
      ((this.bounds.top - this.scroll) / this.screen.height) *
        this.viewport.height;
  }

  /**
   * Events.
   */
  onResize({ viewport, screen }) {
    this.viewport = viewport;
    this.screen = screen;

    this.createBounds();
  }

  /**
   * Loop.
   */
  update(scroll) {
    this.scroll = scroll.current;

    this.updateY();
  }
}
