class RandomUtils {
  static getDeterministicHash(string) {
    return RandomUtils.cyrb53(string);
  }

  static getDeterministicRNG(seed) {
    return new DeterministicRandom(seed);
  }

  // returns a number inclusive of min and max, based on the provided random-number-generator (RNG)
  static randomInt(rng, min, max) {
    return Math.floor(rng.next() * (max + 1 - min) + min);
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

class DeterministicRandom {
  constructor(seed) {
    // seed can be any type
    
    // Initialise by first hashing the seed and then running the RNG a few times
    // See: https://stackoverflow.com/a/47593316
    const rngSeed = RandomUtils.cyrb53(seed + "");
    this.rng = RandomUtils.splitmix32(rngSeed);
    for (let i = 0; i < 10; i++) this.rng();
  }

  next() {
    return this.rng();
  }
}
