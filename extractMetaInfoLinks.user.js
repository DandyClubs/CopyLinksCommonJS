// ✅ 전역 해상도 맵
const resolutionMap = {
    '3840': ['3840x2160', 'uhd', 'ultrahd', '4k', '2160p'],
    '1920': ['1440x1080', '1920x1080', '2048x1080', '2560x1440', 'bd', 'fhd', 'fullhd', '1080p', '1440p'],
    '1280': ['1280x720', '1280x960', '720p'],
    '720': ['720x'],
    '480': ['480x270', '480p', '360p', '240p'],
    'other': []
};

function GetFileName(url) {    
    let name = decodeURIComponent(url).split('/').pop()?.replace('.html', '');
    return name.substring(0, name.lastIndexOf('.'));
}

function createResolutionRegex(keywords) {
    const patterns = keywords.map(k => {
        if (k.includes('x') && k.endsWith('x')) {
            // '720x'와 같은 패턴은 뒤에 숫자가 와야 하므로 \b 대신 \d+를 사용합니다.
            // 예: 720x540을 매칭하기 위해 '720x' -> '720x\d+' 패턴으로 변환
            // *주의: 이렇게 하면 720x로 시작하는 모든 해상도를 포괄합니다.
            return `${k}\\d+`;
        }
        // 대부분의 키워드 ('4k', 'uhd', '1080p' 등)는 독립된 단어로 매칭되도록 \b 사용
        return `\\b${k}\\b`;
    });

    // 패턴들을 |(OR)로 연결하고 대소문자를 무시(i)하는 정규식 객체를 생성
    const pattern = patterns.join('|');
    return new RegExp(pattern, 'i');
}

// 3. resolutionMap을 기반으로 resolutionRegexMap을 동적으로 생성
const resolutionRegexMap = {};

for (const [key, keywords] of Object.entries(resolutionMap)) {
    if (keywords.length > 0) {
        resolutionRegexMap[key] = createResolutionRegex(keywords);
    }
}

// ✅ 해상도 정규식 추출
function getStandardResolution(text) {
    const lowerText = text.toLowerCase();
    let matchedKey = null;

    for (const [key, regex] of Object.entries(resolutionRegexMap)) {
        if (regex.test(lowerText)) {
            /*
            if (matchedKey && matchedKey !== key) {
                // 이미 다른 그룹을 매칭한 적이 있으면 null 반환
                return null;
            }
            */
            console.log(`[매칭 성공] 입력: ${lowerText}, 키: ${key}`);
            matchedKey = key;
        }
    }
    return matchedKey;
}

const DOMAIN = extractRootDomain(window.location.href);

const filterLinksRegex = /frdl\.(io|my)\/|filefox\.cc|katfile\.|clicknupload\.click|mega\.nz\/file|drive\.google\.com\/file\/|ddownload\.com|krakenfiles\.com|send\.now|rg\.to/;
const SKIPFILTER = new RegExp('rapidgator\\.net\\/folder\\/|windfiles\\.com|mypikpak\\.com|pricing\\?aff|mega\\.nz\\/aff|katfile\\.(com|cloud|online)\\/(free|users\\/)|developershome|md5file\\.com|attachment|premium|upgrade|javascript|search|SKIP|#$|^\\/|^(?=.*' + DOMAIN + ').*$');

// ✅ 해상도 블록 생성
function groupResolution(div, siteRule = {}) {
    return new Promise((resolve) => {
        const cloneArea = div.cloneNode(true)
        Array.from(cloneArea.querySelectorAll('a')).forEach(link => link.textContent = '');

        let groups = {};
        const childrenNodes = Array.from(cloneArea.childNodes);
        let currentRes = null;

        for (const el of childrenNodes) {
            const text = el?.textContent || '';
            const res = getStandardResolution(text)
            if (res && res !== currentRes) {
                currentRes = res;
                if (!groups[currentRes]) groups[currentRes] = [];

                if (el.nodeType === Node.ELEMENT_NODE) {
                    const linksInNode = Array.from(el.querySelectorAll('a'))
                        .filter(link => filterLinksRegex.test(link.href) && !SKIPFILTER.test(link.href));
                    if (linksInNode.length > 0) {
                        linksInNode.forEach(a => {
                            groups[currentRes].push(a);
                        });
                    }
                }
            }
        }
        resolve(groups);
    });
}

