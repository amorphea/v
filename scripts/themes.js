// Copyright (C) 2026 amorphea
//
// This file is part of Grevillea.
//
// Grevillea is free software: you can redistribute it and/or modify it under the
// terms of the GNU Affero General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option)
// any later version.
//
// Grevillea is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
// details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Grevillea. If not, see <https://www.gnu.org/licenses/>.

"use strict";

class ThemesDB {
  static #themeLog = [
    ThemesDB.#logEntry('2026-01-01', 'nature', null, ['Life Savers', 'https://fonts.googleapis.com/css2?family=Life+Savers:wght@400;700;800&display=swap']),
    ThemesDB.#logEntry('2026-01-01', 'preview-pride', null, ['Life Savers', 'https://fonts.googleapis.com/css2?family=Life+Savers:wght@400;700;800&display=swap']),
    ThemesDB.#logEntry('2026-01-01', 'nature', null, ['Mystery Quest', 'https://fonts.googleapis.com/css2?family=Mystery+Quest&display=swap" rel="stylesheet']),
    ThemesDB.#logEntry('2026-01-01', 'nature', null, ['Bubblegum Sans', 'https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet" rel="stylesheet']),
    ThemesDB.#logEntry('2026-01-01', 'nature', null, ['Felipa', 'https://fonts.googleapis.com/css2?family=Felipa&display=swap" rel="stylesheet']),
    ThemesDB.#logEntry('2026-01-01', 'nature', null, ['Underdog', 'https://fonts.googleapis.com/css2?family=Underdog&display=swap" rel="stylesheet']),
    ThemesDB.#logEntry('2026-01-01', 'nature', null, ['Cabin Sketch', 'https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&display=swap" rel="stylesheet']),
    ThemesDB.#logEntry('2026-01-01', 'preview-fineline', null, ['Cabin Sketch', 'https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&display=swap" rel="stylesheet']),
    ThemesDB.#logEntry('2026-01-01', 'nature', null, ['Fredericka the Great', 'https://fonts.googleapis.com/css2?family=Fredericka+the+Great&display=swap" rel="stylesheet']),
    ThemesDB.#logEntry('2026-01-01', 'preview-nightclub', null, ['Limelight', 'https://fonts.googleapis.com/css2?family=Limelight&display=swap']),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-001 amorphea-2026 CC-BY-SA-4.0 1080.jpg', 'color: white; --theme-shadow: rgb(0 17 37 / 100%) 0.1cqw 0.2cqw 0.3cqw, rgb(0 46 98 / 60%) 0px 0.2cqw 2cqw;'], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-002 amorphea-2019 CC-BY-SA-4.0 1080.jpg', 'color: white; --theme-shadow: rgb(0 0 0 / 100%) 0.2cqw 0.3cqw 0.5cqw, rgb(0 0 0 / 80%) 0.3cqw 0.4cqw 1cqw, rgb(0 0 0 / 75%) 0px 0.2cqw 2cqw, rgb(0 0 0 / 38%) 0px 0.4cqw 4cqw, rgb(0 0 0 / 60%) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-003 amorphea-2019 CC-BY-SA-4.0 1080.jpg', 'color: white; --theme-shadow: hsl(0deg 0% 0% / 1) 0px 0.2cqw 2cqw, hsl(40deg 100% 25% / 50%) 0px 0.4cqw 4cqw, hsl(40deg 100% 25% / 0.8) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-004 amorphea-2019 CC-BY-SA-4.0 1080.jpg', 'color: white; --theme-shadow: rgb(0 9 45 / 70%) 0.2cqw 0.3cqw 0.5cqw, rgb(0 24 116 / 20%) 0px 0.2cqw 2cqw, rgb(0 34 101 / 30%) 0px 0.4cqw 4cqw, rgb(0 41 85 / 30%) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-005 amorphea-2019 CC-BY-SA-4.0 1080.jpg', 'color: white; --theme-shadow: rgb(0 9 45 / 90%) 0.2cqw 0.3cqw 0.5cqw, rgb(0 34 101 / 70%) 0px 0.4cqw 4cqw'], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-006 amorphea-2020 CC-BY-SA-4.0 1080.jpg', 'color: white; --theme-shadow: rgb(0 0 0 / 80%) 0.2cqw 0.3cqw 0.5cqw, rgb(0 0 0 / 65%) 0px 0.2cqw 2cqw, rgba(0, 0, 0, 0.4) 0px 0.4cqw 4cqw, rgba(0, 0, 0, 0.6) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-007 amorphea-2020 CC-BY-SA-4.0 1080.jpg', 'color: white; --theme-shadow: rgb(0 9 45 / 70%) 0.2cqw 0.3cqw 0.5cqw, rgb(0 24 116 / 20%) 0px 0.2cqw 2cqw, rgb(0 34 101 / 30%) 0px 0.4cqw 4cqw, rgb(0 41 85 / 30%) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-008 amorphea-2023 CC-BY-SA-4.0 1080.jpg', 'color: white; --theme-shadow: rgb(0 43 85 / 60%) 0px 0.2cqw 2cqw, rgb(0 71 190 / 30%) 0px 0.4cqw 4cqw, rgb(0 51 125 / 50%) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-009 amorphea-2023 CC-BY-SA-4.0 1080.jpg', 'color: white; --theme-shadow: rgb(0 28 55 / 60%) 0.1cqw 0.3cqw 0.5cqw, rgb(0 28 55 / 60%) 0px 0.2cqw 2cqw, rgb(0 38 103 / 30%) 0px 0.4cqw 4cqw, rgb(0 53 130 / 50%) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry('2026-01-01', 'nature', ['images/001-010 amorphea-2023 CC-BY-SA-4.0 1080.jpg', 'color: white; --theme-shadow: hsl(0deg 0% 0% / 1) 0.1cqw 0.3cqw 0.1cqw, hsl(0deg 0% 0% / 1) 0px 0.2cqw 2cqw, hsl(40deg 100% 25% / 70%) 0px 0.4cqw 4cqw, hsl(40deg 100% 80% / 0.8) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry('2026-01-01', 'preview-fineline', ['images/001-011 amorphea-2026 CC-BY-SA-4.0 1080.jpg', 'color: black; padding: 10% 18% 12% 18%; --theme-shadow: rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw;'], null),
    ThemesDB.#logEntry('2026-01-01', 'preview-fineline', ['images/001-012 amorphea-2026 CC-BY-SA-4.0 1080.jpg', 'color: black; padding: 12% 12% 12% 12%; --theme-shadow: rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw;'], null),
    ThemesDB.#logEntry('2026-01-01', 'preview-fineline', ['images/001-013 amorphea-2026 CC-BY-SA-4.0 1080.jpg', 'color: black; padding: 14% 23% 40% 23%; --theme-shadow: rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw;'], null),
    ThemesDB.#logEntry('2026-01-01', 'preview-pride', ['images/001-012 amorphea-2026 CC-BY-SA-4.0 1080.jpg', 'color: black; padding: 12% 12% 12% 12%; --theme-shadow: rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw;'], null),
    ThemesDB.#logEntry('2026-01-01', 'preview-nightclub', ['https://picsum.photos/id/117/1000', 'color: white; --theme-shadow: rgb(0 0 0 / 100%) 0.2cqw 0.3cqw 0.5cqw, rgb(0 0 0 / 80%) 0.3cqw 0.4cqw 1cqw, rgb(0 0 0 / 75%) 0px 0.2cqw 2cqw, rgb(0 0 0 / 38%) 0px 0.4cqw 4cqw, rgb(0 0 0 / 60%) 0px 2cqw 8cqw;'], null),
  ];

  static #possibleThemes = null;

  static #logEntry(date, name, image, font) {
    return {
      date,
      name,
      image: image ? { url: image[0], textStyling: image[1] } : null,
      font: font ? { name: font[0], url: font[1] } : null
    };
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
    
    const rng = RandomUtils.getDeterministicRNG(seedDate);
    
    const images = this.imageLogs?.filter(x => new Date(x.date) <= new Date(seedDate));
    const fonts = this.fontLogs?.filter(x => new Date(x.date) <= new Date(seedDate));
    
    const imageLog = images[RandomUtils.randomInt(rng, 0, images.length - 1)];
    const fontLog = fonts[RandomUtils.randomInt(rng, 0, fonts.length - 1)];
    
    return { image: imageLog.image, font: fontLog.font };
  }
}
