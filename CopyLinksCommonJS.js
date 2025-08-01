
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

function getZIndex(el) {
    if (el && el !== document.body && el !== window && el !== document && el !== document.documentElement) {
        var z = window.document.defaultView.getComputedStyle(el).getPropertyValue('z-index');
        if (isNaN(z)) return getZIndex(el.parentNode);
    }
    return z;
};

function getElementPosition(element) {
    // 요소가 유효한지 확인하여 오류를 방지합니다.
    if (!element instanceof HTMLElement) {
        console.error("유효한 HTML 요소를 전달해야 합니다.");
        return null;
    }

    // getBoundingClientRect()를 사용하여 위치와 크기를 가져옵니다.
    const rect = element.getBoundingClientRect();

    // x, y, top, left 속성을 포함한 객체를 반환합니다.
    // x/y와 top/left는 대부분의 경우 동일하지만, 오래된 브라우저 호환성을 위해 둘 다 포함합니다.
    return {
        x: rect.x,
        y: rect.y,
        top: rect.top,
        left: rect.left
    };
}


function getMaxZIndex() {
    let maxZ = null;
    // Get all elements in the document
    const allElements = document.querySelectorAll('*');

    allElements.forEach(element => {
        // Get the computed style of the element
        const style = window.getComputedStyle(element);
        const zIndex = style.zIndex;

        // Check if the z-index is a valid number and the element has a non-static position
        if (zIndex !== 'auto' && !isNaN(parseInt(zIndex))) {
            const position = style.position;
            if (position !== 'static') {
                const currentZ = parseInt(zIndex);
                if (maxZ === null || currentZ > maxZ) {
                    maxZ = currentZ;
                }
            }
        }
    });

    return maxZ;
}

/**
 * 특정 요소의 위치에서 가장 높은 z-index 값을 가진 요소를 찾습니다.
 * @param {Element} targetElement - z-index를 찾을 기준 요소입니다.
 * @returns {number} - 해당 위치에서 가장 높은 z-index 값 또는 1 (기본값).
 */
function getMaxZIndexAtPoint(targetElement) {
    const elements = [];
    const displayValues = [];
    const zIndices = [];

    const pos = getElementPosition(targetElement);
    let item = document.elementFromPoint(pos.x, pos.y);

    while (
        item &&
        item !== document.body &&
        item !== document.documentElement &&
        item !== targetElement
    ) {
        elements.push(item);
        displayValues.push(item.style.display);

        const zIndex = parseInt(window.getComputedStyle(item).zIndex);
        if (!isNaN(zIndex)) zIndices.push(zIndex);

        item.style.display = "none";
        item = document.elementFromPoint(pos.x, pos.y);
    }

    // 원래 display 스타일 복원
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = displayValues[i];
    }

    return zIndices.length > 0 ? Math.max(...zIndices) : 1; // 최소 1 반환
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

function getNodeTextBounds(nodeWithText) {
    // 전달받은 요소가 유효한지 확인합니다.
    if (!nodeWithText instanceof HTMLElement) {
        console.error("유효한 HTML 요소를 전달해야 합니다.");
        return null;
    }

    // 자식 노드들을 순회하며 첫 번째 텍스트 노드를 찾습니다.
    // Text Node의 nodeType은 3입니다.
    const textNode = Array.from(nodeWithText.childNodes).find(
        node => node.nodeType === Node.TEXT_NODE
    );

    // 텍스트 노드가 없는 경우 null을 반환하여 오류를 방지합니다.
    if (!textNode || !textNode.textContent.trim()) {
        console.warn("요소 내에 유효한 텍스트 노드가 없습니다.");
        return null;
    }

    // Range 객체를 생성하여 텍스트 노드를 선택합니다.
    const range = document.createRange();
    range.selectNode(textNode);

    // 선택된 텍스트의 바운딩 사각형을 가져옵니다.
    const bounds = range.getBoundingClientRect();

    // Range 객체는 더 이상 필요 없으므로 메모리 해제
    range.detach();

    return bounds;
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
/**
 * 문자열의 바이트 길이를 제한하여 자르고 '...'을 추가하는 함수입니다.
 * @param {string} text - 자를 원본 문자열입니다.
 * @param {number} maxByte - 최대 허용 바이트 길이입니다.
 * @returns {string} - 바이트 길이에 맞춰 잘린 문자열입니다.
 */
function byteLengthOf(text, maxByte) {
    let currentByte = 0;
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        let charByte;
        if (charCode <= 0x7F) charByte = 1;
        else if (charCode <= 0x7FF) charByte = 2;
        else if (charCode <= 0xFFFF) charByte = 3;
        else {
            charByte = 4;
            i++;
        }

        if (currentByte + charByte > maxByte) {
            // 마지막 문자가 '、' 또는 ','인 경우 제거
            if (result.endsWith('、') || result.endsWith(',')) {
                result = result.slice(0, -1);
            }
            return result.trim() + '…';
        }
        currentByte += charByte;
        result += text[i];
    }
    return result;
}