// ✅ 메타 정보 추출
function extractMetaInfo(div, siteRule = {}) {
    return new Promise((resolve) => {
        const text = div.textContent;
        const titleMatch = text.match(siteRule.getTitleRegex);
        const getTitle = titleMatch ? titleMatch[siteRule.getTitleMatchPoint]?.trim() : text.split('\n')[0]; // siteRule.firstLine 
        const dateMatch = text.match(/(20\d{2}[.\-/]\d{1,2}[.\-/]\d{1,2})/);
        const passwordMatch = text.match(siteRule.passwordRegex);
        const password = passwordMatch ? passwordMatch.pop().trim() : null;


        Promise.resolve(groupResolution(div, siteRule)).then(Blocks => {
            const allLinks = Array.from(div.querySelectorAll('a[href]'))
                .filter(href => filterLinksRegex.test(href));

            let resolutionGroups = {};
            allLinks.forEach(link => {
                const fileName = GetFileName(link.href) + ' ' +
                    (/^https?:/.test(link.textContent) ? GetFileName(link.textContent) : link.textContent);
                const res = getStandardResolution(fileName) || 'other';
                if (!resolutionGroups[res]) resolutionGroups[res] = [];
                resolutionGroups[res].push(link.href);
            });

            if (Object.keys(Blocks).length > 0) {
                for (const [res, links] of Object.entries(Blocks)) {
                    if (!resolutionGroups[res]) resolutionGroups[res] = [];
                    resolutionGroups[res].push(...links.map(a => a.href));
                }
            }

            // 🧹 중복 제거
            for (const res in resolutionGroups) {
                resolutionGroups[res] = [...new Set(resolutionGroups[res])];
            }

            // 🎯 우선순위 적용
            console.log('우선순위 적용: ', siteRule.useResolution, siteRule.priority, resolutionGroups)
            if (siteRule.useResolution && siteRule.priority?.length) {
                for (const res of siteRule.priority) {
                    if (resolutionGroups[res]?.length) {
                        resolve({
                            title: getTitle || '',
                            date: dateMatch?.[1] || null,
                            password: password,
                            coverImage: siteRule.coverImage,
                            //[res]: resolutionGroups[res],
                            links: resolutionGroups[res],
                            priorityResolution: res,

                        });
                        return;
                    }
                }
            }

            // fallback 전체 병합
            const mergedLinks = Object.values(resolutionGroups).flat();
            resolve({
                title: getTitle,
                date: dateMatch?.[1] || null,
                password: password,
                coverImage: siteRule.coverImage,
                links: [...new Set(mergedLinks)],
                priorityResolution: 'All',
            });
        });
    });
}

// ✅ area 내 그룹 생성
function createGroupsFromArea(area, siteRule = {}) {
    return new Promise((resolve) => {
        const childrenNodes = Array.from(area.childNodes);
        const groups = [];
        let currentGroup = document.createElement('div');

        const separatorText = siteRule.separatorText || [];
        const breakPoint = siteRule.breakPoint || [];

        for (const el of childrenNodes) {
            const text = el?.textContent.trim();
            const isSeparator = separatorText.some(keyword => text.includes(keyword));
            const isBreakPoint = breakPoint.some(keyword => text.includes(keyword));
            //console.log('isBreakPoint: ', isBreakPoint, '\nisSeparator: ', isSeparator, '\ntext: ', text)
            if (isBreakPoint) {
                // 지금까지의 currentGroup이 비어있지 않다면 저장
                /*
                if (currentGroup.childNodes.length > 0) {
                    groups.push(currentGroup);
                }
                */
                break; // 반복 종료
            }

            if (isSeparator && currentGroup.childNodes.length > 0) {
                groups.push(currentGroup);
                currentGroup = document.createElement('div');
            }

            currentGroup.appendChild(el.cloneNode(true));
        }

        // 루프가 정상 종료된 경우 마지막 그룹 추가
        if (currentGroup.childNodes.length > 0 &&
            !breakPoint.some(keyword => currentGroup.textContent.includes(keyword))) {
            groups.push(currentGroup);
        }

        resolve(groups);
    });
}

// ✅ 메인 파이프라인
function analyzePage(rule) {
    return createGroupsFromArea(rule.area, rule)
        .then(blocks => Promise.all(blocks.map(block => extractMetaInfo(block, rule))))
        .then(metas => {
            const results = metas.filter(meta => meta && meta.title);

            console.log('그룹별 결과: ', metas)
            // 비교를 위해 resolutionMap의 키들을 미리 배열로 만들어 둡니다.
            const resolutionKeys = Object.keys(resolutionMap);

            const filteredMetas = metas.filter(meta => Object.keys(meta).some(key => resolutionKeys.includes(key)) || meta.links?.length > 0);


            console.log('[✅ analyzePage Final Extracted]', filteredMetas);
            return filteredMetas;
        });
}
