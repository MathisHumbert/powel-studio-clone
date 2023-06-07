import { gsap } from 'gsap';
import each from 'lodash/each';
import Prefix from 'prefix';
import normalizeWheel from 'normalize-wheel';

// import DetectionManager from './Detection';
export default class Page {
  constructor({ element, elements, id, isScrollable = true }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
    };
    this.id = id;
    this.isScrollable = isScrollable;

    this.scroll = {
      position: 0,
      current: 0,
      target: 0,
      limit: 0,
      ease: 0.1,
    };
    this.isDown = false;

    this.transformPrefix = Prefix('transform');
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    this.scroll = {
      position: 0,
      current: 0,
      target: 0,
      limit: 0,
      ease: 0.1,
    };

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });

    this.createAnimations();
    this.createPreloader();
  }

  createAnimations() {
    // create reusable animations
  }

  createPreloader() {
    // load images
  }

  /**
   * Animations.
   */
  show() {
    this.isVisible = true;

    return new Promise((res) => {
      const tl = gsap.timeline();

      tl.fromTo(this.element, { autoAlpha: 0 }, { autoAlpha: 1 }).call(() =>
        res()
      );
    });
  }

  hide() {
    this.isVisible = false;

    return new Promise((res) => {
      gsap.to(this.element, { autoAlpha: 0, onComplete: () => res() });
    });
  }

  /**
   * Events.
   */
  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerWidth;
    }
  }

  // onTouchDown(event) {
  //   if (!DetectionManager.isDesktop()) return;

  //   this.isDown = true;

  //   this.scroll.position = this.scroll.current;
  //   this.start = event.touches ? event.touches[0].clientY : event.clientY;
  // }

  // onTouchMove(event) {
  //   if (!DetectionManager.isDesktop() && !this.isDown) return;

  //   const y = event.touches ? event.touches[0].clientY : event.clientY;
  //   const distance = this.start - y;

  //   this.scroll.target = this.scroll.position + distance;
  // }

  // onTouchUp() {
  //   if (!DetectionManager.isDesktop()) return;

  //   this.isDown = false;
  // }

  onWheel(event) {
    const { pixelY } = normalizeWheel(event);

    this.scroll.target += pixelY;
  }

  /**
   * Loop.
   */
  update() {
    this.scroll.target = gsap.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    );

    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    this.scroll.current = Math.floor(this.scroll.current);

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }

    if (this.elements.wrapper) {
      this.elements.wrapper.style[
        this.transformPrefix
      ] = `translateY(-${this.scroll.current}px)`;
    }

    this.scroll.last = this.scroll.current;
  }
}
