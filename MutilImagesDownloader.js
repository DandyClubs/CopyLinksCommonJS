
// 전역 또는 UI 이벤트 핸들러가 접근 가능한 위치에 선언
let userAbortController = null;
let abortReason = null; // 🔥 추가

let AllCount = 0;
let errorCount = 0;
let addCount = 0;
let rs;   // new ReadableStream
let gmRequest; // GM_xmlhttpRequest의 리턴 객체

async function retry(fn, max = 5, delay = 1000) {
    for (let i = 0; i < max; i++) {
        try {
            return await fn(); // 함수 실행 시도
        } catch (err) {
            if (i === max - 1) {
                // 마지막 시도였다면 에러를 다시 던짐
                throw err;
            }
            console.warn(`Retry attempt ${i + 1} failed:`, err);
            await sleep(delay); // 잠시 대기 후 재시도
        }
    }
}

// === UI 생성 ===
function createProgressUI() {
    if (window.ProgressUI) return;
    if (document.querySelector('.ProgressWrapper')) {
        return;
    }


    const style = document.createElement('style');
    style.textContent = `
    .ProgressWrapper {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(20, 20, 20, 0.85);
      padding: 12px 16px;
      border-radius: 14px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      color: #fff;
      font-family: system-ui, sans-serif;
      backdrop-filter: blur(6px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .ProgressMain {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .ProgressBar {
      width: 180px;
      height: 10px;
      background: #444;
      border-radius: 5px;
      overflow: hidden;
    }
    .ProgressFill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #00e0ff, #00ff95);
      transition: width 0.2s ease-out;
    }
    .ProgressStats {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }
    .ProgressActions {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .ProgressActions button {
      all: unset;
      color: #ccc;
      background: #333;
      border-radius: 4px;
      width: 24px;
      height: 24px;
      font-size: 14px;
      text-align: center;
      line-height: 24px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .ProgressActions button:hover {
      background: #555;
      color: #fff;
    }
    .ProgressWrapper[hidden] {
      opacity: 0;
      pointer-events: none;
      transform: translateY(-10px);
    }
  `;
    document.head.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.className = 'ProgressWrapper';
    wrapper.hidden = true;

    wrapper.innerHTML = `
    <div class="ProgressMain">
      <div class="ProgressBar"><div class="ProgressFill"></div></div>
      <div class="ProgressStats">
        <span class="ProgressText">0%</span>
        <span class="ProgressStatus">0 / 0</span>
        <span class="ProgressErrors">❌ 0</span>
      </div>
    </div>
    <div class="ProgressActions">
      <button class="RetryFailed" title="Retry Failed">↻</button>
      <button class="StopAll" title="Stop All">⏹</button>
    </div>
  `;
    document.body.appendChild(wrapper);

    window.ProgressUI = {
        wrapper,
        fill: wrapper.querySelector('.ProgressFill'),
        percentText: wrapper.querySelector('.ProgressText'),
        statusText: wrapper.querySelector('.ProgressStatus'),
        errorText: wrapper.querySelector('.ProgressErrors'),
        retryBtn: wrapper.querySelector('.RetryFailed'),
        stopBtn: wrapper.querySelector('.StopAll'),
        total: 0,
        done: 0,
        failed: 0,
        visible: false,
        show() {
            this.wrapper.hidden = false;
            this.visible = true;
        },
        hide() {
            this.wrapper.hidden = true;
            this.visible = false;
        },
        reset(totalCount) {
            this.total = totalCount;
            this.done = 0;
            this.failed = 0;
            this.update();
            this.show();
        },
        success() {
            this.done++;
            this.update();
        },
        error() {
            this.failed++;
            this.update();
        },
        update() {
            const percent = this.total ? Math.floor((this.done / this.total) * 100) : 0;
            this.fill.style.width = percent + '%';
            this.percentText.textContent = percent + '%';
            this.statusText.textContent = `${this.done} / ${this.total}`;
            this.errorText.textContent = `❌ ${this.failed}`;
        }
    };

}



