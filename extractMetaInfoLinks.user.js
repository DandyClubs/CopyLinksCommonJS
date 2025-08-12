
// ✅ 전역 해상도 맵
const resolutionMap = {
    '3840': ['3840x2160', 'uhd', '4k', '2160p'],
    '1920': ['1920x1080', 'fhd', '1080p', '1440p', '2560x1440'],
    '1280': ['1280x720', 'hd', '720p'],
    '720': ['720p'],
    'low': ['480p', '360p', '240p'],
    'veryhigh': ['8k', '4320p', 'superhd'],
    'other': []
};

// ✅ 해상도 정규식 추출
function getStandardResolution(text) {
    const lowerText = text.toLowerCase();
    for (const [key, keywords] of Object.entries(resolutionMap)) {
        if (keywords.some(k => lowerText.includes(k))) {
            return key;
        }
    }
    return null;
}

// ✅ 해상도 블록 생성 (div 스캔 기반)
function groupResolutionOfDiv(div) {
    const groups = {};
    const children = Array.from(div.childNodes);
    let currentRes = null;

    for (const el of children) {
        const text = el?.textContent || '';
        const res = getStandardResolution(text);
        if (res && res !== currentRes) {
            currentRes = res;
            if (!groups[currentRes]) groups[currentRes] = [];
        }
        if (el.nodeType === Node.ELEMENT_NODE) {
            const linksInNode = Array.from(el.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => /katfile.com|mega.nz\/file|drive\.google\.com\/file\//.test(href));
            console.log(el, currentRes, linksInNode)
            if (currentRes && linksInNode.length > 0) {
                linksInNode.forEach(a => groups[currentRes].push(a));
                console.log(groups[currentRes])
            }
        }
    }
    return groups;
}

// ✅ 메타 정보 추출
function extractMetaInfo(div, { resolutionMap, priority = [], useResolution = true }) {
    const text = div.textContent;

    const titleMatch = text.match(/影片名稱[:：]?\s*(.+)/i);
    const dateMatch = text.match(/(20\d{2}[.\-/]\d{1,2}[.\-/]\d{1,2})/);
    const passwordMatch = text.match(/【解壓密碼】：(.+?)\s|Password\s?:\s?([^\s]+)/i);

    const coverImage = div.querySelector('img')?.src || null;

    const allLinks = Array.from(div.querySelectorAll('a[href]'));

    const resolutionGroups = {};
    allLinks.forEach(link => {
        const combined = link.textContent + ' ' + link.href;
        const res = getStandardResolution(combined) || 'other';
        if (!resolutionGroups[res]) resolutionGroups[res] = [];
        resolutionGroups[res].push(link.href);
    });

    // 🎯 텍스트 기반 해상도 그룹 분류
    const resBlocks = groupResolutionOfDiv(div);

    for (const [res, links] of Object.entries(resBlocks)) {
        if (!resolutionGroups[res]) resolutionGroups[res] = [];
        resolutionGroups[res].push(...links.map(a => a.href));
    }

    // 🧹 중복 제거
    for (const res in resolutionGroups) {
        resolutionGroups[res] = [...new Set(resolutionGroups[res])];
    }

    // 🎯 우선순위 적용
    let finalLinks = [];
    if (useResolution && priority?.length) {
        for (const res of priority) {
            if (resolutionGroups[res]?.length) {
                finalLinks = resolutionGroups[res];
                return {
                    title: titleMatch?.[1]?.trim() || '',
                    date: dateMatch?.[1] || null,
                    password: passwordMatch?.[1] || passwordMatch?.[2] || null,
                    coverImage,
                    [res]: finalLinks
                };
            }
        }
    }

    // fallback 전체 병합
    const mergedLinks = Object.values(resolutionGroups).flat();
    return {
        title: titleMatch?.[1]?.trim() || text.split('\n')[0],
        date: dateMatch?.[1] || null,
        password: passwordMatch?.[1] || passwordMatch?.[2] || null,
        coverImage,
        links: [...new Set(mergedLinks)]
    };
}

// ✅ area 내 그룹 생성
function createGroupsFromArea(area, siteRule = {}) {
    const children = Array.from(area.childNodes);
    const groups = [];
    let currentGroup = document.createElement('div');
    console.log(currentGroup)

    const separatorText = siteRule.separatorText || [];

    children.forEach(el => {
        const text = el.textContent.trim();
        const isSeparator = separatorText.some(keyword => text.includes(keyword));

        if (isSeparator && currentGroup.children.length > 0) {
            groups.push(currentGroup);
            currentGroup = document.createElement('div');
        }

        currentGroup.appendChild(el.cloneNode(true));
    });

    if (currentGroup.children.length) {
        groups.push(currentGroup);
    }
    return groups;
}

/*
// ✅ 메인 파이프라인
async function analyzePage(area, options = {}) {
    const {
        siteRule = {},
        resolutionMap = resolutionMap,
        priority = ['3840', '1920', '1280', '720'],
        useResolution = true
    } = options;

    const blocks = createGroupsFromArea(area, siteRule);
    const results = [];

    for (const block of blocks) {
        const meta = extractMetaInfo(block, {
            resolutionMap,
            priority,
            siteRule,
            useResolution
        });

        if (meta && meta.title) {
            results.push(meta);
        }
    }

    console.log('[✅ analyzePage Final Extracted]', results);
    return results;
}
*/