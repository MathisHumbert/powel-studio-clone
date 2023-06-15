import Page from 'classes/Page';

import { each } from 'lodash';
import Prefix from 'prefix';

export default class M13 extends Page {
  constructor() {
    super({
      id: 'm13',
      element: '.m13',
      elements: {
        wrapper: '.m13__wrapper',
        scroll: '.m13__header h1',
        mediaList: '.m13__project__list',
      },
    });

    this.transformPrefix = Prefix('transform');
  }

  update(scroll) {
    each(this.elements.mediaList, (element, index) => {
      if (index === 0 || index === 2) {
        element.style[this.transformPrefix] = `translateY(${
          scroll.current * 0.082
        }px)`;
      }
    });

    super.update();
  }
}
