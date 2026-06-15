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
  constructor(title, location, startDatetime, endDatetime, timezone, rsvp, rsvpDate, imageUrl, theme, rng, description) {
    this.state = Vue.reactive({
      title: title,
      location: location,
      startDatetime: startDatetime,
      endDatetime: endDatetime,
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
        get() {
          return s[name];
        },
      });
    }

    function addWritableComputed(name, getter, setter) {
      s[name] = Vue.computed({ get: getter, set: setter });
      Object.defineProperty(t, name, {
        get() { return s[name]; },
        set(newValue) { s[name] = newValue; }
      });
    }

    s.startDetails = Vue.computed(() => s.startDatetime?.match(/(?<yyyy>\d\d\d\d)-(?<MM>\d\d)-(?<dd>\d\d)T?(?<hh>\d\d)?:?(?<mm>\d\d)?/)?.groups);
    s.endDetails = Vue.computed(() => s.endDatetime?.match(/(?<yyyy>\d\d\d\d)-(?<MM>\d\d)-(?<dd>\d\d)T?(?<hh>\d\d)?:?(?<mm>\d\d)?/)?.groups);
    s.rsvpDetails = Vue.computed(() => s.rsvpDate?.match(/(?<yyyy>\d\d\d\d)-(?<MM>\d\d)-(?<dd>\d\d)T?(?<hh>\d\d)?:?(?<mm>\d\d)?/)?.groups);

    addWritableComputed('startDate', () => s.startDetails && s.startDetails.yyyy + "-" + s.startDetails.MM + "-" + s.startDetails.dd, newValue => { s.startDatetime = newValue + "T" + s.startTime });
    addWritableComputed('endDate', () => s.endDetails && s.endDetails.yyyy + "-" + s.endDetails.MM + "-" + s.endDetails.dd, newValue => { s.endDatetime = newValue + "T" + s.endTime });
    addWritableComputed('startTime', () => s.startDetails && s.startDetails.hh + ":" + s.startDetails.mm, newValue => { s.startDatetime = s.startDate + "T" + newValue });
    addWritableComputed('endTime', () => s.endDetails && s.endDetails.hh + ":" + s.endDetails.mm, newValue => { s.endDatetime = s.endDate + "T" + newValue });
    addComputed('validRsvpDate', () => s.rsvpDetails && s.rsvpDetails.yyyy + "-" + s.rsvpDetails.MM + "-" + s.rsvpDetails.dd);

    s.startDateObj = Vue.computed(() => s.startDetails && new Date(+s.startDetails.yyyy, +s.startDetails.MM - 1 || 0, +s.startDetails.dd || 0, +s.startDetails.hh || 0, +s.startDetails.mm || 0));
    s.endDateObj = Vue.computed(() => s.endDetails && new Date(+s.endDetails.yyyy, +s.endDetails.MM - 1 || 0, +s.endDetails.dd || 0, +s.endDetails.hh || 0, +s.endDetails.mm || 0));
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

    s.utcStartDateObj = Vue.computed(() => s.startDatetime && s.timezone && TimeZoneUtils.combineDatetimeAndTimezoneAsUTC(s.startDatetime, s.timezone));
    s.utcEndDateObj = Vue.computed(() => s.endDatetime && s.timezone && TimeZoneUtils.combineDatetimeAndTimezoneAsUTC(s.endDatetime, s.timezone));

    addComputed('startTimeZoneOffset', () => s.utcStartDateObj && TimeZoneUtils.printTimeZone(s.timezone, 'longOffset', undefined, s.utcStartDateObj));
    addComputed('endTimeZoneOffset', () => s.utcEndDateObj && TimeZoneUtils.printTimeZone(s.timezone, 'longOffset', undefined, s.utcEndDateObj));

    const utcDateFormatter = new Intl.DateTimeFormat(undefined, {timeZone: 'UTC', dateStyle: 'short', timeStyle: 'long'});
    const offsetDateFormatter = new Intl.DateTimeFormat(undefined, {timeZone: s.timezone, dateStyle: 'short', timeStyle: 'long'})
    
    addComputed('startDateTimeUTC', () => s.utcStartDateObj && utcDateFormatter.format(s.utcStartDateObj));
    addComputed('endDateTimeUTC', () => s.utcEndDateObj && utcDateFormatter.format(s.utcEndDateObj));

    addComputed('startDateTimeWithOffset', () => s.utcStartDateObj && offsetDateFormatter.format(s.utcStartDateObj));
    addComputed('endDateTimeWithOffset', () => s.utcEndDateObj && offsetDateFormatter.format(s.utcEndDateObj));
  }

  get title() { return this.state.title; }
  set title(x) { this.state.title = x; }

  get location() { return this.state.location; }
  set location(x) { this.state.location = x; }

  get startDatetime() { return this.state.startDatetime; }
  set startDatetime(x) { this.state.startDatetime = x; }

  get endDatetime() { return this.state.endDatetime; }
  set endDatetime(x) { this.state.endDatetime = x; }

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
}

