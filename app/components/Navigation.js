import each from 'lodash/each';

import Component from 'classes/Component';

export default class Navigation extends Component {
  constructor() {
    super({ element: '.navigation', elements: { links: '.navigation a' } });

    this.onChange();
  }

  onChange() {
    const url = window.location.pathname;

    each(this.elements.links, (link, index) => {
      const href = link.getAttribute('data-href');

      if (index === 0 || href === null) return;

      if (url.includes(href) || (url === '/' && href === 'home')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}
