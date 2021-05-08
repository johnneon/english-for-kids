import create from '../utils/create';

export default class Menu {
  constructor(categoryList) {
    this.element = create({ tagName: 'nav', classNames: 'menu' });
    const list = create({ tagName: 'ul', classNames: 'menu__list' });
    const mainPage = create({
      tagName: 'li',
      classNames: 'list__item',
      children: 'Main page',
      dataAttr: [['category', 'mainpage']],
    });
    list.append(mainPage);

    const statPage = create({
      tagName: 'li',
      classNames: 'list__item',
      children: 'Statistics',
      dataAttr: [['category', 'statistics']],
    });

    categoryList.forEach((el) => {
      const elem = create({
        tagName: 'li',
        classNames: 'list__item',
        children: el.categoryName,
        dataAttr: [['category', el.categoryName]],
      });
      list.append(elem);
    });

    this.element.append(list);
    list.append(statPage);
    this.list = [...list.children];
  }

  close = () => {
    this.element.classList.remove('active');
  }

  toggle = () => {
    this.element.classList.toggle('active');
  }

  addActiveSection = (mainState) => {
    this.list.forEach((el) => {
      el.classList.remove('active');
      if (mainState === el.dataset.category) {
        el.classList.add('active');
      }
    });
  }
}
