function updateClipboard(CopyData) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(CopyData).then(() => {
            console.log('navigator.clipboard - Copying to clipboard was successful!');
        }).catch(() => {
            GM_setClipboard(CopyData);
            console.log('GM_setClipboard fallback - Copying to clipboard was successful!');
        });
    } else {
        GM_setClipboard(CopyData);
        console.log('GM_setClipboard - Copying to clipboard was successful!');
    }
}


function MaxZIndexFromPoint(selector) {
    //console.log(selector, getAllElementsFromPoint(document.querySelector(selector)) + 1)
    return getAllElementsFromPoint(document.querySelector(selector))
}

function getMaxZIndex() {
    return Math.max(
        ...Array.from(document.querySelectorAll('body *'), el =>
            parseFloat(window.getComputedStyle(el).zIndex),
        ).filter(zIndex => !Number.isNaN(zIndex)),
        1,
    );
}

function getZIndex(el) {
    if (el && el !== document.body && el !== window && el !== document && el !== document.documentElement) {
        var z = window.document.defaultView.getComputedStyle(el).getPropertyValue('z-index');
        if (isNaN(z)) return getZIndex(el.parentNode);
    }
    return z;
};

function getPosition(element) {
    let rect = element.getBoundingClientRect()
    return {
        x: rect.x,
        y: rect.y
    };
}
function getAllElementsFromPoint(el) {
    const elements = [];
    const displayValues = [];
    const zIndices = [];
    
    const pos = getPosition(el);
    let item = document.elementFromPoint(pos.x, pos.y);
    
    while (
        item &&
        item !== document.body &&
        item !== document.documentElement &&
        item !== el
    ) {
        elements.push(item);
        displayValues.push(item.style.display);
        
        const zI = parseInt(window.getComputedStyle(item).zIndex);
        if (!isNaN(zI)) {
            zIndices.push(zI);
        }
        
        item.style.display = "none";
        item = document.elementFromPoint(pos.x, pos.y);
    }
    
    // Restore display styles
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = displayValues[i];
    }
    
    return zIndices.length > 0 ? Math.max(...zIndices) : 1;
}


function getElementOffset(el) {
    let rect = el.getBoundingClientRect()
    return {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height,
    };
}

function getRelativeOffset(el) {
    return {
        top: el.offsetTop,
        bottom: el.offsetTop + el.offsetHeight,
        left: el.offsetLeft,
        right: el.offsetLeft + el.offsetWidth,
        width: el.offsetWidth,
        height: el.offsetHeight,
    };
}

function getNodeTextElementOffset(node) {
    let textNode = getTextNodesIn(node, false);
    if (!textNode) {
        return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0,
        };
    }

    try {
        const range = document.createRange();
        range.selectNode(textNode);
        const rect = range.getBoundingClientRect();

        return {
            top: rect.top,
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height,
        };
    } catch (error) {
        console.error(error);
        return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0,
        };
    }
}


function getFirstTextNode(node, includeWhitespaceNodes = false) {
    const nonWhitespaceMatcher = /\S/;
    let result = null;

    function traverse(currentNode) {
        if (currentNode.nodeType === Node.TEXT_NODE) {
            if (includeWhitespaceNodes || nonWhitespaceMatcher.test(currentNode.nodeValue)) {
                result = currentNode;
                return true; // stop traversal once found
            }
        } else {
            for (let i = 0; i < currentNode.childNodes.length; i++) {
                if (traverse(currentNode.childNodes[i])) return true;
            }
        }
        return false;
    }

    traverse(node);
    return result;
}

function getDefaultFontSize() {
    const element = document.createElement('div');
    element.style.width = '1rem';
    element.style.position = 'absolute'; // ensure no layout impact
    element.style.visibility = 'hidden'; // keep invisible but measurable
    element.style.height = '0';          // no height needed
    document.body.appendChild(element);

    const widthStr = window.getComputedStyle(element).width;
    const widthMatch = widthStr.match(/[\d.]+/); // allow decimals

    element.remove();

    if (!widthMatch) return null;

    const result = parseFloat(widthMatch[0]);
    return isNaN(result) ? null : result;
}


