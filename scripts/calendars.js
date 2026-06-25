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
		encodeCompactDate(dateObj) {
			return dateObj ? this.encode(dateObj.toISOString().replace(/T.*Z$/, "Z").replace(/T.*$/, "").replace(/-/g, "")) : "";
		},
		encodeCompactDateTime(dateObj) {
			return dateObj ? this.encode(dateObj.toISOString().replace(/\.\d\d\d/, "").replace(/-|:/g, "")) : "";
		},
		joinTruthyStrings(separator, ...strings) {
			return strings.filter(x => !!x).join(separator);
		},
	},
	computed: {
		// See: https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/google.md
		// See: https://stackoverflow.com/questions/10488831/link-to-add-to-google-calendar
		googleCalendarLink() {
			return 'https://calendar.google.com/calendar/r/eventedit?' + this.googleCalendarLinkParams;
		},
		mobileGoogleCalendarLink() {
			return 'https://calendar.google.com/calendar/render?action=TEMPLATE&' + this.googleCalendarLinkParams; // previously tried: https://calendar.google.com/calendar/gp#~calendar:view=e&bm=1?
		},
		mobileGoogleCalendarIntent() {
			return 'intent://https://calendar.google.com/calendar/render?action=TEMPLATE&' + this.googleCalendarLinkParams + '#Intent;scheme=https;package=com.google.android.calendar;S.browser_fallback_url=' + this.encode('https://calendar.google.com/calendar/render?action=TEMPLATE&' + this.googleCalendarLinkParams) + ';end';
		},
		googleCalendarLinkParams() {
			
			let start = this.event.utcStartDateObj || this.event.startDateObj;
			let end = this.event.utcEndDateObj || this.event.endDateObj;
			
			if (!start || !end || !this.event.title) return null; // these parameters are required for google calendar

			if (this.event.allDay && end.getDate() == start.getDate() && end.getMonth() == start.getMonth() && end.getFullYear() == start.getFullYear()) {
				end = new Date(end); end.setDate(end.getDate() + 1); // google calendar requires all-day events to have start/end dates that are 1 day apart
			}
			
			const dateString = this.event.allDay
				? this.encodeCompactDate(start) + "/" + this.encodeCompactDate(end)
				: this.encodeCompactDateTime(start) + "/" + this.encodeCompactDateTime(end);
			
			return (
				'text=' + this.encode(this.event.title) +
				"&dates=" + dateString +
				(this.event.timezone ? "&ctz=" + this.encode(this.event.timezone) : "") +
				(this.event.location ? "&location=" + this.encode(this.event.location) : "") +
				((this.event.description || this.event.rsvpString) ? "&details=" + this.encode(this.joinTruthyStrings("\r\n\r\n", this.event.rsvpString, this.event.description)) : "")
			);
		},
	}
};