class TimeZoneUtils {
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

/*const eventSquareComponent = {
  template: "#event-square",
  components: {},
  props: 
}*/

const app = Vue.createApp({
  components: {
    UrlDisplay: urlDisplayComponent,
    'v-select': window['vue-select'],
  },
  data() {
    return {
      event: new Event("", "", "", "", TimeZoneUtils.getLocalTimeZone(), "", "", "", "", this.randomInt(0,999), ""),
      urlBase: this.getUrlBase(),
      urlHash: window.location.hash.replace(/^#/, ''),
      urlHashLoaded: false,
      urlHashLoadFailed: false,
      possibleTimezones: Intl.supportedValuesOf('timeZone'),
    };
  },
  methods: {
    // displayDatetime(datetime) {
    // 	if (!datetime) return "";
    // 	return datetime.replace(/(?<yyyy>\d\d\d\d)-(?<MM>\d\d)-(?<dd>\d\d)T?(?<hh>\d\d)?:?(?<mm>\d\d)?/, "$<>")
    // },
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
    formatDatetime(datetime) {
      const match = datetime?.match(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d/);
      return match && match[0]?.replace(/\D/g, '') || '';
    },
    formatTheme(theme, rng) {
      if (!theme) return "";
      if (!rng) return "";
      if (rng < 0 || rng > 999) return "";
      if (!/^[a-zA-Z\-]+$/.test(theme)) return "";
      return theme.toLowerCase() + rng;
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
      
      /*
      let newStr = "";
      for (let i = 0; i < str.length; ) {
        if (str.charAt(i) === "+") { newStr += " "; i++; continue; }
        
        const chunk = str.substring(i, i + 3);
        if (chunk === "~7E") { newStr += "~"; i += 3; continue; }
        if (chunk === "~7C") { newStr += "|"; i += 3; continue; }
        if (chunk === "~2B") { newStr += "+"; i += 3; continue; }
        if (chunk === "~60") { newStr += "`"; i += 3; continue; }

        for (let j = i + 3; j < str.length; ) {
          let bigChunk = str.substring(i, j);
          if (/^(\~[0-9a-fA-F][0-9a-fA-F])$/.test(bigChunk))
          newStr += decodeURIComponent(chunk.replace("~", "%"))
        }
      } */
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
      return date + (time ? "T" + time : "");
    },
    randomInt(min, max) { // returns a number inclusive of min and max
      return Math.floor(Math.random() * (max + 1 - min) + min);
    },
    getUrlBase() {
      return (window.location.host + window.location.pathname).replace(/[\/\\]+$/,'');
    },
    parseEventString(str) {
      if (!str) return null;
      const arr = str.split("|");
      if (arr.length < 3) return null; // require at least a title, location, and start time

      const themeMatch = arr[7] && arr[7].match(/^(?<theme>[a-zA-Z]+)(?<rng>[0-9][0-9][0-9])$/);
      const theme = themeMatch && themeMatch.groups.theme?.toLowerCase();
      const rng = Number(themeMatch && themeMatch.groups.rng || this.randomInt(0,999));

      // Reject this event string if there are malformed dates (it has probably been parsed wrong, i.e. we should have used unibinDecode)
      // Don't reject if the dates are absent entirely
      const start = this.parseDatetime(arr[2]);
      const end = this.parseDatetime(arr[3]);
      if (arr[2] && !start) return null;
      if (arr[3] && !end) return null;
      
      return new Event(
        this.unescapeEventStringPart(arr[0]) || "", // title
        this.unescapeEventStringPart(arr[1]) || "", // location
        start || "", // startDatetime
        end || "", // endDatetime
        this.unescapeEventStringPart(arr[4]) || "", // timezone
        this.unescapeEventStringPart(arr[5]) || "", // rsvp
        this.parseDatetime(arr[6]) || "", // rsvpDate
        !theme ? this.unescapeEventStringPart(arr[7]) : "", // imageUrl
        theme || "", // theme
        rng, // rng
        this.unescapeEventStringPart(arr[8]) || "" // description
      )
    },
    async loadEventFromUrlHash(urlHash) {
      for (const decompress of [false, true]) {
        for (const unibinDecode of [false, true]) {
          if (!unibinDecode && decompress) continue; // this combination never occurs in practice; skip this loop iteration
          for (const uriDecode of [false, true]) {
            let str = urlHash;
            try { if (uriDecode) str = decodeURIComponent(str); }
            catch { continue; }
            if (unibinDecode && !decompress) str = this.decode(str);
            if (unibinDecode && decompress) str = await this.decodeAndDecompress(str);

            const evt = this.parseEventString(str);
            console.log(decompress + ", " + unibinDecode + ", " + uriDecode + ":");
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
        this.formatDatetime(this.event.startDatetime) + "|" +
        this.formatDatetime(this.event.endDatetime) + "|" +
        this.escapeEventStringPart(this.event.timezone) + "|" +
        this.escapeEventStringPart(this.event.rsvp) + "|" +
        this.formatDate(this.event.rsvpDate) + "|" +
        (this.escapeEventStringPart(this.event.imageUrl) || this.formatTheme(this.event.theme, this.event.rng)) + "|" +
        this.escapeEventStringPart(this.event.description)
      );
    },
    eventStringEncoded() { return this.encode(this.eventString); },
    eventUrl() { return new EventUrlInfo(this.urlBase, this.eventString) },
    eventUrlEncoded() { return new EventUrlInfo(this.urlBase, this.eventStringEncoded) },
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
