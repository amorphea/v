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

addEventListener("hashchange", (event) => { // if the user manually edits the URL hash, reload the page to apply the new URL hash
  window.location.reload();
})

const app = Vue.createApp({
  components: {
    LinksSection: linksSectionComponent,
    CalendarButtons: calendarButtonsComponent,
    'v-select': window['vue-select'],
    IconX: { template: "#icon-x" },
    IconInfo: { template: "#icon-info" },
    IconRepeat: { template: "#icon-repeat" },
    IconChevronRight: { template: "#icon-chevron-right" },
    IconPrideFlag: { template: "#icon-pride-flag" },
    IconAgplLogo: { template: "#icon-agpl-logo" },
  },
  data() {
    return {
      event: new Event("", "", "", "", "", "", DateUtils.getLocalTimeZone(), "", "", "", "", DateUtils.getTodaysDateString(), ""),
      urlBase: this.getUrlBase(),
      urlHash: window.location.hash.replace(/^#/, ''),
      urlHost: window.location.host,
      createModeInitially: !window.location.hash.replace(/^#/, ''),
      createModeCurrently: !window.location.hash.replace(/^#/, ''),
      urlHashLoaded: false,
      urlHashLoadFailed: false,
      possibleTimezones: Intl.supportedValuesOf('timeZone'),
      possibleThemes: ThemesDB.getPossibleThemes(),
      zoomMode: false,
    };
  },
  watch: {
    'eventString': {
      handler() {
        this.autoShrinkEventSquareText();
        this.addBulletsToEventSquareDateAndTime();
      },
      flush: 'post'
    },
  },
  methods: {
    encode(str) {
      return unibinary.encodeString(str);
    },
    async compressAndEncode(str) {
      return unibinary.encode(await compress(str));
    },
    decode(str) {
      try { return unibinary.decodeString(str); }
      catch { return null; }
    },
    async decodeAndDecompress(str) {
      try { return await decompress(unibinary.decode(str)); }
      catch { return null; }
    },
    formatDate(datetime) {
      const match = datetime?.match(/\d\d\d\d-\d\d-\d\d/);
      return match && match[0]?.replace(/-/g, '') || '';
    },
    formatTime(time) {
      const match = time?.match(/\d\d:\d\d/);
      return match && match[0]?.replace(/:/g, '') || '';
    },
    formatDatetime(datetime) {
      const match = datetime?.match(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d/);
      return match && match[0]?.replace(/\D/g, '') || '';
    },
    formatTheme(theme, rng) {
      if (!theme) return "";
      if (!rng) return "";
      if (!/\d\d\d\d-\d\d-\d\d/.test(rng)) return "";
      if (!/^[a-zA-Z\-]+$/.test(theme)) return "";
      return theme.toLowerCase() + this.formatDate(rng);
    },
    escapeEventStringPart(str) {
      // Unfriendly characters are escaped in the same way as a URI except using '~' rather than '%'.
      // E.g. a line feed becomes '~0A' rather than '%0A'
      // This avoids conflicts with regular URI encoding/decoding, which might also happen when copying links around, depending on the browser
      // Spaces are also replaced with pluses
      
      if (!str) return "";
      let newStr = "";
      for (let char of str) {
        if (char === "~") newStr += '~7E'; // escape tildes
        else if (char === ";") newStr += "~3B"; // escape semicolons
        else if (char === "|") newStr += "~7C"; // escape pipes
        else if (char === "+") newStr += "~2B"; // escape pluses
        else if (char === " ") newStr += "+"; // replace spaces with pluses
        else if (char === "`") newStr += "~60"; // escape backticks (needed for some reason, not sure why)
        else if (/\!\@\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\\\:\'\"\,\<\.\>\/\?/.test(char)) newStr += char; // keep these symbols
        else if (/\p{Letter}|\p{Number}|\p{Mark}|\p{Symbol}|\p{Punctuation}/u.test(char)) newStr += char; // keep everything in unicode other than control/separator characters
        else newStr += encodeURIComponent(char).replace("%", "~"); // escape all other fancy symbols like newlines, tabs, em spaces, RTL control characters, etc
      }
      return newStr;
    },
    unescapeEventStringPart(str) {
      if (!str) return "";
      return decodeURIComponent(str.replace(/\+/g, " ").replace(/\~/g, "%"));
    },
    parseDatetime(datestr) {
      if (!datestr) return null;
      const match = datestr.match(/^((?<yyyy>\d\d\d\d)(?<MM>\d\d)(?<dd>\d\d))((?<hh>\d\d)(?<mm>\d\d))?$/);
      if (!match) return null;
      const groups = match.groups;
      const date = (groups.yyyy && groups.MM && groups.dd) ? (groups.yyyy + "-" + groups.MM + "-" + groups.dd) : null;
      const time = (groups.hh && groups.mm) ? (groups.hh + ":" + groups.mm) : null;
      if (!date) return null;
      if (!!groups.hh !== !!groups.mm) return null; // time is partly present - fail fast by returning null
      return { date: date, time: time };
    },
    parseDate(datestr) {
      if (!datestr) return null;
      const match = datestr.match(/^(?<yyyy>\d\d\d\d)(?<MM>\d\d)(?<dd>\d\d)$/);
      if (!match) return null;
      const groups = match.groups;
      const date = (groups.yyyy && groups.MM && groups.dd) ? (groups.yyyy + "-" + groups.MM + "-" + groups.dd) : null;
      return date;
    },
    parseTime(timestr) {
      if (!timestr) return null;
      const match = timestr.match(/^(?<hh>\d\d)(?<mm>\d\d)$/);
      if (!match) return null;
      const groups = match.groups;
      const time = (groups.hh && groups.mm) ? (groups.hh + ":" + groups.mm) : null;
      return time;
    },
    randomInt(min, max) { // returns a number inclusive of min and max
      return Math.floor(Math.random() * (max + 1 - min) + min);
    },
    getUrlBase() {
      return (window.location.host + window.location.pathname).replace(/[\/\\]+$/,'');
    },
    parseEventString(str) {
      if (!str) return null;
      let arr = str.split(";");
      if (arr.length < 3) { arr = str.split("|"); } // temporary -- try the old format instead
      if (arr.length < 3) return null; // require at least a title, location, and start time  
      
      const themeMatch = arr[10] && arr[10].match(/^(?<theme>[a-zA-Z\-]+)(?<rng>\d\d\d\d\d\d\d\d)$/);
      const theme = themeMatch && themeMatch.groups.theme?.toLowerCase();
      const rng = themeMatch && themeMatch.groups.rng && this.parseDate(themeMatch.groups.rng) || DateUtils.getTodaysDateString();

      // Reject this event string if there are malformed dates or times (it has probably been parsed wrong, i.e. we should have used unibinDecode)
      // Don't reject if the dates/times are absent entirely; that's OK
      const startDate = this.parseDate(arr[2]);
      const startTime = this.parseTime(arr[3]);
      const endDate = this.parseDate(arr[4]);
      const endTime = this.parseTime(arr[5]);
      if (arr[2] && !startDate) return null;
      if (arr[3] && !startTime) return null;
      if (arr[4] && !endDate) return null;
      if (arr[5] && !endTime) return null;
      
      return new Event(
        this.unescapeEventStringPart(arr[0]) || "", // title
        this.unescapeEventStringPart(arr[1]) || "", // location
        startDate || "", // startDate
        startTime || "", // startTime
        endDate || "", // endDate
        endTime || "", // endTime
        this.unescapeEventStringPart(arr[6]) || "", // timezone
        this.unescapeEventStringPart(arr[7]) || "", // rsvp
        this.parseDatetime(arr[8])?.date || "", // rsvpDate
        this.unescapeEventStringPart(arr[9]) || "", // imageUrl
        theme || "", // theme
        rng, // rng
        this.unescapeEventStringPart(arr[11]) || "" // description
      )
    },
    async loadEventFromUrlHash(urlHash) {
      // There are several ways the event string might be encoded in the url hash
      // It may or may not use unibin encoding
      // It may or may not be compressed
      // It may or may not have been URI encoded by the user's software when copy-pasting it between browsers/etc
      // We loop through all possibilities and try each one, to (hopefully) find a combination that can successfully decode the event
      
      for (const decompress of [false, true]) {
        for (const unibinDecode of [false, true]) {
          if (!unibinDecode && decompress) continue; // this combination never occurs in practice; skip this loop iteration
          for (const uriDecode of [false, true]) {
            console.log("Trying decoder combination [decompress: " + decompress + ", unibinDecode: " + unibinDecode + ", uriDecode: " + uriDecode + "]");
            
            let str = urlHash;
            try { if (uriDecode) str = decodeURIComponent(str); }
            catch { continue; }
            if (unibinDecode && !decompress) str = this.decode(str);
            if (unibinDecode && decompress) str = await this.decodeAndDecompress(str);

            const evt = this.parseEventString(str);
            console.log("Parsed event:");
            console.log(evt);
            
            if (evt) {
              this.event = evt;
              this.urlHashLoaded = true;
              return; // break out of all loops
            }
          }
        }
      }
      this.urlHashLoadFailed = true;
    },
    autoShrinkEventSquareText() {
      if (!this.$refs.eventSquare || !this.$refs.eventSquareFontRescale) return;
      
      let maxHeight = this.$refs.eventSquare.getBoundingClientRect().height;
      ShrinkText.shrinkText(this.$refs.eventSquareFontRescale, maxHeight);
    },
    addBulletsToEventSquareDateAndTime() {
      if (!this.$refs.eventSquareDateAndTime) return;

      // Based on: https://stackoverflow.com/a/41019508
      let dateTimes = this.$refs.eventSquareDateAndTime;
      let prevChild = null;
      for (const child of dateTimes.children) {
        if (prevChild != null) {
          if (child.offsetTop === prevChild.offsetTop) child.classList.add('bullet-before');
          else child.classList.remove('bullet-before');
        }
        prevChild = child;
      }
    },
    showThemesFaq() {
      this.showFaqSection(this.$refs.themesFaq);
    },
    showUrlsFaq() {
      this.showFaqSection(this.$refs.urlsFaq);
    },
    showFaqSection(sectionRef) {
      if (!this.$refs.faqCollapseButton || !sectionRef) return;
      
      if (this.$refs.faqCollapseButton.checked) {
        sectionRef.scrollIntoView({ behavior: "smooth" });
      } else {
        this.$refs.faqCollapseButton.checked = true;
        setTimeout(() => {
          sectionRef.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    },
    displayEvent() {
      history.pushState({}, "", "#" + this.eventUrl.urlHash);

      if (this.createModeCurrently) {
        this.createModeCurrently = false;
        this.urlHashLoaded = true;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
  computed: {
    eventString() {
      return (
        this.escapeEventStringPart(this.event.title) + ";" +
        this.escapeEventStringPart(this.event.location) + ";" +
        this.formatDate(this.event.startDate) + ";" +
        this.formatTime(this.event.startTime) + ";" +
        this.formatDate(this.event.endDate) + ";" +
        this.formatTime(this.event.endTime) + ";" +
        this.escapeEventStringPart(this.event.timezone) + ";" +
        this.escapeEventStringPart(this.event.rsvp) + ";" +
        this.formatDate(this.event.rsvpDate) + ";" +
        this.escapeEventStringPart(this.event.imageUrl) + ";" +
        this.formatTheme(this.event.theme, this.event.rng) + ";" +
        this.escapeEventStringPart(this.event.description)
      );
    },
    eventStringEncoded() { return this.encode(this.eventString); },
    eventUrl() { return new EventUrlInfo(this.urlBase, this.eventString) },
    eventUrlEncoded() { return new EventUrlInfo(this.urlBase, this.eventStringEncoded) },
    possiblePrettyTimezones() {
      return this.possibleTimezones.map(x => DateUtils.toPrettyTimezone(x))
    },
    themeInfo() {
      return this.event?.theme && ThemesDB.getTheme(this.event.theme) || null;
    },
    themeAppearance() {
      return this.themeInfo?.chooseAppearance(this.event.rng);
    },
    custombackgroundImage() {
      // Generate CSS code for displaying a custom background image from a user-defined url
      //
      // We're displaying user defined content here, so we need to be cautious of XSS attacks or similar:
      //
      // 1) The image could well be an SVG file, which could contain <script> tags.
      //    Fortunately, browsers disable <script> tags in SVGs whenever the SVG is a background-image or <img>
      //    See: https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_as_an_image
      //    See: https://www.w3.org/Graphics/SVG/WG/wiki/Features/SVG-as-image
      //    See: https://stackoverflow.com/questions/16837960/using-javascript-in-a-background-image-svg
      //    See: http://www.schepers.cc/svg/blendups/embedding.html
      //
      // 2) The image url may contain e.g. single quote characters to break out of the "url('')" parameter and
      //    run custom code. It could also contain URI-encoded strings, e.g. %20 for whitespace.
      //    If we tried using encodeURI or encodeURIComponent, we'd break any URLs which already included
      //    URI-encoded strings like %20 etc. Instead, we can use CSS.escape(), which prefixes both ' characters
      //    (and other characters that might be dangerous to CSS) with backslashes "\"
      //    See: https://stackoverflow.com/a/33541245
      //
      // 3) Loading the image from another site will alert that site to the current user's IP address. As far as
      //    I know, this is pretty unavoidable. I guess the best we can say is, don't wholeheartedly trust links
      //    sent to you by random strangers! If you open a link from a stranger, they might well know that you
      //    opened it (i.e. this is effectively no different from usual)
      return this.event?.imageUrl ? "background-image: url('" + CSS.escape(this.event.imageUrl) + "');" : null;
    },
    eventSquareOuterStyle() {
      return this.custombackgroundImage || (this.themeAppearance?.image ? "background-image: url('" + this.themeAppearance.image.url + "');" : "");
    },
    eventSquareInnerStyle() {
      return (
        (this.themeAppearance?.font ? "font-family: '" + this.themeAppearance.font.name + "';" : "") +
        (this.themeAppearance?.image ? this.themeAppearance.image.textStyling : "")
      );
    },
    imageInfo() {
      let info = this.themeAppearance?.image?.url?.match(/(?<group>\d\d\d+)-(?<number>\d\d\d+) (?<author>[^ ]+)-(?<year>\d\d\d\d) (?<license>[^ ]+) (?<size>[^ ]+)/u)?.groups
      if (!info) return undefined;
      
      switch (info.license) {
        case 'CC0-1.0':
          info.license = 'CC0 1.0';
          info.licenseUrl = 'https://creativecommons.org/publicdomain/zero/1.0/';
          break;
        case 'CC-BY-4.0':
          info.license = 'CC BY 4.0';
          info.licenseUrl = 'https://creativecommons.org/licenses/by/4.0/';
          break;
        case 'CC-BY-SA-4.0':
          info.license = 'CC BY-SA 4.0';
          info.licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/';
          break;
        case 'AI0-1.0':
          info.licenseUrl = 'https://www.humanscommons.org/license/ai0/1.0';
          break;
        case 'AI0-BY-1.0':
          info.licenseUrl = 'https://www.humanscommons.org/license/ai0-by/1.0';
          break;
        case 'AI0-BY-SA-1.0':
          info.licenseUrl = 'https://www.humanscommons.org/license/ai0-by-sa/1.0';
          break;
        default:
          info.licenseUrl = undefined;
      }
      
      return info;
    },
    imageCredit() {
      if (this.custombackgroundImage) return null; // don't display image credit when displaying an image source instead
      if (!this.themeAppearance?.image) return null; // don't display image credit when there's no image
      if (!this.imageInfo?.author) return "Unknown"; // display 'Unknown' whenever the regex match inside imageInfo fails
      return this.imageInfo?.author + " " + this.imageInfo?.year + ", " + this.imageInfo?.license;
    },
    imageSource() {
      if (!this.custombackgroundImage) return null;

      let hostname;
      try { hostname = (new URL(this.event.imageUrl)).hostname.replace('www.', ''); }
      catch { hostname = "Unknown"; }
      
      return {
        href: this.event.imageUrl,
        text: hostname
      };
    },
  },
  asyncComputed: {
    async eventStringCompressedEncoded() { return await this.compressAndEncode(this.eventString); },
    async eventUrlCompressedEncoded() { return new EventUrlInfo(this.urlBase, await this.eventStringCompressedEncoded) },
    async eventUrlSmallestEncoded() {
      const a = this.eventStringEncoded;
      const b = await this.eventStringCompressedEncoded;
      const smallest = a?.length <= b?.length ? a : b;
      return new EventUrlInfo(this.urlBase, smallest);
    },
  },
  beforeMount() {
    if (this.urlHash) {
      this.loadEventFromUrlHash(this.urlHash); // don't wait for async method to return (even if we tried to wait, Vue would continue anyway)
    }
  },
  mounted() {
    this.autoShrinkEventSquareText();
    this.addBulletsToEventSquareDateAndTime();

    // whenever a font is loaded, the sizing of text inside the event
    // square may change, so we need to recalculate the layout
    document.fonts.onloadingdone = () => {
      this.autoShrinkEventSquareText();
      this.addBulletsToEventSquareDateAndTime();
    }
  },
  compilerOptions: {
    isCustomElement: (tag) => tag.startsWith('add-')
  }
});
app.use(AsyncComputed);
app.mount('#app');
