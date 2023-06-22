import SplitType from 'split-type';
import { gsap } from 'gsap';

import Animation from 'classes/Animation';

export default class Title extends Animation {
  constructor({ element, elements, index }) {
    super({ element, elements });
    this.index = index;

    this.splitElement = new SplitType(element, {
      types: 'lines',
    });

    this.isAnimated = false;
  }

  animateIn() {
    if (this.isAnimated) return;

    gsap.fromTo(
      this.splitElement.lines,
      { yPercent: 100, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        stagger: 0.075,
        ease: 'custom-ease',
        delay: this.index * 0.35,
        onComplete: () => (this.isAnimated = true),
      }
    );
  }

  onResize() {
    this.splitElement.split();
  }
}
