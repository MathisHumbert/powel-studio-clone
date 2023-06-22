import { gsap } from 'gsap';

class Colors {
  constructor() {}

  change({ background, color }) {
    gsap.to(document.documentElement, {
      color,
      background,
      duration: 0.6,
      ease: 'custom-ease',
    });
  }
}

export const ColorsManager = new Colors();
