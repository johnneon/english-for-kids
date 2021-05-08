import create from './utils/create';
import * as storage from './utils/storage';
import cards from './data/cards';

import Header from './components/Header';
import Menu from './components/Menu';
import Grid from './components/Grid';
import Footer from './components/Footer';
import StartButton from './components/StartButton';
import FinishGameScreen from './components/FinishGameScreen';
import StatisticsPage from './components/StatisticsPage';
import Stars from './components/Stars';

import CardObserver from './modules/CardObserver';
import AudioObserver from './modules/AudioObserver';
import GameHelper from './modules/GameHelper';

export default class App {
  constructor() {
    // Logic
    this.cardObserver = new CardObserver(cards);
    this.audioObserver = new AudioObserver();
    this.GameHelper = new GameHelper();

    // Interface
    this.wrapper = create({ tagName: 'main', classNames: 'app' });
    this.header = new Header();
    this.footer = new Footer();
    this.mainGrid = new Grid();
    this.menu = new Menu(this.cardObserver.getMainPageGroup());
    this.gameButton = new StartButton();
    this.finishScreen = new FinishGameScreen();
    this.statistic = new StatisticsPage();
    this.starBoard = new Stars();

    this.isPlayMode = false;
    this.isGameStarted = false;
  }

  changeCategory = (elementClicked) => {
    this.stopGame();
    this.mainGrid.appendItems(this.cardObserver.getCategory(elementClicked.dataset.category));
    this.menu.addActiveSection(this.mainGrid.element.dataset.state);
    const playList = this.mainGrid.cards.reduce((acc, el) => {
      acc[el.word] = el.audio;
      return acc;
    }, {});
    this.audioObserver.makePlayList(playList);

    this.GameHelper.cardsChangeMode(this.mainGrid.cards, this.isPlayMode);
    this.appendStartGameBtn(this.isPlayMode);
  }

  changeMode = (target) => {
    this.stopGame();

    this.isGameStarted = false;
    this.isPlayMode = target.checked;

    this.GameHelper.cardsChangeMode(this.mainGrid.cards, this.isPlayMode);
    this.appendStartGameBtn(this.isPlayMode);
    this.header.switcherText(this.isPlayMode);

    if (this.isPlayMode) {
      this.gameButton.startButton.addEventListener('click', this.startGameHandler);
    } else {
      this.gameButton.startButton.removeEventListener('click', this.startGameHandler);
    }

    this.gameButton.changeState(this.isGameStarted);
    this.gameButton.startButton.removeEventListener('click', this.repeatHandler);
  }

  startGameHandler = () => {
    this.mainGrid.element.addEventListener('click', this.startGame);
    this.mainGrid.element.removeEventListener('click', this.startTrainHandler);

    this.gameButton.startButton.removeEventListener('click', this.startGameHandler);
    this.gameButton.startButton.addEventListener('click', this.repeatHandler);
    this.gameButton.changeState(this.isPlayMode);

    this.settingsOfGameMode();
  }

  stopGame = () => {
    if (this.isGameStarted) {
      this.isGameStarted = false;
      this.gameButton.changeState(this.isGameStarted);
      this.gameButton.remove();
      this.starBoard.remove();

      this.mainGrid.element.removeEventListener('click', this.startGame);
      this.mainGrid.element.addEventListener('click', this.startTrainHandler);
      this.mainGrid.cards.forEach((el) => el.removeAnswered());

      this.gameButton.startButton.addEventListener('click', this.startGameHandler);
      this.gameButton.startButton.removeEventListener('click', this.repeatHandler);
    }
  }

  settingsOfGameMode = () => {
    this.audioObserver.shaffleAudios();
    const audios = this.audioObserver.gameAudios;
    this.audiosIterator = audios[Symbol.iterator]();
    this.wrongs = 0;

    this.iteratorValue = this.audiosIterator.next();
    this.iteratorValue.value[1].play();
  }

  startGame = (event) => {
    this.isGameStarted = true;
    const { target } = event;
    const card = target.closest('.card');
    const doneCard = target.closest('.done');

    const [name, sound] = this.iteratorValue.value;

    this.mainGrid.subContainer.append(this.starBoard.append());

    if (target === this.gameButton.startButton) {
      setTimeout(() => {
        sound.play();
      }, 500);
    }
    if (card && doneCard) {
      return;
    }
    if (card?.dataset?.word === name) {
      this.rightAnswer(card);
      this.starBoard.plusStar();
    } else if (card && card?.dataset?.word !== name) {
      this.wrongAnswer();
      this.starBoard.plusEmptyStar();
      storage.writeStats({ word: card.dataset.word, toDo: 'miss' });
    }
  }

  repeatHandler = () => {
    this.iteratorValue.value[1].play();
  }

  wrongAnswer = () => {
    this.wrongs += 1;
    this.audioObserver.error.play();
  }

  rightAnswer = (card) => {
    this.iteratorValue = this.audiosIterator.next();
    if (this.iteratorValue.value) {
      const cardObj = this.mainGrid.cards
        .find((el) => el.word === card.dataset.word);

      this.audioObserver.correct.play();
      cardObj.answered();
      const audio = this.iteratorValue.value[1];
      setTimeout(() => {
        audio.play();
      }, 500);
      storage.writeStats({ word: card.dataset.word, toDo: 'hit' });
    } else {
      this.endOfGame();
    }
  }

