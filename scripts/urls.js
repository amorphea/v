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

const urlDisplayComponent = {
  template: "#url-display",
  components: {
    IconClipboard: { template: "#icon-clipboard" },
    IconClipboardCheck: { template: "#icon-clipboard-check" },
    IconHash: { template: "#icon-hash" },
  },
  props: {
    url: EventUrlInfo,
    urlTitle: String,
    urlFaqCallback: Function,
    urlFaqLinkText: String,
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
    urlFaqCallback: Function,
  },
};
