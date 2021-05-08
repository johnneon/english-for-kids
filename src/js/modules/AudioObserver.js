import create from '../utils/create';

export default class AudioObserver {
  constructor() {
    this.audios = {};

    this.correct = create({ tagName: 'audio', dataAttr: [['src', 'audio/correct.mp3']] });
    this.error = create({ tagName: 'audio', dataAttr: [['src', 'audio/error.mp3']] });
    this.success = create({ tagName: 'audio', dataAttr: [['src', 'audio/success.mp3']] });
    this.lose = create({ tagName: 'audio', dataAttr: [['src', 'audio/youlose.mp3']] });
  }

  makePlayList = (audiosObjecs) => {
    this.audios = audiosObjecs;
  }

  shaffleAudios = () => {
    const audios = Object.entries(this.audios);
    this.gameAudios = audios.sort(() => 0.5 - Math.random());
  }

  play = (target) => {
    this.audios[target].play();
  }
}
