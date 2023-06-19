import SplitType from 'split-type';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/all';

import Animation from 'classes/Animation';

gsap.registerPlugin(CustomEase);

CustomEase.create('title-ease', '0, 0.5, 0.5, 1');

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
        ease: 'title-ease',
        delay: this.index * 0.35 + 0.1,
        onComplete: () => (this.isAnimated = true),
      }
    );
  }

  onResize() {
    this.splitElement.split();
  }
}
