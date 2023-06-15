import { each } from 'lodash';
import Prefix from 'prefix';

import Page from 'classes/Page';

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
        mediaList: '.home__project__list',
      },
    });

    this.transformPrefix = Prefix('transform');
  }

  update(scroll) {
    each(this.elements.mediaList, (element, index) => {
      if (index === 0) {
        element.style[this.transformPrefix] = `translateY(${
          scroll.current * 0.075
        }px)`;
      } else if (index === 1) {
        element.style[this.transformPrefix] = `translateY(${
          scroll.current * 0.15
        }px)`;
      } else {
        element.style[this.transformPrefix] = `translateY(${
          scroll.current * 0.075
        }px)`;
      }
    });

    super.update();
  }
}
