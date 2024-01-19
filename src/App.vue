<template>
    <div class="wrap">
        <TallController />
        <SlopeController />
    </div>
</template>

<script setup lang="ts">
import { TallController, SlopeController } from "./components";
</script>

<style scoped>
.wrap {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    justify-content: center;
}
</style>
