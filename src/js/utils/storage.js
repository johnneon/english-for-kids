export function set(name, value) {
  window.localStorage.setItem(name, JSON.stringify(value));
}

export function get(name, subst = null) {
  return JSON.parse(window.localStorage.getItem(name) || subst);
}

export function del(name) {
  window.localStorage.removeItem(name);
}

export function writeStats(obj) {
  const substr = obj.subst || null;
  const { word, toDo } = obj;
  if (window.localStorage.getItem(word)) {
    const wordDate = JSON.parse(window.localStorage.getItem(word) || substr);
    if (toDo === 'hit') {
      wordDate.hit += 1;
    } else if (toDo === 'miss') {
      wordDate.miss += 1;
    } else if (toDo === 'train') {
      wordDate.train += 1;
    }
    window.localStorage.setItem(wordDate.word, JSON.stringify(wordDate));
  } else {
    const newWord = {
      word: obj.word,
      hit: 0,
      miss: 0,
      train: 0,
      percent: 0,
    };
    if (toDo === 'hit') {
      newWord.hit += 1;
    } else if (toDo === 'miss') {
      newWord.miss += 1;
    } else if (toDo === 'train') {
      newWord.train += 1;
    }
    window.localStorage.setItem(newWord.word, JSON.stringify(newWord));
  }
}

export function clear() {
  window.localStorage.clear();
}
