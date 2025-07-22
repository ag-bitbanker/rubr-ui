// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: false },
    srcDir: "./app",
    css: ["~/assets/css/main.css"],
    ssr: false,
    vite: {
        plugins: [tailwindcss()],
    },
    modules: ['@pinia/nuxt', "@nuxt/eslint"],
    vue: {
        compilerOptions: {
            isCustomElement: (tag) => ['appkit-button','appkit-network-button'].includes(tag),
            
        }
    },
    runtimeConfig: {
        public: {
            projectId: process.env.REOWN_PROJECT_ID
        }
    }
});