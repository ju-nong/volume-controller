<template>
    <div class="container">
        <div class="video-player">
            <!-- 영상 화면 영역 -->
            <div class="video-screen">
                <!-- 정보 아이콘 -->
                <div class="info-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                        />
                    </svg>
                </div>
            </div>

            <div class="nav">
                <!-- 진행바 -->
                <div class="progress-bar">
                    <div class="progress-played"></div>
                    <div class="progress-handle"></div>
                </div>

                <!-- 컨트롤 바 -->
                <div class="controls">
                    <!-- 왼쪽 컨트롤 -->
                    <div class="controls-left">
                        <!-- 재생/일시정지 버튼 -->
                        <button
                            class="control-btn"
                            @click="isPlaying = !isPlaying"
                        >
                            <svg
                                v-show="isPlaying"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                            <svg
                                v-show="!isPlaying"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>

                        <!-- 볼륨 컨트롤 -->
                        <div class="volume-control">
                            <button class="control-btn" @click="toggleMute">
                                <svg
                                    v-if="volume === 0"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                                    />
                                </svg>
                                <svg
                                    v-else
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
                                    />
                                </svg>
                            </button>

                            <div
                                class="volume-slider-wrap"
                                :class="{ moving: isMouseDown }"
                            >
                                <div
                                    ref="$volumeSlider"
                                    class="volume-slider"
                                    :style="`--var-slider-top: ${sliderTop}px;`"
                                    @mousedown="handleMouseDown"
                                >
                                    <div class="volume-track-bg">
                                        <div
                                            class="volume-track-fill"
                                            :style="`width: ${volume}%`"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 시간 표시 -->
                        <div class="time-display">
                            <span>1:54</span>
                            <span class="separator">/</span>
                            <span>4:20</span>
                        </div>
                    </div>

                    <!-- 오른쪽 컨트롤 -->
                    <div class="controls-right">
                        <!-- 자막 버튼 -->
                        <button class="control-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z"
                                />
                            </svg>
                        </button>

                        <!-- 설정 버튼 -->
                        <button class="control-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
                                />
                            </svg>
                        </button>

                        <!-- PIP 버튼 -->
                        <button class="control-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"
                                />
                            </svg>
                        </button>

                        <!-- 전체화면 버튼 -->
                        <button class="control-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Selected volume 표시 -->
            <!-- <p class="selected-volume">
                Selected volume: {{ Math.round(volume) }}%
            </p> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

/**
 * 볼륨 슬라이더
 */
const $volumeSlider = ref<null | HTMLDivElement>(null);

/**
 * 재생 여부
 */
const isPlaying = ref(false);

/**
 * 볼륨
 */
const volume = ref(50);

/**
 * 이전 볼륨
 */
const previousVolume = ref(50);

function toggleMute() {
    if (volume.value > 0) {
        previousVolume.value = volume.value;
        volume.value = 0;
    } else {
        volume.value = previousVolume.value;
    }
}

/**
 * 마우스 down 위치
 */
const startClientY = ref(0);

/**
 * 마우스 다운 여부
 */
const isMouseDown = ref(false);

/**
 * 움직이고 있는지 여부
 */
const isMoving = ref(false);

/**
 * 슬라이더 top
 */
const sliderTop = ref(2);

/**
 * 슬라이더 top 설정
 */
function setTop(event: MouseEvent) {
    const { clientY } = event;

    let newTop = clientY - startClientY.value + 2;

    if (newTop > 50) {
        newTop = 50;
    } else if (newTop < -50) {
        newTop = -50;
    }

    sliderTop.value = newTop;
}

function handleMouseMove(event: MouseEvent) {
    if (!isMouseDown.value) {
        return;
    }

    setTop(event);
}

function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    const start = sliderTop.value;
    const end = 2;
    const duration = 300; // ms
    const startTime = performance.now();

    function easeOutCubic(t: number) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animate(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);

        sliderTop.value = Math.round(start + (end - start) * eased);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            sliderTop.value = 2; // 최종 보정
            isMouseDown.value = false;
            isMoving.value = false;
        }
    }

    requestAnimationFrame(animate);
}

function handleMouseDown(event: MouseEvent) {
    if ($volumeSlider.value === null || isMouseDown.value || isMoving.value) {
        return;
    }

    isMouseDown.value = true;
    isMoving.value = true;
    startClientY.value = event.clientY;

    setTop(event);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
}

watch(isMoving, (to) => {
    function animate() {
        const top = sliderTop.value - 2;

        const afterTop = volume.value - top / 10;

        if (afterTop > 100) {
            volume.value = 100;
        } else if (afterTop < 0) {
            volume.value = 0;
        } else {
            volume.value = afterTop;
        }

        if (isMoving.value) {
            requestAnimationFrame(animate);
        }
    }

    if (to) {
        requestAnimationFrame(animate);
    }
});

// const isDragging = ref(false);
// const volume = ref(50);
// const previousVolume = ref(50);

// const $volumeTrack = ref<null | HTMLDivElement>(null);

// const lastClientY = ref(-1);

// const dragTop = ref(2);

// let interval:number = -1;

// function calculateVolume(event: MouseEvent) {
// if (!$volumeTrack.value) {
//     return;
// }

// const { clientY } = event;

