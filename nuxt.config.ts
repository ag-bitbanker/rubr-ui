// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: false },
    css: ["~/assets/css/main.css"],
    ssr: false,
    vite: {
        plugins: [tailwindcss()],
    },
    modules: ['@pinia/nuxt'],
    vue: {
        compilerOptions: {
            isCustomElement: (tag) => ['appkit-button','appkit-network-button'].includes(tag),
            
        }
    },
    runtimeConfig: {
        public: {
            //projectId: process.env.NUXT_PROJECT_ID
            projectId: "16ad44652fb08a15a5641b277dce355c"
        }
    }
});