// === 사용 함수 ===
function updateProgressUI(done, total) {
    if (!window.ProgressUI) return;
    ProgressUI.done = done;
    ProgressUI.total = total;
    ProgressUI.update();
}

function injectGraphicProgressLayer() {
    if (!window.ProgressUI) createProgressUI();
    ProgressUI.reset(0); // 초기화된 상태
}

function updateStateText(text) {
    if (ProgressUI) ProgressUI.statusText.textContent = text;
}

function showErrorPanel() {
    ProgressUI.errorText.style.color = 'red';
}

// UI 숨기기 함수 예시
function hideProgressUI() {
    const progressWrapper = document.querySelector('.ProgressWrapper');
    if (progressWrapper) {
        progressWrapper.style.display = 'none';
    }
    const errorPanel = document.querySelector('.ErrorPanel'); // 오류 패널도 숨기고 싶으면
    if (errorPanel) {
        errorPanel.style.display = 'none';
    }
}

//window.setImmediate = (fn) => {fn()}
/**
 * Asynchronous fetch-like function using GM_xmlhttpRequest, with support for streaming.
 * It handles the differences between streaming and non-streaming environments.
 * It now also checks for a non-empty response body for a successful status.
 * @param {string} url - The URL to fetch.
 * @param {object} [fetchInit={}] - Optional configuration for the request (method, headers, etc.).
 * @returns {Promise<Response>} A Promise that resolves to a fetch-like Response object.
 */
