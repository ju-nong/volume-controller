<template>
    <div class="container">
        <p>Current Volume Level: {{ volume }}%</p>

        <button @click="handleChangeVolume">Change</button>
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
    font-size: 20px;
    font-weight: 600;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    > button {
        cursor: pointer;
        padding: 8px 16px;
        border: 1px solid #ccc;
        font-weight: 500;
        margin-top: 40px;
        background-color: #e1e1e1;

        &:hover {
            background-color: #eee;
        }

        &:active {
            background-color: #ccc;
        }
    }
}
</style>
