// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ["~/assets/css/style.css"],
    runtimeConfig: {
        canvasApiBaseUrl: process.env.CANVAS_API_BASE_URL,
    },
});
