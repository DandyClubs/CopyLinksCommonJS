
const BASE_URLS = {
    "FANZA_DIGITAL": "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video",
    "FANZA_MONO": "https://awsimgsrc.dmm.com/dig/mono/movie",
    "PRESTIGE": "https://www.prestige-av.com/api/media/goods/prestige",
    "DMM_MONO": "https://pics.dmm.co.jp/mono/movie/adult",
};

const DB_PREFIX_RULES = {
    // [SOD 계열] - awsimgsrc.dmm.com
    "ABF": ["FANZA_MONO", "118", "raw"],

    // S1 NO.1 STYLE
    "SONE": ["FANZA_DIGITAL", "", "zero5"],
    "SNOS": ["FANZA_DIGITAL", "", "zero5"],

    // [Prestige 계열] - pics.dmm.co.jp
    "ABS": ["DMM_MONO", "118", "raw"],
    "ABP": ["DMM_MONO", "118", "raw"],
    "ABW": ["DMM_MONO", "118", "raw"],
    "EZD": ["DMM_MONO", "118", "raw"],
    "CHN": ["DMM_MONO", "118", "raw"],
    "FTN": ["DMM_MONO", "118", "raw"],
    "ABY": ["DMM_MONO", "118", "raw"],
    "DOM": ["DMM_MONO", "118", "raw"],
    "GVH": ["DMM_MONO", "13", "raw"],
    "GVG": ["DMM_MONO", "13", "raw"],
    "GG": ["DMM_MONO", "13", "raw"],

    //# BGN045~072,CHN156~217,ABP398~999번, ABW001~279번

    // [ Madonna 계열] - pics.dmm.co.jp 
    "JUR": ["FANZA_DIGITAL", "", "zero5"],

    // IDEA POCKET
    "IPZZ": ["FANZA_MONO", "", "zero5"],
    "IPZ": ["FANZA_MONO", "", "zero5"],

    // [DIGITAL 계열 - h_, n_] - awsimgsrc.dmm.co.jp (5자리 패딩)
    "AMBI": ["FANZA_DIGITAL", "h_237", "zero5"],
    "AMBS": ["FANZA_DIGITAL", "h_237", "zero5"],
    "CLOT": ["FANZA_DIGITAL", "h_237", "zero5"],
    "NACR": ["FANZA_DIGITAL", "h_237", "zero5"],
    "ZMAR": ["FANZA_DIGITAL", "h_237", "zero5"],
    "BANK": ["FANZA_DIGITAL", "h_1495", "zero5"],
    "BUZ": ["FANZA_DIGITAL", "h_1340", "zero5"],
    "CHUC": ["FANZA_DIGITAL", "h_491", "zero5"],
    "CIEL": ["FANZA_DIGITAL", "h_491", "zero5"],
    "NNNC": ["FANZA_DIGITAL", "h_491", "zero5"],
    "DOCD": ["FANZA_DIGITAL", "h_1711", "zero5"],
    "FCP": ["FANZA_DIGITAL", "h_1711", "zero5"],
    "MFCT": ["FANZA_DIGITAL", "h_1711", "zero5"],
    "EUUD": ["FANZA_DIGITAL", "h_086", "zero5"],
    "JRZE": ["FANZA_DIGITAL", "h_086", "zero5"],
    "JURA": ["FANZA_DIGITAL", "h_086", "zero5"],
    "NUKA": ["FANZA_DIGITAL", "h_086", "zero5"],
    "XMOM": ["FANZA_DIGITAL", "h_086", "zero5"],
    "HZGD": ["FANZA_DIGITAL", "h_1100", "zero5"],
    "JUKF": ["FANZA_DIGITAL", "h_227", "zero5"],
    "MBDD": ["FANZA_DIGITAL", "n_707", "zero5"],
    "MILK": ["FANZA_DIGITAL", "h_1240", "zero5"],
    "ONEX": ["FANZA_DIGITAL", "h_1674", "zero5"],
    "PJAB": ["FANZA_DIGITAL", "h_1604", "zero5"],
    "REBD": ["FANZA_DIGITAL", "h_346", "zero5"],
    "REBDB": ["FANZA_DIGITAL", "h_346", "zero5"],
    "SKMJ": ["FANZA_DIGITAL", "h_1324", "zero5"],
    "SS": ["FANZA_DIGITAL", "h_1231", "zero5"],
    "STSK": ["FANZA_DIGITAL", "h_1605", "zero5"],
    "HMRK": ["FANZA_DIGITAL", "h_1711", "zero5"],
    "BEAF": ["FANZA_DIGITAL", "h_1615", "zero5"],
    "GINAV": ["FANZA_DIGITAL", "h_1350", "zero5"],
    "FCH": ["FANZA_DIGITAL", "h_1711", "zero5"],
    "TENN": ["FANZA_DIGITAL", "h_491", "zero5"],
    "PYM": ["FANZA_DIGITAL", "h_283", "zero5"],
    "MAAN": ["FANZA_DIGITAL", "h_1711", "zero5"],
    "INSTV": ["FANZA_DIGITAL", "h_1472", "zero5"],

    // [기타 숫자형]
    "AD": ["FANZA_DIGITAL", "24", "zero5"],
    "AKB": ["FANZA_DIGITAL", "55", "zero5"],
    "ASEX": ["FANZA_DIGITAL", "1", "zero5"],
    "BLD": ["FANZA_DIGITAL", "24", "zero5"],
    "BOKO": ["FANZA_DIGITAL", "1", "zero5"],
    "CAD": ["FANZA_DIGITAL", "24", "zero5"],
    "CADV": ["FANZA_DIGITAL", "49", "zero5"],
    "CPDE": ["FANZA_DIGITAL", "188", "zero5"],
    "DFDM": ["FANZA_DIGITAL", "2", "zero5"],
    "DLDSS": ["FANZA_DIGITAL", "1", "zero5"],
    "DOCP": ["FANZA_DIGITAL", "188", "zero5"],
    "ECB": ["FANZA_DIGITAL", "2", "zero5"],
    "EKDV": ["FANZA_DIGITAL", "49", "zero5"],
    "FNS": ["FANZA_DIGITAL", "1", "zero5"],
    "FSDSS": ["FANZA_DIGITAL", "1", "zero5"],
    "FSET": ["FANZA_DIGITAL", "1", "zero5"],
    "GN": ["FANZA_DIGITAL", "188", "zero5"],
    "HAWA": ["FANZA_DIGITAL", "1", "zero5"],
    "HN": ["FANZA_DIGITAL", "188", "zero5"],
    "IENE": ["FANZA_DIGITAL", "1", "zero5"],
    "IENF": ["FANZA_DIGITAL", "1", "zero5"],
    "IESP": ["FANZA_DIGITAL", "1", "zero5"],
    "JERA": ["FANZA_DIGITAL", "1", "zero5"],
    "KMHRS": ["FANZA_DIGITAL", "1", "zero5"],
    "MGOLD": ["FANZA_DIGITAL", "1", "zero5"],
    "MIST": ["FANZA_DIGITAL", "1", "zero5"],
    "MTABS": ["FANZA_DIGITAL", "1", "zero5"],
    "MTALL": ["FANZA_DIGITAL", "1", "zero5"],
    "NAMH": ["FANZA_DIGITAL", "1", "zero5"],
    "NEO": ["FANZA_DIGITAL", "433", "zero5"],
    "NEZ": ["FANZA_DIGITAL", "188", "zero5"],
    "NHDTA": ["FANZA_DIGITAL", "1", "zero5"],
    "NHDTB": ["FANZA_DIGITAL", "1", "zero5"],
    "NHDTC": ["FANZA_DIGITAL", "1", "zero5"],
    "NOSKN": ["FANZA_DIGITAL", "1", "zero5"],
    "NSBB": ["FANZA_DIGITAL", "1", "zero5"],
    "NTR": ["FANZA_DIGITAL", "1", "zero5"],
    "OFSD": ["FANZA_DIGITAL", "1", "zero5"],
    "OKB": ["FANZA_DIGITAL", "1", "zero5"],
    "OKK": ["FANZA_DIGITAL", "1", "zero5"],
    "OKS": ["FANZA_DIGITAL", "1", "zero5"],
    "OKV": ["FANZA_DIGITAL", "1", "zero5"],
    "OKX": ["FANZA_DIGITAL", "1", "zero5"],
    "PIYO": ["FANZA_DIGITAL", "1", "zero5"],
    "PRIAN": ["FANZA_DIGITAL", "5389", "zero5"],
    "SGKI": ["FANZA_DIGITAL", "1", "zero5"],
    "SUN": ["FANZA_DIGITAL", "1", "zero5"],
    "SVDVD": ["FANZA_DIGITAL", "1", "zero5"],
    "SVFLA": ["FANZA_DIGITAL", "1", "zero5"],
    "SVSHA": ["FANZA_DIGITAL", "1", "zero5"],
    "SW": ["FANZA_DIGITAL", "1", "zero5"],
    "WAWA": ["FANZA_DIGITAL", "1", "zero5"],
    "WFR": ["FANZA_DIGITAL", "2", "zero5"],
    "WO": ["FANZA_DIGITAL", "1", "zero5"],
    "3DSVR": ["FANZA_DIGITAL", "1", "zero5"],
    "AEGE": ["FANZA_DIGITAL", "1", "zero5"],
    "AKDL": ["FANZA_DIGITAL", "1", "zero5"],



    "UMSO": ["FANZA_DIGITAL", "", "zero5"],
    "HJBB": ["FANZA_DIGITAL", "", "zero5"],
    "USAG": ["FANZA_DIGITAL", "", "zero5"],
    "KAM": ["FANZA_DIGITAL", "", "zero5"],
    "ERDM": ["FANZA_DIGITAL", "", "zero5"],
    "HEZ": ["FANZA_DIGITAL", "59", "zero5"],
    "VENZ": ["FANZA_DIGITAL", "", "zero5"],
    "UZU": ["FANZA_DIGITAL", "", "zero5"],
    "SQTE": ["FANZA_DIGITAL", "", "zero5"],
    "SABA": ["FANZA_DIGITAL", "", "zero5"],
    "OOWL": ["FANZA_DIGITAL", "", "zero5"],
    "KAGN": ["FANZA_DIGITAL", "", "zero5"],
    "MADV": ["FANZA_DIGITAL", "", "zero5"],
    "OAE": ["FANZA_DIGITAL", "", "zero5"],
    "NCYF": ["FANZA_DIGITAL", "", "zero5"],
    "KSBJ": ["FANZA_DIGITAL", "", "zero5"],
    "LUCY": ["FANZA_DIGITAL", "", "zero5"],
    "HUNTA": ["FANZA_DIGITAL", "", "zero5"],

    // Serebu No Tomo    
    "CEAD": ["FANZA_DIGITAL", "", "zero5"],
    "CEMD": ["FANZA_DIGITAL", "", "zero5"],
};


