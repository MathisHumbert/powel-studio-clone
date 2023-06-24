import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { each, map } from 'lodash';
import Prefix from 'prefix';
import normalizeWheel from 'normalize-wheel';

import { ColorsManager } from 'classes/Colors';
import detection from 'classes/Detection';
import Title from 'animations/Title';
import Text from 'animations/Text';
import InnerTitle from 'animations/InnerTitle';

export default class Page {
  constructor({ element, elements, id, isScrollable = true }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsTitles: '[data-animation="title"]',
      animationsContainers: '[data-animation="container"]',
      animationsInnerTitles: '[data-animation="inner-title"]',
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
    this.isVisible = false;

    this.transformPrefix = Prefix('transform');

    this.isDesktop = detection.checkIsDesktop();
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    ColorsManager.change({
      background: this.element.getAttribute('data-background'),
      color: this.element.getAttribute('data-color'),
    });

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
  }

  createAnimations() {
    this.animations = [];

    this.animationsTitles = map(
      this.elements.animationsTitles,
      (element, index) => {
        return new Title({ element, index });
      }
    );

    this.animationsInnerTitles = map(
      this.elements.animationsInnerTitles,
      (element, index) => {
        return new InnerTitle({ element, index });
      }
    );

    each(this.elements.animationsContainers, (element, index) => {
      return new Text({
        element: element,
        elements: {
          text: element.querySelectorAll('[data-animation="text"]'),
        },
        playOnce: index === 0,
      });
    });

    this.animations.push(
      ...this.animationsTitles,
      ...this.animationsInnerTitles
    );
  }

  /**
   * Animations.
   */
  show({ animation }) {
    this.createAnimations();

    if (animation) {
      this.animationIn = animation;
    } else {
      this.animationIn = gsap.timeline();

      this.animationIn.fromTo(
        this.element,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.6, ease: 'custom-ease' }
      );
    }

    this.animationIn.call(() => {
      this.isVisible = true;
    });
  }

  hide() {
    this.isVisible = false;

    return new Promise((res) => {
      gsap.to(this.element, {
        autoAlpha: 0,
        duration: 0.6,
        ease: 'custom-ease',
        onComplete: () => res(),
      });
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
      each(this.animations, (animation) => {
        if (animation && animation.onResize) {
          animation.onResize();
        }
      });
    }
  }

  onTouchDown(event) {
    if (this.isDesktop || !this.isVisible) return;

    this.isDown = true;

    this.scroll.position = this.scroll.current;
    this.start = event.touches ? event.touches[0].clientY : event.clientY;
  }

  onTouchMove(event) {
    if (this.isDesktop || !this.isDown || !this.isVisible) return;

    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const distance = this.start - y;

    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    if (this.isDesktop || !this.isVisible) return;

    this.isDown = false;
  }

  onWheel(event) {
    if (!this.isVisible) return;

    const { pixelY } = normalizeWheel(event);

    this.scroll.target += pixelY;
  }

  /**
   * Loop.
   */
  update() {
    if (!this.isVisible) return;

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
