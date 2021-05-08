import create from '../utils/create';
import rssLogo from '../../images/rs_school_js.svg';

export default class Footer {
  constructor() {
    this.element = create({ tagName: 'footer', classNames: 'footer' });
    this.inner = create({ tagName: 'div', classNames: 'footer__inner' });
    const footerElements = {
      gitLink: create({
        tagName: 'a',
        classNames: 'footer__author',
        children: 'johnneon',
        dataAttr: [['href', 'https://github.com/johnneon']],
      }),
      copy: create({ tagName: 'span', classNames: 'footer__copy', children: '&copy; 2020' }),
      rssLogo: create({
        tagName: 'a',
        classNames: 'rss__logo',
        children: create({
          tagName: 'img',
          classNames: 'rss__logo-img',
          dataAttr: [['src', rssLogo]],
        }),
        dataAttr: [['href', 'https://rs.school/js/']],
      }),
    };
    Object.values(footerElements).forEach((element) => {
      this.inner.append(element);
    });
    this.element.append(this.inner);
  }
}
