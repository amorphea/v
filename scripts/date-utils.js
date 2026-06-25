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
