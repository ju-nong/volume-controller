<template>
    <div class="container">
        <button @mousedown="handleMouseDown">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.0"
                viewBox="0 0 75 75"
                :style="`--cannon-deg: ${degree}deg;`"
                :class="isMouseDown ? '' : 'stop'"
            >
                <path
                    d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
                />
                <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4" />
                <path d="M55.1,20.5a30,30 0 0 1 0,35.6" />
            </svg>
        </button>

        <div>
            <span
                :class="isMouseDown ? 'hidden' : ''"
                :style="`--point-top: ${pointTop}px; --point-left: ${pointLeft}%;`"
            ></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isMouseDown = ref(false);
const degree = ref(0);

const pointTop = ref(0);
const pointLeft = ref(0);

function setDegree() {
    if (isMouseDown.value) {
        const afterDegree = degree.value - 1;

        if (!(afterDegree < -45)) {
            degree.value = afterDegree;

            requestAnimationFrame(setDegree);
        }
    }
}

function handleMouseUp() {
    isMouseDown.value = false;
    degree.value = 0;

    document.removeEventListener("mouseup", handleMouseUp);
}

function handleMouseDown() {
    isMouseDown.value = true;

    document.addEventListener("mouseup", handleMouseUp);

    requestAnimationFrame(setDegree);
}
</script>

<style scoped>
.container {
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 5px;

    > button {
        width: 40px;
        height: 40px;
        background-color: transparent;
        cursor: pointer;

        > svg {
            width: 100%;
            height: 100%;
            transform-origin: left center;
            transform: rotate(var(--cannon-deg));

            &.stop {
                transition: all 0.3s;
            }

            > path {
                stroke: #ccc;
                stroke-width: 5;
                stroke-linejoin: round;
                fill: none;

                &:first-child {
                    fill: #ccc;
                }
            }
        }
    }

    > div {
        width: 100px;
        height: 3px;
        background-color: #e1e1e1;
        position: relative;

        span {
            width: 9px;
            height: 9px;
            border-radius: 100%;
            background-color: #623897;
            position: absolute;
            transform: translate(-50%);
            top: calc(var(--point-top) - 3px);
            left: var(--point-left);

            &.hidden {
                opacity: 0;
            }
        }
    }
}
</style>
