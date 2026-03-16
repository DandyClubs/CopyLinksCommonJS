/**
 * Skyline Masonry Layout Manager
 */
class SkylineLayout {
    constructor(containerWidth, gap, minWidthPercent = 0.8) {
        this.containerWidth = containerWidth;
        this.gap = gap;
        this.minWidthPercent = minWidthPercent;
        // 초기 상태: 바닥 전체(y=0)가 하나의 구간으로 시작
        this.skyline = [{ x: 0, y: 0, w: containerWidth }];
    }

    // 1. 아이템 배치 및 너비 조정 실행
    placeItem(item) {
        let bestY = Infinity;
        let bestX = 0;
        let bestWidth = item.w;
        let found = false;

        // 최적의 위치 탐색: 가장 낮은 Y축 구간을 우선 찾음
        for (let i = 0; i < this.skyline.length; i++) {
            let currentX = this.skyline[i].x;
            let currentY = this.skyline[i].y;

            // 현재 위치에서 가용 가능한 최대 너비 계산
            let availableW = this.containerWidth - currentX;
            let effectiveGap = (currentX === 0) ? 0 : this.gap;
            let realAvailableW = availableW - effectiveGap;

            // 가변 너비 조건 확인 (원래 너비의 80% 이상 확보 시)
            if (realAvailableW >= item.w && realAvailableW >= item.w * this.minWidthPercent) {
                if (currentY < bestY) {
                    bestY = currentY;
                    bestX = currentX + effectiveGap;
                    bestWidth = Math.min(item.w, item.w * this.minWidthPercent);
                    found = true;
                }
            }
        }

        if (found) {
            // DOM 스타일 적용
            item.element.style.position = 'absolute';
            item.element.style.width = `${bestWidth}px`;
            item.element.style.height = `${item.h}px`;
            item.element.style.left = `${bestX}px`;
            item.element.style.top = `${bestY}px`;

            // 스카이라인 업데이트 및 병합
            this.updateAndMerge(bestX, bestY, bestWidth, item.h);
            return { x: bestX, y: bestY, w: bestWidth, h: item.h };
        }
        return null;
    }

    // 2. 스카이라인 업데이트 및 구간 병합 로직
    updateAndMerge(x, y, w, h) {
        const newY = y + h + this.gap;
        const newX = x;
        const newW = w;

        // 영역 침범 구간 수정/제거
        for (let i = 0; i < this.skyline.length; i++) {
            let s = this.skyline[i];
            if (s.x < newX + newW && s.x + s.w > newX) {
                if (s.x >= newX && s.x + s.w <= newX + newW) {
                    this.skyline.splice(i, 1);
                    i--;
                } else if (s.x < newX && s.x + s.w <= newX + newW) {
                    s.w = newX - s.x;
                } else if (s.x >= newX && s.x + s.w > newX + newW) {
                    let rightEdge = s.x + s.w;
                    s.x = newX + newW;
                    s.w = rightEdge - s.x;
                } else {
                    let rightEdge = s.x + s.w;
                    s.w = newX - s.x;
                    this.skyline.splice(i + 1, 0, { x: newX + newW, y: s.y, w: rightEdge - (newX + newW) });
                }
            }
        }

        // 새 구간 추가 및 정렬
        this.skyline.push({ x: newX, y: newY, w: newW });
        this.skyline.sort((a, b) => a.x - b.x);

        // 높이가 같은 인접 구간 병합
        for (let i = 0; i < this.skyline.length - 1; i++) {
            let curr = this.skyline[i];
            let next = this.skyline[i + 1];
            if (Math.abs(curr.y - next.y) < 1 && Math.abs((curr.x + curr.w) - next.x) < 2) {
                curr.w = (next.x + next.w) - curr.x;
                this.skyline.splice(i + 1, 1);
                i--;
            }
        }
    }

