/**
 * Skyline Masonry Layout Manager
 */
class SkylineLayout {
    constructor(containerWidth, gap, minWidthPercent = 0.8) {
        this.containerWidth = containerWidth;
        this.gap = gap;
        this.minWidthPercent = minWidthPercent;
        // 초기 상태: x=0부터 전체 너비만큼 빈 공간(y=0)이 있음
        this.skyline = [{ x: 0, y: 0, w: containerWidth }];
    }

    placeItem(item) {
        let bestY = Infinity;
        let targetIdx = -1;
        let finalX = 0;
        let finalW = item.w;

        // 1. 최적의 위치 찾기 (가장 낮은 Y를 가진 구간 탐색)
        for (let i = 0; i < this.skyline.length; i++) {
            let seg = this.skyline[i];
            let effectiveGap = (seg.x === 0) ? 0 : this.gap;

            // 현재 세그먼트부터 오른쪽으로 가용 너비 계산
            // (연속된 세그먼트들을 합쳐서 공간이 나오는지 확인해야 합니다)
            let combinedW = 0;
            let currentMaxY = 0;

            for (let j = i; j < this.skyline.length; j++) {
                let nextSeg = this.skyline[j];
                combinedW = (nextSeg.x + nextSeg.w) - seg.x;
                currentMaxY = Math.max(currentMaxY, nextSeg.y);

                let realAvailableW = combinedW - effectiveGap;

                // 최소 너비 조건 만족 시
                if (realAvailableW >= item.w) {
                    if (currentMaxY < bestY) {
                        bestY = currentMaxY;
                        finalX = seg.x + effectiveGap;
                        finalW = item.w; // 원래 너비 유지
                        targetIdx = i;
                    }
                    break;
                }
                // 2. 원래 너비로는 안 되지만, 줄여서(minWidthPercent) 들어갈 수 있는지 확인
                else if (realAvailableW >= item.w * this.minWidthPercent) {
                    if (currentMaxY < bestY) {
                        bestY = currentMaxY;
                        finalX = seg.x + effectiveGap;
                        finalW = item.w * this.minWidthPercent; // 남은 공간에 맞춰 축소
                        targetIdx = i;
                    }
                    break;
                }
            }
        }

        if (targetIdx !== -1) {
            // DOM 반영
            item.w = finalW;
            item.element.style.position = 'absolute';
            item.element.style.width = `${finalW}px`;
            item.element.style.height = `${item.h}px`;
            item.element.style.left = `${finalX}px`;
            item.element.style.top = `${bestY}px`;

            // 스카이라인 상태 갱신
            this.updateSkyline(finalX, bestY, finalW, item.h);
            return { x: finalX, y: bestY, w: finalW };
        }
        return null;
    }

    updateSkyline(x, y, w, h) {
        const newY = y + h + this.gap;
        const newX = x;
        const newW = w;

        // 1. 새로운 구간 삽입 (기존 구간들 사이를 비집고 들어감)
        // 기존의 단순 splice 대신, 영역을 덮어씌우는 로직
        let newSegments = [];

        // 새 구간 시작 전의 기존 구간들 유지
        this.skyline.forEach(s => {
            if (s.x < newX && s.x + s.w > newX) {
                newSegments.push({ x: s.x, y: s.y, w: newX - s.x });
            }
            if (s.x + s.w > newX + newW && s.x < newX + newW) {
                newSegments.push({ x: newX + newW, y: s.y, w: (s.x + s.w) - (newX + newW) });
            }
            if (s.x + s.w <= newX || s.x >= newX + newW) {
                newSegments.push(s);
            }
        });

        newSegments.push({ x: newX, y: newY, w: newW });

        // 2. X축 기준 정렬
        newSegments.sort((a, b) => a.x - b.x);

        // 3. 인접 구간 병합 (높이가 같으면 합침)
        this.skyline = [];
        if (newSegments.length > 0) {
            let current = newSegments[0];
            for (let i = 1; i < newSegments.length; i++) {
                let next = newSegments[i];
                if (current.y === next.y) {
                    current.w += next.w;
                } else {
                    this.skyline.push(current);
                    current = next;
                }
            }
            this.skyline.push(current);
        }
    }

