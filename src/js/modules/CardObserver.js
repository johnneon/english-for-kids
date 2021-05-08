import * as storage from '../utils/storage';

export default class CardObserver {
  constructor(cards) {
    if (Array.isArray(cards)) {
      this.cards = cards;
    } else {
      throw new Error('Argument have to be array!');
    }
  }

  getCardsByWords = (words) => {
    const result = [];
    words.forEach((word) => {
      const card = this.cards.filter((el) => el.word === word);
      result.push(card);
    });
    return result.flat();
  }

  getCategory = (category) => this.cards.filter((el) => el.category === category);

  getCategoryGroups = () => [...new Set(this.cards.map((card) => card.category))];

  getMainPageGroup = () => this.cards.filter((el) => el.categoryName);

  getCardsStats = () => {
    const cards = this.cards.filter((card) => card.category);
    const result = [];
    cards.forEach((el) => {
      const { word, category, translation } = el;
      const newObj = {};
      newObj.category = category;
      newObj.word = word;
      newObj.translation = translation;

      const storageItem = storage.get(word);
      if (storageItem) {
        newObj.train = storageItem.train;
        newObj.hit = storageItem.hit;
        newObj.miss = storageItem.miss;
      } else {
        newObj.train = 0;
        newObj.hit = 0;
        newObj.miss = 0;
      }
      const percent = 100 / (newObj.miss + newObj.hit);
      newObj.percent = ((newObj.hit * percent) || 0).toFixed(0);
      result.push(newObj);
    });

    return result;
  }
}