function checkImageExistence(link) {
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: 'HEAD',
            url: link,
            timeout: 5000,
            onload: function (response) {
                const status = response.status;
                if (status === 200) {
                    resolve({ exists: true, reason: 'OK', link, status });
                }
                else if (status === 403) {
                    console.warn(`[ImageRetry] 국가제한 (HTTP ${status}): ${link}`);
                    resolve({ exists: false, reason: 'Region restrictions', link, status });
                }
                else {
                    resolve({ exists: false, reason: 'error', link, status });
                }
            },
            onerror: () => resolve({ exists: false, reason: 'error', link }),
            ontimeout: () => resolve({ exists: false, reason: 'timeout', link })
        });
    });
}

function getMergedRules() {
    const merged = { ...DB_PREFIX_RULES };

    // 저장된 모든 키 목록을 가져와 "RULE_"로 시작하는 것만 필터링
    const allKeys = GM_listValues();
    allKeys.forEach(key => {
        if (DB_PREFIX_RULES[key]) {
            GM_deleteValue(key);
        } else {
            merged[key] = GM_getValue(key);
        }
    });

    return merged;
}

async function generateUrlCandidates(code, imageSrc = '') {
    const codePattern = /([A-Z]{2,6})-?(\d+)([a-z]*)?/i;
    const match = code.match(codePattern);
    if (!match) return [];

    const prefix = match[1].toUpperCase();
    const pureNum = match[2];
    const extraSuffix = (match[3] || "").toLowerCase();

    const candidates = [];
    const metaData = {};
    const CURRENT_RULES = getMergedRules();

    const numInt = parseInt(pureNum, 10);

    // --- 1. Prestige Old ---
    const isPrestigeOld = (
        (prefix === "BGN" && numInt >= 45 && numInt <= 72) ||
        (prefix === "CHN" && numInt >= 156 && numInt <= 217) ||
        (prefix === "ABP" && numInt >= 398 && numInt <= 999) ||
        (prefix === "ABW" && numInt >= 1 && numInt <= 279)
    );

    if (isPrestigeOld) {
        const url = `${BASE_URLS['PRESTIGE']}/${prefix.toLowerCase()}/${pureNum}/pb_${prefix.toLowerCase()}-${pureNum}.jpg`;
        candidates.push(url);
        metaData[url] = ["PRESTIGE", "", "raw"];
    }

    if (CURRENT_RULES[prefix]) {
        const [category, extraNum, format] = CURRENT_RULES[prefix];
        const targetBaseUrl = BASE_URLS[category] || BASE_URLS["FANZA_DIGITAL"];
        let formattedNum;
        if (format.startsWith('zero')) {
            const len = parseInt(format.slice(4), 10);
            formattedNum = pureNum.padStart(len, '0');
        } else {
            formattedNum = pureNum; // raw
        }
        const fileName = `${extraNum}${prefix.toLowerCase()}${formattedNum}${extraSuffix}`;
        candidates.push(`${targetBaseUrl}/${fileName}/${fileName}pl.jpg`);
    }


    if (imageSrc && imageSrc.includes('dmm')) {
        const fileNamePart = imageSrc.split('/').pop().replace(/\..*$/, '').replace(/p[ls]$|jp$/, '');
        const flexRegex = new RegExp(`(.*?)${prefix}(\\d+)`, 'i');
        const fileMatch = fileNamePart.match(flexRegex);

        if (fileMatch) {
            const extra = fileMatch[1];
            const rawNumStr = fileMatch[2]; // 이미지 경로에서 추출된 실제 숫자 (예: "0003")
            const zero5 = pureNum.padStart(5, '0'); // 5자리로 맞춘 숫자 (예: "00001")

            // 1. FANZA_DIGITAL 시도 (무조건 5자리 포맷 사용)
            const digitalFName = `${extra}${prefix.toLowerCase()}${zero5}${extraSuffix}`;
            const digitalUrl = `${BASE_URLS["FANZA_DIGITAL"]}/${digitalFName}/${digitalFName}pl.jpg`;

            if (!metaData[digitalUrl]) {
                candidates.push(digitalUrl);
                metaData[digitalUrl] = ["FANZA_DIGITAL", extra, "zero5"];
            }

            // 2. FANZA_MONO 시도 조건 체크
            // 조건: extra가 'h_'로 시작하지 않음 AND (5자리가 아니거나, 5자리라면 0으로 시작하지 않음)
            const isHPrefix = extra.startsWith('h_');
            const is5DigitStartingWithZero = (rawNumStr.length === 5 && rawNumStr.startsWith('0'));

            if (!isHPrefix && !is5DigitStartingWithZero) {
                const monoFName = `${extra}${prefix.toLowerCase()}${rawNumStr}${extraSuffix}`;
                const monoUrl = `${BASE_URLS["FANZA_MONO"]}/${monoFName}/${monoFName}pl.jpg`;

                if (!metaData[monoUrl]) {
                    candidates.push(monoUrl);
                    metaData[monoUrl] = ["FANZA_MONO", extra, "raw"];
                }
            }
        }
    }

    const uniqueCandidates = [...new Set(candidates)];
    uniqueCandidates._meta = metaData;
    uniqueCandidates._prefix = prefix; // 저장을 위해 prefix 전달
    return uniqueCandidates;
}

function saveRuleFromUrl(url, prefix, pureNum) {
    try {
        const urlObj = new URL(url);

        const fileName = urlObj.pathname
            .split('/')
            .pop()
            .replace(/\..*$/, '')
            .replace(/p[ls]$/, '');

        const match = fileName.match(new RegExp(`${prefix}(\\d+)`, 'i'));
        if (!match) return;

        const extractedNumStr = match[1];

        // 🔥 핵심: raw 판별은 "완전 일치"
        let format;
        if (extractedNumStr === pureNum) {
            format = "raw";
        } else if (extractedNumStr.length === 5) {
            format = "zero5";
        } else {
            const padLen = `zero${extractedNumStr.length}`;
            format = padLen;
        }

        const category = url.includes('digital')
            ? "FANZA_DIGITAL"
            : "FANZA_MONO";

        const extra = fileName.split(new RegExp(prefix, 'i'))[0];

        GM_setValue(prefix, [category, extra, format]);

        console.log(
            `%c[자동 학습 awsimgsrc] ${prefix} → ${format}`,
            "color: lime;"
        );

    } catch (e) {
        console.error("규칙 저장 오류:", e);
    }
}