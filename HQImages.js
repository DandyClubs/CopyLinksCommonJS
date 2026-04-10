
const BASE_URLS = {
    "FANZA_DIGITAL": "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video", // 00001 
    "FANZA_MONO": "https://awsimgsrc.dmm.com/dig/mono/movie",              // raw 
    "PRESTIGE": "https://www.prestige-av.com/api/media/goods/prestige",    // raw
    "DMM_MONO": "https://pics.dmm.co.jp/mono/movie/adult",                 // raw
};

const DB_PREFIX_RULES = {
    "ABF": ["FANZA_MONO", "118"],

    // S1 NO.1 STYLE
    "SONE": ["FANZA_DIGITAL", ""],
    "SNOS": ["FANZA_DIGITAL", ""],

    // [Prestige 계열] - DMM_MONO는 MONO 로직을 따름
    "ABS": ["DMM_MONO", "118"],
    "ABP": ["DMM_MONO", "118"],
    "ABW": ["DMM_MONO", "118"],
    "EZD": ["DMM_MONO", "118"],
    "CHN": ["DMM_MONO", "118"],
    "FTN": ["DMM_MONO", "118"],
    "ABY": ["DMM_MONO", "118"],
    "DOM": ["DMM_MONO", "118"],
    "GVH": ["DMM_MONO", "13"],
    "GVG": ["DMM_MONO", "13"],
    "GG": ["DMM_MONO", "13"],

    // [ Madonna 계열 ]
    "JUR": ["FANZA_DIGITAL", ""],

    //  S級素人
    "SAMA": ["FANZA_DIGITAL", "h_244"],

    // IDEA POCKET (MONO지만 예외적으로 5자리를 쓰신다면 DIGITAL로 변경 권장, 
    // 혹은 MONO 로직대로 raw를 쓰신다면 유지)
    "IPZZ": ["FANZA_DIGITAL", ""],
    "IPZ": ["FANZA_DIGITAL", ""],

    // [DIGITAL 계열 - h_, n_] (자동으로 5자리 패딩 적용됨)
    "AMBI": ["FANZA_DIGITAL", "h_237"],
    "AMBS": ["FANZA_DIGITAL", "h_237"],
    "CLOT": ["FANZA_DIGITAL", "h_237"],
    "NACR": ["FANZA_DIGITAL", "h_237"],
    "ZMAR": ["FANZA_DIGITAL", "h_237"],
    "BANK": ["FANZA_DIGITAL", "h_1495"],
    "BUZ": ["FANZA_DIGITAL", "h_1340"],
    "CHUC": ["FANZA_DIGITAL", "h_491"],
    "CIEL": ["FANZA_DIGITAL", "h_491"],
    "NNNC": ["FANZA_DIGITAL", "h_491"],
    "DOCD": ["FANZA_DIGITAL", "h_1711"],
    "FCP": ["FANZA_DIGITAL", "h_1711"],
    "MFCT": ["FANZA_DIGITAL", "h_1711"],
    "EUUD": ["FANZA_DIGITAL", "h_086"],
    "JRZE": ["FANZA_DIGITAL", "h_086"],
    "JURA": ["FANZA_DIGITAL", "h_086"],
    "NUKA": ["FANZA_DIGITAL", "h_086"],
    "XMOM": ["FANZA_DIGITAL", "h_086"],
    "HZGD": ["FANZA_DIGITAL", "h_1100"],
    "JUKF": ["FANZA_DIGITAL", "h_227"],
    "MBDD": ["FANZA_DIGITAL", "n_707"],
    "MILK": ["FANZA_DIGITAL", "h_1240"],
    "ONEX": ["FANZA_DIGITAL", "h_1674"],
    "PJAB": ["FANZA_DIGITAL", "h_1604"],
    "REBD": ["FANZA_DIGITAL", "h_346"],
    "REBDB": ["FANZA_DIGITAL", "h_346"],
    "SKMJ": ["FANZA_DIGITAL", "h_1324"],
    "SS": ["FANZA_DIGITAL", "h_1231"],
    "STSK": ["FANZA_DIGITAL", "h_1605"],
    "HMRK": ["FANZA_DIGITAL", "h_1711"],
    "BEAF": ["FANZA_DIGITAL", "h_1615"],
    "GINAV": ["FANZA_DIGITAL", "h_1350"],
    "FCH": ["FANZA_DIGITAL", "h_1711"],
    "TENN": ["FANZA_DIGITAL", "h_491"],
    "PYM": ["FANZA_DIGITAL", "h_283"],
    "MAAN": ["FANZA_DIGITAL", "h_1711"],
    "INSTV": ["FANZA_DIGITAL", "h_1472"],

    // [기타 숫자형]
    "AD": ["FANZA_DIGITAL", "24"],
    "AKB": ["FANZA_DIGITAL", "55"],
    "ASEX": ["FANZA_DIGITAL", "1"],
    "BLD": ["FANZA_DIGITAL", "24"],
    "BOKO": ["FANZA_DIGITAL", "1"],
    "CAD": ["FANZA_DIGITAL", "24"],
    "CADV": ["FANZA_DIGITAL", "49"],
    "CPDE": ["FANZA_DIGITAL", "188"],
    "DFDM": ["FANZA_DIGITAL", "2"],
    "DLDSS": ["FANZA_DIGITAL", "1"],
    "DOCP": ["FANZA_DIGITAL", "118"],
    "ECB": ["FANZA_DIGITAL", "2"],
    "EKDV": ["FANZA_DIGITAL", ""],
    "FNS": ["FANZA_DIGITAL", "1"],
    "FSDSS": ["FANZA_DIGITAL", "1"],
    "FSET": ["FANZA_DIGITAL", "1"],
    "GN": ["FANZA_DIGITAL", "188"],
    "HAWA": ["FANZA_DIGITAL", "1"],
    "HN": ["FANZA_DIGITAL", "188"],
    "IENE": ["FANZA_DIGITAL", "1"],
    "IENF": ["FANZA_DIGITAL", "1"],
    "IESP": ["FANZA_DIGITAL", "1"],
    "JERA": ["FANZA_DIGITAL", "1"],
    "KMHRS": ["FANZA_DIGITAL", "1"],
    "MGOLD": ["FANZA_DIGITAL", "1"],
    "MIST": ["FANZA_DIGITAL", "1"],
    "MTABS": ["FANZA_DIGITAL", "1"],
    "MTALL": ["FANZA_DIGITAL", "1"],
    "NAMH": ["FANZA_DIGITAL", "1"],
    "NEO": ["FANZA_DIGITAL", "433"],
    "NEZ": ["FANZA_DIGITAL", "188"],
    "NHDTA": ["FANZA_DIGITAL", "1"],
    "NHDTB": ["FANZA_DIGITAL", "1"],
    "NHDTC": ["FANZA_DIGITAL", "1"],
    "NOSKN": ["FANZA_DIGITAL", "1"],
    "NSBB": ["FANZA_DIGITAL", "1"],
    "NTR": ["FANZA_DIGITAL", "1"],
    "OFSD": ["FANZA_DIGITAL", "1"],
    "OKB": ["FANZA_DIGITAL", "1"],
    "OKK": ["FANZA_DIGITAL", "1"],
    "OKS": ["FANZA_DIGITAL", "1"],
    "OKV": ["FANZA_DIGITAL", "1"],
    "OKX": ["FANZA_DIGITAL", "1"],
    "PIYO": ["FANZA_DIGITAL", "1"],
    "PRIAN": ["FANZA_DIGITAL", "5389"],
    "SGKI": ["FANZA_DIGITAL", "1"],
    "SUN": ["FANZA_DIGITAL", "1"],
    "SVDVD": ["FANZA_DIGITAL", "1"],
    "SVFLA": ["FANZA_DIGITAL", "1"],
    "SVSHA": ["FANZA_DIGITAL", "1"],
    "SW": ["FANZA_DIGITAL", "1"],
    "WAWA": ["FANZA_DIGITAL", "1"],
    "WFR": ["FANZA_DIGITAL", "2"],
    "WO": ["FANZA_DIGITAL", "1"],
    "3DSVR": ["FANZA_DIGITAL", "1"],
    "AEGE": ["FANZA_DIGITAL", "1"],
    "AKDL": ["FANZA_DIGITAL", "1"],

    // Serebu No Tomo    
    "CEAD": ["FANZA_DIGITAL", ""],
    "CEMD": ["FANZA_DIGITAL", ""],
};



