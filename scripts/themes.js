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
    ThemesDB.#logEntry( 1, '2026-01-01', 'nature', null, ['Life Savers', 'https://fonts.googleapis.com/css2?family=Life+Savers:wght@400;700;800&display=swap']),
    ThemesDB.#logEntry( 3, '2026-01-01', 'nature', null, ['Mystery Quest', 'https://fonts.googleapis.com/css2?family=Mystery+Quest&display=swap']),
    ThemesDB.#logEntry( 4, '2026-01-01', 'nature', null, ['Bubblegum Sans', 'https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap']),
    ThemesDB.#logEntry( 5, '2026-01-01', 'nature', null, ['Felipa', 'https://fonts.googleapis.com/css2?family=Felipa&display=swap']),
    ThemesDB.#logEntry( 6, '2026-01-01', 'nature', null, ['Underdog', 'https://fonts.googleapis.com/css2?family=Underdog&display=swap']),
    ThemesDB.#logEntry( 7, '2026-01-01', 'nature', null, ['Cabin Sketch', 'https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&display=swap']),
    ThemesDB.#logEntry( 9, '2026-01-01', 'nature', null, ['Fredericka the Great', 'https://fonts.googleapis.com/css2?family=Fredericka+the+Great&display=swap']),
    ThemesDB.#logEntry(11, '2026-01-01', 'nature', ['images/001-001 amorphea-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; --theme-shadow: rgb(0 17 37 / 100%) 0.1cqw 0.2cqw 0.3cqw, rgb(0 46 98 / 60%) 0px 0.2cqw 2cqw;'], null),
    ThemesDB.#logEntry(12, '2026-01-01', 'nature', ['images/001-002 amorphea-2019 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; --theme-shadow: rgb(0 0 0 / 100%) 0.2cqw 0.3cqw 0.5cqw, rgb(0 0 0 / 80%) 0.3cqw 0.4cqw 1cqw, rgb(0 0 0 / 75%) 0px 0.2cqw 2cqw, rgb(0 0 0 / 38%) 0px 0.4cqw 4cqw, rgb(0 0 0 / 60%) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry(13, '2026-01-01', 'nature', ['images/001-003 amorphea-2019 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; --theme-shadow: hsl(0deg 0% 0% / 1) 0px 0.2cqw 2cqw, hsl(40deg 100% 25% / 50%) 0px 0.4cqw 4cqw, hsl(40deg 100% 25% / 0.8) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry(14, '2026-01-01', 'nature', ['images/001-004 amorphea-2019 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; --theme-shadow: rgb(0 9 45 / 70%) 0.2cqw 0.3cqw 0.5cqw, rgb(0 24 116 / 20%) 0px 0.2cqw 2cqw, rgb(0 34 101 / 30%) 0px 0.4cqw 4cqw, rgb(0 41 85 / 30%) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry(15, '2026-01-01', 'nature', ['images/001-005 amorphea-2019 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; --theme-shadow: rgb(0 9 45 / 90%) 0.2cqw 0.3cqw 0.5cqw, rgb(0 34 101 / 70%) 0px 0.4cqw 4cqw'], null),
    ThemesDB.#logEntry(16, '2026-01-01', 'nature', ['images/001-006 amorphea-2020 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; --theme-shadow: rgb(0 0 0 / 80%) 0.2cqw 0.3cqw 0.5cqw, rgb(0 0 0 / 65%) 0px 0.2cqw 2cqw, rgba(0, 0, 0, 0.4) 0px 0.4cqw 4cqw, rgba(0, 0, 0, 0.6) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry(17, '2026-01-01', 'nature', ['images/001-007 amorphea-2020 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; --theme-shadow: rgb(0 9 45 / 70%) 0.2cqw 0.3cqw 0.5cqw, rgb(0 24 116 / 20%) 0px 0.2cqw 2cqw, rgb(0 34 101 / 30%) 0px 0.4cqw 4cqw, rgb(0 41 85 / 30%) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry(18, '2026-01-01', 'nature', ['images/001-008 amorphea-2023 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; --theme-shadow: rgb(0 43 85 / 60%) 0px 0.2cqw 2cqw, rgb(0 71 190 / 30%) 0px 0.4cqw 4cqw, rgb(0 51 125 / 50%) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry(19, '2026-01-01', 'nature', ['images/001-009 amorphea-2023 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; --theme-shadow: rgb(0 28 55 / 60%) 0.1cqw 0.3cqw 0.5cqw, rgb(0 28 55 / 60%) 0px 0.2cqw 2cqw, rgb(0 38 103 / 30%) 0px 0.4cqw 4cqw, rgb(0 53 130 / 50%) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry(20, '2026-01-01', 'nature', ['images/001-010 amorphea-2023 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; --theme-shadow: hsl(0deg 0% 0% / 1) 0.1cqw 0.3cqw 0.1cqw, hsl(0deg 0% 0% / 1) 0px 0.2cqw 2cqw, hsl(40deg 100% 25% / 70%) 0px 0.4cqw 4cqw, hsl(40deg 100% 80% / 0.8) 0px 2cqw 8cqw;'], null),
    ThemesDB.#logEntry( 8, '2026-01-01', 'preview-pen-sketch', null, ['Cabin Sketch', 'https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&display=swap']),
    ThemesDB.#logEntry(96, '2026-01-01', 'preview-pen-sketch', null, ['Julee', 'https://fonts.googleapis.com/css2?family=Julee&display=swap']),
    ThemesDB.#logEntry(97, '2026-01-01', 'preview-pen-sketch', null, ['Unkempt', 'https://fonts.googleapis.com/css2?family=Unkempt:wght@400;700&display=swap']),
    ThemesDB.#logEntry(98, '2026-01-01', 'preview-pen-sketch', null, ['Handlee', 'https://fonts.googleapis.com/css2?family=Handlee&display=swap']),
    ThemesDB.#logEntry(21, '2026-01-01', 'preview-pen-sketch', ['images/001-011 amorphea-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 12% 15% 12% 15%;'], null),
    ThemesDB.#logEntry(22, '2026-01-01', 'preview-pen-sketch', ['images/001-012 amorphea-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 12% 12% 12% 12%;'], null),
    ThemesDB.#logEntry(23, '2026-01-01', 'preview-pen-sketch', ['images/001-013 amorphea-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 12% 18% 26% 18%;'], null),
    ThemesDB.#logEntry(39, '2026-01-01', 'preview-pen-sketch', ['images/001-021 Cez-2022 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 15% 13% 15% 13%;'], null),
    ThemesDB.#logEntry(51, '2026-01-01', 'preview-pen-sketch', ['images/001-024 Cez-2020 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 15% 13% 15% 13%;'], null),
    ThemesDB.#logEntry(95, '2026-01-01', 'preview-pen-sketch', ['images/001-033 Snail-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 16% 15% 16% 15%;'], null),
    ThemesDB.#logEntry( 2, '2026-01-01', 'preview-pride', null, ['Life Savers', 'https://fonts.googleapis.com/css2?family=Life+Savers:wght@400;700;800&display=swap']),
    ThemesDB.#logEntry(41, '2026-01-01', 'preview-pride', null, ['Metamorphous', 'https://fonts.googleapis.com/css2?family=Metamorphous&display=swap']),
    ThemesDB.#logEntry(42, '2026-01-01', 'preview-pride', null, ['Indie Flower', 'https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap']),
    ThemesDB.#logEntry(48, '2026-01-01', 'preview-pride', null, ['Bilbo Swash Caps', 'https://fonts.googleapis.com/css2?family=Bilbo+Swash+Caps&display=swap']),
    ThemesDB.#logEntry(49, '2026-01-01', 'preview-pride', null, ['Protest Revolution', 'https://fonts.googleapis.com/css2?family=Protest+Revolution&display=swap']),
    ThemesDB.#logEntry(50, '2026-01-01', 'preview-pride', null, ['Limelight', 'https://fonts.googleapis.com/css2?family=Limelight&display=swap']),
    ThemesDB.#logEntry(24, '2026-01-01', 'preview-pride', ['images/001-012 amorphea-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 12% 12% 12% 12%; --theme-shadow: rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw, rgb(255 255 255 / 100%) 0cqw 0cqw 0.5cqw;'], null),
    ThemesDB.#logEntry(40, '2026-01-01', 'preview-pride', ['images/001-022 amorphea-2026 CC-BY-SA-4.0 1080.png', '--theme-color: black; padding: 12% 12% 12% 12%;'], null),
    ThemesDB.#logEntry(51, '2026-01-01', 'preview-pride', ['images/001-023 amorphea-2026 CC-BY-SA-4.0 1080.png', '--theme-color: #e7e7e7; padding: 12% 12% 12% 12%;'], null),
    ThemesDB.#logEntry(26, '2026-01-01', 'countryside', ['images/001-014 amorphea-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 10% 10% 15% 10%;'], null),
    ThemesDB.#logEntry(27, '2026-01-01', 'countryside', ['images/001-015 amorphea-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 7% 5% 28% 5%;'], null),
    ThemesDB.#logEntry(28, '2026-01-01', 'countryside', ['images/001-016 amorphea-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 7% 5% 30% 5%;'], null),
    ThemesDB.#logEntry(34, '2026-01-01', 'countryside', ['images/001-017 amorphea-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; padding: 15% 5% 15% 5%;'], null),
    ThemesDB.#logEntry(35, '2026-01-01', 'countryside', ['images/001-018 amorphea-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 7% 5% 25% 5%;'], null),
    ThemesDB.#logEntry(36, '2026-01-01', 'countryside', ['images/001-020 amorphea-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 7% 5% 28% 5%;'], null),
    ThemesDB.#logEntry(29, '2026-01-01', 'countryside', null, ['Felipa', 'https://fonts.googleapis.com/css2?family=Felipa&display=swap']),
    ThemesDB.#logEntry(30, '2026-01-01', 'countryside', null, ['Cabin Sketch', 'https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&display=swap']),
    ThemesDB.#logEntry(31, '2026-01-01', 'countryside', null, ['Fredericka the Great', 'https://fonts.googleapis.com/css2?family=Fredericka+the+Great&display=swap']),
    ThemesDB.#logEntry(32, '2026-01-01', 'countryside', null, ['Indie Flower', 'https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap']),
    ThemesDB.#logEntry(33, '2026-01-01', 'countryside', null, ['Cormorant', 'https://fonts.googleapis.com/css2?family=Cormorant:wght@300..700&display=swap']),
    ThemesDB.#logEntry(43, '2026-01-01', 'countryside', null, ['Quintessential', 'https://fonts.googleapis.com/css2?family=Quintessential&display=swap']),
    ThemesDB.#logEntry(44, '2026-01-01', 'countryside', null, ['Jim Nightshade', 'https://fonts.googleapis.com/css2?family=Jim+Nightshade&display=swap']),
    ThemesDB.#logEntry(46, '2026-01-01', 'countryside', null, ['Handlee', 'https://fonts.googleapis.com/css2?family=Handlee&display=swap']),
    ThemesDB.#logEntry(37, '2026-01-01', 'preview-seaside', ['images/001-019 amorphea-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 7% 5% 30% 5%;'], null),
    ThemesDB.#logEntry(38, '2026-01-01', 'preview-seaside', null, ['Felipa', 'https://fonts.googleapis.com/css2?family=Felipa&display=swap']),
    ThemesDB.#logEntry(32, '2026-01-01', 'preview-seaside', null, ['Indie Flower', 'https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap']),
    ThemesDB.#logEntry(51, '2026-01-01', 'handmade-paper', ['images/001-025 Noelle~20J~20Gardiner-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: #492611; padding: 8% 8% 8% 8%;'], null),
    ThemesDB.#logEntry(52, '2026-01-01', 'handmade-paper', ['images/001-026 Noelle~20J~20Gardiner-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 8% 8% 8% 8%;'], null),
    ThemesDB.#logEntry(53, '2026-01-01', 'handmade-paper', ['images/001-027 Noelle~20J~20Gardiner-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 8% 8% 8% 8%;'], null),
    ThemesDB.#logEntry(54, '2026-01-01', 'handmade-paper', ['images/001-028 Noelle~20J~20Gardiner-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; padding: 8% 8% 8% 8%;'], null),
    ThemesDB.#logEntry(55, '2026-01-01', 'handmade-paper', ['images/001-029 Noelle~20J~20Gardiner-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; padding: 8% 8% 8% 8%;'], null),
    ThemesDB.#logEntry(56, '2026-01-01', 'handmade-paper', ['images/001-030 Noelle~20J~20Gardiner-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 8% 8% 8% 8%;'], null),
    ThemesDB.#logEntry(57, '2026-01-01', 'handmade-paper', ['images/001-031 Noelle~20J~20Gardiner-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; padding: 8% 8% 8% 8%;'], null),
    ThemesDB.#logEntry(58, '2026-01-01', 'handmade-paper', ['images/001-032 Noelle~20J~20Gardiner-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: #6c3a22; padding: 8% 8% 8% 8%;'], null),
    ThemesDB.#logEntry(59, '2026-01-01', 'handmade-paper', null, ['Indie Flower', 'https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap']),
    ThemesDB.#logEntry(60, '2026-01-01', 'handmade-paper', null, ['Cabin Sketch', 'https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&display=swap']),
    ThemesDB.#logEntry(61, '2026-01-01', 'handmade-paper', null, ['Handlee', 'https://fonts.googleapis.com/css2?family=Handlee&display=swap']),
    ThemesDB.#logEntry(62, '2026-01-01', 'handmade-paper', null, ['Cormorant', 'https://fonts.googleapis.com/css2?family=Cormorant:wght@300..700&display=swap']),
    ThemesDB.#logEntry(63, '2026-01-01', 'handmade-paper', null, ['Jim Nightshade', 'https://fonts.googleapis.com/css2?family=Jim+Nightshade&display=swap']),
    ThemesDB.#logEntry(64, '2026-01-01', 'handmade-paper', null, ['Felipa', 'https://fonts.googleapis.com/css2?family=Felipa&display=swap']),
    ThemesDB.#logEntry(65, '2026-01-01', 'handmade-paper', null, ['Courgette', 'https://fonts.googleapis.com/css2?family=Courgette&display=swap']),
    ThemesDB.#logEntry(66, '2026-01-01', 'handmade-paper', null, ['Cookie', 'https://fonts.googleapis.com/css2?family=Cookie&display=swap']),
    ThemesDB.#logEntry(67, '2026-01-01', 'handmade-paper', null, ['Style Script', 'https://fonts.googleapis.com/css2?family=Style+Script&display=swap']),
    ThemesDB.#logEntry(68, '2026-01-01', 'handmade-paper', null, ['Lobster', 'https://fonts.googleapis.com/css2?family=Lobster&display=swap']),
    ThemesDB.#logEntry(69, '2026-01-01', 'handmade-paper', null, ['Courier Prime', 'https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap']),
    ThemesDB.#logEntry(70, '2026-01-01', 'handmade-paper', null, ['Doto', 'https://fonts.googleapis.com/css2?family=Doto:wght,ROND@900,100&display=swap']),
    ThemesDB.#logEntry(71, '2026-01-01', 'handmade-paper', null, ['Stardos Stencil', 'https://fonts.googleapis.com/css2?family=Stardos+Stencil:wght@400;700&display=swap']),
    ThemesDB.#logEntry(72, '2026-01-01', 'handmade-paper', null, ['PT Serif', 'https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap']),
    ThemesDB.#logEntry(73, '2026-01-01', 'handmade-paper', null, ['Livvic', 'https://fonts.googleapis.com/css2?family=Livvic:ital,wght@0,400;0,700;1,400;1,700&display=swap']),
    ThemesDB.#logEntry(74, '2026-01-01', 'handmade-paper', null, ['Roboto', 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap']),
    ThemesDB.#logEntry(75, '2026-01-01', 'handmade-paper', null, ['Creepster', 'https://fonts.googleapis.com/css2?family=Creepster&display=swap']),
    ThemesDB.#logEntry(76, '2026-01-01', 'preview-snail-comic', ['images/001-033 snail-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 16% 15% 16% 15%;'], null),
    ThemesDB.#logEntry(77, '2026-01-01', 'preview-snail-comic', ['images/001-034 snail-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; padding: 16% 15% 16% 15%;'], null),
    ThemesDB.#logEntry(78, '2026-01-01', 'preview-snail-comic', ['images/001-035 snail-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: #EDE3E9; padding: 18% 18% 18% 18%;'], null),
    ThemesDB.#logEntry(79, '2026-01-01', 'preview-snail-comic', ['images/001-036 snail-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: #336860; padding: 17% 17% 17% 17%;'], null),
    ThemesDB.#logEntry(80, '2026-01-01', 'preview-snail-comic', ['images/001-037 snail-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: black; padding: 20% 19% 20% 19%;'], null),
    ThemesDB.#logEntry(81, '2026-01-01', 'preview-snail-comic', ['images/001-038 snail-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: #5B163C; padding: 17% 18% 17% 18%;'], null),
    ThemesDB.#logEntry(82, '2026-01-01', 'preview-snail-comic', ['images/001-039 snail-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: white; padding: 18% 17% 18% 17%;'], null),
    ThemesDB.#logEntry(83, '2026-01-01', 'preview-snail-comic', ['images/001-040 snail-2026 CC-BY-SA-4.0 1080.jpg', '--theme-color: #5B4E3E; padding: 18% 18% 18% 18%;'], null),
    ThemesDB.#logEntry(84, '2026-01-01', 'preview-snail-comic', null, ['Indie Flower', 'https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap']),
    ThemesDB.#logEntry(85, '2026-01-01', 'preview-snail-comic', null, ['Doto', 'https://fonts.googleapis.com/css2?family=Doto:wght,ROND@900,100&display=swap']),
    ThemesDB.#logEntry(86, '2026-01-01', 'preview-snail-comic', null, ['PT Serif', 'https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap']),
    ThemesDB.#logEntry(87, '2026-01-01', 'preview-snail-comic', null, ['Courier Prime', 'https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap']),
    ThemesDB.#logEntry(88, '2026-01-01', 'preview-snail-comic', null, ['Stardos Stencil', 'https://fonts.googleapis.com/css2?family=Stardos+Stencil:wght@400;700&display=swap']), ////
    ThemesDB.#logEntry(89, '2026-01-01', 'preview-snail-comic', null, ['Mystery Quest', 'https://fonts.googleapis.com/css2?family=Mystery+Quest&display=swap']),
    ThemesDB.#logEntry(90, '2026-01-01', 'preview-snail-comic', null, ['Julee', 'https://fonts.googleapis.com/css2?family=Julee&display=swap']),
    ThemesDB.#logEntry(91, '2026-01-01', 'preview-snail-comic', null, ['Combo', 'https://fonts.googleapis.com/css2?family=Combo&display=swap']),
    ThemesDB.#logEntry(92, '2026-01-01', 'preview-snail-comic', null, ['Piedra', 'https://fonts.googleapis.com/css2?family=Piedra&display=swap']),
    ThemesDB.#logEntry(93, '2026-01-01', 'preview-snail-comic', null, ['Miniver', 'https://fonts.googleapis.com/css2?family=Miniver&display=swap']),
    ThemesDB.#logEntry(94, '2026-01-01', 'preview-snail-comic', null, ['Unkempt', 'https://fonts.googleapis.com/css2?family=Unkempt:wght@400;700&display=swap']),
    // Next number: 99
  ];

  static #possibleThemes = null;

  static #logEntry(num, date, name, image, font) {
    return {
      num: num,
      date: new Date(date),
      name: name,
      image: image ? { url: image[0], textStyling: image[1] } : null,
      font: font ? { name: font[0], url: font[1] } : null
    };
  }
  
  static getPossibleThemes() {
    // get all distinct theme names. See https://stackoverflow.com/a/33121880
    return ThemesDB.#possibleThemes || (ThemesDB.#possibleThemes = [...new Set(ThemesDB.#themeLog.map(x => x.name))].sort());
  }

  static getTheme(name) {
    const themeInfo = ThemesDB.#themeLog.filter(x => x.name === name);
    if (themeInfo.length == 0) return null;
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

  chooseAppearance(bgSeed, fontSeed) {
    if ($grevillea_version.value === 0) {
      return this.chooseAppearance_v0(bgSeed);
    }
    
    if (!/\d\d\d\d-\d\d-\d\d/.test(bgSeed)) return null;
    if (!ValidationUtils.isNumber(fontSeed)) return null;
    
    // This function is called both when the initial user selects a seed, and when a new
    // user opens the same event link with a predetermined seed. The same background and
    // font are produced deterministically in either case. The process is designed to be
    // user-friendly when an initial user selects a seed.
    //
    // The background and font are chosen in 3 steps:
    //
    // 1) First, the user chooses a seed date (bgSeed). This determines which
    //    log entries are active -- only the backgrounds added before this date
    //    are usable
    //
    // 2) All currently-usable backgrounds are shuffled, using the most recent update
    //    date as the seed for a random-number-generator. All currently-usasble fonts
    //    are shuffled, using the number of currently-usable fonts as the seed.
    //
    // 3) The user chooses a background seed (bgSeed) and a font seed (fontSeed). The
    //    seeds are used to select an entry from each shuffled array, modulo the
    //    length of the array. Each time the user clicks a button to change the seed,
    //    the subsequent entry in the shuffled array is selected.
    //
    // Note that bgSeed is used in both steps 1 and step 3, and so it affects both steps.
    // This approach (i.e. shuffling an array in advance, then iterating through it
    // sequentially) helps minimise repetition of the same background/font each time the
    // user clicks a button to change the seed.
    
    const bgSeedDate = new Date(bgSeed);
    
    const backgrounds = this.imageLogs?.filter(x => (x.date <= bgSeedDate)).toSorted((a, b) => a.num - b.num);
    const fonts = this.fontLogs?.filter(x => (x.date <= bgSeedDate)).toSorted((a, b) => a.num - b.num);
    
    if (backgrounds.length == 0 || fonts.length == 0) return null;
    
    const updateDates = backgrounds.map(x => x.date).concat(fonts.map(x => x.date));
    const lastUpdate = updateDates.reduce((max, x) => x > max ? x : max, new Date('1970-01-01')); // We could use Math.max() instead of Array.reduce(), but that would convert the dates to numbers
    
    const bgRng = RandomUtils.getDeterministicRNG(lastUpdate);
    const fontRng = RandomUtils.getDeterministicRNG(fonts.length);
    
    let bgShuffle = backgrounds.map((x, i) => i); // an array of ints [0, 1, 2, ...]
    let fontShuffle = fonts.map((x, i) => i);    
    RandomUtils.shuffleArray(bgShuffle, bgRng);
    RandomUtils.shuffleArray(fontShuffle, fontRng);
    
    const bgSeedDay = Math.floor(bgSeedDate / (60 * 60 * 24 * 1000))
    const lastUpdateDay = Math.floor(lastUpdate / (60 * 60 * 24 * 1000))
    
    const backgroundIndex = bgShuffle[(bgSeedDay - lastUpdateDay) % bgShuffle.length];
    const fontIndex = fontShuffle[fontSeed % fontShuffle.length];
    
    const backgroundLogEntry = backgrounds[backgroundIndex];
    const fontLogEntry = fonts[fontIndex];
    
    return { image: backgroundLogEntry.image, font: fontLogEntry.font };
  }
  
  chooseAppearance_v0(seed) {
    if (!/\d\d\d\d-\d\d-\d\d/.test(seed)) return null;
    
    const rng = RandomUtils.getDeterministicRNG(seed);
    
    const images = this.imageLogs?.filter(x => new Date(x.date) <= new Date(seed));
    const fonts = this.fontLogs?.filter(x => new Date(x.date) <= new Date(seed));
    
    const imageLogEntry = images[RandomUtils.randomInt(rng, 0, images.length - 1)];
    const fontLogEntry = fonts[RandomUtils.randomInt(rng, 0, fonts.length - 1)];
    
    return { image: imageLogEntry.image, font: fontLogEntry.font };
  }
}
