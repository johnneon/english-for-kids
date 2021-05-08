import create from '../utils/create';

export default class MenuCard {
  constructor(object) {
    this.category = object.categoryName;
    this.image = object.image;
    const side = (sideName) => {
      const sideWrap = create({ tagName: 'div', classNames: `card__${sideName}` });

      const cardImage = create({ tagName: 'img', dataAttr: [['src', object.image]] });
      const cardImageWrap = create({ tagName: 'div', classNames: 'card__image', children: cardImage });
      sideWrap.append(cardImageWrap);

      this.frontFooter = create({
        tagName: 'div',
        classNames: 'card__footer',
        children: create({ tagName: 'h4', classNames: 'card__word', children: object.categoryName }),
        parent: sideWrap,
      });

      return sideWrap;
    };

    const cardInner = create({
      tagName: 'div',
      classNames: 'card__inner',
      children: side('front'),
    });

    this.element = create({
      tagName: 'div',
      classNames: 'card',
      children: cardInner,
      dataAttr: [['category', object.categoryName]],
    });
  }
}
