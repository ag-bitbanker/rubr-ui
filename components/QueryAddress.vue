<script setup>
import { useWeb3Store } from "@/stores/web3";
import { useClipboard } from '@vueuse/core'
import InputText from "@/volt/InputText.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";
import Button from "@/volt/Button.vue";
import Message from "@/volt/Message.vue";
import { useWeb3AccountStore } from "@/stores/web3Account";
const web3AccountStore = useWeb3AccountStore();
const { account } = storeToRefs(web3AccountStore)
const { copy } = useClipboard()
const web3Store = useWeb3Store();
const { explorerUrl, addresses } = web3Store;
const { label, disabled, invalid = false, loading = false } = defineProps(['label', 'disabled', 'invalid', 'loading'])

const model = defineModel()
const url = computed(() => explorerUrl(model))
const emit = defineEmits(['query'])
</script>
<template>
    <div class="flex flex-col">
        <div class="flex flex-row items-center justify-between">
            <label>{{ label }}</label>
            <div class="flex flex-row items-center">
                <SecondaryButton v-if="account?.address" variant="text" label="My wallet" size="small"
                    @click="model = account.address" />
                <SecondaryButton v-if="addresses?.treasury" variant="text" label="Treasury" size="small"
                    @click="model = addresses.treasury" />
            </div>
        </div>
        <div class="flex items-stretch flex-auto">
            <div class="flex flex-col flex-1">

                <InputText pt:root="rounded-s-md rounded-e-none" v-model="model" aria-describedby="account"
                    :disabled="disabled" />
            </div>
            <span
                class="flex items-center justify-center border-y border-e border-surface-300 dark:border-surface-700 overflow-hidden">
                <SecondaryButton icon="pi pi-copy" variant="text" pt:root="rounded-none" :disabled="!model"
                    @click="copy(model)" />
            </span>
            <span
                class="flex items-center justify-center border-y border-e border-surface-300 dark:border-surface-700 rounded-e-md overflow-hidden">
                <SecondaryButton icon="pi pi-external-link" variant="text" :disabled="!url" pt:root="rounded-none"
                    :href="url" target="_blank" rel="noopener" as="a" />
            </span>
            <Button icon="pi pi-search" class="min-w-32 ml-2" label="Query" @click="emit('query')" :loading="loading" />
        </div>
        <Message v-if="invalid" size="small" severity="error" variant="simple">Invalid address</Message>
    </div>
</template>