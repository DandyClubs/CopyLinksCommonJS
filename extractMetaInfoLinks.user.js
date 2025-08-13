// ✅ 전역 해상도 맵
const resolutionMap = {
    '3840': ['3840x2160', 'uhd', 'ultrahd', '4k', '2160p'],
    '1920': ['1920x1080', '2048x1080', 'fhd', 'fullhd', '1080p', '1440p', '2560x1440'],
    '1280': ['1280x720', 'hd', '720p'],
    '720': ['720p'],
    'low': ['480p', '360p', '240p'],
    'veryhigh': ['8k', '4320p', 'superhd'],
    'other': []
};

function GetFileName(url) {
    let name = url.split('/').pop()?.replace('.html', '');
    return name.substring(0, name.lastIndexOf('.'));
}

// ✅ 해상도 정규식 추출
function getStandardResolution(text) {
    const lowerText = text.toLowerCase();
    let matchedKey = null;

    for (const [key, keywords] of Object.entries(resolutionMap)) {
        if (keywords.some(k => lowerText.includes(k))) {
            if (matchedKey && matchedKey !== key) {
                // 이미 다른 그룹을 매칭한 적이 있으면 null 반환
                return null;
            }
            matchedKey = key;
        }
    }
    return matchedKey;
}


// ✅ 해상도 블록 생성
function groupResolution(div, siteRule = {}) {
    return new Promise((resolve) => {
        let groups = {};
        const childrenNodes = Array.from(div.childNodes);
        let currentRes = null;

        for (const el of childrenNodes) {
            const text = el?.textContent || '';
            const res = getStandardResolution(text);
            if (res && res !== currentRes) {
                currentRes = res;
                if (!groups[currentRes]) groups[currentRes] = [];
            }
            if (el.nodeType === Node.ELEMENT_NODE) {
                const linksInNode = Array.from(el.querySelectorAll('a'))
                    .filter(link => /katfile.com|mega.nz\/file|drive\.google\.com\/file\//.test(link.href));
                if (linksInNode.length > 0) {
                    linksInNode.forEach(a => {
                        const fileName = GetFileName(a.href) + ' ' +
                            (/^https?:/.test(a.textContent) ? GetFileName(a.textContent) : a.textContent);
                        const res2 = getStandardResolution(fileName);
                        const finalRes = res2 ? res2 : currentRes ? currentRes : 'other';
                        groups[finalRes].push(a);
                    });
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
        const dateMatch = text.match(/(20\d{2}[.\-/]\d{1,2}[.\-/]\d{1,2})/);
        const passwordMatch = text.match(siteRule.passwordRegex);
        const coverImage = div.querySelector('img')?.src || null;

        Promise.resolve(groupResolution(div, siteRule)).then(Blocks => {
            const allLinks = Array.from(div.querySelectorAll('a[href]'))
                .filter(href => /katfile.com|mega.nz\/file|drive\.google\.com\/file\//.test(href));

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
            console.log(siteRule.useResolution, siteRule.priority, resolutionGroups)
            if (siteRule.useResolution && siteRule.priority?.length) {
                for (const res of siteRule.priority) {
                    if (resolutionGroups[res]?.length) {
                        resolve({
                            title: titleMatch?.[1]?.trim() || '',
                            date: dateMatch?.[1] || null,
                            password: passwordMatch?.[1] || passwordMatch?.[2] || null,
                            coverImage: siteRule.coverImage,
                            [res]: resolutionGroups[res]
                        });
                        return;
                    }
                }
            }

            // fallback 전체 병합
            const mergedLinks = Object.values(resolutionGroups).flat();
            resolve({
                title: titleMatch?.[1]?.trim() || text.split('\n')[0], // siteRule.firstLine 
                date: dateMatch?.[1] || null,
                password: passwordMatch?.[1] || passwordMatch?.[2] || null,
                coverImage: siteRule.coverImage,
                links: [...new Set(mergedLinks)]
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
            console.log('isBreakPoint: ', isBreakPoint, '\nisSeparator: ', isSeparator, '\ntext: ', text)
            if (isBreakPoint) {
                // 지금까지의 currentGroup이 비어있지 않다면 저장
                if (currentGroup.childNodes.length > 0) {
                    groups.push(currentGroup);
                }
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
            //console.log('[✅ analyzePage Final Extracted]', results);
            return results;
        });
}
