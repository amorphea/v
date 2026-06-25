// Copyright (C) 2026 amorphea
//
// This file is part of UtilV.
//
// UtilV is free software: you can redistribute it and/or modify it under the
// terms of the GNU Affero General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option)
// any later version.
//
// UtilV is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
// details.
//
// You should have received a copy of the GNU Affero General Public License
// along with UtilV. If not, see <https://www.gnu.org/licenses/>.

"use strict";

class EventUrlInfo {
  constructor(urlBase, urlHash) {
    this.urlBase = urlBase;
    this.urlHash = urlHash;
    this.fullUrl = this.urlBase + '#' + this.urlHash;
    this.charCount = this.fullUrl.length;
    this.compatibleWithIG = this.charCount <= 245;
    this.ascii = /^[\x20-\x7E]*$/.test(this.urlHash);
  }
}

class Event {
  constructor(title, location, startDate, startTime, endDate, endTime, timezone, rsvp, rsvpDate, imageUrl, theme, rng, description) {
    this.state = Vue.reactive({
      title: title,
      location: location,
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      timezone: timezone,
      rsvp: rsvp,
      rsvpDate: rsvpDate,
      imageUrl: imageUrl,
      theme: theme,
      rng: rng,
      description: description,
    });

    const s = this.state;
    const t = this;

    function addComputed(name, func) {
      s[name] = Vue.computed(func);
      Object.defineProperty(t, name, {
        get() { return s[name]; },
      });
    }

    function addWriteableComputed(name, getter, setter) {
      s[name] = Vue.computed({ get: getter, set: setter });
      Object.defineProperty(t, name, {
        get() { return s[name]; },
        set(newValue) { s[name] = newValue; }
      });
    }

    addWriteableComputed(
      'startDatetime',
      () => s.startDate + (s.startTime ? "T" + s.startTime : ""),
      newValue => { s.startDate = newValue?.match(/(\d\d\d\d-\d\d-\d\d)/); s.startTime = newValue?.match(/(\d\d:\d\d)/); }
    );
    addWriteableComputed(
      'endDatetime',
      () => s.endDate + (s.endTime ? "T" + s.endTime : ""),
      newValue => { s.endDate = newValue?.match(/(\d\d\d\d-\d\d-\d\d)/); s.endTime = newValue?.match(/(\d\d:\d\d)/); }
    );

    s.startDetails = Vue.computed(() => s.startDatetime?.match(/(?<yyyy>\d\d\d\d)-(?<MM>\d\d)-(?<dd>\d\d)T?(?<hh>\d\d)?:?(?<mm>\d\d)?/)?.groups);
    s.endDetails = Vue.computed(() => s.endDatetime?.match(/(?<yyyy>\d\d\d\d)-(?<MM>\d\d)-(?<dd>\d\d)T?(?<hh>\d\d)?:?(?<mm>\d\d)?/)?.groups);
    s.rsvpDetails = Vue.computed(() => s.rsvpDate?.match(/(?<yyyy>\d\d\d\d)-(?<MM>\d\d)-(?<dd>\d\d)T?(?<hh>\d\d)?:?(?<mm>\d\d)?/)?.groups);
    
    //addWriteableComputed('startDate', () => s.startDetails && s.startDetails.yyyy + "-" + s.startDetails.MM + "-" + s.startDetails.dd, newValue => { s.startDatetime = newValue + "T" + s.startTime });
    //addWriteableComputed('endDate', () => s.endDetails && s.endDetails.yyyy + "-" + s.endDetails.MM + "-" + s.endDetails.dd, newValue => { s.endDatetime = newValue + "T" + s.endTime });
    //addWriteableComputed('startTime', () => s.startDetails && s.startDetails.hh + ":" + s.startDetails.mm, newValue => { s.startDatetime = s.startDate + "T" + newValue });
    //addWriteableComputed('endTime', () => s.endDetails && s.endDetails.hh + ":" + s.endDetails.mm, newValue => { s.endDatetime = s.endDate + "T" + newValue });
    addComputed('validRsvpDate', () => s.rsvpDetails && s.rsvpDetails.yyyy + "-" + s.rsvpDetails.MM + "-" + s.rsvpDetails.dd);

    addComputed('startDateObj', () => s.startDetails && new Date(+s.startDetails.yyyy, +s.startDetails.MM - 1 || 0, +s.startDetails.dd || 0, +s.startDetails.hh || 0, +s.startDetails.mm || 0));
    addComputed('endDateObj', () => s.endDetails && new Date(+s.endDetails.yyyy, +s.endDetails.MM - 1 || 0, +s.endDetails.dd || 0, +s.endDetails.hh || 0, +s.endDetails.mm || 0));
    s.rsvpDateObj = Vue.computed(() => s.rsvpDetails && new Date(+s.rsvpDetails.yyyy, +s.rsvpDetails.MM - 1 || 0, +s.rsvpDetails.dd || 0, +s.rsvpDetails.hh || 23, +s.rsvpDetails.mm || 59));

    addComputed('multiYear', () => s.startDetails && s.endDetails && (s.startDetails.yyyy !== s.endDetails.yyyy));
    addComputed('rsvpMultiYear', () => (s.rsvpDetails && s.startDetails && s.rsvpDetails.yyyy !== s.startDetails.yyyy) || (s.rsvpDetails && s.endDetails && s.rsvpDetails.yyyy !== s.endDetails.yyyy));

    addComputed('lateNight', () => s.startDetails && s.endDetails && s.startDetails.yyyy === s.endDetails.yyyy && s.startDetails.MM === s.endDetails.MM && (+s.startDetails.dd + 1) === +s.endDetails.dd && +s.startDetails.hh > 12 && +s.endDetails.hh < 6);
    addComputed('multiDay', () => s.startDetails && s.endDetails && !s.lateNight && (s.startDetails.yyyy !== s.endDetails.yyyy || s.startDetails.MM !== s.endDetails.MM || s.startDetails.dd !== s.endDetails.dd));

    addComputed('startOnTheHour', () => s.startDetails?.mm === "00");
    addComputed('endOnTheHour', () => s.endDetails?.mm === "00");

    addComputed('allDay', () => s.startDetails?.hh === null && s.startDetails?.mm === null && s.endDetails?.hh === null && s.endDetails?.mm === null);

    addComputed('year', () => s.startDetails?.yyyy);
    addComputed('endYear', () => this.multiYear ? s.endDetails?.yyyy : null);
    addComputed('rsvpYear', () => this.rsvpMultiYear ? s.rsvpDetails?.yyyy : null);

    const shortWeekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: "short" });
    const longWeekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: "long" });
    const yearlessDateFormatter = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "numeric" });
    const yearfulDateFormatter = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "numeric", year: "numeric" });

    addComputed('startShortWeekday', () => s.startDateObj && shortWeekdayFormatter.format(s.startDateObj));
    addComputed('endShortWeekday', () => s.endDateObj && shortWeekdayFormatter.format(s.endDateObj));
    addComputed('startLongWeekday', () => s.startDateObj && longWeekdayFormatter.format(s.startDateObj));
    addComputed('endLongWeekday', () => s.endDateObj && longWeekdayFormatter.format(s.endDateObj));

    addComputed('lessThanAWeek', () => (s.endDateObj - s.startDateObj) < 1000 * 60 * 60 * 24 * 6);

    addComputed('startYearlessDate', () => s.startDateObj && yearlessDateFormatter.format(s.startDateObj));
    addComputed('startYearfulDate', () => s.startDateObj && yearfulDateFormatter.format(s.startDateObj));

    addComputed('endYearlessDate', () => s.endDateObj && yearlessDateFormatter.format(s.endDateObj));
    addComputed('endYearfulDate', () => s.endDateObj && yearfulDateFormatter.format(s.endDateObj));

    const minutelessTimeFormatter = new Intl.DateTimeFormat(undefined, { hour: "numeric", hour12: true });
    const minutefulTimeFormatter = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", hour12: true });
    const whimsicalMinutelessTimeFormatter = new Intl.DateTimeFormat(undefined, { hour: "numeric", hour12: true, dayPeriod: "long" });
    const whimsicalMinutefulTimeFormatter = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", hour12: true, dayPeriod: "long" });

    addComputed('shortStartTime'    , () => s.startDateObj && (s.startOnTheHour ?          minutelessTimeFormatter.format(s.startDateObj) :          minutefulTimeFormatter.format(s.startDateObj)));
    addComputed('shortEndTime'      , () => s.endDateObj   && (s.endOnTheHour   ?          minutelessTimeFormatter.format(s.endDateObj)   :          minutefulTimeFormatter.format(s.endDateObj)));
    addComputed('whimsicalStartTime', () => s.startDateObj && (s.startOnTheHour ? whimsicalMinutelessTimeFormatter.format(s.startDateObj) : whimsicalMinutefulTimeFormatter.format(s.startDateObj)));
    addComputed('whimsicalEndTime'  , () => s.endDateObj   && (s.endOnTheHour   ? whimsicalMinutelessTimeFormatter.format(s.endDateObj)   : whimsicalMinutefulTimeFormatter.format(s.endDateObj)));

    addComputed('rsvpString', () => (
      ((s.rsvp || s.rsvpDate) && "RSVP ")
      + (s.rsvp && "to " + s.rsvp)
      + (s.rsvp && s.rsvpDate && " ")
      + (s.rsvpDate && "by " + (s.rsvpMultiYear ? yearfulDateFormatter.format(s.rsvpDateObj) : yearlessDateFormatter.format(s.rsvpDateObj)))
    ));

    addWriteableComputed(
      'prettyTimezone',
      () => DateUtils.toPrettyTimezone(s.timezone),
      (newValue) => s.timezone = DateUtils.fromPrettyTimezone(newValue)
    );

    addComputed('utcStartDateObj', () => s.startDate && s.startTime && s.timezone && DateUtils.combineDatetimeAndTimezoneAsUTC(s.startDatetime, s.timezone));
    addComputed('utcEndDateObj', () => s.endDate && s.endTime && s.timezone && DateUtils.combineDatetimeAndTimezoneAsUTC(s.endDatetime, s.timezone));

    addComputed('startTimezoneOffset', () => s.utcStartDateObj && DateUtils.printTimeZone(s.timezone, 'longOffset', undefined, s.utcStartDateObj));
    addComputed('endTimezoneOffset', () => s.utcEndDateObj && DateUtils.printTimeZone(s.timezone, 'longOffset', undefined, s.utcEndDateObj));

    const utcDateFormatter = new Intl.DateTimeFormat(undefined, {timeZone: 'UTC', dateStyle: 'short', timeStyle: 'long'});
    
    addComputed('startDateTimeUTC', () => s.utcStartDateObj && utcDateFormatter.format(s.utcStartDateObj));
    addComputed('endDateTimeUTC', () => s.utcEndDateObj && utcDateFormatter.format(s.utcEndDateObj));

    addComputed('startDateTimeWithOffset', () => s.utcStartDateObj && new Intl.DateTimeFormat(undefined, {timeZone: s.timezone, dateStyle: 'short', timeStyle: 'long'}).format(s.utcStartDateObj));
    addComputed('endDateTimeWithOffset', () => s.utcEndDateObj && new Intl.DateTimeFormat(undefined, {timeZone: s.timezone, dateStyle: 'short', timeStyle: 'long'}).format(s.utcEndDateObj));

    addComputed('rngSeed', () => {
      const dateMatch = s.rng?.match(/\d\d\d\d-\d\d-\d\d/);
      return dateMatch ? Math.floor(new Date(dateMatch[0]).getTime() / (60 * 60 * 24 * 1000)) : 0;
    });
  }

  get title() { return this.state.title; }
  set title(x) { this.state.title = x; }

  get location() { return this.state.location; }
  set location(x) { this.state.location = x; }

  get startDate() { return this.state.startDate; }
  set startDate(x) { this.state.startDate = x; }

  get startTime() { return this.state.startTime; }
  set startTime(x) { this.state.startTime = x; }

  get endDate() { return this.state.endDate; }
  set endDate(x) { this.state.endDate = x; }

  get endTime() { return this.state.endTime; }
  set endTime(x) { this.state.endTime = x; }

  get timezone() { return this.state.timezone; }
  set timezone(x) { this.state.timezone = x; }

  get rsvp() { return this.state.rsvp; }
  set rsvp(x) { this.state.rsvp = x; }

  get rsvpDate() { return this.state.rsvpDate; }
  set rsvpDate(x) { this.state.rsvpDate = x; }

  get imageUrl() { return this.state.imageUrl; }
  set imageUrl(x) { this.state.imageUrl = x; }

  get theme() { return this.state.theme; }
  set theme(x) { this.state.theme = x; }

  get rng() { return this.state.rng; }
  set rng(x) { this.state.rng = x; }

  get description() { return this.state.description; }
  set description(x) { this.state.description = x; }

  regenerateThemeRNG() {
    var date = this.state.rng ? new Date(this.state.rng) : new Date();
    date.setDate(date.getDate() - 1)
    this.state.rng = date.toISOString().match(/\d\d\d\d-\d\d-\d\d/)[0];
  }
}

