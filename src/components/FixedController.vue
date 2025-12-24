<template>
    <div class="container">
        <div class="thumb">
            <div class="pointer" @mousedown="handleMouseDown"></div>
            <div class="tooltip">{{ volume }}%</div>
        </div>

        <div
            class="slider"
            :style="`--var-fixed-controller-track-left:${trackLeft}px`"
        >
            <span>
                <VolumeIcon :width="25" :isBlack="true" />
            </span>
            <div class="track"></div>
            <span>
                <VolumeIcon :width="100" :isBlack="true" />
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VolumeIcon } from ".";

/**
 * 트랙 반너비
 */
const TRACK_HALF_WIDTH = 80;

/**
 * 볼륨
 */
const volume = ref(50);

/**
 * 트랙 left
 */
const trackLeft = ref(0);

/**
 * 마우스 다운 x좌표
 */
let mouseDownX = 0;

/**
 * 마우스 다운 했을 때의 트랙 left
 */
let cachedTrackLeft = 0;

/**
 * 드래그 여부
 */
let isDragging = false;

/**
 * 전역 마우스 움직임
 */
function handleMouseMove(event: MouseEvent) {
    if (!isDragging) {
        return;
    }

    let calculatedTrackLeft = cachedTrackLeft - (event.clientX - mouseDownX);

    if (calculatedTrackLeft > TRACK_HALF_WIDTH) {
        calculatedTrackLeft = TRACK_HALF_WIDTH;
    } else if (calculatedTrackLeft < -TRACK_HALF_WIDTH) {
        calculatedTrackLeft = -TRACK_HALF_WIDTH;
    }

    trackLeft.value = calculatedTrackLeft;

    volume.value = Math.floor(
        ((calculatedTrackLeft + TRACK_HALF_WIDTH) / (TRACK_HALF_WIDTH * 2)) *
            100,
    );
}

/**
 * 핸들 마우스 다운
 */
function handleMouseDown(event: MouseEvent) {
    cachedTrackLeft = trackLeft.value;
    mouseDownX = event.clientX;

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
</script>

<style scoped>
.container {
    height: 240px;
    display: flex;
    align-items: center;
    margin: 0 auto;
    position: relative;

    .thumb {
        position: relative;

        .pointer {
            background-color: #2b2b2b;
            width: 16px;
            height: 16px;
            border-radius: 100%;
            box-shadow: 2px 2px 3px #000;
            cursor: pointer;
        }

        .tooltip {
            position: absolute;
            bottom: 28px;
            left: 50%;
            transform: translateX(-50%);
            background: #000;
            color: #fff;
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 6px;
            white-space: nowrap;
        }

        .tooltip::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 6px 6px 0 6px;
            border-style: solid;
            border-color: #000 transparent transparent transparent;
        }
    }

    .slider {
        display: flex;
        align-items: center;
        gap: 6px;
        position: absolute;
        top: 50%;
        left: calc(50% - var(--var-fixed-controller-track-left));
        transform: translate(-50%, -50%);
        pointer-events: none;

        > span {
            width: 36px;
            height: 36px;

            &:nth-of-type(2) {
                margin-left: 8px;
            }
        }

        .track {
            width: 160px;
            height: 4px;
            background: #2b2b2b;
            border-radius: 2px;
        }
    }
}
</style>