    // 컨테이너 전체 높이 반환
    getMaxHeight() {
        return Math.max(...this.skyline.map(s => s.y));
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
                group.filter(v => v.baseW > minShrinkWidth);

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
    let placedRects = [];
    /*    
    allCalculatedItems.forEach(data => {
        
        //const pos = findBestPosition(data.w, data.h, placedRects, containerWidth, gap);
        const pos = findBestPositionWithSmartGap(data, placedRects, containerWidth, gap);

        // DOM 반영
        //data.element.style.width = `${data.w}px`;
        data.element.style.width = `${pos.finalW}px`;
        data.element.style.height = `${data.h}px`;
        data.element.style.left = `${pos.x}px`;
        data.element.style.top = `${pos.y}px`;

        // 배치 정보 저장
        placedRects.push({ x: pos.x, y: pos.y, w: data.w, h: data.h });
    });

    const totalHeight = Math.max(...placedRects.map(r => r.y + r.h), 0);
    container.style.height = `${totalHeight}px`;
    */

    const layout = new SkylineLayout(containerWidth, gap, 0.98);

    allCalculatedItems.forEach(data => {
        // 내부적으로 find + resize + updateAndMerge를 모두 수행합니다.
        const result = layout.placeItem(data);

        if (result) {
            // 배치된 정보를 리스트에 저장 (나중에 높이 계산 등에 필요하다면 유지)
            placedRects.push({
                x: result.x,
                y: result.y,
                w: result.w,
                h: result.h
            });
        }
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

function findBestPosition(w, h, placed, containerW, gap) {
    let y = 0;
    let x = 0;
    const step = 2; // 탐색 정밀도를 높이기 위해 step을 낮춤

    while (true) {        
        if (x + w > containerW + step) {
            x = 0;
            y += step;
            continue;
        }
        const current = { x, y, w, h };

        // 6. 충돌 검사 (Gap 적용)
        const hasOverlap = placed.some(p => {
            return !(
                current.x + current.w + gap <= p.x ||
                current.x >= p.x + p.w + gap ||
                current.y + current.h + gap <= p.y ||
                current.y >= p.y + p.h + gap
            );
        });

        if (!hasOverlap) return { x, y };

        x += step;
        if (y > 20000) return { x: 0, y: 0 };
    }
}


function findBestPositionWithSmartGap(data, placed, containerW, gap) {
    let step = 2;
    let minWidthPercent = 0.98;
    let originalW = data.w;

    for (let y = 0; ; y += step) {
        for (let x = 0; x <= containerW; x += step) {

            // 1. 간격(Gap) 계산: 벽에 붙으면 0, 아니면 gap 적용
            let effectiveGap = (x === 0) ? 0 : gap;

            // 2. 실제 사용 가능한 최대 너비 계산 (중요!)
            // 컨테이너 전체 너비에서 현재 시작점(x)과 필요한 간격(gap)을 뺍니다.
            let availableW = containerW - x - effectiveGap;

            // 3. 최소 너비 체크 (남은 공간이 너무 작으면 다음 줄로)
            if (availableW < originalW * minWidthPercent) {
                // x가 0인데도 공간이 부족하면 이 줄은 아예 불가능한 것
                if (x === 0) break;
                continue;
            }

            // 4. 목표 너비 결정
            let targetW = availableW < originalW ? Math.min(originalW, originalW * minWidthPercent) : originalW;
            let current = { x: x + effectiveGap, y, w: targetW, h: data.h };
            console.log(containerW, availableW, originalW, originalW * minWidthPercent);
            // 5. 충돌 검사
            const hasOverlap = placed.some(p => {
                return !(
                    current.x + current.w + gap <= p.x ||
                    current.x >= p.x + p.w + gap ||
                    current.y + current.h + gap <= p.y ||
                    current.y >= p.y + p.h + gap
                );
            });

            if (!hasOverlap) {
                // 실제 렌더링될 x 좌표는 gap이 더해진 current.x입니다.
                return { x: current.x, y: current.y, finalW: targetW };
            }
        }
        if (y > 20000) return { x: 0, y: 0, finalW: originalW };
    }
}