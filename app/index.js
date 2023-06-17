import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import each from 'lodash/each';

import Home from 'pages/Home';
import Project from 'pages/Project';
import M13 from 'pages/M13';
import Canvas from 'components/Canvas';
import { Loader } from './classes/Loader';

gsap.registerPlugin(ScrollTrigger);

class App {
  constructor() {
    this.createContent();

    this.createCanvas();
    this.createPages();
    this.createPreloader();

    this.addEventsListeners();
    this.addLinkListeners();

    this.update();
  }

  /**
   * Create.
   */
  createScrollTrigger() {
    ScrollTrigger.scrollerProxy('#wrapper', {
      scrollTop: (value) => {
        if (arguments.length) {
          this.page.scroll.current = value;
        }
        return this.page.scroll.current;
      },

      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.defaults({ scroller: '#wrapper' });
  }

  createPreloader() {
    // TODO: create Preloader Component

    this.loader = new Loader();

    this.loader.load(this.content, this.onPreloaded.bind(this));
  }

  createLoader() {
    this.loader.load(this.content, this.onLoaded.bind(this));
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
      m13: new M13(),
    };

    this.page = this.pages[this.template];

    this.createScrollTrigger();

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
    ScrollTrigger.getAll().forEach((t) => t.kill());

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

      this.createScrollTrigger();

      this.page = this.pages[this.template];
      this.page.create();

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