/**
 [ Prestige / 프레스티지 계열 ]
AMA, BGN, INU, JBS, JNT, KRV, MAS, MGT, PHX, PPP, PPT, PPX, PRD, RVRSS, SAD, SEI, SNG, THU, VPC, WAT, YRH, YRK, YRZ 

[ MOODYZ / 무디즈 계열 ]
LOVD, MDED, MDID, MDJD, MDLD, MDPD, MDQD, MDRD, MDUD, MDVR, MDWD, MDXD, MDYD, MEYD, MIAA, MIAB, MIAD, MIAE, MIAS, MIBD, MIDD, MIDE, MIDV, MIFD, MIGD, MIID, MIKR, MIMK, MINT, MIQD, MIRD, MIVD, MIXS, MIZD, MNGS 

[ SOD Create 계열 ]
DSVR, KIRE, MASD, MMGH, MOGI, SCDA, SCDE, SDDL, SDDM, SDHS, SDMS, SDMT, SDMU, SDNM, SDSI, SHYN, STAR, STKO, TIGR 

[ Attackers / 어택커즈 계열 ]
ADN, APNS, ATAD, ATID, ATKD, ATVR, JBD, RBD, RBK, SAME, SHKD, SSPD, YUJ 

[ Faleno / 팔레노 계열 ]
FADSS, FCDSS, FLNO, FLNS, FSVSS
 */