/**
 * UTF-16 문자열의 바이트 길이를 계산하는 함수입니다.
 * @param {string} text - 바이트 길이를 계산할 문자열입니다.
 * @returns {number} - 문자열의 바이트 길이입니다.
 */
function byteLengthOfCheck(text) {
    let byteLength = 0;
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        if (charCode <= 0x7F) {
            byteLength += 1;
        } else if (charCode <= 0x7FF) {
            byteLength += 2;
        } else if (charCode <= 0xFFFF) {
            byteLength += 3;
        } else {
            byteLength += 4;
            i++; // 서로게이트 페어이므로 다음 문자도 건너뜁니다.
        }
    }
    return byteLength;
}


/**
 * 주어진 문자열에서 특정 문자의 마지막 위치를 찾는 함수입니다.
 * String.prototype.lastIndexOf()를 사용해 더 효율적으로 개선했습니다.
 *
 * @param {string} text - 원본 문자열입니다.
 * @param {string} char - 찾고자 하는 문자입니다.
 * @returns {number} - 마지막으로 일치하는 문자의 인덱스입니다. 없으면 -1을 반환합니다.
 */
function searchChar(text, char) {
    return text.lastIndexOf(char);
}

/**
 * 전각(Full-width) 문자의 위치를 찾는 함수입니다.
 * 유니코드 값 범위를 사용하여 전각 문자의 인덱스를 찾습니다.
 *
 * @param {string} text - 원본 문자열입니다.
 * @returns {number[]} - 전각 문자가 시작하는 인덱스들의 배열입니다.
 */
function getFlag(text) {
    const points = [];
    // 역순으로 순회하며 전각 문자의 시작점을 찾습니다.
    for (let i = text.length - 1; i >= 0; i--) {
        const code = text.charCodeAt(i);
        // 전각 문자 범위 (U+FF01-U+FF5F, U+FFE0-U+FFEF)
        if ((code >= 0xFF01 && code <= 0xFF5F) || (code >= 0xFFE0 && code <= 0xFFEF)) {
            points.push(i);
        }
    }
    return points;
}


/**
 * 주어진 문자열에서 마지막 부분을 추출하는 함수입니다.
 * 특정 패턴(시리즈명, 파일번호 등)에 따라 제목의 끝부분을 찾아 반환합니다.
 *
 * @param {string} text - 원본 문자열입니다.
 * @returns {string} - 추출된 문자열 또는 빈 문자열을 반환합니다.
 */
