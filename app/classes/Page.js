import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { each, map } from 'lodash';
import Prefix from 'prefix';
import normalizeWheel from 'normalize-wheel';

import { ColorsManager } from 'classes/Colors';
import Title from 'animations/Title';

gsap.registerPlugin(ScrollTrigger);

export default class Page {
  constructor({ element, elements, id, isScrollable = true }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsTitles: '[data-animation="title"]',
    };
    this.id = id;
    this.isScrollable = isScrollable;

    this.scroll = {
      position: 0,
      current: 0,
      target: 0,
      limit: 0,
      last: 0,
      velocity: 0,
      ease: 0.1,
    };
    this.clamp = gsap.utils.clamp(0, this.scroll.limit);

    this.isDown = false;

    this.transformPrefix = Prefix('transform');

    this.isDesktop = document.body.classList.contains('desktop');
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    this.scroll = {
      position: 0,
      current: 0,
      target: 0,
      limit: 0,
      last: 0,
      velocity: 0,
      ease: 0.05,
    };

    this.clamp = gsap.utils.clamp(0, this.scroll.limit);

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
  }

  createAnimations() {
    this.animations = [];

    this.animationsTitles = map(
      this.elements.animationsTitles,
      (element, index) => {
        return new Title({ element, index });
      }
    );

    this.animations.push(...this.animationsTitles);
  }

  /**
   * Animations.
   */
  show() {
    this.isVisible = true;

    return new Promise((res) => {
      ColorsManager.change({
        background: this.element.getAttribute('data-background'),
        color: this.element.getAttribute('data-color'),
      });

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
    this.scroll = {
      position: 0,
      current: 0,
      target: 0,
      limit: 0,
      last: 0,
      velocity: 0,
      ease: 0.05,
    };

    if (this.elements.wrapper) {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;

      this.clamp = gsap.utils.clamp(0, this.scroll.limit);
    }

    if (this.animations && this.animations.length > 0) {
      each(this.animations, (animation) => animation.onResize());
    }
  }

  onTouchDown(event) {
    if (this.isDesktop) return;

    this.isDown = true;

    this.scroll.position = this.scroll.current;
    this.start = event.touches ? event.touches[0].clientY : event.clientY;
  }

  onTouchMove(event) {
    if (this.isDesktop || !this.isDown) return;

    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const distance = this.start - y;

    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    if (this.isDesktop) return;

    this.isDown = false;
  }

  onWheel(event) {
    const { pixelY } = normalizeWheel(event);

    this.scroll.target += pixelY;
  }

  /**
   * Loop.
   */
  update() {
    this.scroll.target = this.clamp(this.scroll.target);

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

    if (this.elements.scroll) {
      this.elements.scroll.style[
        this.transformPrefix
      ] = `translateY(${this.scroll.current}px)`;
    }

    this.scroll.velocity = (this.scroll.current - this.scroll.last) * 0.05;

    this.scroll.last = this.scroll.current;

    ScrollTrigger.update();
  }
}
