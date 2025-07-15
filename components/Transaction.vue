<script setup>
import { useWeb3Store } from "@/stores/web3";
import { useClipboard } from '@vueuse/core'
import InputText from "@/volt/InputText.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";
const { copy } = useClipboard()
const web3Store = useWeb3Store();
const { explorerUrl } = web3Store;
const { label, transaction } = defineProps(['label', 'transaction'])
const url = computed(() => explorerUrl(transaction))
</script>
<template>
    <div class="flex flex-col gap-1">
        <label>{{ label }}</label>
        <div class="flex items-stretch flex-auto">
            <InputText readonly pt:root="flex-1 rounded-s-md rounded-e-none" :value="transaction"
                aria-describedby="account" />
            <span
                class="flex items-center justify-center border-y border-e border-surface-300 dark:border-surface-700 overflow-hidden">
                <SecondaryButton icon="pi pi-copy" variant="text" pt:root="rounded-none" :disabled="!address"
                    @click="copy(transaction)" />
            </span>
            <span
                class="flex items-center justify-center border-y border-e border-surface-300 dark:border-surface-700 rounded-e-md overflow-hidden">
                <SecondaryButton icon="pi pi-external-link" variant="text" :disabled="!url"
                    pt:root="rounded-none" :href="url" target="_blank" rel="noopener" as="a"/>
            </span>
           
        </div>
    </div>
</template>