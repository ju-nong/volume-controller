<template>
    <div class="container">
        <div class="floor">
            <div class="crank">
                <div class="axis" ref="$axis"></div>
                <div
                    class="pillar"
                    :style="`
						--var-pillar-angle: ${pillarAngle}deg;
					`"
                >
                    <div></div>
                </div>
                <div
                    class="handle"
                    :style="`
						--var-handle-top: ${handleTop}px;
						--var-handle-left: ${handleLeft}px;		
					`"
                    @mousedown="handleMouseDown"
                ></div>
            </div>

            <div class="volume">
                <div class="progress">
                    <span>{{ volume }}</span>
                    <div>
                        <div :style="`--var-volume: ${volume}%`"></div>
                    </div>
                </div>
                <VolumeIcon :width="volume" />

                <p>
                    <span v-for="(_, index) in volumeUpCount" :key="index"
                        >+1</span
                    >
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { VolumeIcon } from ".";

import { onBeforeUnmount, onMounted, ref } from "vue";

/**
 * 2 ~ 4분면 통과 여부
 */
let q2 = false,
    q3 = false,
    q4 = false;

/**
 * 볼륨
 */
const volume = ref(50);

/**
 * 볼륨 증가 횟수
 */
let volumeUpCount = ref(0);

/**
 * axis 요소 (중심점 계산용)
 */
const $axis = ref<null | HTMLElement>(null);

/**
 * 기둥 각도
 */
const pillarAngle = ref(0);

/**
 * 핸들 top
 */
const handleTop = ref(-156);

/**
 * 핸들 left
 */
const handleLeft = ref(0);

/**
 * 드래그 여부
 */
let isDragging = false;

/**
 * 핸들 마우스 다운
 */
function handleMouseDown(event: MouseEvent) {
    isDragging = true;

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
}

/**
 * 전역 마우스 업
 */
function handleMouseUp() {
    isDragging = false;

    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
}

/**
 * 전역 마우스 움직임
 */
function handleMouseMove(event: MouseEvent) {
    if (!isDragging || !$axis.value) {
        return;
    }

    // axis 요소의 중심점을 기준으로 계산
    const rect = $axis.value.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const { clientX, clientY } = event;

    // atan2(y, x) - 마우스 위치와 중심점의 차이로 각도 계산
    // 12시 방향을 0도로 하기 위해 x, y를 바꾸고 부호 조정
    const rad = Math.atan2(clientX - cx, cy - clientY);
    const deg = rad * (180 / Math.PI);

    // 각도를 0~360 범위로 정규화
    const angle = (deg + 360) % 360;

    if (volume.value < 100 && q2 && q3 && q4 && angle < 90) {
        q2 = false;
        q3 = false;
        q4 = false;

        volume.value += 1;
        volumeUpCount.value += 1;
    } else if (angle < 90) {
        q2 = false;
        q3 = false;
        q4 = false;
    } else if (angle < 180) {
        q2 = true;
        q3 = false;
        q4 = false;
    } else if (q2 && angle < 270) {
        q3 = true;
        q4 = false;
    } else if (q2 && q3 && angle < 360) {
        q4 = true;
    }

    pillarAngle.value = angle;

    // 핸들 위치 계산 (pillar 길이를 반지름으로 원형 궤도)
    const radius = 156; // pillar 높이
    const angleRad = angle * (Math.PI / 180);

    // CSS 좌표계에 맞게 계산 (12시 방향이 0도, 시계방향 증가)
    // sin은 x방향, cos는 y방향 (위쪽이 음수)
    handleLeft.value = Math.sin(angleRad) * radius;
    handleTop.value = -Math.cos(angleRad) * radius;
}

/**
 * 볼륨 감소 인터벌
 */
let interval: number = -1;

onMounted(() => {
    interval = setInterval(() => {
        // 드래그 중이거나 볼륨이 0인 경우
        if (
            // isDragging ||
            volume.value === 0
        ) {
            return;
        }

        volume.value -= 1;
        // }, 2500);
    }, 750);
});

onBeforeUnmount(() => {
    clearInterval(interval);
});
</script>

<style scoped>
@keyframes fade-out {
    from {
        opacity: 0.5;
        transform: translateX(-50%) translateY(0%);
    }
    to {
        opacity: 0;
        transform: translateX(-50%) translateY(-50%);
    }
}

.container {
    margin: 200px auto;

    > .floor {
        width: 600px;
        height: 80px;
        background-color: #7e7e7e;
        position: relative;

        > .crank {
            position: absolute;
            top: 50%;
            left: 30%;
            transform: translateY(-50%);
            z-index: 3;

            > .axis,
            > .handle {
                background-color: #a8a8a8;
                border: 2px solid #fff;
                border-radius: 100%;
                z-index: 5;
            }

            > .axis {
                position: relative;
                width: 60px;
                height: 60px;
            }

            > .pillar {
                width: 60px;
                height: 160px;
                background: #fff; /* border 색 */
                clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
                padding: 2px;

                position: absolute;
                z-index: 2;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%) rotate(var(--var-pillar-angle));

                transform-origin: bottom center;

                > div {
                    width: 100%;
                    height: 100%;
                    background: #a8a8a8;
                    clip-path: inherit;
                }
            }

            > .handle {
                position: absolute;
                width: 65px;
                height: 65px;
                cursor: pointer;

                top: var(--var-handle-top);
                left: var(--var-handle-left);

                transform: translateX(-2px);
            }
        }

        > .volume {
            position: absolute;
            bottom: 10px;
            right: 30%;
            z-index: 1;

            display: flex;
            flex-direction: column;
            align-items: center;
            row-gap: 10px;

            > .progress {
                width: 40px;
                background-color: #a6a7a5;
                display: flex;
                flex-direction: column;
                row-gap: 4px;
                align-items: center;
                padding: 4px 0px 9px 0px;

                > span {
                    color: #fff;
                    font-size: 16px;
                    text-align: center;
                }

                > div {
                    width: 22px;
                    height: 150px;
                    background-color: #d0d2d2;
                    display: flex;
                    align-items: flex-end;

                    > div {
                        background-color: #0ebf14;
                        width: 100%;
                        height: var(--var-volume);
                    }
                }
            }

            > svg {
                width: 40px;
                height: 40px;
            }

            > p {
                position: absolute;

                bottom: 100%;
                transform: translateY(-30%);

                > span {
                    position: absolute;

                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%) translateY(-50%);
                    font-size: 16px;

                    color: #0ebf14;
                    opacity: 0.5;

                    animation: fade-out 1s ease-in-out forwards;
                }
            }
        }
    }
}
</style>
