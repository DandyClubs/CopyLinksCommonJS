
/**
 * 주어진 텍스트에서 일본어 문자의 개수를 세어 반환합니다.
 * 히라가나, 가타카나, 한자를 포함합니다.
 * @param {string} text - 일본어 문자를 찾을 문자열
 * @returns {number} - 찾은 일본어 문자의 개수
 */
function countJapaneseCharacters(text) {
    const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g;
    const matches = text.match(japanesePattern);
    return matches ? matches.length : 0;
}

/**
 * 두 문장 중 일본어 문자가 더 많이 포함된 문장을 찾아 반환합니다.
 * 일본어 문자 수가 같을 경우, 더 긴 문장을 반환합니다.
 * @param {string} sentence1 - 첫 번째 문장
 * @param {string} sentence2 - 두 번째 문장
 * @returns {string} - 결과 메시지
 */
function compareJapaneseCharacters(sentence1, sentence2) {
    if (sentence1 === sentence2) {
        return sentence1
    }

    const count1 = countJapaneseCharacters(sentence1);
    const count2 = countJapaneseCharacters(sentence2);

    if (count1 > count2) {
        return sentence1
    } else if (count2 > count1) {
        return sentence2
    } else {

        if (sentence1.length > sentence2.length) {
            return sentence1
        }
        if (sentence1.length > sentence2.length) {
            return sentence2
        } else {
            return sentence2
        }
    }
}

/**
 * 주어진 텍스트를 정리하고 단어 배열로 반환합니다.
 * - 소문자로 변환
 * - 구두점 및 특수문자 제거
 * @param {string} text - 처리할 문자열
 * @returns {string[]} - 정리된 단어들의 배열
 */
function tokenizeAndClean(text) {
    // 소문자로 변환하고, 알파벳과 숫자, 공백을 제외한 모든 문자를 제거
    const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, '');
    // 공백을 기준으로 단어를 분리
    return cleanedText.split(/\s+/).filter(word => word.length > 0);
}

/**
 * 두 문장의 단어 일치율을 계산합니다.
 * @param {string} sentence1 - 첫 번째 문장
 * @param {string} sentence2 - 두 번째 문장
 * @returns {number} - 0에서 100 사이의 일치율(퍼센트)
 */
function getWordMatchPercentage(sentence1, sentence2) {
    const words1 = tokenizeAndClean(sentence1);
    const words2 = tokenizeAndClean(sentence2);

    // 두 문장이 완전히 동일하면 100% 일치
    if (words1.join(' ') === words2.join(' ')) {
        return 100;
    }

    // Set을 사용하여 중복되지 않는 단어 목록을 만듭니다.
    const set1 = new Set(words1);
    const set2 = new Set(words2);

    // 더 짧은 문장의 단어 수를 기준으로 일치율을 계산합니다.
    const shorterWordCount = Math.min(set1.size, set2.size);
    if (shorterWordCount === 0) {
        return 0;
    }

    let matchedWordsCount = 0;
    for (const word of set1) {
        if (set2.has(word)) {
            matchedWordsCount++;
        }
    }

    return (matchedWordsCount / shorterWordCount) * 100;
}

/**
 * 두 문장을 비교하여 조건에 맞는 문장을 반환합니다.
 * - 단어 일치율이 높은 문장
 * - 일치율이 같을 경우, 총 길이가 더 긴 문장
 * @param {string} sentence1 - 첫 번째 문장
 * @param {string} sentence2 - 두 번째 문장
 * @returns {string} - 결과 메시지
 */
function compareSentencesByWordMatch(sentence1, sentence2) {
    const matchPercentage1 = getWordMatchPercentage(sentence1, sentence2);
    const matchPercentage2 = getWordMatchPercentage(sentence2, sentence1);

    // 이중 비교를 통해 더 높은 일치율을 찾습니다.
    // 이 로직은 `shorterWordCount` 기준으로 계산되므로, 두 문장의 일치율은 항상 동일합니다.
    const matchPercentage = matchPercentage1;

    if (matchPercentage > 0) {
        // 일치율이 0보다 큰 경우에만 길이 비교를 진행합니다.
        const length1 = sentence1.length;
        const length2 = sentence2.length;

        if (length1 > length2) {
            return sentence1
        } else {
            return sentence2
        }
    } else {
        return sentence2
    }
}

