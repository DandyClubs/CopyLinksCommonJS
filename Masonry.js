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
        let finalH = item.h;
        const ratio = finalW / finalH;

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
                        finalW = realAvailableW; // 남은 공간에 맞춰 축소
                        //finalH = Math.floor(finalW / ratio);
                        targetIdx = i;
                    }
                    break;
                }
            }
        }

        if (targetIdx !== -1) {
            // DOM 반영
            finalW = Math.round(finalW / 2) * 2;
            finalH = Math.round(finalH / 2) * 2;
            item.w = finalW;
            item.element.style.position = 'absolute';
            item.element.style.width = `${finalW}px`;
            item.element.style.height = `${finalH}px`;
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


function applyAspectRatio(img) {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const item = img.closest(".image-masonry-item");
    if (item && w > 0 && h > 0) {
        item.style.aspectRatio = `${w}/${h}`;
    }
}

async function smartImageLoader(wrapper, loaderEl, { preloadMargin = "1500px" } = {}) {
    const imgs = [...wrapper.querySelectorAll("img")];
    const total = imgs.length;
    if (!total) return;

    const circle = loaderEl?.querySelector(".progress-circle");
    let loadedCount = 0;

    const updateProgress = () => {
        loadedCount++;
        const percent = Math.round((loadedCount / total) * 100);
        if (circle) circle.style.setProperty("--p", percent);
    };

    const loadPromises = imgs.map(img => {
        return new Promise(resolve => {
            if (img.complete){
                updateProgress();
                resolve();
            }
            img.onload = function () {
                updateProgress();
                resolve();
            }            
            img.onerror = function () {
                updateProgress();
                resolve();
            }            
        });
    });

    await Promise.allSettled(loadPromises);

}

function createSectionMasonry(container) {
    const nodes = [...container.childNodes];
    const wrappers = [];
    let currentImageGroup = [];
    let nodesToRemove = [];
    let previousWasBrOrNewline = false; // 연속 줄바꿈 체크

    const flushGroup = (targetNode) => {
        if (currentImageGroup.length === 0) return;

        const wrapper = document.createElement("div");
        wrapper.className = "image-masonry";
        // targetNode가 없으면 container 끝에 추가
        if (targetNode) {
            targetNode.parentNode.insertBefore(wrapper, targetNode);
        } else {
            container.appendChild(wrapper);
        }

        currentImageGroup.forEach(img => {
            const item = document.createElement("div");
            item.className = "image-masonry-item";
            const cleanImg = document.createElement("img");

            const realSrc = img.getAttribute("ess-data") || img.getAttribute("data-src") || img.src;
            if (realSrc) cleanImg.src = realSrc;

            if (img.naturalWidth) {
                item.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
            }

            item.appendChild(cleanImg);
            wrapper.appendChild(item);
        });

        // 수집된 이미지 노드들과 찌꺼기들 제거
        nodesToRemove.forEach(node => node.remove());

        wrappers.push(wrapper);
        currentImageGroup = [];
        nodesToRemove = [];
    };

    nodes.forEach((node) => {
        // 1. Element 노드인 경우 (태그)
        if (node.nodeType === Node.ELEMENT_NODE) {
            const style = window.getComputedStyle(node);
            if (style.display === 'none') {
                node.remove();
                return;
            }

            const imgs = node.tagName === "IMG" ? [node] : [...node.querySelectorAll("img")];

            if (imgs.length > 0) {
                currentImageGroup.push(...imgs);
                nodesToRemove.push(node);
                previousWasBrOrNewline = false;
            } else {
                const text = node.textContent.trim();
                const isBr = node.tagName === "BR";

                if (isBr) {
                    if (previousWasBrOrNewline) {
                        node.remove(); // 연속된 BR 제거
                    } else {
                        previousWasBrOrNewline = true;
                    }
                } else {
                    if (text !== "") previousWasBrOrNewline = false;
                }

                // 이미지 그룹 수집 중 무시할 요소들
                if (currentImageGroup.length > 0) {
                    const isAttachmentInfo =
                        text === "" ||
                        /\.(jpg|jpeg|png|gif|webp|bmp)/i.test(text) ||
                        node.querySelector('.xw1, .xg1') ||
                        isBr;

                    if (isAttachmentInfo) {
                        nodesToRemove.push(node);
                        return;
                    }
                }

                // 유의미한 텍스트 태그를 만나면 그룹 마감
                if (currentImageGroup.length > 0 && text !== "") {
                    flushGroup(node);
                }
            }
        }
        // 2. Text 노드인 경우 (태그 밖의 텍스트)
        else if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();

            if (text === "") {
                // 단순 공백/줄바꿈 문자열 처리
                if (currentImageGroup.length > 0) {
                    nodesToRemove.push(node); // 이미지 사이의 공백은 제거 대상
                }
            } else {
                // 진짜 텍스트가 들어있는 경우
                if (currentImageGroup.length > 0) {
                    // 파일명 같은 텍스트인지 한 번 더 체크
                    if (/\.(jpg|jpeg|png|gif|webp|bmp)/i.test(text)) {
                        nodesToRemove.push(node);
                    } else {
                        flushGroup(node);
                        previousWasBrOrNewline = false;
                    }
                } else {
                    previousWasBrOrNewline = false;
                }
            }
        }
    });

    // 마지막 남은 그룹 처리
    if (currentImageGroup.length > 0) {
        flushGroup(null);
    }

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

function optimizeSingleLayout(container, columnCount = 3, maxHeight = 500) {

    const items =
        Array.from(container.querySelectorAll('.image-masonry-item'));

    if (!items.length) return;

    const imageData =
        collectImageData(items);

    const heightProfile =
        buildAverageHeights(imageData, 15);

    const heightMap =
        new Map(heightProfile.map(d => [d.originalHeight, d.averageHeight]));

    const gap = 4;

    const containerWidth =
        Math.floor(container.getBoundingClientRect().width);

    const maxWidth =
        Math.floor((containerWidth - gap) / columnCount);

    const shrinkThreshold = 0.85;

    const allCalculatedItems = [];

    let scaleMap = [];

    let i = 0;

    while (i < items.length) {

        let group = [];
        let groupBaseWidthSum = 0;

        // ---------------------------------------------------
        // 그룹 생성
        // ---------------------------------------------------

        while (i < items.length) {

            const item = items[i];
            const img = item.querySelector('img');

            const ratio =
                Math.round(getAspectRatio(item, img) * 1000) / 1000;

            const originalNaturalW =
                img.naturalWidth;

            const originalNaturalH =
                img.naturalHeight;

            const avH =
                heightMap.get(originalNaturalH);

            let tempH = avH;
            let tempW = tempH * ratio;

            // 최대 너비 제한
            if (tempW > maxWidth) {
                tempW = maxWidth;
                tempH = tempW / ratio;
            }

            // 최대 높이 제한
            if (tempH > maxHeight) {
                tempH = maxHeight;
                tempW = tempH * ratio;
            }

            // even pixel
            tempW =
                Math.round(tempW / 2) * 2;

            tempH =
                Math.round(tempH / 2) * 2;

            const nextWidth =
                groupBaseWidthSum +
                tempW +
                (group.length > 0 ? gap : 0);

            if (nextWidth > containerWidth) {

                if (nextWidth * shrinkThreshold <= containerWidth) {

                    group.push({
                        element: item,
                        ratio,
                        baseW: tempW,
                        baseH: tempH,
                        origW: originalNaturalW,
                        origH: originalNaturalH
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
                origW: originalNaturalW,
                origH: originalNaturalH
            });

            groupBaseWidthSum = nextWidth;

            i++;
        }

        // ---------------------------------------------------
        // Width Shrink
        // ---------------------------------------------------

        const totalGaps =
            (group.length - 1) * gap;

        const availableW =
            containerWidth - totalGaps;

        const currentWSum =
            group.reduce((sum, item) => sum + item.baseW, 0);

        let overflow =
            currentWSum - availableW;

        const minShrinkWidth = 200;

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
                    Math.round(item.baseW - shrink);
            });
        }

        // ---------------------------------------------------
        // Cache + Size 계산
        // ---------------------------------------------------

        const groupResults = [];

        group.forEach(item => {

            let usedCache = null;

            const cached =
                scaleMap.find(s =>
                    (
                        Math.abs(s.keyH - item.origH) <= 15 ||
                        Math.abs(s.keyW - item.origW) <= 15
                    ) &&
                    Math.abs(s.ratio - item.ratio) <= 0.075
                );

            let finalW;
            let finalH;

            // -----------------------------------------
            // 캐시 사용
            // -----------------------------------------

            if (cached) {

                finalW = cached.finalW;
                finalH = cached.finalH;

                usedCache = cached;

            } else {

                finalW =
                    Math.round(item.baseW);

                if (finalW > maxWidth) {
                    finalW = maxWidth;
                }

                finalH =
                    Math.round(finalW / item.ratio);

                // maxHeight 근접 보정
                if (
                    finalH > maxHeight &&
                    Math.abs(finalH - maxHeight) <= 10
                ) {
                    finalH = maxHeight;
                    finalW = Math.round(finalH * item.ratio);
                }

                // even pixel
                finalW =
                    Math.round(finalW / 2) * 2;

                finalH =
                    Math.round(finalH / 2) * 2;

                const newCache = {
                    keyW: item.origW,
                    keyH: item.origH,
                    ratio: item.ratio,
                    finalW,
                    finalH
                };

                scaleMap.push(newCache);

                usedCache = newCache;
            }

            groupResults.push({
                item,
                usedCache
            });
        });

        // ---------------------------------------------------
        // Height Cluster Normalize (최빈값 및 빈도수 기준 그룹화로 수정)
        // ---------------------------------------------------

        const normalizeThreshold = 5;
        const heightGroups = [];

        groupResults.forEach(res => {
            const h = res.usedCache.finalH;
            let found = false;

            for (const group of heightGroups) {
                // 그룹의 대표값(여기서는 첫 번째로 들어온 높이)을 기준으로 비교하거나
                // 그룹 내 값들의 현재 평균값과 비교합니다.
                const avg = group.reduce((s, v) => s + v.usedCache.finalH, 0) / group.length;

                if (Math.abs(h - avg) <= normalizeThreshold) {
                    group.push(res);
                    found = true;
                    break;
                }
            }

            if (!found) {
                heightGroups.push([res]);
            }
        });

        // ---------------------------------------------------
        // 그룹별 높이 통일 (가장 많이 등장하는 높이(최빈값)로 통일)
        // ---------------------------------------------------

        heightGroups.forEach(group => {
            // 1. 그룹 내에서 각 높이가 몇 번 등장했는지 카운팅 (빈도수 맵 생성)
            const frequencyMap = new Map();
            group.forEach(res => {
                const h = res.usedCache.finalH;
                frequencyMap.set(h, (frequencyMap.get(h) || 0) + 1);
            });

            // 2. 가장 많이 등장한 높이(최빈값) 찾기
            let targetHeight = group[0].usedCache.finalH; // 기본값 선언
            let maxCount = 0;

            frequencyMap.forEach((count, height) => {
                if (count > maxCount) {
                    maxCount = count;
                    targetHeight = height;
                }
                // 만약 빈도수가 같다면(예: 100px 2개, 105px 2개) 원래 먼저 선점된 값을 유지하거나
                // 필요에 따라 더 작은 값/큰 값을 선택하도록 예외 처리가 가능합니다.
            });

            // 3. 결정된 targetHeight(최빈값)로 그룹 내 모든 아이템 높이 통일
            group.forEach(res => {
                let finalH = targetHeight;
                let finalW = Math.round(finalH * res.item.ratio);

                // even pixel 강제
                finalW = Math.round(finalW / 2) * 2;
                finalH = Math.round(finalH / 2) * 2;

                // cache 동기화
                res.usedCache.finalW = finalW;
                res.usedCache.finalH = finalH;

                allCalculatedItems.push({
                    element: res.item.element,
                    w: finalW,
                    h: finalH
                });
            });
        });
    }

    // ---------------------------------------------------
    // Skyline 배치
    // ---------------------------------------------------

    const layout =
        new SkylineLayout(containerWidth, gap, 0.95);

    allCalculatedItems.forEach(data => {

        layout.placeItem(data);

    });

    // ---------------------------------------------------
    // 전체 높이 갱신
    // ---------------------------------------------------

    const totalHeight =
        layout.getMaxHeight();

    container.style.height =
        `${totalHeight}px`;
}

function getAspectRatio(item, img) {
    if (img && img.naturalWidth) return img.naturalWidth / img.naturalHeight;
    const styleRatio = item.style.aspectRatio.split('/');
    return styleRatio.length === 2 ? parseFloat(styleRatio[0]) / parseFloat(styleRatio[1]) : 1;
}
