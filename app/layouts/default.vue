<script setup>
import AppTopbar from "@/components/AppTopbar.vue";
import AppFooter from "@/components/AppFooter.vue";

</script>
<template>
    <div class="bg-surface-0 dark:bg-surface-950 max-w-5xl mx-auto min-h-screen p-2 md:p-8 flex flex-col gap-4 md:gap-6">
        <AppTopbar/>
            <slot/>
        <AppFooter/>
    </div>
</template>    