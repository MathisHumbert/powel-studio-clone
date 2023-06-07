import Home from './pages/Home';
import Project from './pages/Project';

class App {
  constructor() {
    this.createContent();

    this.createPages();
    this.createPreloader();

    this.addEventsListeners();

    this.update();
  }

  createPreloader() {
    // create Preloader
    this.onPreloaded();
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
    this.page.create();
  }

  /**
   * Events.
   */
  onPreloaded() {
    this.onResize();

    this.page.show();
  }

  onPopState() {}

  onChange() {}

  onResize() {
    if (this.page) {
      this.page.onResize();
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
  }

  /**
   * Listeners.
   */
  addEventsListeners() {
    window.addEventListener('resize', this.onResize.bind(this));

    window.addEventListener('mousedown', this.onTouchDown.bind(this));
    window.addEventListener('mousemove', this.onTouchMove.bind(this));
    window.addEventListener('mouseup', this.onTouchUp.bind(this));

    window.addEventListener('touchstart', this.onTouchDown.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));
    window.addEventListener('touchend', this.onTouchUp.bind(this));

    window.addEventListener('wheel', this.onWheel.bind(this));
  }
}

new App();
