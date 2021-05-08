import create from '../utils/create';

export default class Card {
  constructor(object) {
    this.category = object.category;
    this.word = object.word;
    this.translation = object.translation;
    this.image = object.image;
    this.audioSrc = object.audioSrc;

    this.isTrainMode = true;

    const side = (sideName) => {
      const sideWrap = create({ tagName: 'div', classNames: `card__${sideName}` });
      const rotateImg = create({ tagName: 'img', dataAttr: [['src', 'images/rotate.svg']] });
      const rotateButton = create({ tagName: 'button', classNames: 'card__rotate-btn', children: rotateImg });

      const cardImage = create({ tagName: 'img', dataAttr: [['src', object.image]] });
      const cardImageWrap = create({ tagName: 'div', classNames: 'card__image', children: cardImage });
      sideWrap.append(cardImageWrap);

      if (sideName.match(/back/)) {
        this.backFooter = create({
          tagName: 'div',
          classNames: 'card__footer',
          children: create({ tagName: 'h4', classNames: 'card__word', children: object.translation }),
          parent: sideWrap,
        });
      } else {
        this.frontFooter = create({
          tagName: 'div',
          classNames: 'card__footer',
          children: [create({ tagName: 'h4', classNames: 'card__word', children: object.word }), rotateButton],
          parent: sideWrap,
        });
      }

      return sideWrap;
    };

    const cardInner = create({
      tagName: 'div',
      classNames: 'card__inner',
      children: [side('front'), side('back')],
    });

    this.element = create({
      tagName: 'div',
      classNames: 'card',
      children: cardInner,
      dataAttr: [['word', object.word]],
    });

    this.audio = create({ tagName: 'audio', dataAttr: [['src', object.audioSrc]] });
    this.rotate = () => this.element.classList.remove('rotate');
    this.element.addEventListener('mouseleave', this.rotate);
  }

  remove = () => this.element.removeEventListener('mouseleave', this.rotate);

  rotateTo = () => this.element.classList.add('rotate')

  rotateBack = () => this.element.classList.remove('rotate')

  toTrainMode = () => {
    this.element.classList.remove('play__mode');
    this.isTrainMode = true;
    this.frontFooter.style.display = 'block';
  }

  toPlayMode = () => {
    this.element.classList.add('play__mode');
    this.isTrainMode = false;
    this.frontFooter.style.display = 'none';
  }

  answered = () => {
    this.done = true;
    this.element.classList.add('done');
  }

  removeAnswered = () => {
    this.element.classList.remove('done');
  }
}
