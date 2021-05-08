import create from '../utils/create';

import Card from './Card';
import MenuCard from './MenuCard';

export default class Grid {
  constructor() {
    this.element = create({
      tagName: 'section',
      classNames: 'cards__grid',
      children: '',
      dataAttr: [['state', 'mainpage']],
    });
    this.title = create({ tagName: 'h2', classNames: 'cards__category main__title' });
    this.supContainer = create({ tagName: 'div', classNames: 'sup__container' });
    this.subContainer = create({ tagName: 'div', classNames: 'sub__container' });

    this.cards = [];
  }

  removeListeners = () => {
    if (this.cards?.remove) {
      this.cards.forEach((el) => el.remove());
    }
  }

  showMenu = (elements) => {
    if (!Array.isArray(elements) && elements.length < 1) {
      throw new Error('The argument must not be an empty array!');
    }

    this.title.innerHTML = 'Main page';
    this.element.before(this.supContainer);
    this.supContainer.append(this.title);

    this.element.style.display = 'flex';
    this.element.innerHTML = '';
    this.removeListeners();
    this.cards = [];
    this.element.dataset.state = 'mainpage';

    elements.forEach((el) => {
      const card = new MenuCard(el);

      this.cards.push(card);
      this.element.append(card.element);
    });
    this.element.after(this.subContainer);
  }

  appendItems = (elements) => {
    if (!Array.isArray(elements) || elements.length === 0) {
      throw new Error('The argument must not be an empty array!');
    }
    this.element.style.display = 'flex';
    this.element.innerHTML = '';
    this.removeListeners();
    this.cards = [];
    this.element.dataset.state = elements[0].category;

    this.title.innerHTML = elements[0].category;

    elements.forEach((el) => {
      const card = new Card(el);

      this.cards.push(card);
      this.element.append(card.element);
    });
  }

  hide = () => {
    this.element.style.display = 'none';
  }
}