function getLastText(text) {
    let lastPart = '';
    const wordList = text.split(/\s/).filter(e => e);

    // 1. 시리즈명이 있는 경우, 시리즈명 이후의 모든 텍스트를 추출
    if (Series && new RegExp(Series + '.*').test(text)) {
        lastPart = text.match(new RegExp(Series + '.*'))?.[0] || '';
    }
    // 2. '朝までハシゴ酒' 패턴이 있는 경우, 해당 패턴 이후의 텍스트를 추출
    else if (/朝までハシゴ酒/.test(text)) {
        lastPart = text.match(/朝までハシゴ酒.*/)?.[0] || '';
    }
    // 3. 마지막 단어가 숫자로 끝나는 경우의 복잡한 로직
    else if (/\d+$/.test(wordList[wordList.length - 1])) {
        const lastWord = wordList[wordList.length - 1];
        const secondLastWord = wordList[wordList.length - 2];

        // 마지막 단어가 'ファイル'과 숫자의 조합인 경우
        if (/ファイル\d+/.test(lastWord)) {
            lastPart = `${secondLastWord} ${lastWord}`;
        }
        // 마지막 단어가 일본어 문자이고 숫자로 끝나는 경우
        else if (JapaneseChar.test(lastWord)) {
            lastPart = lastWord;
        }
        // 그 외의 경우 (숫자로 끝나는 마지막 두 단어를 결합)
        else {
            lastPart = `${secondLastWord} ${lastWord}`;
        }
    }

    // 추출된 부분이 비어있으면 즉시 종료
    if (!lastPart || lastPart.trim() === '') {
        return '';
    }

    // 4. 추출된 마지막 부분이 특정 패턴으로 끝나는 경우 추가 처리
    if (/\d+$/.test(lastPart)) {
        // 마지막 '【' 이후의 텍스트를 추출
        if (lastPart.includes('】') && lastPart.includes('【')) {
            const searchCharPoint = text.lastIndexOf("【");
            if (searchCharPoint !== -1) {
                lastPart = text.substring(searchCharPoint);
            }
        }
        // '、'를 포함하고 길이가 10 이하인 경우
        else if (lastPart.includes('、') && lastPart.length <= 10) {
            const searchCharPoint = lastPart.lastIndexOf("、");
            if (searchCharPoint !== -1) {
                lastPart = lastPart.substring(searchCharPoint + 1);
            }
        }
    }

    // 5. 바이트 길이 체크 및 조정
    if (byteLengthOfCheck(lastPart) >= 100) {
        const flagPoints = getFlag(lastPart);
        if (flagPoints.length > 0) {
            let tempLastPart = lastPart.substring(flagPoints[0]);
            if (!JapaneseChar.test(tempLastPart) && flagPoints[1]) {
                tempLastPart = lastPart.substring(flagPoints[1]);
            }
            lastPart = tempLastPart;
        }
    }

    // 최종 유효성 검사: 추출된 마지막 부분이 숫자나 특정 태그로 끝나지 않으면 버림
    if (!/\d+|【.*】$/.test(lastPart)) {
        lastPart = '';
    }

    // 최종 바이트 길이 확인
    return byteLengthOfCheck(lastPart) <= 200 ? lastPart : '';
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
    if (!str || typeof str !== 'string') {
        return '';
    }

    // 정규 표현식: 각 단어의 시작점을 찾습니다.
    // \b는 단어 경계를 의미합니다. (문자-비문자, 비문자-문자, 혹은 문자열 시작/끝)
    // 따라서, \b 뒤에 오는 모든 글자를 대문자로 바꿉니다.
    return str.replace(/\b[a-z]/g, (match) => match.toUpperCase());
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
        text = text.replace(/[Ａ-ｚ]/g, function (elem) {
            return String.fromCharCode(parseInt(elem.charCodeAt(0)) - 65248);
        });
    }
    // R: 반각문자를 전각으로 변환
    // A: 반각영문자를 전각으로 변환
    if (option.match(/[RA]/)) {
        text = text.replace(/[A-z]/g, function (elem) {
            return String.fromCharCode(parseInt(elem.charCodeAt(0)) + 65248);
        });
    }
    // n: 전각숫자를 반각으로 변환
    // a: 전각 영숫자를 반각으로 변환
    if (option.match(/[na]/)) {
        text = text.replace(/[０-９]/g, function (elem) {
            return String.fromCharCode(parseInt(elem.charCodeAt(0)) - 65248);
        });
    }
    // N: 반각숫자를 전각으로 변환
    // A: 반각영숫자를 전각으로 변환
    if (option.match(/[NA]/)) {
        text = text.replace(/[0-9]/g, function (elem) {
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