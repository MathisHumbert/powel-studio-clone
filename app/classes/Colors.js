import { gsap } from 'gsap';
import { CustomEase } from 'gsap/all';

gsap.registerPlugin(CustomEase);

CustomEase.create('color-ease', '0, 0.5, 0.5, 1');

class Colors {
  constructor() {}

  change({ backgroundColor, color }) {
    document.documentElement.style.setProperty(
      '--main-bg-color',
      backgroundColor
    );
    document.documentElement.style.setProperty('--main-text-color', color);
  }
}

export const ColorsManager = new Colors();
