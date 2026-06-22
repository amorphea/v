"use strict";

class ThemesDB {
  static #themeLog = [
    ThemesDB.#logEntry('2026-01-01', 'nature', null, ['Life Savers', 'https://fonts.googleapis.com/css2?family=Life+Savers:wght@400;700;800&display=swap']),
    ThemesDB.#logEntry('2026-01-01', 'nature', null, ['Mystery Quest', 'https://fonts.googleapis.com/css2?family=Mystery+Quest&display=swap" rel="stylesheet']),
    ThemesDB.#logEntry('2026-01-01', 'nature', null, ['Bubblegum Sans', 'https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet" rel="stylesheet']),
    ThemesDB.#logEntry('2026-01-01', 'nature', null, ['Felipa', 'https://fonts.googleapis.com/css2?family=Felipa&display=swap" rel="stylesheet']),
    ThemesDB.#logEntry('2026-01-01', 'nature', null, ['Underdog', 'https://fonts.googleapis.com/css2?family=Underdog&display=swap" rel="stylesheet']),
    ThemesDB.#logEntry('2026-01-01', 'nature', null, ['Cabin Sketch', 'https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&display=swap" rel="stylesheet']),
    ThemesDB.#logEntry('2026-01-01', 'nature', null, ['Fredericka the Great', 'https://fonts.googleapis.com/css2?family=Fredericka+the+Great&display=swap" rel="stylesheet']),
    ThemesDB.#logEntry('2026-01-01', 'nightclub', null, ['Limelight', 'https://fonts.googleapis.com/css2?family=Limelight&display=swap']),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-001 amorphea-2026 CC-BY-SA-4.0 1080.jpg', 'color: white; text-shadow: 0 0.2cqw 2cqw hsl(0deg 0% 0% / 0.2), 0 0.4cqw 4cqw hsl(0deg 0% 0% / 0.3), 0 2cqw 8cqw hsl(0deg 0% 0% / 0.3);'], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-002 amorphea-2019 CC-BY-SA-4.0 1080.jpg', ''], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-003 amorphea-2019 CC-BY-SA-4.0 1080.jpg', 'color: white; text-shadow: rgb(0 0 0 / 1) 0px 0.2cqw 2cqw, rgb(116 79 0 / 50%) 0px 0.4cqw 4cqw, rgb(116 79 0 / 0.8) 0px 2cqw 8cqw'], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-004 amorphea-2019 CC-BY-SA-4.0 1080.jpg', ''], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-005 amorphea-2019 CC-BY-SA-4.0 1080.jpg', ''], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-006 amorphea-2020 CC-BY-SA-4.0 1080.jpg', ''], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-007 amorphea-2020 CC-BY-SA-4.0 1080.jpg', ''], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-008 amorphea-2023 CC-BY-SA-4.0 1080.jpg', ''], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-009 amorphea-2023 CC-BY-SA-4.0 1080.jpg', ''], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-010 amorphea-2023 CC-BY-SA-4.0 1080.jpg', ''], null),
    ThemesDB.#logEntry('2026-01-01', 'nightclub', ['https://picsum.photos/id/117/1000', ''], null),
  ];

  static #possibleThemes = null;

  static #logEntry(date, name, image, font) {
    return { date, name, image: image ? { url: image[0], textStyling: image[1] } : null, font: font ? { name: font[0], url: font[1] } : null };
  }
  
  static getPossibleThemes() {
    // get all distinct theme names. See https://stackoverflow.com/a/33121880
    return ThemesDB.#possibleThemes || (ThemesDB.#possibleThemes = [...new Set(ThemesDB.#themeLog.map(x => x.name))]);
  }

  static getTheme(name) {
    const themeInfo = ThemesDB.#themeLog.filter(x => x.name === name);
    const fontLogs = themeInfo.filter(x => x.font);
    const imageLogs = themeInfo.filter(x => x.image);
    return new Theme(name, imageLogs, fontLogs);
  }
}

class Theme {
  constructor(name, imageLogs, fontLogs) {
    this.name = name;
    this.imageLogs = imageLogs;
    this.fontLogs = fontLogs;
  }

  chooseAppearance(seedDate) {
    if (!/\d\d\d\d-\d\d-\d\d/.test(seedDate)) return null;
    
    const rng = new DeterministicRandom(seedDate);
    
    const images = this.imageLogs?.filter(x => new Date(x.date) <= new Date(seedDate));
    const fonts = this.fontLogs?.filter(x => new Date(x.date) <= new Date(seedDate));
    
    const imageLog = images[Theme.#randomInt(rng, 0, images.length - 1)];
    const fontLog = fonts[Theme.#randomInt(rng, 0, fonts.length - 1)];
    
    return { image: imageLog.image, font: fontLog.font };
  }

  static #randomInt(rng, min, max) { // returns a number inclusive of min and max
    return Math.floor(rng.next() * (max + 1 - min) + min);
  }
}

class DeterministicRandom {
  constructor(seed) {
    // seed can be any type
    
    // Initialise by first hashing the seed and then running the RNG a few times
    // See: https://stackoverflow.com/a/47593316
    const rngSeed = DeterministicRandom.cyrb53(seed + "");
    this.rng = DeterministicRandom.splitmix32(rngSeed);
    for (let i = 0; i < 10; i++) this.rng();
  }

  next() {
    return this.rng();
  }

  /* SplitMix32 psuedo-random number generator
   * License: Public Domain
   * Authors: Sebastiano Vigna (vigna@acm.org), tommyettinger, bryc, et al
   * See: https://xorshift.di.unimi.it/splitmix64.c
   * See: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
   * See: https://github.com/bryc/code/blob/master/jshash/PRNGs.md
   */
  static splitmix32(state) {
    return function() {
      state |= 0;
      state = state + 0x9e3779b9 | 0;
      let t = state ^ state >>> 16;
      t = Math.imul(t, 0x21f0aaad);
      t = t ^ t >>> 15;
      t = Math.imul(t, 0x735a2d97);
      return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
    }
  }
  
  /* cyrb53 (c) 2018 bryc (github.com/bryc)
   * License: Public domain (or MIT if needed). Attribution appreciated.
   * A fast and simple 53-bit string hash function with decent collision resistance.
   * Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
   */
  static cyrb53(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };
}