function createFloatPanelFrom(el, {
    id = 'FloatingCenterBox',
    offset = { top: '20px', right: '20px' },
    draggable = true
} = {}) {
    if (!el || !(el instanceof HTMLElement)) return;

    el.id = id;
    el.classList.add('float-panel');

    Object.assign(el.style, {
        position: 'fixed',
        zIndex: '999999',
        top: offset.top,
        right: offset.right,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '10px',
        fontSize: '14px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto',
    });
}


// 내부 컨텐츠(패딩 등)를 담는 요소를 찾아줌
function getInnerForMeasurement(el) {
    // 사용자가 .panel-inner처럼 지정해놨다면 그걸 우선 사용
    const inner = el.querySelector('.panel-inner');
    return inner || el;
}

function ensureDisplayBlock(el) {
    if (window.getComputedStyle(el).display === 'none') {
        el.style.display = 'block';
        return true;
    }
    return false;
}

// fadeSlideDown: Promise 반환 (transition 끝나면 resolve)
function fadeSlideDown(el, duration = 400) {
    return new Promise((resolve) => {
        if (el.classList.contains('sliding')) {
            // 이미 슬라이딩 중이면 바로 resolve (또는 대기 로직을 넣어도 됨)
            resolve();
            return;
        }
        el.classList.add('sliding');

        const measured = getInnerForMeasurement(el);
        const wasHidden = ensureDisplayBlock(el);

        el.style.overflow = 'hidden';
        // 닫힌 상태에서 패딩 깜빡임을 방지하기 위해 inline padding 건드리지 않음.
        // 초기 상태: 높이 0, opacity 0
        el.style.height = '0px';
        el.style.opacity = '0';

        // 강제 리플로우
        el.offsetHeight;

        // 적용: transition 설정
        el.style.transition = `height ${duration}ms ease, opacity ${duration}ms ease`;

        // 읽어온 실제 컨텐츠 높이 (inner의 scrollHeight 사용)
        const targetHeight = measured.scrollHeight;
        // 애니메이션 시작: 높이(px)와 opacity 1로
        // use requestAnimationFrame to ensure previous style applied
        requestAnimationFrame(() => {
            el.style.height = targetHeight + 'px';
            el.style.opacity = '1';
        });

        const onTransitionEnd = (e) => {
            // height 변화가 끝났을 때만 처리
            if (e.propertyName !== 'height') return;
            el.style.removeProperty('height');     // allow auto height after open
            el.style.removeProperty('overflow');   // restore overflow
            el.style.removeProperty('transition');
            el.classList.remove('sliding');
            el.removeEventListener('transitionend', onTransitionEnd);
            resolve();
        };

        // 안전장치: 브라우저가 transitionend를 안주거나 빠르게 끝나는 경우 대비 타임아웃
        const safetyTimeout = setTimeout(() => {
            if (el.classList.contains('sliding')) {
                // 동일한 정리
                el.style.removeProperty('height');
                el.style.removeProperty('overflow');
                el.style.removeProperty('transition');
                el.classList.remove('sliding');
                el.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            }
        }, duration + 100);

        el.addEventListener('transitionend', function handler(e) {
            // 위 onTransitionEnd 함수와 동일 처리; use single handler to clear timeout too
            if (e.propertyName !== 'height') return;
            clearTimeout(safetyTimeout);
            onTransitionEnd(e);
        }, { once: true });
    });
}

