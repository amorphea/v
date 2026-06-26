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
			else return includeTime ? this.encodeWallClockGoogleDateTime(date) : encodeWallClockGoogleDate(date);
		},
		encodeWallClockGoogleDate(date) {
			// Example: 20260626
			return date ? DateUtils.formatLocalISOTime(date).replace(/T.*$/, "").replace(/-/g, "") : "";
		},
		encodeZonedGoogleDate(date) {
			// Example: 20260626Z
			return date ? date.toISOString().replace(/T.*$/, "Z").replace(/-/g, "") : "";
		},
		encodeWallClockGoogleDateTime(date) {
			// Example: 20260626T114500
			return date ? DateUtils.formatLocalISOTime(date).replace(/\.\d\d\d/, "").replace(/-|:/g, "").replace(/Z$/, "") : "";
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
			// https://www.labnol.org/calendar
			// https://customer.io/tools/calendar-link-generator
			// https://gist.github.com/miwebguy/2e805e343e0d434f06f2194b92b925d8
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
			let start = this.event.utcStartDateObj || this.event.startDateObj;
			let end = this.event.utcEndDateObj || this.event.endDateObj;
			let startIsZoned = !!this.event.utcStartDateObj; // is the start time a 'zoned' time (i.e. one with a timezone) or a 'wall-clock' time?
			let endIsZoned = !!this.event.utcEndDateObj; // is the end time a 'zoned' time (i.e. one with a timezone) or a 'wall-clock' time?
			
			if (!start || !end || !this.event.title) return null; // these parameters are required for google calendar

			if (this.event.allDay && end.getDate() == start.getDate() && end.getMonth() == start.getMonth() && end.getFullYear() == start.getFullYear()) {
				// google calendar requires all-day events to have start/end dates that are 1 day apart
				end = new Date(end);
				end.setDate(end.getDate() + 1);
			}
			
			const dateString = this.encodeGoogleDate(start, startIsZoned, !this.event.allDay) + "/" + this.encodeGoogleDate(end, endIsZoned, !this.event.allDay);
			
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
		outlookCalendarLinkParams() {
			// Outlook ignores UTC times sadly, and appears to have no way to specify a timezone
			// For events with no timezone (startIsUtc == false), we simply print the wall-clock time from the event link
			// For events with a timezone, we take the UTC time and render it as a local time based on the *current* user's current local timezone,
			// so that it should hopefully appear correctly in the current user's Outlook web app

			let startIsUtc = !!this.event.utcStartDateObj;
			let endIsUtc = !!this.event.utcEndDateObj;

			let startStr = startIsUtc ? DateUtils.formatLocalISOTime(this.event.utcStartDateObj) : (this.event.startDate + 'T' + this.event.startTime + ":00"); // formatted as an ISO time e.g. 2026-04-04T16:30:00 (without the 'Z')
			let endStr = endIsUtc ? DateUtils.formatLocalISOTime(this.event.utcEndDateObj) : (this.event.endDate + 'T' + this.event.endTime + ":00");

			// outlook calendar requires all-day events to have start/end dates that are 1 day apart, OR for the end time to be omitted
			// editing the times to achieve the first is tricky here when using wal- clock time strings, so we do the latter if needed instead
			let hideEndTime = this.event.allDay && startStr === endStr;
			
			return (
				'allday=' + (this.event.allDay ? 'true' : 'false') +
				'&startdt=' + this.encodeOutlookDateTime(startStr) +
				(!hideEndTime ? '&enddt=' + this.encodeOutlookDateTime(endStr) : "") +
				(this.event.title ? "&subject=" + this.encode(this.event.title) : "") +
				(this.event.location ? "&location=" + this.encode(this.event.location) : "") +
				((this.event.description || this.event.rsvpString) ? "&body=" + this.encode(this.joinTruthyStrings("\r\n\r\n", this.event.rsvpString, this.event.description)) : "")
			);
		}
	}
};
