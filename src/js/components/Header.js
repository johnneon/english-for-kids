import create from '../utils/create';

export default class Header {
  constructor() {
    this.element = create({ tagName: 'header', classNames: 'header' });
    this.inner = create({ tagName: 'div', classNames: 'header__inner' });
    this.burger = create({ tagName: 'button', classNames: 'burger', children: '<span></span>' });
    this.switcher = create({ tagName: 'div', classNames: 'switcher' });
    this.checkbox = create({ tagName: 'input', parent: this.switcher, dataAttr: [['type', 'checkbox'], ['id', 'mode']] });
    this.label = create({
      tagName: 'label',
      children: 'Train',
      parent: this.switcher,
      dataAttr: [['for', 'mode']],
    });

    const title = create({
      tagName: 'h1',
      classNames: 'header__title',
      children: 'RSS English for kids',
    });

    this.inner.append(this.burger, title, this.switcher);
    this.element.append(this.inner);
  }

  switcherText= (isPlayMode) => {
    if (isPlayMode) {
      this.label.innerText = 'Play';
    } else {
      this.label.innerText = 'Train';
    }
  }

  burgerToggle = () => this.burger.classList.toggle('active');

  burgerActive = () => this.burger.classList.add('active');

  burgerDisable = () => this.burger.classList.remove('active');
}
