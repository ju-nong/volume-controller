<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        viewBox="0 0 75 75"
        :class="isBlack ? 'black' : ''"
    >
        <path
            d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
        />
        <path
            :class="width === 0 ? 'hidden' : ''"
            d="M48,27.6a19.5,19.5 0 0 1 0,21.4"
        />
        <path
            :class="width < 33 ? 'hidden' : ''"
            d="M55.1,20.5a30,30 0 0 1 0,35.6"
        />
        <path
            :class="width < 66 ? 'hidden' : ''"
            d="M61.6,14a38.8,38.8 0 0 1 0,48.6"
        />
    </svg>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

const props = withDefaults(
    defineProps<{
        width: number;
        isBlack?: boolean;
    }>(),
    {
        isBlack: false,
    },
);
const { width, isBlack } = toRefs(props);
</script>

<style scoped>
svg {
    width: 100%;
    height: 100%;

    &.black {
        > path {
            stroke: #000;

            &:first-child {
                fill: #000;
            }
        }
    }

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
</style>
