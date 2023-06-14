import { each, map } from 'lodash';
import imagesLoaded from 'imagesloaded';
import * as THREE from 'three';

import Home from 'pages/Home';
import Project from 'pages/Project';
import Canvas from 'components/Canvas';
class App {
  constructor() {
    this.createContent();

    this.createPages();
    this.createPreloader();
    this.createCanvas();

    this.addEventsListeners();
    this.addLinkListeners();

    this.update();
  }

  createPreloader() {
    // create Preloader
    this.loadedTextureUrl = [window.location.pathname];
    this.textureLoader = new THREE.TextureLoader();

    window.TEXTURES = {};

    const images = this.content.querySelectorAll('img');

    Promise.all(
      map(images, (image) => {
        return new Promise((res) => {
          const src = image.getAttribute('src');
          this.textureLoader.load(src, (texture) => {
            window.TEXTURES[src] = texture;

            res();
          });
        });
      })
    ).then(() => {
      console.log('loaded');
      this.onPreloaded();
    });
  }

  createLoader() {
    if (!this.loadedTextureUrl.includes(window.location.pathname)) {
      this.loadedTextureUrl.push(window.location.pathname);

      const images = this.content.querySelectorAll('img');

      Promise.all(
        map(images, (image) => {
          return new Promise((res) => {
            const src = image.getAttribute('src');
            this.textureLoader.load(src, (texture) => {
              window.TEXTURES[src] = texture;

              res();
            });
          });
        })
      ).then(() => {
        this.onLoaded();
      });
    } else {
      // load textures
      const imgLoaded = imagesLoaded(this.content);

      imgLoaded.on('done', () => {
        console.log('loaded');

        this.onLoaded();
      });
    }
  }

  createCanvas() {
    this.canvas = new Canvas({ template: this.template });
  }

  createContent() {
    this.content = document.querySelector('.content');
    this.template = this.content.getAttribute('data-template');
  }

  createPages() {
    this.pages = {
      home: new Home(),
      project: new Project(),
    };

    this.page = this.pages[this.template];
    this.page.create(true);
  }

  /**
   * Events.
   */
  onPreloaded() {
    this.onResize();

    this.canvas.onPreloaded();

    this.page.show();
  }

  onLoaded() {
    this.onResize();

    this.canvas.onLoaded(this.template);

    this.page.show();
  }

  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  async onChange({ url, push }) {
    this.canvas.onChangeStart();

    await this.page.hide();

    const request = await window.fetch(url);

    if (request.status === 200) {
      const html = await request.text();
      const div = document.createElement('div');

      div.innerHTML = html;

      if (push) {
        window.history.pushState({}, '', url);
      }

      const divContent = div.querySelector('.content');
      this.template = divContent.getAttribute('data-template');

      this.content.innerHTML = divContent.innerHTML;
      this.content.setAttribute('data-template', this.template);

      this.page = this.pages[this.template];

      this.page.create(false);
      this.createLoader();

      this.addLinkListeners();
    } else {
      console.log('error');
    }
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }

    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize();
    }
  }

  onTouchDown(event) {
    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event);
    }
  }

  onTouchMove(event) {
    if (this.page && this.page.onTouchMove) {
      this.page.onTouchMove(event);
    }
  }

  onTouchUp(event) {
    if (this.page && this.page.onTouchUp) {
      this.page.onTouchUp(event);
    }
  }

  onWheel(event) {
    if (this.page && this.page.onWheel) {
      this.page.onWheel(event);
    }
  }

  /**
   * Loop.
   */
  update() {
    if (this.page && this.page.update) {
      this.page.update(this.page.scroll);
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update({
        scroll: this.page.scroll.current,
        velocity: this.page.scroll.velocity,
      });
    }

    window.requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Listeners.
   */
  addEventsListeners() {
    window.addEventListener('resize', this.onResize.bind(this));

    window.addEventListener('popstate', this.onPopState.bind(this));

    window.addEventListener('mousedown', this.onTouchDown.bind(this));
    window.addEventListener('mousemove', this.onTouchMove.bind(this));
    window.addEventListener('mouseup', this.onTouchUp.bind(this));

    window.addEventListener('touchstart', this.onTouchDown.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));
    window.addEventListener('touchend', this.onTouchUp.bind(this));

    window.addEventListener('wheel', this.onWheel.bind(this));
  }

  addLinkListeners() {
    const links = document.querySelectorAll('a');

    each(links, (link) => {
      link.onclick = (e) => {
        e.preventDefault();

        this.onChange({ url: link.href, push: true });
      };
    });
  }
}

new App();
