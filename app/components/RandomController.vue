<template>
    <div class="container">
        <div>
            <button @click="handleChangeVolume">🎲</button>
            <p class="volume">Volume: {{ volume }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const volume = ref(0);

function handleChangeVolume() {
    volume.value = Math.floor(Math.random() * 101);
}
</script>

<style scoped>
.container {
    height: 240px;
    margin: 0 auto;
    display: flex;
    align-items: center;

    > div {
        position: relative;
        > button {
            font-size: 24px;
            cursor: pointer;
            padding: 8px 16px;
            border: 1px solid #ccc;
            font-weight: 500;
            background-color: #e1e1e1;

            &:hover {
                background-color: #eee;
            }

            &:active {
                background-color: #ccc;
            }
        }

        > p {
            top: 50%;
            left: 0;
            transform: translate(-110%, -50%);
        }
    }
}
</style>
