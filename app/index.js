import each from 'lodash/each';
import imagesLoaded from 'imagesloaded';

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
    const imgLoaded = imagesLoaded(this.content);

    imgLoaded.on('done', () => {
      this.onPreloaded();
    });
  }

  createLoader() {
    const imgLoaded = imagesLoaded(this.content);

    imgLoaded.on('done', () => {
      this.onLoaded();
    });
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

      this.canvas.onChangeEnd(this.template);

      this.page = this.pages[this.template];

      this.page.create(false);
      this.createLoader();

      this.addLinkListeners();
    } else {
      console.log('error');
    }
  }

  onResize() {
    if (this.page) {
      this.page.onResize();
    }

    if (this.canvas) {
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
    window.requestAnimationFrame(this.update.bind(this));

    if (this.page && this.page.update) {
      this.page.update();
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.page.scroll);
    }
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