//백그라운드 이미지 가져오기
function GetBackGroundUrl(area) {
    try {
        // Get computed 'background' style of the element (may include multiple properties)
        const backgroundStyle = window.getComputedStyle(area).getPropertyValue('background');

        // Extract the URL inside url("...") or url('...') or url(...)
        const match = backgroundStyle.match(/url\(["']?(.*?)["']?\)/);

        return match ? match[1] : '';
    } catch (err) {
        console.error('GetBackGroundUrl error:', err);
        return '';
    }
}


//Match
function MatchRegex(Area, regex, attributeToSearch) {
    //console.log(Area, regex, attributeToSearch)
    const output = [];
    if (attributeToSearch) {
        for (let element of Area.querySelectorAll(`[${attributeToSearch}]`)) {
            //console.log(regex.test(element.getAttribute(attributeToSearch)), element)
            if (regex.test(element.getAttribute(attributeToSearch))) {
                //console.log(element)
                output.push(element);
            }
        }
    } else {
        for (let element of Area.querySelectorAll('*')) {
            for (let attribute of element.attributes) {
                if (regex.test(attribute.value)) {
                    //console.log(element)
                    output.push(element);
                }
            }
        }
    }
    return output;
}

// Not Match
function NotMatchRegex(Area, regex, attributeToSearch) {
    const output = [];
    if (attributeToSearch) {
        for (let element of Area.querySelectorAll(`[${attributeToSearch}]`)) {
            if (!regex.test(element.getAttribute(attributeToSearch))) {
                //console.log(element)
                output.push(element);
            }
        }
    } else {
        for (let element of Area.querySelectorAll('*')) {
            for (let attribute of element.attributes) {
                if (!regex.test(attribute.value)) {
                    //console.log(element)
                    output.push(element);
                }
            }
        }
    }
    return output;
}

function querySelectorAllRegex(Area, regex, attributeToSearch) {
    const output = [];
    if (attributeToSearch === 'href') {
        for (let element of Area.querySelectorAll('A')) {
            if (element.href && !regex.test(element.href)) {
                //console.log(element, regex)
                output.push(element);
            }
        }
    } else if (attributeToSearch) {
        for (let element of Area.querySelectorAll(`[${attributeToSearch}]`)) {
            if (!regex.test(element.getAttribute(attributeToSearch))) {
                console.log(element, regex)
                output.push(element);
            }
        }
    } else {
        for (let element of Area.querySelectorAll('*')) {
            for (let attribute of element.attributes) {
                if (!regex.test(attribute.value)) {
                    console.log(element)
                    output.push(element);
                }
            }
        }
    }
    return output;
}

function byteLengthOf(text, maxByte) {
    let byteCount = 0;
    let cutIndex = text.length;

    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);

        if (code < 0x0080) {
            byteCount += 1;
        } else if (code < 0x0800) {
            byteCount += 2;
        } else if (code < 0xD800) {
            byteCount += 3;
        } else if (code < 0xDC00) {
            const lo = text.charCodeAt(i + 1);
            if (i + 1 < text.length && lo >= 0xDC00 && lo <= 0xDFFF) {
                byteCount += 4;
                i++; // skip low surrogate
            } else {
                throw new Error("UCS-2 String malformed");
            }
        } else if (code < 0xE000) {
            throw new Error("UCS-2 String malformed");
        } else {
            byteCount += 3;
        }

        if (byteCount >= maxByte) {
            cutIndex = i;
            break;
        }
    }

    if (byteCount >= maxByte) {
        const truncated = text.slice(0, cutIndex).replace(/(、|,)$/, '').trim();
        return truncated + '…';
    }

    return text;
}


function byteLengthOfCheck(TitleText) {
    if (typeof TitleText === 'undefined') return 0;

    let lineByte = 0;
    for (let i = 0; i < TitleText.length; i++) {
        const code = TitleText.charCodeAt(i);

        if (code < 0x0080) {
            lineByte += 1;
        } else if (code < 0x0800) {
            lineByte += 2;
        } else if (code < 0xD800) {
            lineByte += 3;
        } else if (code < 0xDC00) {
            const lo = TitleText.charCodeAt(++i);
            if (i < TitleText.length && lo >= 0xDC00 && lo <= 0xDFFF) {
                lineByte += 4;
            } else {
                throw new Error("UCS-2 String malformed");
            }
        } else if (code < 0xE000) {
            throw new Error("UCS-2 String malformed");
        } else {
            lineByte += 3;
        }
    }

    return lineByte;
}


function SearchChar(text, char) {
    const regex = new RegExp(char, 'g');
    const matches = text.match(regex);
    return matches ? matches[matches.length - 1] : '';
}


function getFlag(text) {
    const points = [];
    for (let i = text.length - 1; i >= 0; i--) {
        const code = text.charCodeAt(i);
        // Full-width punctuation/symbols, excluding full-width colon (：)
        if (code > 65280 && code < 65375 && code !== 65306) {
            console.log(i, code, String.fromCodePoint(code));
            points.push(i + 1);
        }
    }
    return points;
}


//ingnore childNodes Text
function ignoreChildNodesText(element) {
    if (!(element instanceof Element)) return '';

    let result = '';
    for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            result += node.nodeValue;
        }
    }

    return result.replace(/\s+/g, ' ').trim();
}


