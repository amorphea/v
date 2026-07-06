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

// For the most complete documentation on calendar links, see:
// https://interactiondesignfoundation.github.io/add-event-to-calendar-docs/

const calendarButtonsComponent = {
	template: "#calendar-buttons",
	components: {
	
	},
	props: {
		event: Event
	},
	data() {
		return { }
	},
	methods: {
		encode(str) {
			return encodeURIComponent(str);
		},
		encodeGoogleDate(date, isZoned, includeTime) {
			if (isZoned) return includeTime ? this.encodeZonedGoogleDateTime(date) : this.encodeZonedGoogleDate(date);
			else return includeTime ? this.encodeWallClockGoogleDateTime(date) : this.encodeWallClockGoogleDate(date);
		},
		encodeWallClockGoogleDate(date) {
			// Example: 20260626
			return date ? DateUtils.formatLocalISOTime(date).replace(/T.*$/, "").replace(/-/g, "") : "";
		},
		encodeWallClockGoogleDateTime(date) {
			// Example: 20260626T114500
			return date ? DateUtils.formatLocalISOTime(date).replace(/\.\d\d\d/, "").replace(/-|:/g, "").replace(/Z$/, "") : "";
		},
		encodeZonedGoogleDate(date) {
			// Example: 20260626Z
			return date ? date.toISOString().replace(/T.*$/, "Z").replace(/-/g, "") : "";
		},
		encodeZonedGoogleDateTime(date) {
			// Example: 20260626T114500Z
			return date ? date.toISOString().replace(/\.\d\d\d/, "").replace(/-|:/g, "") : "";
		},
		encodeOutlookDateTime(dateISOStr) {
			// Example: 2026-06-26T11%3A45%3A00
			return dateISOStr ? dateISOStr.replace(/\.\d\d\d/, "").replace(/:/g, "%3A") : "";
		},
		joinTruthyStrings(separator, ...strings) {
			return strings.filter(x => !!x).join(separator);
		},
		fixAllDayEventEnd(start, end) {
			// Some calendars require all-day events to have start/end dates that are 1 day apart
			// This method returns an end date which meets that requirement (but ONLY if the start and end dates were identical originally; it leaves multi-day all day events untouched)
			if (start && end && end.getDate() == start.getDate() && end.getMonth() == start.getMonth() && end.getFullYear() == start.getFullYear()) {
				end = new Date(end);
				end.setDate(end.getDate() + 1);
			}
			return end;
		},
		googleCalendarLinkPrefix() {
			return 'calendar.google.com/calendar/render?action=TEMPLATE&';
			// Other options, which didn't work well on mobile:
			// calendar.google.com/calendar/r/eventedit?
			// calendar.google.com/calendar/gp#~calendar:view=e&bm=1?
			// See:
			// https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/google.md
			// https://stackoverflow.com/questions/10488831/link-to-add-to-google-calendar
		},
		outlookCalendarLinkPrefix() {
			return 'outlook.live.com/calendar/0/action/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&';
			// Other options and examples:
			// https://outlook.live.com/calendar/0/action/compose?subject=Title&allday=false&body=Description&startdt=2026-07-26T08%3A00%3A00&enddt=2026-07-26T08%3A30%3A00&location=Location&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent
			// https://outlook.office.com/calendar/deeplink/compose?&subject=Sushi%20Training&location=Convention%20Center&startdt=2016-02-29T19%3A00%3A00&enddt=2016-03-01T00%3A00%3A05&body=Body+text
			// https://outlook.office.com/owa/?path=/calendar/action/compose
			// https://outlook.office.com/calendar/0/deeplink/compose?
			// https://outlook.office.com/calendar/deeplink/compose?
			// See:
			// https://interactiondesignfoundation.github.io/add-event-to-calendar-docs/services/outlook-web.html
			// https://www.labnol.org/calendar
			// https://customer.io/tools/calendar-link-generator
			// https://gist.github.com/miwebguy/2e805e343e0d434f06f2194b92b925d8
		},
		office365CalendarLinkPrefix() {
			return 'outlook.office.com/calendar/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&';
		},
		yahooCalendarLinkPrefix() {
			return 'calendar.yahoo.com/?v=60&';
			// See: https://interactiondesignfoundation.github.io/add-event-to-calendar-docs/services/yahoo.html
		},
	},
	computed: {
		isAndroid() {
			return navigator.userAgent.toLowerCase().indexOf('android') > -1;
		},
		googleCalendarLink() {
			return 'https://' + this.googleCalendarLinkPrefix() + this.googleCalendarLinkParams;
		},
		mobileGoogleCalendarIntent() {
			return (
				'intent://' +
				this.googleCalendarLinkPrefix() + this.googleCalendarLinkParams +
				'#Intent;scheme=https;package=com.google.android.calendar;S.browser_fallback_url=' +
				this.encode('https://' + this.googleCalendarLinkPrefix() + this.googleCalendarLinkParams) +
				';end'
			);
		},
		googleCalendarLinkParams() {
			// There are two categories of event times to deal with: 'zoned' times (with a timezone) and 'wall-clock' times (with no timezone)
			//  - For zoned times, we can use utcStartDateObj, and then call .toISOString() to print it for the calendar link
			//  - For wall-clock times, we can use startDateObj, and then call DateUtils.formatLocalISOTime() to print it for the calendar link
			// 
			// Note that we CANNOT use .toISOString() on a wall-clock time. The startDateObj is a local representation of the wall-clock time, stored
			// as a UTC time based on the user's current timezone (different user devices, in different timezones, will use a different UTC time to represent
			// the same wall-clock time). Calling DateUtils.formatLocalISOTime() safely converts the time back to a wall-clock representation
			// based on the current user's timezone
			
			let start = this.event.utcStartDateObj || this.event.startDateObj;
			let end = this.event.utcEndDateObj || this.event.endDateObj;
			let startIsZoned = !!this.event.utcStartDateObj;
			let endIsZoned = !!this.event.utcEndDateObj;
			
			if (!start || !end || !this.event.title) return null; // these parameters are required by Google Calendar

			if (this.event.allDay) end = this.fixAllDayEventEnd(start, end);
			
			const dateString = this.encodeGoogleDate(start, startIsZoned, !this.event.allDay) + "/" + this.encodeGoogleDate(end, endIsZoned, !this.event.allDay); // omit the time for all-day events, include it otherwise
			
			return (
				'text=' + this.encode(this.event.title) +
				"&dates=" + dateString +
				(this.event.timezone ? "&ctz=" + this.encode(this.event.timezone) : "") +
				(this.event.location ? "&location=" + this.encode(this.event.location) : "") +
				((this.event.description || this.event.rsvpString) ? "&details=" + this.encode(this.joinTruthyStrings("\r\n\r\n", this.event.rsvpString, this.event.description)) : "")
			);
		},
		outlookCalendarLink() {
			return 'https://' + this.outlookCalendarLinkPrefix() + this.outlookCalendarLinkParams;
		},
		office365CalendarLink() {
			return 'https://' + this.office365CalendarLinkPrefix() + this.outlookCalendarLinkParams;
		},
		outlookCalendarLinkParams() {
			// Outlook appears to ignore UTC times sadly (adding a 'Z' didn't work when tested), and it appears to have no way to specify a timezone separately either,
			// so we handle the next part differently from Google:
			// 
			// There are two categories of event times to deal with: 'zoned' times (with a timezone) and 'wall-clock' times (with no timezone)
			//  - For wall-clock times, we can use startDateObj, and then call DateUtils.formatLocalISOTime() to print it for the calendar link (same as Google)
			//  - For zoned times, we can use utcStartDateObj, and then render it into the *current* user's local timezone using DateUtils.formatLocalISOTime(),
			//    so that it should hopefully apppear correctly in the current user's Outlook web app
			//
			// I.e. in either case we just call DateUtils.formatLocalISOTime()
			// :)

			let start = this.event.utcStartDateObj || this.event.startDateObj;
			let end = this.event.utcEndDateObj || this.event.endDateObj;
			let startIsZoned = !!this.event.utcStartDateObj;
			let endIsZoned = !!this.event.utcEndDateObj;

			if (this.event.allDay) end = this.fixAllDayEventEnd(start, end);
			
			return (
				'allday=' + (this.event.allDay ? 'true' : 'false') +
				'&startdt=' + this.encodeOutlookDateTime(DateUtils.formatLocalISOTime(start)) +
				'&enddt=' + this.encodeOutlookDateTime(DateUtils.formatLocalISOTime(end)) +
				(this.event.title ? "&subject=" + this.encode(this.event.title) : "") +
				(this.event.location ? "&location=" + this.encode(this.event.location) : "") +
				((this.event.description || this.event.rsvpString) ? "&body=" + this.encode(this.joinTruthyStrings("\r\n\r\n", this.event.rsvpString, this.event.description)) : "")
			);
		},
		yahooCalendarLink() {
			return 'https://' + this.yahooCalendarLinkPrefix() + this.yahooCalendarLinkParams;
		},
		yahooCalendarLinkParams() {
			// Yahoo appears to handle timezones the same way as Google, so we do the same here as above
			// It also uses the same date-time encoding format to Google (though the start and end times are separate URL parameters, rather than being stuck together)
			
			let start = this.event.utcStartDateObj || this.event.startDateObj;
			let end = this.event.utcEndDateObj || this.event.endDateObj;
			let startIsZoned = !!this.event.utcStartDateObj;
			let endIsZoned = !!this.event.utcEndDateObj;

			if (!start || !this.event.title) return null; // these parameters are required by Yahoo

			if (this.event.allDay) end = this.fixAllDayEventEnd(start, end);
			
			return (
				"TITLE=" + this.encode(this.event.title) +
				"&ST=" + this.encodeGoogleDate(start, startIsZoned, !this.event.allDay) + // omit the time for all-day events, include it otherwise
				(end ? "&ET=" + this.encodeGoogleDate(end, endIsZoned, !this.event.allDay) : "") +
				(this.event.location ? "&in_loc=" + this.encode(this.event.location) : "") +
				((this.event.description || this.event.rsvpString) ? "&DESC=" + this.encode(this.joinTruthyStrings("\r\n\r\n", this.event.rsvpString, this.event.description)) : "")
			);
		},
		icsFileUri() {
			return "data:text/calendar;charset=UTF-8," + encodeURIComponent(this.icsFileContents);
		},
		icsFileContents() {
			// See: https://en.wikipedia.org/wiki/ICalendar
			// Archive: https://en.wikipedia.org/w/index.php?title=ICalendar&oldid=1337928525
			// See: https://www.rfc-editor.org/info/rfc5545/
			
			function encodeIcsLine(line) {
				// Each line must be at most 75 bytes long, not including the CR LF at the end
				// (note this is *bytes* not two-byte unicode characters, so we set the limit at 30 characters)
				// Longer lines are 'folded' by prefixing the next line with a single space character,
				// see https://www.rfc-editor.org/info/rfc5545/#section-3
				// Carriage returns, line feeds, and backslashes are escaped with backslashes
				
				line = line.replace(/\\/g, "\\").replace(/\r/g, "\\r").replace(/\n/g, "\\n");
				let foldedLine = "";
				while (line !== "") {
					if (foldedLine !== "") foldedLine += "\r\n ";
					foldedLine += line.substring(0, 30);
					line = line.substring(30);
				}
				return foldedLine + "\r\n";
			}

			let start = this.event.utcStartDateObj || this.event.startDateObj;
			let end = this.event.utcEndDateObj || this.event.endDateObj;
			let startIsZoned = !!this.event.utcStartDateObj;
			let endIsZoned = !!this.event.utcEndDateObj;

			if (this.event.allDay) end = this.fixAllDayEventEnd(start, end);

			
			// TODO: Add URI, DTSTAMP, more timezone handling, image, source url, etc
			return (
				encodeIcsLine("BEGIN:VCALENDAR") +
				encodeIcsLine("VERSION:2.0") +
				encodeIcsLine("PRODID:-//amorphea//Grevillea//1.0") +
				encodeIcsLine("BEGIN:VEVENT") +
				encodeIcsLine("DTSTART:" + this.encodeGoogleDate(start, startIsZoned, !this.event.allDay)) +
				encodeIcsLine("DTEND:" + this.encodeGoogleDate(end, endIsZoned, !this.event.allDay)) +
				encodeIcsLine("SUMMARY:" + this.event.title) +
				encodeIcsLine("LOCATION:" + this.event.location) +
				encodeIcsLine("DESCRIPTION:" + this.event.description) +
				encodeIcsLine("END:VEVENT") +
				encodeIcsLine("END:VCALENDAR")
			);
		},
	}
};