async function Xfetch(url, fetchInit = {}) {
    const defaultFetchInit = { method: "GET" };
    const { headers, method, signal } = { ...defaultFetchInit, ...fetchInit };
    const isStreamSupported = GM_xmlhttpRequest?.RESPONSE_TYPE_STREAM;
    const HEADERS_RECEIVED = 2;

    // Utility to parse raw response headers string into an object
    function parseHeaders(rawHeaders) {
        const headers = {};
        rawHeaders.split(/\r?\n/).forEach(line => {
            const [key, ...vals] = line.split(':');
            if (key) headers[key.trim().toLowerCase()] = vals.join(':').trim();
        });
        return headers;
    }

    if (!isStreamSupported) {
        console.log('Streaming Not Supported!');
        // Fallback for browsers/userscript engines without streaming support
        return new Promise((resolve, reject) => {
            // This promise will hold the blob and is used by the various response methods
            const blobPromise = new Promise((res, rej) => {
                gmRequest = GM_xmlhttpRequest({
                    url,
                    method,
                    headers,
                    responseType: "blob",
                    // The signal property is not supported by GM_xmlhttpRequest, so we need to
                    // manually abort the request if the signal is aborted.
                    onabort: () => rej(new Error('Request aborted')),
                    onload: (response) => {
                        console.log('response.status:', response.status);
                        // The crucial check: A successful status AND a non-empty response body.
                        if (response.status === 200 && response.response.byteLength > 0) {
                            res(response.response);
                        } else if (response.status === 200 && response.response.byteLength === 0) {
                            // Specifically reject 200 with an empty body, as this is the issue.
                            rej(new Error(`Status 200 but empty response`));
                        } else {
                            rej(new Error(`Status ${response.status} or empty response`));
                        }
                    },
                    onerror: rej,
                    onreadystatechange: onHeadersReceived,
                    signal, // Pass the signal to GM_xmlhttpRequest
                });
            });

            // If the signal is aborted, we can reject the promise
            if (signal) {
                signal.addEventListener('abort', () => {
                    try {
                        if (gmRequest && typeof gmRequest.abort === 'function') {
                            gmRequest.abort(); // 실제 네트워크 연결 끊기
                        }
                        console.log(rs, rs.cancel);
                        if (rs && typeof rs.cancel === 'function') {
                            rs.cancel(); // 스트림 닫기
                        }
                    } catch (e) {
                        console.warn("Abort cleanup error:", e);
                    }
                    reject(new Error('Request aborted'));
                }, { once: true });
            };

            blobPromise.catch(reject);

            function onHeadersReceived(gmResponse) {
                const { readyState, responseHeaders, status, statusText } = gmResponse;
                if (readyState === HEADERS_RECEIVED) {
                    const hdrs = parseHeaders(responseHeaders);
                    resolve({
                        headers: hdrs,
                        status,
                        statusText,
                        ok: status >= 200 && status < 300,
                        arrayBuffer: () => blobPromise.then(blob => blob.arrayBuffer()),
                        blob: () => blobPromise,
                        json: () => blobPromise.then(blob => blob.text()).then(text => JSON.parse(text)),
                        text: () => blobPromise.then(blob => blob.text()),
                    });
                }
            }
        });
    } else {
        // Streaming supported
        //console.log('Streaming Supported!')
        return new Promise((resolve, reject) => {
            const responsePromise = new Promise((res, rej) => {
                gmRequest = GM_xmlhttpRequest({
                    url,
                    method,
                    headers,
                    responseType: "stream",
                    onerror: rej,
                    onreadystatechange: onHeadersReceived,
                    signal, // Pass the signal to GM_xmlhttpRequest
                });
            });

            if (signal) {
                signal.addEventListener('abort', () => {
                    try {
                        if (gmRequest && typeof gmRequest.abort === 'function') {
                            gmRequest.abort(); // 실제 네트워크 연결 끊기
                        }
                        console.log(rs, rs.cancel);
                        if (rs && typeof rs.cancel === 'function') {
                            rs.cancel(); // 스트림 닫기
                        }
                    } catch (e) {
                        console.warn("Abort cleanup error:", e);
                    }
                    reject(new Error('Request aborted'));
                }, { once: true });
            };

            responsePromise.catch(reject);

            function onHeadersReceived(gmResponse) {
                const { readyState, responseHeaders, status, statusText, response: readableStream } = gmResponse;
                if (readyState === HEADERS_RECEIVED) {
                    const hdrs = parseHeaders(responseHeaders);

                    // New check for empty response based on Content-Length header
                    const contentLength = hdrs['content-length'];

                    // If the response is empty or too small, reject it.
                    // This is a heuristic check for cases where the server returns 200 OK but with no actual content.
                    // The threshold (1000 bytes) can be adjusted based on typical minimum image sizes.
                    if (status === 200 && (isNaN(contentLength) || contentLength < 1000)) {
                        console.warn(`Status 200 but empty or abnormally small response (Content-Length: ${contentLength}) for `);
                        rej(new Error(`Status 200 but empty or abnormally small response (Content-Length: ${contentLength})`));
                        signal.abort(); // Abort the request to prevent further processing)
                        return;
                    }
                    let responseInit = { headers: hdrs, status, statusText, contentLength };

                    // Special case: status 0 might happen in some contexts
                    if (status === 0) {
                        console.warn("status is 0!", { status, statusText, contentLength });
                        delete responseInit.status;
                        delete responseInit.statusText;
                    }
                    resolve(new Response(readableStream, responseInit));
                }
            }
        });
    }
}


document.addEventListener('click', (e) => {
    const stopBtn = e.target.closest('.StopAll');
    console.log(e.target);
    if (!stopBtn) return;
    console.log('StopAll 버튼 클릭');
    if (stopBtn) {
        if (userAbortController && !userAbortController.signal.aborted) {
            console.log("⏹ 다운로드 중지 요청");
            abortReason = 'user';
            userAbortController.abort();
        }
    }
    const retryFailedBtn = e.target.closest('.RetryFailed');
    if (!retryFailedBtn) return;
    if (retryFailedBtn) {
        if (errorCount > 0) {
            console.log("🔄 실패한 이미지 재시도", errorCount);
            downloadPhotosWithRetry(DownloadImagesDB);
        } else {
            console.log("❌ 재시도할 실패 이미지 없음");
        }
    }
});