// fadeSlideUp: Promise 반환 (transition 끝나면 resolve)
function fadeSlideUp(el, duration = 400) {
    return new Promise((resolve) => {
        if (el.classList.contains('sliding')) {
            resolve();
            return;
        }
        el.classList.add('sliding');

        // 측정 대상: 내부가 있으면 내부의 높이를 기준으로
        const measured = getInnerForMeasurement(el);

        // 현재 실제 높이를 픽셀로 고정 (scrollHeight 사용)
        const currentHeight = measured.scrollHeight;
        el.style.height = currentHeight + 'px';
        el.style.overflow = 'hidden';
        // ensure opacity exists
        if (!el.style.opacity) {
            const comp = window.getComputedStyle(el);
            el.style.opacity = comp.opacity || '1';
        }

        // 리플로우
        el.offsetHeight;

        // transition 적용
        el.style.transition = `height ${duration}ms ease, opacity ${duration}ms ease`;

        // 시작: 높이 0, opacity 0
        requestAnimationFrame(() => {
            el.style.height = '0px';
            el.style.opacity = '0';
        });

        const onTransitionEnd = (e) => {
            if (e.propertyName !== 'height') return;
            // 닫힌 뒤 display none 처리
            el.style.display = 'none';
            // inline 스타일 정리 (padding 등은 건드리지 않음)
            el.style.removeProperty('height');
            el.style.removeProperty('opacity');
            el.style.removeProperty('overflow');
            el.style.removeProperty('transition');
            el.classList.remove('sliding');
            el.removeEventListener('transitionend', onTransitionEnd);
            resolve();
        };

        const safetyTimeout = setTimeout(() => {
            if (el.classList.contains('sliding')) {
                el.style.display = 'none';
                el.style.removeProperty('height');
                el.style.removeProperty('opacity');
                el.style.removeProperty('overflow');
                el.style.removeProperty('transition');
                el.classList.remove('sliding');
                el.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            }
        }, duration + 100);

        el.addEventListener('transitionend', function handler(e) {
            if (e.propertyName !== 'height') return;
            clearTimeout(safetyTimeout);
            onTransitionEnd(e);
        }, { once: true });
    });
}

// toggle 유틸 (기존 로직과 유사하게 display/offsetHeight 검사)
function fadeSlideToggle(el, duration = 400) {
    const isHidden = window.getComputedStyle(el).display === 'none' || el.offsetHeight === 0;
    if (isHidden) {
        return fadeSlideDown(el, duration);
    } else {
        return fadeSlideUp(el, duration);
    }
}

// showThenHide: 열고 pause(ms) 만큼 대기했다가 닫음
async function showThenHide(el, { duration = 400, pause = 1000 } = {}) {
    await fadeSlideDown(el, duration);
    await sleep(pause);
    await fadeSlideUp(el, duration);
}



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


// --- 공통 유틸 함수들 ---

/**
 * HTMLElement인지 확인
 * @param {Node} el 
 * @returns {boolean}
 */
function isHTMLElement(el) {
    return el instanceof HTMLElement;
}

// --- 주요 API 함수 (통합) ---

/**
 * 요소 위치/크기 계산 (모드별)
 * @param {Node} el 
 * @param {Object} options - { mode: 'position'|'relative'|'textNode'|'bounding' }
 * @returns {Object|null}
 */
function getElementMetrics(el, options = {}) {
    const mode = options.mode || 'bounding';
    const emptyMetrics = { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0, centerX: 0, centerY: 0 };

    if (!el) {
        console.error('유효한 요소를 전달해야 합니다.');
        return null;
    }

    switch (mode) {
        case 'position': {
            if (!isHTMLElement(el)) {
                console.error('position 모드는 HTMLElement가 필요합니다.');
                return null;
            }
            const rect = el.getBoundingClientRect();
            return {
                x: rect.x,
                y: rect.y,
                top: rect.top,
                left: rect.left,
                centerX: rect.left + rect.width / 2,
                centerY: rect.top + rect.height / 2,
            };
        }
        case 'relative': {
            if (!isHTMLElement(el)) {
                console.error('relative 모드는 HTMLElement가 필요합니다.');
                return null;
            }
            return {
                top: el.offsetTop,
                bottom: el.offsetTop + el.offsetHeight,
                left: el.offsetLeft,
                right: el.offsetLeft + el.offsetWidth,
                width: el.offsetWidth,
                height: el.offsetHeight,
                centerX: el.offsetLeft + el.offsetWidth / 2,
                centerY: el.offsetTop + el.offsetHeight / 2,
            };
        }
        case 'textNode': {
            let textNode = null;
            if (isHTMLElement(el)) {
                textNode = getFirstTextNode(el);
            } else if (el.nodeType === Node.TEXT_NODE) {
                textNode = el;
            }

            if (!textNode) {
                return emptyMetrics;
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
                    centerX: rect.left + rect.width / 2,
                    centerY: rect.top + rect.height / 2,
                };
            } catch (error) {
                console.error('텍스트 노드 위치 계산 중 오류 발생:', error);
                return emptyMetrics;
            }
        }
        case 'bounding':
        default: {
            if (!isHTMLElement(el)) {
                console.error('bounding 모드는 HTMLElement가 필요합니다.');
                return null;
            }
            const rect = el.getBoundingClientRect();
            return {
                top: rect.top,
                bottom: rect.bottom,
                left: rect.left,
                right: rect.right,
                width: rect.width,
                height: rect.height,
                centerX: rect.left + rect.width / 2,
                centerY: rect.top + rect.height / 2,
            };
        }
    }
}

