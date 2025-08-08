/**
 * 웹페이지의 특정 영역에서 제목, 링크, 비밀번호 등의 정보를 추출하여 구조화된 배열로 반환합니다.
 * @param {HTMLElement} area - 정보를 추출할 DOM 영역.
 * @returns {Array<object>} 추출된 정보가 담긴 객체 배열.
 */
function extractPostData(area) {
    if (!area) {
        console.error("⚠️ Invalid 'area' argument. Please provide a valid DOM element.");
        return [];
    }

    const dataItems = [];
    let currentItem = null;

    function saveCurrentItem() {
        if (currentItem) {
            // 중복 링크 제거
            if (currentItem.links) {
                currentItem.links = [...new Set(currentItem.links)];
            }
            dataItems.push(currentItem);
        }
    }

    // NodeList를 배열로 변환하여 순회
    Array.from(area.childNodes).forEach(node => {
        const text = node.textContent?.trim() || '';

        // 【影片名稱】：을 기준으로 새 그룹 시작
        if (text.startsWith('【影片名稱】：')) {
            saveCurrentItem();
            currentItem = {
                title: text.replace('【影片名稱】：', '').trim(),
                links: [],
                size: null,
                password: null,
                releaseDate: null
            };
        }

        // <tr> 태그 안의 정보를 파싱
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'tr') {
            const header = node.querySelector('.header')?.textContent?.trim();
            const value = node.querySelector('.text')?.textContent?.trim();
            if (currentItem && header && value) {
                if (header === '発売日:') {
                    currentItem.releaseDate = value;
                }
            }
        }

        // 텍스트 기반 정보 추출
        if (currentItem) {
            // 링크 추출 (<a> 태그)
            if (node.nodeType === Node.ELEMENT_NODE) {
                const linksInNode = Array.from(node.querySelectorAll('a'))
                    .map(a => a.href)
                    .filter(href => href && (href.includes('katfile.com') || href.includes('mega.nz')));
                if (linksInNode.length > 0) {
                    currentItem.links.push(...linksInNode);
                }
            }

            // 【影片大小】： 추출
            const sizeMatch = text.match(/【影片大小】：(.*)/);
            if (sizeMatch) {
                currentItem.size = sizeMatch[1].trim();
            }

            // 【解壓密碼】： 추출
            const passwordMatch = text.match(/【解壓密碼】：(.*)/);
            if (passwordMatch) {
                currentItem.password = passwordMatch[1].trim();
            }
        }
    });

    saveCurrentItem(); // 마지막 그룹 저장
    return dataItems;
}

/**
 * 웹페이지에서 링크(URL)를 유연한 옵션에 따라 찾아 반환합니다.
 *
 * @param {HTMLElement} area - 검색을 수행할 DOM 영역.
 * @param {Array<string>|object|undefined} [tags] - 추출할 태그 이름 배열, 또는 모든 옵션을 담은 객체.
 * - 예시 1 (배열): ['a', 'img', 'video']
 * - 예시 2 (객체): { tags: ['a', 'img'], ... }
 * @param {string|RegExp|Array<string>|undefined} [separator] - 구분자로 사용할 텍스트, 정규식, 또는 태그 이름 배열.
 * - 예시 1 (문자열): '【影片名稱】：'
 * - 예시 2 (정규식): /FC2-PPV-\d+/i
 * - 예시 3 (태그 배열): ['h1', 'h2']
 * @param {Array<string|number>|undefined} [resolutionPriority] - 해상도 우선순위 배열.
 * - 예시 1 (특정 해상도): ['1920', '3840']
 * - 예시 2 (비교 연산자): ['>=1080', '<=720']
 * - 예시 3 (범위): ['720-1920']
 * - 예시 4 (MAX): ['MAX', '1920', '>=720', '1280']
 * @param {Array<Array<string|RegExp>>|undefined} [urlFilters] - URL을 필터링할 속성 및 정규식 배열.
 * - 예시: [['src', /.+\.png/, /^((?!ad).)*$/gi], ['href', /example\.com/]]
 * - src 속성에서 '.png'를 포함하고 'ad'는 제외하는 필터.
 * - 위 필터에서 결과가 없으면 href 속성에서 'example.com'을 포함하는 URL을 찾음.
 * @returns {Array<*>} 조건에 맞는 링크(URL) 배열 또는 그룹 객체 배열을 반환합니다.
 */
