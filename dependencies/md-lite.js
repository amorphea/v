/*
MD Lite
https://github.com/croct-tech/md-lite-js
Copyright (c) 2020 Croct.com

License:
MIT License

Copyright (c) 2020 Croct.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


Notes on previous licenses:

At https://github.com/croct-tech/md-lite-js, the location from which the
MD Lite software was sourced, there are two licenses:

 - A README.md file containing a license note (below), added on the 14th of
   September 2023 by user marcospassos with the comment 'initial commit'.
   Note: user marcospassos is a member of the 'croct-tech' organisation
   on GitHub (as of writing this in 2026).
 - A LICENSE file (above, containing an MIT license) added on the 8th of
   November 2023 by user marcospassos with the comment 'Add a license file'.

The README.md license note (below) specifies that 'Dissemination of this
information or reproduction of this material is strictly forbidden unless
prior written permission is obtained from Croct Limited'. The LICENSE file
would appear to provide said written permission, superseding the README.md
license note, so the MD Lite software has been reproduced here under the MIT
license as per the LICENSE file. If this understanding is mistaken and the
LICENSE file does not supersede the README.md license note, then reproduction
of the MD Lite software should be discontinued.

The superseded README.md license note is reproduced below:

> ## License
> 
> Copyright © 2015-2023 Croct Limited, All Rights Reserved.
> 
> All information contained herein is, and remains the property of Croct Limited.
> The intellectual, design and technical concepts contained herein are
> proprietary to Croct Limited s and may be covered by U.S. and Foreign Patents,
> patents in process, and are protected by trade secret or copyright law.
> Dissemination of this information or reproduction of this material is strictly
> forbidden unless prior written permission is obtained from Croct Limited.

*/



// ast.js

// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });



// index.js

// "use strict";
// var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
//     if (k2 === undefined) k2 = k;
//     var desc = Object.getOwnPropertyDescriptor(m, k);
//     if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
//       desc = { enumerable: true, get: function() { return m[k]; } };
//     }
//     Object.defineProperty(o, k2, desc);
// }) : (function(o, m, k, k2) {
//     if (k2 === undefined) k2 = k;
//     o[k2] = m[k];
// }));
// var __exportStar = (this && this.__exportStar) || function(m, exports) {
//     for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// __exportStar(require("./ast"), exports);
// __exportStar(require("./parsing"), exports);
// __exportStar(require("./rendering"), exports);



// parsing.js

