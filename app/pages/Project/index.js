import Page from 'classes/Page';
import { gsap } from 'gsap';

export default class Project extends Page {
  constructor() {
    super({
      id: 'project',
      element: '.project',
      elements: {
        wrapper: '.project__wrapper',
        scroll: '.project__content__wrapper',
      },
    });
  }

  createAnimations() {
    // gsap.to(document.body, {
    //   color: this.element.getAttribute('data-color'),
    //   backgroundColor: this.element.getAttribute('data-background'),
    // });

    super.createAnimations();
  }
}