function activityTimeoutSignal(ms) {
    const controller = new AbortController();
    let timeoutId = null;

    // 타임아웃을 설정/재설정하는 함수
    const resetTimeout = () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => { abortReason = 'error'; controller.abort(); }, ms);
    };

    // 타임아웃을 즉시 시작
    resetTimeout();

    // fetch가 진행될 때마다 타임아웃을 재설정하는 기능 추가
    // 이 부분은 fetch의 'signal'이 아닌, 다운로드 루프 내에서 처리해야 합니다.
    // 여기서는 컨트롤러 객체에 이 함수를 추가하여 외부에서 호출할 수 있도록 합니다.
    controller.resetTimeout = resetTimeout;

    // 다운로드가 완료되거나 취소되면 타임아웃을 정리하는 함수
    controller.clearTimeout = () => {
        if (timeoutId) clearTimeout(timeoutId);
    };

    return controller;
}


async function downloadPhotosWithRetry(DownloadImagesDB, ArchivesFileName) {
    // 다운로드 시작 시 새로운 AbortController 생성
    userAbortController = new AbortController();    
    const { signal: userSignal } = userAbortController;
    const maxRetries = 2;
    let errorList = [];
    errorCount = 0;

    AllCount = DownloadImagesDB.length;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`[Attempt ${attempt}] 시작`);
        if (userSignal.aborted) {
            console.log("🚫 다운로드가 사용자 요청에 의해 중단되었습니다.");
            break;
        }

        try {
            // downloadPhotosAttempt에 사용자 취소 신호 전달
            const result = await downloadPhotosAttempt(DownloadImagesDB, ArchivesFileName, userSignal, attempt > 1);
            errorList = result.failed;

            if (errorList.length === 0) {
                break;
            }
            errorCount = errorList.length;
            console.warn(`[Attempt ${attempt}] 실패 항목 ${errorList.length}개, 재시도 준비`);


        } catch (fatalErr) {
            if (fatalErr.name === 'AbortError') {
                console.log("🚫 다운로드가 사용자 요청 또는 타임아웃으로 취소되었습니다.");
                updateStateText("🚫 다운로드 취소됨");
            } else {
                console.error("⛔ 치명적 오류:", fatalErr);                
            }
            // IndexedDB 임시 데이터 제거 (streamSaver 버퍼 제거)

            if (typeof cleanupStreamSaverTempFiles === 'function') {
                await cleanupStreamSaverTempFiles();
            }
            break;
        }
    }

    // 다운로드 종료 후 AbortController 초기화
    userAbortController = null;

    if (errorList.length) {
        errorCount = errorList.length;
        updateStateText(`❌ 최종 실패 ${errorList.length} 항목`);
        showErrorPanel(errorList);
        
    } else if (userSignal.aborted) {
        if (abortReason === 'user') {
            console.log("⛔ 사용자 중단");        
        } else {
            console.log("⚠️ 오류로 중단 → 재시도 대상");
            await sleep(5000);
        }
    } else {
        updateStateText(`✅ 전체 성공`);
        await sleep(2500);
        hideProgressUI();
    }
}



