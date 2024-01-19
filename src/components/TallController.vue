<template>
    <div class="container">
        <div
            class="controller"
            @mousemove="handleMouseMove"
            @mouseup="isMouseDown = false"
            @mouseleave="isMouseDown = false"
        >
            <div ref="$progress" @mousedown="handleMouseDown">
                <div :style="`--tall-width: ${progressWidth}%`"></div>
            </div>
        </div>
        <div class="icon">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.0"
                viewBox="0 0 75 75"
            >
                <path
                    d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
                />
                <path
                    :class="progressWidth === 0 ? 'hidden' : ''"
                    d="M48,27.6a19.5,19.5 0 0 1 0,21.4"
                />
                <path
                    :class="progressWidth < 33 ? 'hidden' : ''"
                    d="M55.1,20.5a30,30 0 0 1 0,35.6"
                />
                <path
                    :class="progressWidth < 66 ? 'hidden' : ''"
                    d="M61.6,14a38.8,38.8 0 0 1 0,48.6"
                />
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const isMouseDown = ref(false);

const $progress = ref<null | HTMLDivElement>(null);
const progressWidth = ref(100);
const progressLeft = computed(() =>
    $progress.value === null ? 0 : $progress.value.getBoundingClientRect().left,
);

function calcWidth(clientX: number) {
    const width = ((clientX - progressLeft.value) / 14) * 100;
    progressWidth.value = width > 100 ? 100 : width < 0 ? 0 : width;
}

function handleMouseDown(event: MouseEvent) {
    isMouseDown.value = true;

    const { clientX } = event;

    calcWidth(clientX);
}

function handleMouseMove(event: MouseEvent) {
    if (!isMouseDown.value) {
        return;
    }

    const { clientX } = event;

    calcWidth(clientX);
}
</script>

<style scoped>
.container {
    margin: 20px auto 0px auto;
    width: 50px;
    height: 240px;
    cursor: pointer;

    &:hover {
        .controller {
            visibility: visible;
        }
    }

    .icon {
        width: 50px;
        height: 50px;
        padding: 10px;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.8);

        > svg {
            width: 100%;
            height: 100%;

            > path {
                stroke: #fff;
                stroke-width: 5;
                stroke-linejoin: round;
                fill: none;

                &.hidden {
                    display: none;
                }

                &:first-child {
                    fill: #fff;
                }
            }
        }
    }

    .controller {
        visibility: hidden;
        width: 50px;
        height: 190px;
        background-color: rgba(0, 0, 0, 0.8);
        bottom: 50px;
        left: 0;
        padding: 16px 18px;

        > div {
            width: 100%;
            height: 100%;

            > div {
                width: var(--tall-width);
                height: 100%;
                background-color: #247c54;
            }
        }
    }
}
</style>
