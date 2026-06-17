"use strict";

class ThemesDB {
  static getPossibleThemes() {
    return ['nature', 'nightclub'];
  }

  static getTheme(name) {
    switch(name) {
      case 'nature': return new Theme('nature', [], []);
      case 'nightclub': return new Theme('nightclub', [], []);
      default:
        return new Theme('default', [], []);
    }
  }
}

class Theme {
  constructor(name, backgrounds, fonts) {
    this.state = Vue.reactive({
      name: name,
      backgrounds: backgrounds,
      fonts: fonts,
    });

    const s = this.state;
    const t = this;

    function addComputed(name, func) {
      s[name] = Vue.computed(func);
      Object.defineProperty(t, name, {
        get() { return s[name]; },
      });
    }
  }

  randomlyGenerate(seedDate) {
    const rng = new DeterministicRandom(seedDate);
    console.log("random numbers:")
    console.log(rng.next());
    console.log(rng.next());
    console.log(rng.next());
  }
}

class DeterministicRandom {
  constructor(seed) {
    // seed can be any type
    
    // Initialise by first hashing the seed and then running the RNG a few times
    // See: https://stackoverflow.com/a/47593316
    const rngSeed = cyrb53(seed + "");
    this.rng = splitmix32(rngSeed);
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
  splitmix32(state) {
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
  cyrb53(str, seed = 0) {
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
