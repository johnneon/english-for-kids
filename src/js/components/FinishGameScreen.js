import create from '../utils/create';

export default class FinishGameScreen {
  constructor() {
    this.element = create({ tagName: 'div', classNames: 'finish__game' });
    this.imgContainer = create({ tagName: 'div', classNames: 'img_container', parent: this.element });
    this.text = create({ tagName: 'p', classNames: 'finishText' });
    this.isDisplay = false;
  }

  showWinScreen = () => {
    this.isDisplay = true;
    this.element.innerHTML = '';
    const image = create({ tagName: 'img', dataAttr: [['src', 'images/success.jpg']] });
    this.text.innerText = 'You win!';
    this.imgContainer.append(image);
    this.element.append(this.imgContainer, this.text);
    return this.element;
  }

  showLoseScreen = (errors) => {
    this.isDisplay = true;
    if (!errors || typeof errors !== 'number') {
      throw new Error('Invalide number of mistakes');
    }
    this.element.innerHTML = '';
    const image = create({ tagName: 'img', dataAttr: [['src', 'images/failure.jpg']] });
    this.text.innerText = `You lose, you made ${errors} mistakes`;
    this.imgContainer.append(image);
    this.element.append(this.imgContainer, this.text);
    return this.element;
  }

  remove = () => {
    if (this.isDisplay) {
      this.isDisplay = false;
      this.element.parentNode.removeChild(this.element);
    }
  }
}