"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.parse = parse;
// exports.unescape = unescape;
function parse(markdown) {
    return MarkdownParser.parse(markdown);
}
function unescape(input) {
    if (!input.includes('\\')) {
        // Optimization for cases where there are no escape sequences
        return input;
    }
    let text = '';
    for (let index = 0; index < input.length; index++) {
        const char = input[index];
        if (char === '\\' && index + 1 < input.length) {
            text += input[++index];
            continue;
        }
        text += char;
    }
    return text;
}
class MismatchError extends Error {
    constructor() {
        super('Mismatched token');
        Object.setPrototypeOf(this, MismatchError.prototype);
    }
}
class MarkdownParser {
    constructor(input) {
        this.index = 0;
        this.chars = [...input];
    }
    static parse(input) {
        return new MarkdownParser(input).parseNext();
    }
    parseNext(end = '') {
        const root = {
            type: 'fragment',
            children: [],
            source: '',
        };
        const startIndex = this.index;
        let text = '';
        let paragraphStartIndex = this.index;
        let textStartIndex = this.index;
        while (!this.done) {
            const escapedText = this.parseText('');
            if (escapedText !== '') {
                text += escapedText;
                continue;
            }
            if (end !== '' && (this.matches(end) || this.matches(...MarkdownParser.NEWLINE))) {
                break;
            }
            if (this.matches(...MarkdownParser.NEW_PARAGRAPH)) {
                const paragraphEndIndex = this.index;
                while (MarkdownParser.NEWLINE.includes(this.current)) {
                    this.advance();
                }
                if (text !== '' || root.children.length > 0) {
                    let paragraph = root.children[root.children.length - 1];
                    if (paragraph?.type !== 'paragraph') {
                        paragraph = {
                            type: 'paragraph',
                            children: root.children,
                            source: '',
                        };
                        root.children = [paragraph];
                    }
                    paragraph.source = this.getSlice(paragraphStartIndex, paragraphEndIndex);
                    if (text !== '') {
                        paragraph.children.push({
                            type: 'text',
                            content: text,
                            source: this.getSlice(textStartIndex, paragraphEndIndex),
                        });
                        text = '';
                    }
                    root.children.push({
                        type: 'paragraph',
                        children: [],
                        source: '',
                    });
                }
                paragraphStartIndex = this.index;
                textStartIndex = this.index;
                continue;
            }
            const nodeStartIndex = this.index;
            let node = null;
            try {
                node = this.parseCurrent();
            }
            catch (error) {
                if (!(error instanceof MismatchError)) {
                    /* istanbul ignore next */
                    throw error;
                }
            }
            if (node === null) {
                this.seek(nodeStartIndex);
                text += this.current;
                this.advance();
                continue;
            }
            let parent = root.children[root.children.length - 1];
            if (parent?.type !== 'paragraph') {
                parent = root;
            }
            if (text !== '') {
                parent.children.push({
                    type: 'text',
                    content: text,
                    source: this.getSlice(textStartIndex, nodeStartIndex),
                });
            }
            text = '';
            textStartIndex = this.index;
            parent.children.push(node);
        }
        if (text !== '') {
            let parent = root.children[root.children.length - 1];
            if (parent?.type !== 'paragraph') {
                parent = root;
            }
            parent.children.push({
                type: 'text',
                content: text,
                source: this.getSlice(textStartIndex, this.index),
            });
        }
        const lastNode = root.children[root.children.length - 1];
        if (lastNode?.type === 'paragraph') {
            if (lastNode.children.length === 0) {
                root.children.pop();
            }
            else {
                lastNode.source = this.getSlice(paragraphStartIndex, this.index);
            }
        }
        if (root.children.length === 1) {
            return root.children[0];
        }
        root.source = this.getSlice(startIndex, this.index);
        return root;
    }
    parseCurrent() {
        const char = this.lookAhead();
        const startIndex = this.index;
        switch (char) {
            case '*':
            case '_': {
                const delimiter = this.matches('**') ? '**' : char;
                this.advance(delimiter.length);
                const children = this.parseNext(delimiter);
                this.match(delimiter);
                return {
                    type: delimiter.length === 1 ? 'italic' : 'bold',
                    children: children,
                    source: this.getSlice(startIndex, this.index),
                };
            }
            case '~': {
                this.match('~~');
                const children = this.parseNext('~~');
                this.match('~~');
                return {
                    type: 'strike',
                    children: children,
                    source: this.getSlice(startIndex, this.index),
                };
            }
            case '`': {
                if (this.matches('```')) {
                    return null;
                }
                const delimiter = this.matches('``') ? '``' : '`';
                this.match(delimiter);
                const content = this.parseText(delimiter).trim();
                if (this.matches('```')) {
                    return null;
                }
                this.match(delimiter);
                return {
                    type: 'code',
                    content: content,
                    source: this.getSlice(startIndex, this.index),
                };
            }
            case '!': {
                this.advance();
                this.match('[');
                const alt = this.parseText(']');
                this.match('](');
                const src = this.parseText(')');
                this.match(')');
                return {
                    type: 'image',
                    src: src,
                    alt: alt,
                    source: this.getSlice(startIndex, this.index),
                };
            }
            case '[': {
                this.advance();
                const label = this.parseNext(']');
                this.match('](');
                const href = this.parseText(')', '"');
                let title;
                if (this.matches('"')) {
                    this.match('"');
                    title = this.parseText('"');
                    this.match('"');
                }
                this.match(')');
                return {
                    type: 'link',
                    href: href.trim(),
                    ...(title !== undefined ? { title: title } : {}),
                    children: label,
                    source: this.getSlice(startIndex, this.index),
                };
            }
            default:
                return null;
        }
    }
    parseText(...end) {
        let text = '';
        while (!this.done) {
            if (this.current === '\\' && this.index + 1 < this.length) {
                this.advance();
                text += this.current;
                this.advance();
                continue;
            }
            if (end.some(token => (token === '' || this.matches(token))) || this.matches(...MarkdownParser.NEWLINE)) {
                break;
            }
            text += this.current;
            this.advance();
        }
        return text;
    }
    get done() {
        return this.index >= this.length;
    }
    get length() {
        return this.chars.length;
    }
    get current() {
        return this.chars[this.index];
    }
    advance(length = 1) {
        this.index += length;
    }
    seek(index) {
        this.index = index;
    }
    matches(...lookahead) {
        return lookahead.some(substring => this.lookAhead(substring.length) === substring);
    }
    match(...lookahead) {
        for (const substring of lookahead) {
            if (this.lookAhead(substring.length) === substring) {
                this.advance(substring.length);
                return;
            }
        }
        throw new MismatchError();
    }
    lookAhead(length = 1) {
        if (length === 1) {
            return this.current;
        }
        return this.getSlice(this.index, this.index + length);
    }
    getSlice(start, end) {
        return this.chars
            .slice(start, end)
            .join('');
    }
}
MarkdownParser.NEWLINE = ['\r\n', '\r', '\n'];
MarkdownParser.NEW_PARAGRAPH = MarkdownParser.NEWLINE
    .flatMap(prefix => MarkdownParser.NEWLINE.map(suffix => prefix + suffix));



// rendering.js

"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.render = render;
// const parsing_1 = require("./parsing");
function render(markdown, visitor) {
    return visit(typeof markdown === 'string' ? (0, parsing_1.parse)(markdown) : markdown, visitor);
}
function visit(root, visitor) {
    let index = 0;
    function visitNode(node) {
        switch (node.type) {
            case 'text':
                return visitor.text({
                    ...node,
                    index: index++,
                });
            case 'bold':
                return visitor.bold({
                    type: node.type,
                    children: visitNode(node.children),
                    source: node.source,
                    index: index++,
                });
            case 'italic':
                return visitor.italic({
                    type: node.type,
                    children: visitNode(node.children),
                    index: index++,
                    source: node.source,
                });
            case 'strike':
                return visitor.strike({
                    type: node.type,
                    children: visitNode(node.children),
                    index: index++,
                    source: node.source,
                });
            case 'code':
                return visitor.code({
                    ...node,
                    index: index++,
                });
            case 'image':
                return visitor.image({
                    ...node,
                    index: index++,
                });
            case 'link':
                return visitor.link({
                    type: node.type,
                    href: node.href,
                    title: node.title,
                    children: visitNode(node.children),
                    index: index++,
                    source: node.source,
                });
            case 'paragraph': {
                return visitor.paragraph({
                    type: node.type,
                    children: node.children.map(child => visitNode(child)),
                    index: index++,
                    source: node.source,
                });
            }
            case 'fragment':
                return visitor.fragment({
                    type: node.type,
                    children: node.children.map(child => visitNode(child)),
                    index: index++,
                    source: node.source,
                });
        }
    }
    return visitNode(root);
}
