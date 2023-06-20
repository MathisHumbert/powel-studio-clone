import SplitType from 'split-type';
import { map, each } from 'lodash';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/all';

import Animation from 'classes/Animation';

gsap.registerPlugin(CustomEase);

CustomEase.create('title-ease', '0, 0.5, 0.5, 1');

export default class InnerTitle extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });

    this.element = element;

    this.splitElementsLines = [];

    this.splitElements = map(elements.title, (element) => {
      const splitElement = new SplitType(element, {
        types: 'lines',
      });

      this.splitElementsLines.push(splitElement.lines);

      return splitElement;
    });

    this.isAnimated = false;
  }

  animateIn() {
    if (this.isAnimated) return;

    gsap.fromTo(
      this.splitElementsLines,
      { yPercent: 100, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        ease: 'title-ease',
        stagger: 0.05,
        delay: 0.5,
        onComplete: () => (this.isAnimated = true),
      }
    );
  }

  onResize() {
    if (this.isAnimated) {
      each(this.splitElements, (element) => element.split());
    }
  }
}
