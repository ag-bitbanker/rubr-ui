<script setup>
import { useWeb3Store } from "@/stores/web3";
import { useClipboard } from '@vueuse/core'
import InputText from "@/volt/InputText.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";
import ContrastButton from "@/volt/ContrastButton.vue";
import Button from "@/volt/Button.vue";
import Message from "@/volt/Message.vue";
import { useWeb3AccountStore } from "@/stores/web3Account";
const web3AccountStore = useWeb3AccountStore();
const { account } = storeToRefs(web3AccountStore)
const { copy } = useClipboard()
const web3Store = useWeb3Store();
const { explorerUrl } = web3Store;

const { addresses } = storeToRefs(web3Store)
const { label= '', disabled= false, invalid = false, loading = false } = defineProps({
    label: String,
    disabled: Boolean,
    invalid: Boolean,
    loading: Boolean
})

const model = defineModel({ type: String })
const url = computed(() => explorerUrl(model))
const emit = defineEmits(['query'])
</script>
<template>
    <div class="flex flex-col">
        <div class="flex flex-row items-center justify-between">
            <label>{{ label }}</label>
            <div class="flex flex-row items-center">
                <Button 
                    v-if="account?.address" variant="text" pt:root:class="p-small:p-small:py-[0.175rem]"
                    label="My wallet" size="small" @click="model = account.address" />
                <ContrastButton 
                    v-if="addresses?.treasury" variant="text" pt:root:class="p-small:p-small:py-[0.175rem]"
                    label="Treasury" size="small" @click="model = addresses.treasury" />
            </div>
        </div>
        <div class="flex items-stretch flex-auto">
            <div class="flex flex-col flex-1">

                <InputText 
                    v-model="model" pt:root="rounded-s-md rounded-e-none" aria-describedby="account"
                    :disabled="disabled" />
            </div>
            <span class="flex items-center justify-center border-y border-e border-surface-300 dark:border-surface-700">
                <SecondaryButton 
                    icon="pi pi-copy" variant="text" pt:root="rounded-none" :disabled="!model"
                    @click="copy(model)" />
            </span>
            <span class="flex items-center justify-center border-y border-e border-surface-300 dark:border-surface-700">
                <SecondaryButton 
                    icon="pi pi-external-link" variant="text" :disabled="!url" pt:root="rounded-none"
                    :href="url" target="_blank" rel="noopener" as="a" />
            </span>
            <span
                class="flex items-center justify-center border-y border-e border-surface-300 dark:border-surface-700 rounded-e-md">
                <Button 
                    icon="pi pi-search" variant="text" class="md:min-w-32" pt:root="rounded-none" label="Query"
                    :loading="loading" @click="emit('query')" />
            </span>
        </div>
        <Message v-if="invalid" size="small" severity="error" variant="simple">Invalid address</Message>
    </div>
</template>