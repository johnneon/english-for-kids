export default class GameHelper {
  cardsChangeMode = (cards, isPlay) => {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      throw new Error('Invalid dataset!');
    } else if (!isPlay) {
      cards.forEach((element) => {
        if (element.toTrainMode) {
          element.toTrainMode();
        }
      });
    } else if (isPlay) {
      cards.forEach((element) => {
        if (element.toPlayMode) {
          element.toPlayMode();
        }
      });
    }
  }
}