    getMaxHeight() {
        return this.skyline.length > 0 ? Math.max(...this.skyline.map(s => s.y)) : 0;
    }
}

async function preloadImageSizes(wrapper, loaderEl) {
    const imgs = [...wrapper.querySelectorAll("img")];
    const total = imgs.length;
    if (!total) return;

    const circle = loaderEl?.querySelector(".progress-circle");
    let loaded = 0;

    const updateProgress = () => {
        loaded++;
        const percent = Math.round((loaded / total) * 100);
        if (circle) circle.style.setProperty("--p", percent);
    };

    const loadImage = img => new Promise(resolve => {
        const realSrc =
            img.getAttribute("ess-data") ||
            img.getAttribute("data-src") ||
            img.src;

        if (!realSrc) {
            updateProgress();
            return resolve();
        }

        let done = false;
        const finish = () => {
            if (done) return;
            done = true;

            const w = img.naturalWidth;
            const h = img.naturalHeight;

            const item = img.closest(".image-masonry-item");
            if (item && w > 0 && h > 0) {
                item.style.aspectRatio = `${w}/${h}`;
            }
            updateProgress();
            resolve();
        };

        img.addEventListener('load', (event) => {
            finish();
            img.removeEventListener('error', finish);
        }, { once: true });
        img.addEventListener('error', (event) => {
            finish();
            img.removeEventListener('load', finish);
        }, { once: true });
        img.src = realSrc;

        if (img.complete && img.naturalWidth > 16) {
            finish();
        }
    });

    await Promise.all(imgs.map(loadImage));
}

function createSectionMasonry(container) {

    const blocks = [...container.querySelectorAll(':scope > .textblock')];
    const wrappers = [];

    blocks.forEach((block, index) => {

        const nextBlock = blocks[index + 1];
        let current = block.nextElementSibling;

        const images = [];

        while (current && current !== nextBlock) {

            /* IMG 직접 */
            if (current.tagName === "IMG") {
                images.push(current);
            }

            /* IMG 포함 노드 */
            else {

                const imgs = current.querySelectorAll?.("img");

                if (imgs && imgs.length) {
                    imgs.forEach(img => images.push(img));
                }

            }

            current = current.nextElementSibling;
        }

        if (!images.length) return;

        const wrapper = document.createElement("div");
        wrapper.className = "image-masonry";

        block.after(wrapper);

        images.forEach(img => {

            const item = document.createElement("div");
            item.className = "image-masonry-item";

            const cleanImg = document.createElement("img");

            /* 실제 src */
            const realSrc =
                img.getAttribute("ess-data") ||
                img.getAttribute("data-src") ||
                img.src;

            if (realSrc) cleanImg.src = realSrc;

            /* 속성 복사 */
            if (img.title) cleanImg.title = img.title;

            const iyl = img.getAttribute("iyl-data");
            if (iyl) cleanImg.setAttribute("iyl-data", iyl);

            cleanImg.style.maxWidth = "100%";
            cleanImg.style.cursor = "pointer";

            //cleanImg.loading = "lazy";
            cleanImg.decoding = "async";

            /* CLS 방지 ratio */
            const w = img.naturalWidth;
            const h = img.naturalHeight;

            if (w && h) {
                item.style.aspectRatio = w + " / " + h;
            }

            item.appendChild(cleanImg);
            wrapper.appendChild(item);

        });

        /* 원본 이미지만 제거 */
        images.forEach(img => img.remove());

        wrappers.push(wrapper);

    });

    return wrappers;
}

