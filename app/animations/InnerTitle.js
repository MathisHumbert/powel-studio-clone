import SplitType from 'split-type';
import { gsap } from 'gsap';

import Animation from 'classes/Animation';

export default class Title extends Animation {
  constructor({ element, elements, index }) {
    super({ element, elements });
    this.index = index;

    this.splitElement = new SplitType(element, {
      types: 'lines',
      tagName: 'span',
    });

    gsap.set(this.splitElement.lines, { autoAlpha: 0, yPercent: 100 });
  }

  animateIn() {
    if (this.isAnimated) return;

    gsap.to(this.splitElement.lines, {
      yPercent: 0,
      autoAlpha: 1,
      ease: 'custom-ease',
      delay: this.index * 0.05 + 0.2,
      onComplete: () => (this.isAnimated = true),
    });
  }

  onResize() {
    this.splitElement.split();
  }
}
