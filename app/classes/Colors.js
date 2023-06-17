import { gsap } from 'gsap';
import { CustomEase } from 'gsap/all';

gsap.registerPlugin(CustomEase);

CustomEase.create('color-ease', '0, 0.5, 0.5, 1');

class Colors {
  constructor() {}

  change({ background, color }) {
    document.documentElement.style.setProperty('--main-bg-color', background);
    document.documentElement.style.setProperty('--main-text-color', color);
  }
}

export const ColorsManager = new Colors();