// // 이전 위치와의 차이 계산 (위로 가면 음수, 아래로 가면 양수)
// const deltaY = lastClientY.value - clientY;

// // delta를 현재 볼륨에 적용 (위로 가면 증가, 아래로 가면 감소)
// let newVolume = volume.value + deltaY;
// newVolume = Math.max(0, Math.min(100, newVolume));

// volume.value = newVolume;

// dragTop.value -= deltaY;

// // 현재 위치를 다음 계산을 위해 저장
// lastClientY.value = clientY;
// }

// function handleVolumeMouseMove(event: MouseEvent) {
//     if (!isDragging.value) {
//         return;
//     }

//     calculateVolume(event);
// }

// function handleVolumeMouseUp() {
//     isDragging.value = false;

//     dragTop.value = 2;

//     document.removeEventListener("mousemove", handleVolumeMouseMove);
//     document.removeEventListener("mouseup", handleVolumeMouseUp);
// }

// async function handleVolumeMouseDown(event: MouseEvent) {
//     if (
//         (event.target as HTMLElement).closest(
//             ".volume-slider, .volume-track-bg, .volume-track-fill",
//         )
//     ) {
//         lastClientY.value = event.clientY;
//         isDragging.value = true;

//         document.addEventListener("mousemove", handleVolumeMouseMove);
// 		document.addEventListener("mouseup", handleVolumeMouseUp);

// 		interval = setInterval(() => {

// 		}, 100);
//     }
// }
</script>

<style scoped>
.container {
    height: 240px;
    margin: 0 auto;

    > .video-player {
        width: 480px;
        height: 100%;
        border-radius: 8px;
        background: #000;
        font-family: "Roboto", "Arial", sans-serif;
        position: relative;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.35), 0 0 80px rgba(0, 0, 0, 0.2);

        > .video-screen {
            width: 100%;
            /* height: calc(100% - 56px); */
            border-radius: 8px;
            height: 100%;
            background: #1a1a1a;
            position: relative;

            > .info-icon {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 24px;
                height: 24px;
                color: rgba(255, 255, 255, 0.8);
                cursor: pointer;

                &:hover {
                    color: #fff;
                }
            }
        }

        > .nav {
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 0;
            border-radius: 8px;

            > .progress-bar {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                position: relative;
                cursor: pointer;

                &:hover {
                    height: 6px;

                    > .progress-handle {
                        opacity: 1;
                    }
                }

                > .progress-played {
                    width: 45%;
                    height: 100%;
                    background: #ff0000;
                    position: absolute;
                    left: 0;
                    top: 0;
                }

                > .progress-handle {
                    left: 45%;
                    width: 14px;
                    height: 14px;
                    background: #ff0000;
                    border-radius: 50%;
                    position: absolute;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    transition: opacity 0.1s;
                }
            }

            > .controls {
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));

                > .controls-left,
                > .controls-right {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .control-btn {
                    width: 36px;
                    height: 36px;
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    padding: 6px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;

                    &:hover {
                        background: rgba(255, 255, 255, 0.1);
                    }

                    > svg {
                        width: 100%;
                        height: 100%;
                    }
                }

                .volume-control {
                    display: flex;
                    align-items: center;
                    position: relative;

                    /* &::after {
                        content: "";
                        width: 60px;
                        height: 2px;
                        background: red;
                        position: absolute;
                        top: -30px;
                        left: 0;
                        transform: translateY(-50%);
                    }

                    &::before {
                        content: "";
                        width: 60px;
                        height: 2px;
                        background: red;
                        position: absolute;
                        bottom: -30px;
                        left: 0;
                        transform: translateY(-50%);
                    } */

                    &:hover {
                        > .volume-slider-wrap {
                            width: 60px;
                            overflow: visible;
                        }
                    }

                    /* &.controlling {
                        > .volume-slider-wrap {
                            width: 60px;
                            overflow: visible;

                            > .volume-slider {
                                top: var(--var-slider-top);
                            }
                        }
                    } */

                    > .volume-slider-wrap {
                        width: 0;
                        height: 4px;
                        overflow: hidden;
                        transition: width 0.2s ease;
                        position: relative;

                        &.moving {
                            width: 60px;
                            overflow: visible;

                            > .volume-slider {
                                transition: all 0s;
                                top: var(--var-slider-top);
                            }
                        }

                        > .volume-slider {
                            width: 52px;
                            height: 4px;
                            position: absolute;
                            top: 2px;
                            left: 4px;
                            transform: translateY(-50%);
                            cursor: pointer;

                            > .volume-track-bg {
                                position: absolute;
                                width: 52px;
                                height: 4px;
                                /* background: rgba(255, 255, 255, 0.3); */
                                background-color: #575757;
                                border-radius: 2px;
                                overflow: hidden;

                                > .volume-track-fill {
                                    position: absolute;
                                    height: 4px;
                                    background: #fff;
                                    border-radius: 2px;
                                    left: 0;
                                }
                            }
                        }
                    }
                }

                .time-display {
                    color: #fff;
                    font-size: 13px;
                    margin-left: 8px;
                    white-space: nowrap;

                    > .separator {
                        margin: 0 4px;
                        opacity: 0.7;
                    }
                }
            }
        }
    }
}
</style>