function collectImageData(items) {
    return items.map(item => {
        const img = item.querySelector('img');
        if (!img) return null;
        return {
            element: item,
            width: img.naturalWidth,
            height: img.naturalHeight
        };

    }).filter(Boolean);
}

function buildAverageHeights(data, threshold = 15) {
    const parsedSizes = [...data];
    parsedSizes.sort((a, b) => a.height - b.height);

    const groups = [];
    let currentGroup = [];

    for (const item of parsedSizes) {
        if (currentGroup.length === 0) {
            currentGroup.push(item);
        } else {
            const currentAverage =
                currentGroup.reduce((sum, g) => sum + g.height, 0) / currentGroup.length;

            if (Math.abs(item.height - currentAverage) <= threshold) {
                currentGroup.push(item);
            } else {
                groups.push(currentGroup);
                currentGroup = [item];
            }
        }
    }
    if (currentGroup.length > 0) groups.push(currentGroup);

    // --- 최적화 포인트: 평탄화(Flatten)하여 직접 매핑 ---
    const finalMapping = [];

    groups.forEach(group => {
        // 1. 그룹 내 유니크 높이로 평균 계산
        const uniqueHeights = [...new Set(group.map(item => item.height))];
        const sumUnique = uniqueHeights.reduce((sum, h) => sum + h, 0);
        const averageHeight = Math.round(sumUnique / uniqueHeights.length);

        // 2. 해당 그룹에 속한 모든 아이템에 평균값을 미리 할당
        group.forEach(item => {
            finalMapping.push({
                originalHeight: item.height,
                averageHeight: averageHeight
            });
        });
    });

    return finalMapping;
}

