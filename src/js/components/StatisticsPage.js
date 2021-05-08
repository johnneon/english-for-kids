import create from '../utils/create';
import * as storage from '../utils/storage';

export default class StatisticsPage {
  constructor() {
    this.table = create({ tagName: 'table', classNames: 'stats__table' });
    this.thead = create({ tagName: 'thead' });
    this.tbody = create({ tagName: 'tbody' });

    this.resetBtn = create({
      tagName: 'button',
      classNames: 'statistick__btn',
      children: 'Reset',
      dataAttr: [['statistic', 'reset']],
    });
    this.trainBtn = create({
      tagName: 'button',
      classNames: 'statistick__btn',
      children: 'Repeat difficult words',
      dataAttr: [['statistic', 'train']],
    });

    this.categoryes = [
      'Categories',
      'Words',
      'Translation',
      'Trained',
      'Correct',
      'Incorrect',
      '%',
    ];
    this.theadTr = create({ tagName: 'tr' });
    this.categoryes.forEach((el, ind) => {
      let category = this.categoryes[ind].toLowerCase();
      if (category === '%') {
        category = 'percent';
      }
      const theadTh = create({
        tagName: 'th',
        classNames: category,
        children: el,
        dataAttr: [['category', category]],
      });
      this.theadTr.append(theadTh);
    });
    this.thead.append(this.theadTr);
    this.table.append(this.thead);

    this.element = create({ tagName: 'div', classNames: 'stats', children: this.table });

    this.isDisplay = false;
    this.isBtnsDisplay = false;
  }

  makeIncorectCollection = () => {
    const worstWords = [];
    this.statsDate.sort((a, b) => (b.miss - a.miss));
    for (let i = 0; i < 8; i += 1) {
      const element = this.statsDate[i];
      if (element.miss > 0) {
        worstWords.push(element.word);
      }
    }
    return worstWords;
  }

  clearStatistics = () => {
    storage.clear();
    this.sortByCategory();
    this.activeSection('categories');
  }

  appendButtons = () => {
    this.isBtnsDisplay = true;
    this.btnContainer = create({ tagName: 'div', classNames: 'btn__container' });
    this.btnContainer.append(this.trainBtn, this.resetBtn);
    return this.btnContainer;
  }

  removeButtons = () => {
    if (this.isBtnsDisplay) {
      this.isBtnsDisplay = false;
      this.isDisplay = false;
      this.btnContainer.parentNode.removeChild(this.btnContainer);
    }
  }

  activeSection = (listItem) => {
    const listItems = [...this.theadTr.children];
    listItems.forEach((element) => {
      element.classList.remove('active');
      if (element.dataset.category === listItem) {
        element.classList.add('active');
      }
    });
  }

  displayData = (data) => {
    this.tbody.innerHTML = '';
    for (let i = 0; i < data.length; i += 1) {
      const tr = create({ tagName: 'tr' });
      const item = data[i];

      Object.keys(item).forEach((el, ind) => {
        const wordItem = item[el].toString();
        let category = this.categoryes[ind].toLowerCase();
        if (category === '%') {
          category = 'percent';
        }
        const td = create({ tagName: 'td', classNames: category, children: wordItem });
        tr.append(td);
      });

      this.tbody.append(tr);
    }
  }

  showStats = (stats) => {
    this.isDisplay = true;
    this.statsDate = [...stats];

    this.sortByCategory();
    this.activeSection('categories');

    this.table.append(this.tbody);
    return this.element;
  }

  remove = () => {
    if (this.isDisplay) {
      this.isDisplay = false;
      this.element.parentNode.removeChild(this.element);
    }
  }

  sortByWord = () => {
    this.statsDate.sort((a, b) => (a.word > b.word ? 1 : -1));
    this.displayData(this.statsDate);
  }

  sortByTranslation = () => {
    this.statsDate.sort((a, b) => (a.translation > b.translation ? 1 : -1));
    this.displayData(this.statsDate);
  }

  sortByCategory = () => {
    this.statsDate.sort((a, b) => (a.category > b.category ? 1 : -1));
    this.displayData(this.statsDate);
  }

  sortByTrain = () => {
    this.statsDate.sort((a, b) => (b.train - a.train));
    this.displayData(this.statsDate);
  }

  sortByHits = () => {
    this.statsDate.sort((a, b) => (b.hit - a.hit));
    this.displayData(this.statsDate);
  }

  sortByMiss = () => {
    this.statsDate.sort((a, b) => (b.miss - a.miss));
    this.displayData(this.statsDate);
  }

  sortByPercent = () => {
    this.statsDate.sort((a, b) => (b.percent - a.percent));
    this.displayData(this.statsDate);
  }
}
