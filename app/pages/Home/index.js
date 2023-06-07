import Page from '../../classes/Page';

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
        header: '.home__header',
        articles: '.home__project__item',
      },
    });
  }
}
