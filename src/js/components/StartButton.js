import create from '../utils/create';

export default class StartButton {
  constructor() {
    this.startButton = create({
      tagName: 'button',
      classNames: 'game__button',
      children: 'Start game!',
      dataAttr: [['game', 'start']],
    });
    this.isDisplay = false;
  }

  append = () => {
    this.isDisplay = true;
    return this.startButton;
  };

  remove = () => {
    if (this.isDisplay) {
      this.isDisplay = false;
      this.startButton.parentNode.removeChild(this.startButton);
    }
  }

  changeState = (isGameMode) => {
    const repeat = create({ tagName: 'img', dataAttr: [['src', 'images/repeat.svg']] });
    if (isGameMode) {
      this.startButton.innerHTML = '';
      this.startButton.append(repeat);
      this.startButton.dataset.game = 'repeat';
      this.startButton.classList.add('repeat');
    } else {
      this.startButton.innerHTML = '';
      this.startButton.innerHTML = 'Start game!';
      this.startButton.dataset.game = 'start';
      this.startButton.classList.remove('repeat');
    }
  }
}