function fetchImageResolution(url) {

    const cleanUrl = url.split('?')[0];
    const finalUrl = cleanUrl.toLowerCase();


    // 1. URL 확장자를 통해 필요한 바이트 크기 미리 계산
    const getExpectedRange = (finalUrl) => {
        if (finalUrl.endsWith('.png') || finalUrl.endsWith('.gif')) {
            return "0-1000"; // PNG/GIF는 1KB면 충분함
        } else if (finalUrl.endsWith('.jpg') || finalUrl.endsWith('.jpeg')) {
            return "0-20000"; // JPEG나 알 수 없는 경우 20KB
        } else if (finalUrl.endsWith('.webp')) {
            return "0-5000"; // WebP는 약 5KB 정도
        }
    };

    const targetRange = getExpectedRange(finalUrl);

    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: finalUrl,
            headers: {
                "Range": `bytes=${targetRange}`,
                "Referer": finalUrl,
                "Origin": new URL(finalUrl).origin
            },
            responseType: "arraybuffer",            
            onload: (res) => {
                const status = res.status;
                let result = { width: 0, height: 0, status: res.status, errorReason: "", type: "Unknown" };

                // 1. HTTP 오류 체크
                if (status === 0) {
                    const sameDomain = location.hostname === new URL(finalUrl).hostname;
                    if (sameDomain) {
                        console.warn(`[VideoCode] status=0 (같은 도메인) → 네트워크 문제, 재시도 가능: ${finalUrl}`);
                        resolve({ exists: false, retry: true, reason: 'network_error' });
                    } else {
                        console.warn(`[VideoCode] status=0 (외부 도메인) → CORS 가능성, 재시도 허용: ${finalUrl}`);
                        resolve({ exists: false, retry: true, reason: 'cors_possible' });
                    }
                }
                else if (status >= 200 && status < 300) {
                    console.log(`[VideoCode] 이미지 존재 확인됨 (HTTP ${status}): ${finalUrl}`);
                    const bytes = new Uint8Array(res.response);

                    // 2. 포맷 판별 및 해상도 추출
                    // PNG (89 50 4E 47 ...)
                    if (bytes[0] === 0x89 && bytes[1] === 0x50) {
                        result.type = "PNG";
                        result.width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
                        result.height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
                    }
                    // GIF (47 49 46 38 ...)
                    else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
                        result.type = "GIF";
                        result.width = bytes[6] | (bytes[7] << 8); // Little-endian
                        result.height = bytes[8] | (bytes[9] << 8);
                    }
                    // JPEG (FF D8 ...)
                    else if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
                        result.type = "JPEG";
                        let i = 2;
                        while (i < bytes.length - 8) {
                            const marker = (bytes[i] << 8) | bytes[i + 1];
                            const len = (bytes[i + 2] << 8) | bytes[i + 3];
                            // SOF 마커 확인 (0xFFC0 ~ 0xFFCF 중 일부 제외)
                            if (marker >= 0xFFC0 && marker <= 0xFFCF && ![0xFFC4, 0xFFC8, 0xFFCC].includes(marker)) {
                                result.height = (bytes[i + 5] << 8) | bytes[i + 6];
                                result.width = (bytes[i + 7] << 8) | bytes[i + 8];
                                break;
                            }
                            i += len + 2;
                        }
                    }
                    // WebP (52 49 46 46 ... 57 45 42 50)
                    else if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
                        result.type = "WebP";
                        // WebP는 내부 청크(VP8/VP8L/VP8X)에 따라 위치가 달라 더 복잡하지만,
                        // 간단하게 24-30바이트 사이에서 기초 해상도를 읽을 수 있습니다.
                        if (bytes[12] === 0x56 && bytes[13] === 0x50 && bytes[14] === 0x38) {
                            result.width = (bytes[26] | (bytes[27] << 8)) & 0x3FFF;
                            result.height = (bytes[28] | (bytes[29] << 8)) & 0x3FFF;
                        }
                    }

                    if (!result.width) result.errorReason = "해상도 정보 추출 불가";
                    resolve({ exists: true, result });
                }
                else if (status >= 300 && status < 400) {
                    console.warn(`[VideoCode] 리다이렉트 응답 (HTTP ${status}): ${finalUrl}`);
                    // GM_xmlhttpRequest는 리다이렉트를 따라가므로 이 경우는 거의 없음
                    resolve({ exists: false, reason: 'redirect' });
                }
                else if (status === 403) {
                    console.warn(`[VideoCode] 국가제한 (HTTP ${status}): ${finalUrl}`);
                    resolve({ exists: false, reason: 'Region restrictions' });
                }
                else if (status >= 400 && status < 500) {
                    console.warn(`[VideoCode] 클라이언트 오류 (HTTP ${status}) → 이미지 없음: ${finalUrl}`);
                    resolve({ exists: false, reason: 'client_error' });
                }
                else if (status >= 500) {
                    console.warn(`[VideoCode] 서버 오류 (HTTP ${status}) → 재시도 가능: ${finalUrl}`);
                    resolve({ exists: false, reason: 'server_error' });
                }
            },
            onerror: () => resolve({ width: 0, height: 0, status: 0, errorReason: "네트워크 오류" }),
            ontimeout: () => resolve({ width: 0, height: 0, status: 0, errorReason: "시간 초과" })
        });
    });
}