function findLinks(area, tags, separator, resolutionPriority, urlFilters, knownHosts, excludeSelf) {
    if (!area) {
        console.error("⚠️ Invalid 'area' argument. Please provide a valid DOM element.");
        return [];
    }

    let options = {};
    if (Array.isArray(tags)) {
        options.tags = tags;
        options.separator = separator;
        options.resolutionPriority = (Array.isArray(resolutionPriority) ? resolutionPriority.map(r => String(r)) : resolutionPriority);
        options.urlFilters = urlFilters;
        options.knownHosts = knownHosts;
        options.excludeSelf = excludeSelf;
    } else if (typeof tags === 'object' && tags !== null) {
        options = tags;
    }

    const {
        tags: finalTags = ['a'],
        separator: finalSeparator,
        resolutionPriority: finalResolutionPriority = ['1920', '3840', '1280'],
        urlFilters: finalUrlFilters,
        knownHosts: autoKnownHosts = false,
        excludeSelf: autoExcludeSelf = true
    } = options;

    const KNOWN_HOSTS = [
        'katfile.com', 'mega.nz', 'drive.google.com', 'filespace.com',
        'nitroflare.com', 'uploadgig.com', 'uptobox.com'
    ];

    let EXCLUDE_HOSTS = ['google.com', 'gstatic.com', 'adservice.google.com', 'doubleclick.net',
        'youtube.com', 'youtu.be', 'developershome.com', 'md5file.com', 'netlify.app'
    ];
    if (autoExcludeSelf) {
        EXCLUDE_HOSTS.push(document.location.hostname.replace('www.', ''));
    }

    let effectiveUrlFilters = finalUrlFilters || [];

    const excludeRegexSource = EXCLUDE_HOSTS.map(host => `(?:^|\\W)${host.replace(/\./g, '\\.')}`).join('|');
    const excludeRegex = new RegExp(`^((?!${excludeRegexSource}).)*$`, 'i');
    effectiveUrlFilters.push(['href', excludeRegex]);

    if (autoKnownHosts) {
        const knownHostsRegex = new RegExp(`(${KNOWN_HOSTS.map(host => host.replace(/\./g, '\\.')).join('|')})`, 'i');
        effectiveUrlFilters.push(['href', knownHostsRegex]);
    }

    const findResolutionInText = (text) => {
        const resolutionMap = {
            '3840': ['3840x2160', 'uhd', '4k', '2160p'],
            '1920': ['1920x1080', 'fhd', '1080p'],
            '1280': ['1280x720', 'hd', '720p']
        };
        if (!text) return null;
        text = text.toLowerCase();
        for (const resKey in resolutionMap) {
            const regex = new RegExp(`\\b(?:${resolutionMap[resKey].join('|')})\\b`, 'i');
            if (regex.test(text)) {
                return resKey;
            }
        }
        return null;
    };

    const extractURL = (element) => {
        const tagName = element.tagName;
        if (tagName === 'A') return element.href;
        if (tagName === 'IMG') return element.src;
        if (tagName === 'VIDEO') return element.src;
        return null;
    };

    const findBestLinkInGroup = (links, priority, groupResolution) => {
        const checkResolutionCondition = (linkResolution, condition) => {
            if (!linkResolution) return false;
            const linkResValue = parseInt(linkResolution);
            const comparisonMatches = String(condition).trim().match(/(>=|<=|>|<|=)?\s*(\d+)|(\d+)\s*(>=|<=|>|<|=)?/);
            if (comparisonMatches) {
                let operator, value;
                if (comparisonMatches[1]) {
                    operator = comparisonMatches[1];
                    value = parseInt(comparisonMatches[2]);
                } else {
                    value = parseInt(comparisonMatches[3]);
                    operator = comparisonMatches[4] || '=';
                }
                switch (operator) {
                    case '>': return linkResValue > value;
                    case '<': return linkResValue < value;
                    case '>=': return linkResValue >= value;
                    case '<=': return linkResValue <= value;
                    case '=': default: return linkResValue === value;
                }
            }
            return linkResolution === String(condition).trim();
        };

        const allLinksInGroup = links.map(el => ({
            url: el.url,
            element: el.element,
            resolution: groupResolution
        })).filter(el => el.url);

        const maxResolutionIndex = priority.findIndex(res => String(res).toLowerCase() === 'max');
        if (maxResolutionIndex !== -1) {
            const availableResolutions = allLinksInGroup
                .map(el => el.resolution)
                .filter(res => res)
                .map(res => parseInt(res))
                .filter(res => !isNaN(res));

            if (availableResolutions.length > 0) {
                const maxResolution = Math.max(...availableResolutions);
                const foundMax = allLinksInGroup.filter(el => parseInt(el.resolution) === maxResolution);
                if (foundMax.length > 0) {
                    return foundMax.map(el => el.url);
                }
            }
        }

        for (const res of priority.filter(p => String(p).toLowerCase() !== 'max')) {
            const found = allLinksInGroup.filter(el => el.resolution && checkResolutionCondition(el.resolution, res));
            if (found.length > 0) {
                return found.map(link => link.url);
            }
        }

        return allLinksInGroup.map(el => el.url);
    };

    const applyUrlFilters = (linkElements, filters) => {
        if (!filters || filters.length === 0) {
            return linkElements;
        }

        return filters.reduce((filtered, filterGroup) => {
            const attributeName = filterGroup[0];
            const regex = filterGroup[1];

            return filtered.filter(el => {
                const attributeValue = el.element.getAttribute(attributeName) || '';
                return regex.test(attributeValue);
            });
        }, linkElements);
    };

    // -----------------------------------------------------------
    // Case 1: Text-based or CSS-based Grouping Mode
    // -----------------------------------------------------------
    if (finalSeparator) {
        let finalLinks = [];
        let groupNodes = [];
        const tagsSelector = finalTags.map(t => t.toLowerCase()).join(',');

        if (typeof finalSeparator === 'string' && finalSeparator.trim().length > 0 && finalSeparator.includes(' ')) {
            // CSS selector
            groupNodes = Array.from(area.querySelectorAll(finalSeparator));
        } else {
            // Text or RegExp separator
            let separatorPattern = finalSeparator;
            if (typeof separatorPattern === 'string') {
                const escapedSeparator = separatorPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                separatorPattern = new RegExp(`(.*${escapedSeparator}.*)`, 'i');
            }

            let currentGroupNodes = [];
            Array.from(area.childNodes).forEach(node => {
                if ((node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) && separatorPattern.test(node.textContent)) {
                    if (currentGroupNodes.length > 0) {
                        const tempDiv = document.createElement('div');
                        currentGroupNodes.forEach(n => tempDiv.appendChild(n.cloneNode(true)));
                        groupNodes.push(tempDiv);
                    }
                    currentGroupNodes = [node];
                } else {
                    currentGroupNodes.push(node);
                }
            });
            if (currentGroupNodes.length > 0) {
                const tempDiv = document.createElement('div');
                currentGroupNodes.forEach(n => tempDiv.appendChild(n.cloneNode(true)));
                groupNodes.push(tempDiv);
            }
        }

        if (groupNodes.length === 0) {
            const allLinks = Array.from(area.querySelectorAll(tagsSelector))
                .map(el => ({ element: el, url: extractURL(el) }))
                .filter(el => el.url);
            return applyUrlFilters(allLinks, effectiveUrlFilters).map(el => el.url);
        }

        groupNodes.forEach(groupBlock => {
            const groupResolution = findResolutionInText(groupBlock.textContent);
            let linksInGroup = Array.from(groupBlock.querySelectorAll(tagsSelector))
                .map(el => ({ element: el, url: extractURL(el) }))
                .filter(el => el.url);

            linksInGroup = applyUrlFilters(linksInGroup, effectiveUrlFilters);

            if (linksInGroup.length > 0) {
                const bestLinks = findBestLinkInGroup(linksInGroup, finalResolutionPriority, groupResolution);
                finalLinks.push(...bestLinks);
            } else {
                const allLinks = Array.from(groupBlock.querySelectorAll(tagsSelector))
                    .map(el => ({ element: el, url: extractURL(el) }))
                    .filter(el => el.url);
                finalLinks.push(...applyUrlFilters(allLinks, effectiveUrlFilters).map(el => el.url));
            }
        });

        if (finalLinks.length > 0) {
            return [...new Set(finalLinks)];
        }
    }
    // -----------------------------------------------------------
    // Case 2: Resolution & URL Filtering Mode (No separator)
    // -----------------------------------------------------------
    const allElements = [];
    let currentResolutionContext = null;
    const tagSelector = finalTags.map(t => t.toLowerCase()).join(',');

    Array.from(area.childNodes).forEach(node => {
        const nodeText = node.textContent || '';
        const resolution = findResolutionInText(nodeText);
        if (resolution) {
            currentResolutionContext = resolution;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            const elementsInElement = Array.from(node.querySelectorAll(tagSelector));
            elementsInElement.forEach(el => {
                const url = extractURL(el);
                if (url) {
                    const elObj = {
                        url: url,
                        element: el,
                        resolution: findResolutionInText(url) || findResolutionInText(el.textContent) || currentResolutionContext
                    };
                    allElements.push(elObj);
                }
            });
        }
    });

    let filteredLinksByUrl = applyUrlFilters(allElements, effectiveUrlFilters);

    if (filteredLinksByUrl.length > 0) {
        const maxResolutionIndex = finalResolutionPriority.findIndex(res => String(res).toLowerCase() === 'max');
        if (maxResolutionIndex !== -1) {
            const availableResolutions = filteredLinksByUrl
                .map(el => el.resolution)
                .filter(res => res)
                .map(res => parseInt(res))
                .filter(res => !isNaN(res));

            if (availableResolutions.length > 0) {
                const maxResolution = Math.max(...availableResolutions);
                const foundMax = filteredLinksByUrl.filter(el => parseInt(el.resolution) === maxResolution);
                if (foundMax.length > 0) {
                    return foundMax.map(el => el.url);
                }
            }
            const filteredPriority = finalResolutionPriority.filter((_, index) => index !== maxResolutionIndex);

            for (const res of filteredPriority) {
                const found = filteredLinksByUrl.filter(el => el.resolution && checkResolutionCondition(el.resolution, res));
                if (found.length > 0) {
                    return found.map(link => link.url);
                }
            }

            return [];
        }

        for (const res of finalResolutionPriority) {
            const found = filteredLinksByUrl.filter(el => el.resolution && checkResolutionCondition(el.resolution, res));
            if (found.length > 0) {
                return found.map(link => link.url);
            }
        }
    }

    console.log('⚠️ No specific links found. Returning all found URLs on the page.');
    return allElements.map(el => el.url);
}