// --- 보조 유틸 함수 ---

/**
 * 주어진 노드에서 공백이 아닌 내용을 포함하는 첫 번째 텍스트 노드를 재귀적으로 찾습니다.
 * @param {Node} node - 탐색을 시작할 노드.
 * @returns {Text|null} - 찾은 텍스트 노드 또는 찾지 못한 경우 null.
 */
function getFirstTextNode(node) {
    if (!node) {
        return null;
    }

    // NodeList를 배열로 변환하여 for...of 루프 사용
    for (const childNode of Array.from(node.childNodes)) {
        // 텍스트 노드인지 확인하고, 공백이 아닌 텍스트가 있는지 검사
        if (childNode.nodeType === Node.TEXT_NODE && childNode.textContent.trim().length > 0) {
            return childNode;
        }

        // 자식 노드에 대해 재귀적으로 탐색
        const foundNode = getFirstTextNode(childNode);
        if (foundNode) {
            return foundNode;
        }
    }

    return null;
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


/**
 * DOM 요소 중 regex가 attributeToSearch 값에 매칭되는 요소를 찾습니다.
 * @param {Element} Area - 검색할 DOM 영역
 * @param {RegExp} regex - 찾을 정규식
 * @param {string} [attributeToSearch] - 검색할 속성명 (예: 'src', 'href', 'innerText' 등)
 * @param {Object} [options]
 * @param {boolean} [options.ignoreCase=false] - 대소문자 무시 여부
 * @param {boolean} [options.wholeWord=false] - 전체 단어 매칭 여부
 * @param {string[]} [options.includeTag] - 포함할 태그 리스트 (대문자 태그명 배열). 지정하면 이 태그만 검색
 * @param {string[]} [options.excludeTag] - 제외할 태그 리스트 (대문자 태그명 배열). includeTag가 없을 때 적용
 * @param {boolean} [options.notMatch=false] - regex에 매칭되지 않는 요소를 찾음
 * @param {boolean} [options.firstOnly=false] - 첫 번째 매칭 요소만 반환
 * @param {(element: Element) => boolean} [options.filterCallback] - 추가 필터 함수 (true일 때 포함)
 * @param {number} [options.maxResults=Infinity] - 최대 반환 개수
 * @returns {Element|Element[]} - 첫 번째 요소 또는 배열 반환 (firstOnly 옵션에 따라)
 * 
 * @example
 * // src 속성에 'example' 포함하는 모든 IMG, VIDEO 태그 찾기
 * findElementsByRegex(document.body, /example/, 'src', {
 *   includeTag: ['IMG', 'VIDEO']
 * });
 * 
 * @example
 * // href 속성에 'http' 포함하지 않는 모든 A 태그 찾기 (notMatch)
 * findElementsByRegex(document.body, /http/, 'href', {
 *   includeTag: ['A'],
 *   notMatch: true
 * });
 * 
 * @example
 * // 모든 태그 중 script, style 태그는 제외하고 textContent에 'warning' 포함하는 요소 첫 개만 찾기
 * findElementsByRegex(document.body, /warning/i, 'textContent', {
 *   excludeTag: ['SCRIPT', 'STYLE'],
 *   firstOnly: true,
 *   ignoreCase: true
 * });
 */

function querySelectorAllRegex(Area, regex, attributeToSearch = '', options = {}) {
    if (!Area || !regex) return options.firstOnly ? null : [];

    const {
        ignoreCase = true,
        wholeWord = false,
        excludeTag = [],  //{ excludeTag: ['SCRIPT', 'STYLE'] } 대문자로 태그명 지정해야 함
        includeTag = null,  //{ includeTag: ['IMG'] }  대문자로 태그명 지정해야 함
        maxResults = Infinity,
        filterCallback = null,
        notMatch = false,
        firstOnly = false,
        searchStyle = false,
    } = options;

    let pattern = typeof regex === 'string' ? regex : regex.source;
    const flags = (regex.flags || '') + (ignoreCase && !(regex.flags?.includes('i')) ? 'i' : '');
    const finalPattern = wholeWord ? `\\b(?:${pattern})\\b` : pattern;
    const compiledRegex = new RegExp(finalPattern, flags);

    const tagMap = {
        'href': ['a'],
        'src': ['img', 'script', 'iframe', 'video', 'audio', 'source'],
        'innerText': ['*'],
        'textContent': ['*'],
        'script': ['script'],
        'style': ['*']
    };

    const tags = tagMap[attributeToSearch] || ['*'];
    const selector = tags.join(',');

    const isTagAllowed = (tagName) => {
        if (includeTag && includeTag.length > 0) {
            return includeTag.includes(tagName);
        }
        return !excludeTag.includes(tagName);
    };

    const elements = Area.querySelectorAll(selector);
    const results = [];

    for (const el of elements) {
        const tagName = el.tagName.toUpperCase();
        if (!isTagAllowed(tagName)) continue;

        let value = '';

        if (attributeToSearch === 'innerText' || attributeToSearch === 'textContent') {
            value = el.textContent || '';
        } else if (attributeToSearch === 'script') {
            if (tagName !== 'SCRIPT') continue;
            value = el.textContent || '';
        } else if (attributeToSearch === 'style') {
            if (!searchStyle) continue;
            value = el.getAttribute('style') || '';
        } else if (attributeToSearch) {
            value = el.getAttribute?.(attributeToSearch) || '';
        } else {
            let found = false;
            for (const attr of el.attributes) {
                if (compiledRegex.test(attr.value)) {
                    found = true;
                    value = attr.value;
                    break;
                }
            }
            if (!found) continue;
        }

        const isMatch = compiledRegex.test(value);
        if (notMatch ? isMatch : !isMatch) continue;

        if (filterCallback && !filterCallback(el)) continue;

        results.push(el);
        if (firstOnly || results.length >= maxResults) break;
    }

    return firstOnly ? (results[0] || null) : results;
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

        if (currentByte + charByte >= maxByte) {
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
        console.log({ lastPart })
    }
    // 2. '朝までハシゴ酒' 패턴이 있는 경우, 해당 패턴 이후의 텍스트를 추출
    else if (/朝までハシゴ酒/.test(text)) {
        lastPart = text.match(/朝までハシゴ酒.*/)?.[0] || '';
        console.log({ lastPart })
    }
    // 3. 마지막 단어가 숫자로 끝나는 경우의 복잡한 로직
    else if (/\d+$/.test(wordList[wordList.length - 1])) {
        const lastWord = wordList[wordList.length - 1];
        const secondLastWord = wordList[wordList.length - 2];

        // 마지막 단어가 'ファイル'과 숫자의 조합인 경우
        if (/ファイル\d+/.test(lastWord)) {
            lastPart = `${secondLastWord} ${lastWord}`;
            console.log({ lastPart })
        }
        // 마지막 단어가 일본어 문자이고 숫자로 끝나는 경우
        else if (JapaneseChar.test(lastWord)) {
            lastPart = lastWord;
            console.log({ lastPart })
        }
        // 그 외의 경우 (숫자로 끝나는 마지막 두 단어를 결합)
        else {
            lastPart = `${secondLastWord} ${lastWord}`;
            console.log({ lastPart })
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
                console.log({ lastPart })
            }
        }
        // '、'를 포함하고 길이가 10 이하인 경우
        else if (lastPart.includes('、') && lastPart.length <= 10) {
            const searchCharPoint = lastPart.lastIndexOf("、");
            if (searchCharPoint !== -1) {
                lastPart = lastPart.substring(searchCharPoint + 1);
                console.log({ lastPart })
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
            console.log({ lastPart })
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


function addToPreserveList(word, listText, ignoreCase = false) {
    const lines = listText.split('\n').map(line => line.trim()).filter(Boolean);
    const formatted = ignoreCase ? `(?i)${word}` : word;

    if (!lines.includes(formatted)) {
        lines.push(formatted);
    }
    return lines.join('\n');
}

function nameCorrection(str, preserveText = '') {
    if (!str || typeof str !== 'string') return '';

    const preservePatterns = preserveText
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(pattern => {
            let ignoreCase = false;
            if (pattern.startsWith('(?i)')) {
                ignoreCase = true;
                pattern = pattern.slice(4);
            }
            const isRegexPattern = /[\(\)\[\]\?\:\|\!\<\>]/.test(pattern);
            if (!isRegexPattern) {
                pattern = escapeRegExp(pattern);
            }
            return { pattern, ignoreCase, rawPattern: pattern };
        });

    const preserveRegexes = preservePatterns.map(({ pattern, ignoreCase }) =>
        new RegExp(`^${pattern}$`, ignoreCase ? 'iu' : 'u')
    );

    const contractionParts = ['t', 'll', 's', 're', 've', 'd', 'm'];

    const lowerCaseWords = new Set([
        'a', 'an', 'the',
        'and', 'but', 'or', 'nor', 'for', 'so', 'yet',
        'at', 'by', 'in', 'of', 'on', 'to', 'up', 'via', 'with', 'as',
        'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
        'that', 'this', 'these', 'those',
        'let', "can't", "i'll", 'be'
    ]);

    function correctWord(word, isFirstWord, isLastWord) {
        if (/^'\p{L}+$/u.test(word)) return word;

        for (let i = 0; i < preserveRegexes.length; i++) {
            if (preserveRegexes[i].test(word)) {
                return word.toUpperCase();
            }
        }

        if (
            /[A-Z]/.test(word) &&
            /[a-z]/.test(word) &&
            !/^([A-Z]+|[a-z]+)$/.test(word)
        ) {
            return word;
        }

        if (word === word.toUpperCase()) return word;

        const parts = word.split(/(?<=\p{L})'(?=\p{L})/u);

        return parts.map((part, i) => {
            const lower = part.toLowerCase();

            if (i > 0 && contractionParts.includes(lower)) {
                return lower;
            }

            if (isFirstWord || isLastWord || !lowerCaseWords.has(lower)) {
                return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            } else {
                return lower;
            }
        }).join("'");
    }

    // 단어 분리 (공백과 구두점 포함, 숫자/단위 묶음 유지)
    const words = str.match(/[\[\]()]|\b[\p{L}\d]+(?:[\/:.][\p{L}\d]+)*\b|[^\w\s]+|\s+/gu) || [];



    // 첫/마지막 알파벳 단어 인덱스 찾기
    const firstWordIdx = words.findIndex(w => /\p{L}/u.test(w));
    let lastWordIdx = -1;
    for (let i = words.length - 1; i >= 0; i--) {
        if (/\p{L}/u.test(words[i])) {
            lastWordIdx = i;
            break;
        }
    }

    // 구분자 배열 (분리 후 다시 붙일 때 사용)
    const delimiters = ['-', '/', ':', '_'];

    return words.map((word, idx) => {
        if (/^\s+$/.test(word) || /^[^\w\s]+$/.test(word)) return word;

        // 구분자 포함 시 분리 후 각 부분 Title Case 적용
        let splitRegex = new RegExp(`([${delimiters.map(d => '\\' + d).join('')}])`);
        if (splitRegex.test(word)) {
            const parts = word.split(splitRegex);
            // parts 배열 예시: ['tamply', '-', 'total']

            return parts.map((part, i) => {
                if (delimiters.includes(part)) {
                    return part; // 구분자 그대로 유지
                } else {
                    const isFirst = idx === firstWordIdx && i === 0;
                    const isLast = idx === lastWordIdx && i === parts.length - 1;
                    return correctWord(part, isFirst, isLast);
                }
            }).join('');
        }

        const isFirst = idx === firstWordIdx;
        const isLast = idx === lastWordIdx;
        return correctWord(word, isFirst, isLast);
    }).join('');
}


function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

    const replacements = {
        '<': '＜',
        '>': '＞',
        ':': '：',
        '"': '＂',
        '/': '／',
        '\\': '＼',
        '|': '｜',
        '?': '？',
        '*': '＊',
    };

    return [...text].map(c => replacements[c] || c).join('');
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