function checkImageExistence(link) {
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: 'HEAD',
            url: link,            
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
    const codePattern = /(\d{0,2}[a-zA-Z]{1,6}\d{0,2})-?(\d{3})([a-z]*)/i;
    const match = code.match(codePattern);
    if (!match) return [];

    const prefix = match[1].toUpperCase();
    const pureNum = match[2];
    const extraSuffix = (match[3] || "").toLowerCase();

    const candidates = [];
    const metaData = {};
    const CURRENT_RULES = getMergedRules();
    const numInt = parseInt(pureNum, 10);

    // --- 1. Prestige Old (예외 케이스) ---
    const isPrestigeOld = (
        (prefix === "BGN" && numInt >= 45 && numInt <= 72) ||
        (prefix === "CHN" && numInt >= 156 && numInt <= 217) ||
        (prefix === "ABP" && numInt >= 398 && numInt <= 999) ||
        (prefix === "ABW" && numInt >= 1 && numInt <= 279)
    );

    if (isPrestigeOld) {
        const url = `${BASE_URLS['PRESTIGE']}/${prefix.toLowerCase()}/${pureNum}/pb_${prefix.toLowerCase()}-${pureNum}.jpg`;
        candidates.push(url);
        metaData[url] = ["PRESTIGE", ""];
    }

    // --- 2. 이미 알고 있는 규칙 적용 ---
    if (CURRENT_RULES[prefix]) {
        const [category, extraPrefix] = CURRENT_RULES[prefix];
        const targetBaseUrl = BASE_URLS[category] || BASE_URLS["FANZA_DIGITAL"];

        // DIGITAL이면 5자리, 아니면 raw
        const formattedNum = (category === "FANZA_DIGITAL")
            ? pureNum.padStart(5, '0')
            : pureNum;

        const fileName = `${extraPrefix}${prefix.toLowerCase()}${formattedNum}${extraSuffix}`;
        const url = `${targetBaseUrl}/${fileName}/${fileName}pl.jpg`;

        candidates.push(url);
        metaData[url] = [category, extraPrefix];
    }

    // --- 3. DMM 이미지 경로 기반 후보 생성 ---
    if (imageSrc && imageSrc.includes('dmm')) {

        const pathSegments = imageSrc.split('/');
        const contentId = pathSegments[pathSegments.length - 2];
        const flexRegex = new RegExp(`(.*)${prefix}(\\d+)`, 'i');
        const fileMatch = contentId.match(flexRegex);

        if (fileMatch) {
            const extraPrefix = fileMatch[1];
            const rawNumStr = fileMatch[2];
            const zero5 = pureNum.padStart(5, '0');            

            // 1. DIGITAL 시도 (5자리)
            const digitalFName = `${extraPrefix}${prefix.toLowerCase()}${zero5}${extraSuffix}`;
            const digitalUrl = `${BASE_URLS["FANZA_DIGITAL"]}/${digitalFName}/${digitalFName}pl.jpg`;
            if (!metaData[digitalUrl]) {
                candidates.push(digitalUrl);
                metaData[digitalUrl] = ["FANZA_DIGITAL", extraPrefix];
            }

            // 2. MONO 시도
            const monoFName = `${extraPrefix}${prefix.toLowerCase()}${rawNumStr}${extraSuffix}`;
            const monoUrl = `${BASE_URLS["FANZA_MONO"]}/${monoFName}/${monoFName}pl.jpg`;
            if (!metaData[monoUrl]) {
                candidates.push(monoUrl);
                metaData[monoUrl] = ["FANZA_MONO", extraPrefix];
            }

        }
    }

    const uniqueCandidates = [...new Set(candidates)];
    uniqueCandidates._meta = metaData;
    uniqueCandidates._prefix = prefix;
    return uniqueCandidates;
}

function saveRuleFromUrl(url, prefix) {
    try {
        const urlObj = new URL(url);
        const host = urlObj.hostname; // 도메인 추출 (예: awsimgsrc.dmm.co.jp)
        const fileName = urlObj.pathname
            .split('/')
            .pop()
            .replace(/\..*$/, '')
            .replace(/p[ls]$/, '');

        const prefixIndex = fileName.toLowerCase().indexOf(prefix.toLowerCase());
        if (prefixIndex === -1) return;
        const extraPrefix = fileName.substring(0, prefixIndex);

        // URL 포함 키워드로 카테고리만 결정
        let category = "FANZA_DIGITAL";
        if (host === 'awsimgsrc.dmm.com') category = "FANZA_MONO";
        else if (host === 'pics.dmm.co.jp') category = "DMM_MONO";
        else if (host === 'prestige-av.com') category = "PRESTIGE";

        // 설정값 저장 [카테고리, 접두어]
        GM_setValue(prefix, [category, extraPrefix]);

        console.log(
            `%c[규칙 학습 완료] ${prefix} → ${category} (접두어: ${extraPrefix})`,
            "color: #00FF00; font-weight: bold;"
        );

    } catch (e) {
        console.error("규칙 저장 오류:", e);
    }
}