  endOfGame = () => {
    this.stopGame();
    if (this.wrongs === 0) {
      this.audioObserver.success.play();
      this.mainGrid.element.append(this.finishScreen.showWinScreen());
      setTimeout(() => {
        this.finishScreen.remove();
        this.mainGrid.showMenu(this.cardObserver.getMainPageGroup());
        this.menu.addActiveSection(this.mainGrid.element.dataset.state);
      }, 5000);
    } else {
      this.audioObserver.lose.play();
      this.mainGrid.element.append(this.finishScreen.showLoseScreen(this.wrongs));
      setTimeout(() => {
        this.finishScreen.remove();
        this.mainGrid.showMenu(this.cardObserver.getMainPageGroup());
        this.menu.addActiveSection(this.mainGrid.element.dataset.state);
      }, 5000);
    }
  }

  appendStartGameBtn = (isPlayMode) => {
    if (this.mainGrid.element.dataset.state !== 'mainpage' && isPlayMode) {
      this.mainGrid.subContainer.append(this.gameButton.append());
    } else if (this.gameButton.isDisplay) {
      this.gameButton.remove();
      this.starBoard.remove();
    }
  }

  headerEventHandler = (event) => {
    const { target } = event;

    if (target.closest('.burger')) {
      this.menu.toggle();
      this.header.burgerToggle();
    } else if (target.closest('.switcher')) {
      this.changeMode(target);
    }
  }

  sideMenuHandler = (event) => {
    event.preventDefault();
    const { target } = event;
    const listItem = target.closest('.list__item');
    this.menu.addActiveSection(this.mainGrid.element.dataset.state);
    if (listItem) {
      this.stopGame();
      if (listItem.dataset.category === 'mainpage') {
        this.mainGrid.showMenu(this.cardObserver.getMainPageGroup());
        this.gameButton.remove();
        this.statistic.remove();
        this.statistic.removeButtons();
      } else if (listItem.dataset.category === 'statistics') {
        this.mainGrid.hide();
        this.mainGrid.title.innerHTML = 'Statistics';
        this.mainGrid.element.after(this.statistic.showStats(this.cardObserver.getCardsStats()));
        this.mainGrid.supContainer.append(this.statistic.appendButtons());
        this.menu.addActiveSection(listItem.dataset.category);
      } else {
        this.changeCategory(listItem);
        this.statistic.remove();
        this.statistic.removeButtons();
      }
      this.menu.toggle();
      this.header.burgerDisable();
    }
  }

  startTrainHandler = (event) => {
    const { target } = event;
    const card = target.closest('.card');
    const foreground = target.closest('.card__front');
    const btn = target.closest('.card__rotate-btn');
    if (!card) return;

    if (card?.dataset?.category) {
      this.changeCategory(card);
    }

    if (btn && card?.dataset?.word) {
      const cardObj = this.mainGrid.cards
        .find((el) => el.word === card.dataset.word);
      cardObj.rotateTo();
    } else if (!this.isPlayMode && card?.dataset?.word && foreground && !btn) {
      this.audioObserver.play(card.dataset.word);
      storage.writeStats({ word: card.dataset.word, toDo: 'train' });
    }
  }

  statisticHandler = (event) => {
    const { target } = event;
    const label = target?.dataset?.category;
    if (label === 'categories') {
      this.statistic.sortByCategory();
      this.statistic.activeSection(label);
    } else if (label === 'words') {
      this.statistic.sortByWord();
      this.statistic.activeSection(label);
    } else if (label === 'translation') {
      this.statistic.sortByTranslation();
      this.statistic.activeSection(label);
    } else if (label === 'trained') {
      this.statistic.sortByTrain();
      this.statistic.activeSection(label);
    } else if (label === 'correct') {
      this.statistic.sortByHits();
      this.statistic.activeSection(label);
    } else if (label === 'incorrect') {
      this.statistic.sortByMiss();
      this.statistic.activeSection(label);
    } else if (label === 'percent') {
      this.statistic.sortByPercent();
      this.statistic.activeSection(label);
    }
  }

  appHendler = (event) => {
    const { target } = event;
    if (!target.closest('.burger') && !target.closest('.menu')) {
      this.menu.close();
      this.header.burgerDisable();
    }
  }

  resetHandler = () => {
    this.statistic.clearStatistics();
    this.statistic.showStats(this.cardObserver.getCardsStats());
  }

  trainDifficultWords = () => {
    const worstCollection = this.statistic.makeIncorectCollection();
    const worstCards = this.cardObserver.getCardsByWords(worstCollection);
    if (worstCards.length === 0) {
      return;
    }
    this.statistic.remove();
    this.mainGrid.appendItems(worstCards);
    this.menu.addActiveSection(this.mainGrid.element.dataset.state);
    const playList = this.mainGrid.cards.reduce((acc, el) => {
      acc[el.word] = el.audio;
      return acc;
    }, {});
    this.audioObserver.makePlayList(playList);

    this.GameHelper.cardsChangeMode(this.mainGrid.cards, this.isPlayMode);
    this.appendStartGameBtn(this.isPlayMode);
    this.statistic.removeButtons();
    this.mainGrid.title.innerHTML = 'Repeat difficult words';
  }

  init = (parent) => {
    // Run handlers
    this.header.element.addEventListener('click', this.headerEventHandler);
    this.menu.element.addEventListener('click', this.sideMenuHandler);
    this.mainGrid.element.addEventListener('click', this.startTrainHandler);
    this.statistic.element.addEventListener('click', this.statisticHandler);
    this.wrapper.addEventListener('click', this.appHendler);
    this.statistic.resetBtn.addEventListener('click', this.resetHandler);
    this.statistic.trainBtn.addEventListener('click', this.trainDifficultWords);

    this.wrapper.append(
      this.menu.element,
      this.header.element,
      this.mainGrid.element,
      this.footer.element,
    );

    this.mainGrid.showMenu(this.cardObserver.getMainPageGroup());
    this.menu.addActiveSection(this.mainGrid.element.dataset.state);
    parent.append(this.wrapper);
  }
}
