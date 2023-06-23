import { gsap } from 'gsap';

import Page from 'classes/Page';

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

  show({ oldTemplate }) {
    if (
      oldTemplate === 'home' &&
      window.location.pathname.includes('project')
    ) {
      const tl = gsap.timeline({ delay: 2 });

      tl.fromTo(
        this.element,
        { autoAlpha: 0, duration: 0 },
        {
          autoAlpha: 1,
        }
      );

      super.show({ animation: tl });
    } else {
      super.show({});
    }
  }

  onResize() {
    if (window.innerWidth > 768 && this.elements.scroll === null) {
      this.elements.scroll = document.querySelector(
        '.project__content__wrapper'
      );
    } else if (window.innerWidth < 768 && this.elements.scroll !== null) {
      this.elements.scroll = null;
    }

    super.onResize();
  }
}
