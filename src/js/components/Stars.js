import create from '../utils/create';

export default class Stars {
  constructor() {
    this.element = create({ tagName: 'div', classNames: 'stars' });
    this.isDisplay = false;
  }

  append = () => {
    this.isDisplay = true;
    return this.element;
  }

  plusStar = () => {
    const star = create({
      tagName: 'img',
      classNames: 'empty__star',
      dataAttr: [['src', './images/star-win.svg']],
    });
    this.element.append(star);
  }

  plusEmptyStar = () => {
    const star = create({
      tagName: 'img',
      classNames: 'empty__star',
      dataAttr: [['src', './images/star.svg']],
    });
    this.element.append(star);
  }

  remove = () => {
    if (this.isDisplay) {
      this.isDisplay = false;
      this.element.innerHTML = '';
      this.element.parentNode.removeChild(this.element);
    }
  }
}