async function downloadPhotosAttempt(DB, ArchivesFileName, userSignal, isRetry = false) {
    injectGraphicProgressLayer();
    let failed = [];
    const zip = new fflate.Zip();
    addCount = 0;
    // streamSaver에도 사용자 취소 신호 전달
    const fileStream = streamSaver.createWriteStream(ArchivesFileName, { signal: userSignal });

    rs = new ReadableStream({
        start(controller) {
            zip.ondata = (err, chunk, final) => {
                if (err) return controller.error(err);
                controller.enqueue(chunk);
                if (final) controller.close();
            };
        }
    });

    const pipePromise = rs.pipeTo(fileStream).catch(err => {
        if (err.name !== 'AbortError') {
            console.error("❌ 저장 스트림 오류", err);
        }
        throw err;
    });

    for (const meta of DB) {

        // 루프 시작 시 사용자 취소 신호 확인
        if (userSignal.aborted) {
            zip.terminate();
            break;
        }

        // 개별 다운로드에 대한 타임아웃 컨트롤러 생성 (30초로 설정)
        const activityController = activityTimeoutSignal(30000);

        try {
            // 사용자 취소 신호와 활동 감지 타임아웃 신호를 결합
            const combinedSignal = AbortSignal.any([userSignal, activityController.signal]);


            const usefoamgirl = 'foamgirl.net' === RootDomain;
            let modHeader;
            if ('foamgirl.net' === RootDomain) {
                modHeader = {
                    'Referer': PageURL,
                    //'Origin': new URL(PageURL).origin
                };

            } else if ('everia.club' === RootDomain) {
                modHeader = {
                    'Referer': meta.P,
                    //'Origin': new URL(meta.P).origin
                };
            } else {
                modHeader = {
                    'Referer': PageURL,
                    //'Origin': new URL(PageURL).origin
                };
            }

            const response = await Xfetch(meta.P,
                {
                    headers: modHeader,
                    signal: combinedSignal,
                });

            if (!response.ok) {
                // Xfetch에서 이미 오류를 처리했지만, 혹시 모를 경우를 대비
                throw new Error(`HTTP ${response.status} or empty response`);
            }

            const file = new fflate.ZipPassThrough(`${ArchivesFileName}/${meta.F}`);
            zip.add(file);

            const reader = response.body.getReader();
            while (true) {
                // 데이터를 읽을 때마다 활동 타임아웃을 재설정
                const { value, done } = await reader.read();
                if (done) break;

                // 데이터 수신 시 타임아웃 재설정
                activityController.resetTimeout();
                file.push(value);
            }
            file.push(new Uint8Array(0), true);

            // 다운로드 완료 시 타임아웃 정리
            activityController.clearTimeout();

            addCount++;
            updateProgressUI(addCount, DB.length);
        } catch (err) {
            // 사용자 취소 신호인 경우에만 루프를 중단하고,
            // 그 외의 오류는 다시 던져서 전체 프로세스를 중단합니다.
            if (err.name === 'AbortError') {
                zip.terminate();
                throw err;
            }

            // Xfetch에서 발생한 오류나 기타 다른 오류가 여기로 오게 됩니다.
            // 다운로드 루프를 중단하고 전체 함수를 종료하기 위해 오류를 다시 던집니다.
            console.warn(`[실패] ${meta.P}`, err);
            failed.push(meta);
            updateProgressUI(addCount, DB.length);
            zip.terminate(); // 불완전 ZIP 종료
            throw err; // 여기서 오류를 다시 던져야 루프가 멈추고 함수가 종료됩니다.
        }
    }

    if (userSignal.aborted || failed.length) {
        zip.terminate(); // 불완전 ZIP 종료
    } else {
        zip.end(); // 완전한 종료
    }

    await pipePromise; // 스트림 저장 완료 대기

    return { addCount, failed };
}

async function cleanupStreamSaverTempFiles() {
    // IndexedDB에서 streamSaver 저장소 제거
    try {
        const req = indexedDB.deleteDatabase('streamsaver');
        req.onsuccess = () => console.log("🧹 streamSaver 임시 파일 제거 완료");
        req.onerror = () => console.warn("⚠️ 임시 파일 제거 실패 (무시 가능)");
    } catch (e) {
        console.warn("streamSaver cleanup error:", e);
    }
}


async function generateZIP(DB, ZipFileName) {
    const DownloadImagesDB = [];
    const ArchivesFileName = ZipFileName + ".zip";
    for (const { src, filename } of DB) {
        DownloadImagesDB.push({ P: src, F: filename });  // indexedDB에서 가져온 주소와 메타데이타 조합
    }
    await downloadPhotosWithRetry(DownloadImagesDB, ArchivesFileName);
}
