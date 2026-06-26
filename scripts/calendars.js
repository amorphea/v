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
		encodeGoogleDate(dateObj, isUTC) {
			return dateObj ? this.encode(dateObj.toISOString().replace(/T.*$/, isUTC ? "Z" : "").replace(/-/g, "")) : "";
		},
		encodeGoogleDateTime(dateObj, isUTC) {
			// Example: 20260626T114500Z
			return dateObj ? this.encode(dateObj.toISOString().replace(/\.\d\d\d/, "").replace(/-|:/g, "").replace(/Z$/, isUTC ? "Z" : "")) : "";
		},
		encodeOutlookDateTime(dateObj, isUTC) {
			// Example: 2026-06-26T11%3A45%3A00
			return dateObj ? dateObj.toISOString().replace(/\.\d\d\d/, "").replace(/:/g, "%3A").replace(/Z$/, isUTC ? "Z" : "") : "";
		}
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
			let startIsUtc = !!this.event.utcStartDateObj;
			let endIsUtc = !!this.event.utcEndDateObj;
			
			if (!start || !end || !this.event.title) return null; // these parameters are required for google calendar

			if (this.event.allDay && end.getDate() == start.getDate() && end.getMonth() == start.getMonth() && end.getFullYear() == start.getFullYear()) {
				end = new Date(end); end.setDate(end.getDate() + 1); // google calendar requires all-day events to have start/end dates that are 1 day apart
			}
			
			const dateString = this.event.allDay
				? this.encodeGoogleDate(start, startIsUtc) + "/" + this.encodeGoogleDate(end, endIsUtc)
				: this.encodeGoogleDateTime(start, startIsUtc) + "/" + this.encodeGoogleDateTime(end, endIsUtc);
			
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
			// We just use the wall-clock time here, and hope that the user realises if they're in a different timezone
			// Future improvement: We may be able to convert from a UTC/timezoned time on the event to the current user's local timezone?
			
			let start = this.event.startDateObj;
			let end = this.event.endDateObj;
			if (this.event.allDay && end.getDate() == start.getDate() && end.getMonth() == start.getMonth() && end.getFullYear() == start.getFullYear()) {
				end = new Date(end); end.setDate(end.getDate() + 1); // outlook calendar requires all-day events to have start/end dates that are 1 day apart
			}
			
			return (
				'allday=' + (this.event.allDay ? 'true' : 'false') +
				'&startdt=' + this.encodeOutlookDateTime(start) +
				'&enddt=' + this.encodeOutlookDateTime(end) +
				(this.event.title ? "&subject=" + this.encode(this.event.title) : "") +
				(this.event.location ? "&location=" + this.encode(this.event.location) : "") +
				((this.event.description || this.event.rsvpString) ? "&body=" + this.encode(this.joinTruthyStrings("\r\n\r\n", this.event.rsvpString, this.event.description)) : "")
			);
		}
	}
};
