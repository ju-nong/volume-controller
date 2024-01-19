<template>
    <div class="container">
        <button>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.0"
                viewBox="0 0 75 75"
            >
                <path
                    d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
                />
                <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4" />
                <path d="M55.1,20.5a30,30 0 0 1 0,35.6" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.container {
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;

    > button {
        width: 40px;
        height: 40px;
        background-color: transparent;
        cursor: pointer;

        > svg {
            width: 100%;
            height: 100%;

            > path {
                stroke: rgba(0, 0, 0, 0.2);
                stroke-width: 5;
                stroke-linejoin: round;
                fill: none;

                &:first-child {
                    fill: rgba(0, 0, 0, 0.2);
                }
            }
        }
    }
}
</style>