class DateUtils {
  // Just use Intl library, not Temporal, as browser support for Temporal isn't good enough yet
  
  static getLocalTimeZone() {
    // Returns e.g. Australia/Hobart
    return new Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  
  static printTimeZone(timeZone, printFormat, locale, referenceDate) {
    // timeZone should be in the format of e.g. Australia/Hobart
    // printFormat should be one of "short", "long", "shortOffset", "longOffset", "shortGeneric", or "longGeneric"
    // locale should be e.g. "en-AU" or defaults to the current locale
    // referenceDate should be a Date, or defaults to the current date (this impacts whether the daylight-savings-time
    // vs. standard-time timezone is printed, and reflects political changes e.g. countries switching timezone)
    // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
    if (locale == null) locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (referenceDate == null) referenceDate = new Date();
    return new Intl.DateTimeFormat(locale, {timeZone: timeZone, timeZoneName: printFormat }).formatToParts(new Date(referenceDate)).find(x => x.type === 'timeZoneName').value
  }
  
  static isTimezoneStatic(date1, date2, timeZone) {
    // returns FALSE if a timezone is discontinuous between date1 and date2 due to a change of daylight savings (or e.g. a country switching timezone for political reasons), otherwise returns TRUE
    let offset1 = this.printTimeZone(timeZone, "longOffset", "en-GB", date1);
    let offset2 = this.printTimeZone(timeZone, "longOffset", "en-GB", date2);
    return offset1 === offset2;
  }
  
  static combineDatetimeAndTimezoneAsUTC(datetimeString, timeZone) {
    // Converts a 'wall clock' date time string plus a timezone string to a UTC time
    // The timezone specifies a region/city (e.g. Australia/Hobart), which could be in either daylight-savings-time or standard-time
    // The first attempt gets an approximation of the timezone-offset to use, by pretending the 'wall clock' time is already in UTC (by appending 'Z')
    // The second attempt uses this approximate timezone-offset to get the correct timezone-offset
    // Finally (third attempt) a date is returned using the correct timezone-offset
    // Note: It might technically only need 2 attempts total, I'm not sure. I've tested it out across daylight-savings boundaries and it seems to work OK, so I don't wanna break anything
    let attempt1 = this.printTimeZone(timeZone, "longOffset", "fr-FR", new Date(datetimeString + "Z"));
    let attempt2 = this.printTimeZone(timeZone, "longOffset", "fr-FR", new Date(datetimeString + attempt1.replace("UTC", "").replace("\u2212","-")));
    return new Date(datetimeString + attempt2.replace("UTC", "").replace("\u2212","-"));
  }

  // Convert IANA timezones to and from pretty timezones by replacing slashes "/" with chevrons " › " and replacing underscores with spaces
  static toPrettyTimezone(timezone) {
    return timezone?.replace(/\//g, ' \u203A ')?.replace(/_/g, ' ');
  }
  static fromPrettyTimezone(timezone) {
    return timezone?.replace(/ \u203A /g, '\/')?.replace(/ /g, '_');
  }

  static getTodaysDateString() {
    return new Date().toISOString().match(/\d\d\d\d-\d\d-\d\d/)[0];
  }
}

const urlDisplayComponent = {
  template: "#url-display",
  components: {
    IconClipboard: { template: "#icon-clipboard" },
    IconClipboardCheck: { template: "#icon-clipboard-check" },
    IconHash: { template: "#icon-hash" },
  },
  props: {
    url: EventUrlInfo
  },
  data() {
    return {
      copied: false
    }
  },
  methods: {
    copyUrlToClipboard() {
      navigator.clipboard.writeText(this.url.fullUrl);
      this.copied = true;
      setTimeout(() => { this.copied = false; }, 2000);
    },
    removeNewlinesFromManualCopy() {
      navigator.clipboard.readText()
        .then(x => x?.replace(/\r|\n/g, ''))
        .then(x => navigator.clipboard.writeText(x))
        .catch(x => {});
    }
  }
};

const linksSectionComponent = {
  template: "#links-section",
  components: {
    UrlDisplay: urlDisplayComponent,
    IconChevronRight: { template: "#icon-chevron-right" },
  },
  props: {
    eventUrl: EventUrlInfo,
    eventUrlSmallestEncoded: EventUrlInfo,
  },
};

const app = Vue.createApp({
  components: {
    LinksSection: linksSectionComponent,
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
      urlHashLoaded: false,
      urlHashLoadFailed: false,
      possibleTimezones: Intl.supportedValuesOf('timeZone'),
      possibleThemes: ThemesDB.getPossibleThemes(),
      zoomMode: false,
    };
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
        else if (char === "|") newStr += "~7C"; // escape pipes
        else if (char === "+") newStr += "~2B"; // escape pluses
        else if (char === " ") newStr += "+"; // replace spaces with pluses
        else if (char === "`") newStr += "~60"; // escape backticks (needed for some reason, not sure why)
        else if (/\!\@\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\\\;\:\'\"\,\<\.\>\/\?/.test(char)) newStr += char; // keep these symbols
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
    parseEventString_old1(arr) {
      const themeMatch = arr[7] && arr[7].match(/^(?<theme>[a-zA-Z]+)(?<rng>[0-9][0-9][0-9])$/);
      const theme = themeMatch && themeMatch.groups.theme?.toLowerCase();
      const rng = themeMatch && themeMatch.groups.rng && this.parseDate(themeMatch.groups.rng) || DateUtils.getTodaysDateString();

      // Reject this event string if there are malformed dates (it has probably been parsed wrong, i.e. we should have used unibinDecode)
      // Don't reject if the dates are absent entirely
      const start = this.parseDatetime(arr[2]);
      const end = this.parseDatetime(arr[3]);
      if (arr[2] && !start) return null;
      if (arr[3] && !end) return null;
      
      return new Event(
        this.unescapeEventStringPart(arr[0]) || "", // title
        this.unescapeEventStringPart(arr[1]) || "", // location
        start?.date || "", // startDate
        start?.time || "", // startTime
        end?.date || "", // endDate
        end?.time || "", // endTime
        this.unescapeEventStringPart(arr[4]) || "", // timezone
        this.unescapeEventStringPart(arr[5]) || "", // rsvp
        this.parseDatetime(arr[6])?.date || "", // rsvpDate
        !theme ? this.unescapeEventStringPart(arr[7]) : "", // imageUrl
        theme || "", // theme
        rng, // rng
        this.unescapeEventStringPart(arr[8]) || "" // description
      )
    },
    parseEventString_old2(arr) {
      const themeMatch = arr[9] && arr[9].match(/^(?<theme>[a-zA-Z]+)(?<rng>\d\d\d\d\d\d\d\d)$/);
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
        !theme ? this.unescapeEventStringPart(arr[9]) : "", // imageUrl
        theme || "", // theme
        rng, // rng
        this.unescapeEventStringPart(arr[10]) || "" // description
      )
    },
    parseEventString(str) {
      if (!str) return null;
      const arr = str.split("|");
      if (arr.length < 3) return null; // require at least a title, location, and start time

      if (arr.length === 9) return this.parseEventString_old1(arr); // temporary backwards compatibility to update existing event strings
      if (arr.length === 11) return this.parseEventString_old2(arr); // temporary backwards compatibility to update existing event strings
      
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
            console.log("Trying decoder combination [decompress: " + decompress + ", unibinDecode:" + unibinDecode + ", uriDecode:" + uriDecode + "]");
            
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
  },
  computed: {
    eventString() {
      return (
        this.escapeEventStringPart(this.event.title) + "|" +
        this.escapeEventStringPart(this.event.location) + "|" +
        this.formatDate(this.event.startDate) + "|" +
        this.formatTime(this.event.startTime) + "|" +
        this.formatDate(this.event.endDate) + "|" +
        this.formatTime(this.event.endTime) + "|" +
        this.escapeEventStringPart(this.event.timezone) + "|" +
        this.escapeEventStringPart(this.event.rsvp) + "|" +
        this.formatDate(this.event.rsvpDate) + "|" +
        this.escapeEventStringPart(this.event.imageUrl) + "|" +
        this.formatTheme(this.event.theme, this.event.rng) + "|" +
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
      return this.event.theme && ThemesDB.getTheme(this.event.theme) || null;
    },
    themeAppearance() {
      return this.themeInfo?.chooseAppearance(this.event.rng);
    },
    eventSquareStyle() {
      return (this.themeAppearance?.font ? "font-family: '" + this.themeAppearance.font.name + "';" : "") + (this.themeAppearance?.image ? "background-image: url('" + this.themeAppearance.image.url + "');" + this.themeAppearance.image.textStyling : "");
    }
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
  compilerOptions: {
    isCustomElement: (tag) => tag.startsWith('add-')
  }
});
app.use(AsyncComputed);
app.mount('#app');
