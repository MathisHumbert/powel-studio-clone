import Page from 'classes/Page';
import { gsap } from 'gsap';

export default class Studio extends Page {
  constructor() {
    super({
      id: 'studio',
      element: '.studio',
      elements: {
        wrapper: '.studio__wrapper',
      },
    });
  }

  createAnimations() {
    // create animations

    super.createAnimations();
  }
}
