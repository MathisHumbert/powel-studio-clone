import SplitType from 'split-type';
import { map, each } from 'lodash';
import { gsap } from 'gsap';

import Animation from 'classes/Animation';
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
        ease: 'custom-ease',
        delay: 0.1,
        stagger: 0.05,
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
