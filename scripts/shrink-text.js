class ShrinkText {
	// Based upon text-fit.js by STRML
	//
	// textFit v2.3.1
	// Previously known as jQuery.textFit
	// 11/2014 by STRML (strml.github.com)
	// MIT License
	//
	// The MIT License (Expat License):
	//
	// Copyright (c) 2014 STRML (strml.github.com)
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy of this
	// software and associated documentation files (the "Software"), to deal in the Software
	// without restriction, including without limitation the rights to use, copy, modify,
	// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
	// permit persons to whom the Software is furnished to do so, subject to the following
	// conditions:
	//
	// The above copyright notice and this permission notice shall be included in all copies
	// or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
	// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
	// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
	// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
	// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	static shrinkText(element, width, maxHeight) {
		if (!isElement(element)) {
			return false;
		}

		var innerSpan, originalHeight, originalHTML, originalWidth;
		var low, mid, high;

		// Get element data.
		originalHTML = el.innerHTML;
		originalWidth = innerWidth(el);
		originalHeight = innerHeight(el);

		// Add textFitted span inside this container.
		innerSpan = document.createElement('span');
		innerSpan.className = 'textFitted';
		// Inline block ensure it takes on the size of its contents, even if they are enclosed
		// in other tags like <p>
		innerSpan.style['display'] = 'inline-block';
		innerSpan.innerHTML = originalHTML;
		el.innerHTML = '';
		el.appendChild(innerSpan);

		// Prepare & set alignment
		if (settings.alignHoriz) {
			el.style['text-align'] = 'center';
			innerSpan.style['text-align'] = 'center';
		}

		low = settings.minFontSize;
		high = settings.maxFontSize;

		// Binary search for highest best fit
		var size = low;
		while (low <= high) {
			mid = (high + low) >> 1;
			innerSpan.style.fontSize = mid + 'px';
			var innerSpanBoundingClientRect = innerSpan.getBoundingClientRect();
			if (
				innerSpanBoundingClientRect.width <= originalWidth 
				&& (settings.widthOnly || innerSpanBoundingClientRect.height <= originalHeight)
			) {
				size = mid;
				low = mid + 1;
			} else {
				high = mid - 1;
			}
			// await injection point
		}
		// found, updating font if differs:
		if( innerSpan.style.fontSize != size + 'px' ) innerSpan.style.fontSize = size + 'px';

	}
}