function optimizeSingleLayout(container) {
    const items = Array.from(container.querySelectorAll('.image-masonry-item'));
    const imageData = collectImageData(items);
    const heightProfile = buildAverageHeights(imageData, 15);
    const heightMap = new Map(heightProfile.map(d => [d.originalHeight, d.averageHeight]));

    if (!items.length) return;

    const maxHeight = 500;
    const gap = 4;
    const containerWidth = Math.floor(container.getBoundingClientRect().width);
    const maxWidth = Math.floor((containerWidth - gap) / 3);
    const shrinkThreshold = 0.85;
    const allCalculatedItems = []; // 모든 이미지의 최종 크기를 담을 배열


    let scaleMap = []; // 유사 이미지의 최종 크기 정보를 저장

    let i = 0;
    while (i < items.length) {
        let group = [];
        let groupBaseWidthSum = 0;

        // 1. 그룹핑 로직
        while (i < items.length) {
            const item = items[i];
            const img = item.querySelector('img');
            const ratio = getAspectRatio(item, img);
            const originalNaturalW = img.naturalWidth;
            const originalNaturalH = img.naturalHeight;

            const avH = heightMap.get(originalNaturalH);

            let tempH = avH;
            let tempW = img.naturalWidth * ratio;

            if (tempW > maxWidth) {
                tempW = maxWidth;
                tempH = tempW / ratio;
            }
            if (tempH > maxHeight) {
                tempH = maxHeight;
                tempW = tempH * ratio;
            }


            tempW = Math.round(tempW / 2) * 2;
            tempH = tempW / ratio;

            const nextWidth = groupBaseWidthSum + tempW + (group.length > 0 ? gap : 0);
            if (nextWidth > containerWidth) {
                if (nextWidth * shrinkThreshold <= containerWidth) {
                    group.push({
                        element: item,
                        ratio,
                        baseW: tempW,
                        baseH: tempH,
                        origW: originalNaturalW, // 캐시용 키값
                        origH: originalNaturalH // 캐시용 키값
                    });
                    i++;
                }
                break;
            }
            group.push({
                element: item,
                ratio,
                baseW: tempW,
                baseH: tempH,
                origW: originalNaturalW, // 캐시용 키값
                origH: originalNaturalH // 캐시용 키값
            });
            groupBaseWidthSum = nextWidth;
            i++;
        }

        // 2. Scale 계산
        const totalGaps = (group.length - 1) * gap;
        const availableW = containerWidth - totalGaps;
        const currentWSum = group.reduce((sum, item) => sum + item.baseW, 0);

        let overflow =
            currentWSum - availableW;

        // 작은 이미지는 shrink 하지 않음
        const minShrinkWidth = 160;

        if (overflow > 0) {

            const shrinkables =
                group.filter(v => v.baseW > minShrinkWidth || v.baseH > minShrinkWidth);

            const shrinkSum =
                shrinkables.reduce((s, v) => s + v.baseW, 0);

            shrinkables.forEach(item => {

                const ratio =
                    item.baseW / shrinkSum;

                const shrink =
                    overflow * ratio;

                item.baseW =
                    Math.floor(item.baseW - shrink);

            });

        }
        //let rowScale = Math.min(Number((availableW / currentWSum).toFixed(2)), 1);
        // 3. 배치 및 캐시 적용
        // 그룹 내 동일 높이 그룹별로 '최소 높이'를 찾기 위한 맵
        const minHeightMap = new Map();
        // 가계산된 결과를 잠시 담아둘 배열
        const groupResults = [];
        group.forEach(item => {

            let usedCache = null; // 어떤 캐시 객체를 사용했는지 저장
            const cached = scaleMap.find(s =>
                (Math.abs(s.keyH - item.origH) <= 12 || Math.abs(s.keyW - item.origW) <= 12) &&
                Math.abs(s.ratio - item.ratio) <= 0.05
            );

            let finalW, finalH;
            if (cached) {
                finalW = cached.finalW;
                finalH = cached.finalH;
                usedCache = cached;
            } else {
                finalW = Math.floor(item.baseW);
                if (finalW > maxWidth) finalW = maxWidth;
                finalH = Math.floor(finalW / item.ratio);
                if (finalH > maxHeight && Math.abs(finalH - maxHeight) <= 10) {
                    finalH = maxHeight;
                    finalW = Math.round(finalH * item.ratio);
                }
                const newCache = {
                    keyW: item.origW,
                    keyH: item.origH,
                    ratio: item.ratio,
                    finalW: finalW,
                    finalH: finalH
                };
                scaleMap.push(newCache);
                usedCache = newCache; // 새로 만든 캐시 참조 보관
            }

            const hKey = heightMap.get(usedCache.keyH);
            if (!minHeightMap.has(hKey) || finalH < minHeightMap.get(hKey)) {
                minHeightMap.set(hKey, finalH);
            }
            console.log(heightProfile, hKey, minHeightMap, usedCache.keyH);
            groupResults.push({ item, usedCache, hKey });
        });

        groupResults.forEach(res => {
            const syncedH = minHeightMap.get(res.hKey);
            const syncedW = Math.floor(syncedH * res.item.ratio);

            res.usedCache.finalW = syncedW;
            res.usedCache.finalH = syncedH;

            allCalculatedItems.push({
                element: res.item.element,
                w: syncedW,
                h: syncedH
            });
        });
    }
    // 3단계: [핵심] 모든 크기 계산이 끝난 후 최종 배치 (findBestPosition 실행)
    const layout = new SkylineLayout(containerWidth, gap, 0.98);

    allCalculatedItems.forEach(data => {
        // 내부적으로 find + resize + updateAndMerge를 모두 수행합니다.        
            layout.placeItem(data);        
    });

    // 2. 전체 높이 갱신 (가장 높은 skyline 위치 기준)
    const totalHeight = layout.getMaxHeight();
    container.style.height = `${totalHeight}px`;
}

function getAspectRatio(item, img) {
    if (img && img.naturalWidth) return img.naturalWidth / img.naturalHeight;
    const styleRatio = item.style.aspectRatio.split('/');
    return styleRatio.length === 2 ? parseFloat(styleRatio[0]) / parseFloat(styleRatio[1]) : 1;
}
