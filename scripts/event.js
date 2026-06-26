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
