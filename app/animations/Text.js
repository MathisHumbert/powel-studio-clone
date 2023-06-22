import { gsap } from 'gsap';

import Animation from 'classes/Animation';
export default class Text extends Animation {
  constructor({ element, elements, playOnce }) {
    super({ element, elements });

    this.playOnce = playOnce;

    this.isAnimated = false;
  }

  animateIn() {
    if (this.isAnimated) return;

    gsap.fromTo(
      this.elements.text,
      { yPercent: 100, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        ease: 'custom-ease',
        duration: 0.6,
        delay: 0.05,
        onComplete: () => {
          if (this.playOnce) {
            this.isAnimated = true;
          }
        },
      }
    );
  }

  animateOut() {
    if (this.isAnimated) return;

    gsap.set(this.elements.text, { autoAlpha: 0, yPercent: 100 });
  }
}