// innerText except A tag
function getDirectInnerText(el) {
  if (!(el instanceof Element)) return '';
  let parts = [];

  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      parts.push(node.nodeValue);
    }
    else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
      parts.push(node.textContent);
    }
  }

  // Join, trim, and collapse multiple spaces
  return parts.join('').replace(/\s+/g, ' ').trim();
}


//첫글자 대문자
function nameCorrection(str) {
    if (typeof str !== 'string') return '';

    return str
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .split(' ')
        .map(word =>
            word.replace(/(^\w|[-'][a-z])/g, match => match.toUpperCase())
        )
        .join(' ');
}


//첫문자 대문자 나머지 소문자
function capitalize(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, ch => ch.toUpperCase());
}


//파일명 사용불가 문자 전각문자로 변환
function FilenameConvert(text) {
    if (typeof text !== 'string') return '';

    // Forbidden characters in filenames (Windows) → replace with fullwidth versions
    const ExcludeChar = /[<>:"/\\|?*]/g;

    return text.replace(ExcludeChar, char => 
        String.fromCharCode(char.charCodeAt(0) + 65248)
    );
}

const MONTH_MAP = {
  jan: '01', feb: '02', mar: '03', apr: '04',
  may: '05', jun: '06', jul: '07', aug: '08',
  sep: '09', oct: '10', nov: '11', dec: '12',
  january: '01', february: '02', march: '03', april: '04',
  june: '06', july: '07', august: '08', september: '09',
  october: '10', november: '11', december: '12'
};

function getNumericMonth(monthInput) {
  if (typeof monthInput !== 'string') return null;

  const key = monthInput.trim().toLowerCase().slice(0, 3);
  const num = MONTH_MAP[key] || null;

  if (!num) {
    console.warn(`getNumericMonth: invalid month “${monthInput}”`);
  }
  return num;
}


/**
 * 해당 함수는
 * php의 mb_convert_kana의 Javascript 버전이다.
 * 히라가나는 반각이 없음.
 */

function mbConvertKana(text, option) {
    let katahan, kanazen, hirazen, mojilength, i, re;
    katahan = ["ｶﾞ", "ｷﾞ", "ｸﾞ", "ｹﾞ", "ｺﾞ", "ｻﾞ", "ｼﾞ", "ｽﾞ", "ｾﾞ", "ｿﾞ", "ﾀﾞ", "ﾁﾞ", "ﾂﾞ", "ﾃﾞ", "ﾄﾞ", "ﾊﾞ", "ﾊﾟ", "ﾋﾞ", "ﾋﾟ", "ﾌﾞ", "ﾌﾟ", "ﾍﾞ", "ﾍﾟ", "ﾎﾞ", "ﾎﾟ", "ｳﾞ", "ｰ", "ｧ", "ｱ", "ｨ", "ｲ", "ｩ", "ｳ", "ｪ", "ｴ", "ｫ", "ｵ", "ｶ", "ｷ", "ｸ", "ｹ", "ｺ", "ｻ", "ｼ", "ｽ", "ｾ", "ｿ", "ﾀ", "ﾁ", "ｯ", "ﾂ", "ﾃ", "ﾄ", "ﾅ", "ﾆ", "ﾇ", "ﾈ", "ﾉ", "ﾊ", "ﾋ", "ﾌ", "ﾍ", "ﾎ", "ﾏ", "ﾐ", "ﾑ", "ﾒ", "ﾓ", "ｬ", "ﾔ", "ｭ", "ﾕ", "ｮ", "ﾖ", "ﾗ", "ﾘ", "ﾙ", "ﾚ", "ﾛ", "ﾜ", "ｦ", "ﾝ", "ｶ", "ｹ", "ﾜ", "ｲ", "ｴ", "ﾞ", "ﾟ"];
    kanazen = ["ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ", "ゾ", "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "パ", "ビ", "ピ", "ブ", "プ", "ベ", "ペ", "ボ", "ポ", "ヴ", "ー", "ァ", "ア", "ィ", "イ", "ゥ", "ウ", "ェ", "エ", "ォ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ッ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ", "マ", "ミ", "ム", "メ", "モ", "ャ", "ヤ", "ュ", "ユ", "ョ", "ヨ", "ラ", "リ", "ル", "レ", "ロ", "ワ", "ヲ", "ン", "ヵ", "ヶ", "ヮ", "ヰ", "ヱ", "゛", "゜"];
    hirazen = ["が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "ぱ", "び", "ぴ", "ぶ", "ぷ", "べ", "ぺ", "ぼ", "ぽ", "ヴ", "ー", "ぁ", "あ", "ぃ", "い", "ぅ", "う", "ぇ", "え", "ぉ", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "っ", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "ゃ", "や", "ゅ", "ゆ", "ょ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "ん", "か", "け", "ゎ", "ゐ", "ゑ", "゛", "゜"];
    mojilength = katahan.length;
    // r: 전각문자를 반각으로 변환
    // a: 전각영문자를 반각으로 변환
    if (option.match(/[ra]/)) {
        text = text.replace(/[Ａ-ｚ]/g, function(elem) {
            return String.fromCharCode(parseInt(elem.charCodeAt(0)) - 65248);
        });
    }
    // R: 반각문자를 전각으로 변환
    // A: 반각영문자를 전각으로 변환
    if (option.match(/[RA]/)) {
        text = text.replace(/[A-z]/g, function(elem) {
            return String.fromCharCode(parseInt(elem.charCodeAt(0)) + 65248);
        });
    }
    // n: 전각숫자를 반각으로 변환
    // a: 전각 영숫자를 반각으로 변환
    if (option.match(/[na]/)) {
        text = text.replace(/[０-９]/g, function(elem) {
            return String.fromCharCode(parseInt(elem.charCodeAt(0)) - 65248);
        });
    }
    // N: 반각숫자를 전각으로 변환
    // A: 반각영숫자를 전각으로 변환
    if (option.match(/[NA]/)) {
        text = text.replace(/[0-9]/g, function(elem) {
            return String.fromCharCode(parseInt(elem.charCodeAt(0)) + 65248);
        });
    }
    // s: 전각스페이스를 반각으로 변환
    if (option.match(/s/)) {
        text = text.replace(/　/g, " ");
    }
    // S: 반각스페이스를 전각으로 변환
    if (option.match(/S/)) {
        text = text.replace(/ /g, "　");
    }
    // k: 전각카타카나를 반각 카타카타로 변환
    if (option.match(/k/)) {
        for (i = 0; i < mojilength; i++) {
            re = new RegExp(kanazen[i], "g");
            text = text.replace(re, katahan[i]);
        }
    }
    // K: 반각카타카타를 전각카타카타로 변환
    // V: 탁점사용중인 문자를 글자로 변환
    if (option.match(/K/)) {
        if (!option.match(/V/)) {
            text = text.replace(/ﾞ/g, "゛");
            text = text.replace(/ﾟ/g, "゜");
        }
        for (i = 0; i < mojilength; i++) {
            re = new RegExp(katahan[i], "g");
            text = text.replace(re, kanazen[i]);
        }
    }
    // h: 전각히라가나를 반각카타카나로 변환
    if (option.match(/h/)) {
        for (i = 0; i < mojilength; i++) {
            re = new RegExp(hirazen[i], "g");
            text = text.replace(re, katahan[i]);
        }
    }
    // H: 반각카타카나를 전각히라가라로 변환
    // V: 탁점사용중인 문자를 글자로 변환
    if (option.match(/H/)) {
        if (!option.match(/V/)) {
            text = text.replace(/ﾞ/g, "゛");
            text = text.replace(/ﾟ/g, "゜");
        }
        for (i = 0; i < mojilength; i++) {
            re = new RegExp(katahan[i], "g");
            text = text.replace(re, hirazen[i]);
        }
    }
    // c: 전각카타카나를 전각히라가나로 변환
    if (option.match(/c/)) {
        for (i = 0; i < mojilength; i++) {
            re = new RegExp(kanazen[i], "g");
            text = text.replace(re, hirazen[i]);
        }
    }
    // C: 전각히라가나를 전각카타카나로 변환
    if (option.match(/C/)) {
        for (i = 0; i < mojilength; i++) {
            re = new RegExp(hirazen[i], "g");
            text = text.replace(re, kanazen[i]);
        }
    }
    return text;
}