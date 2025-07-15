<script setup>
import { formatEther } from 'ethers';
import InputText from "@/volt/InputText.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";



const { label, value, symbol, decimals = 18, loading = false, disabled = false } = defineProps(['label', 'value', 'symbol', 'decimals', 'loading', 'disabled'])
const emit = defineEmits(['update'])
const formattingOptions = computed(() => ({ minimumFractionDigits: 2, maximumFractionDigits: unref(decimals) }))
const valueBN = computed(() => value === undefined ? value : decimals == 18 ? BigInt(value) : BigInt(value) * BigInt(10) ** BigInt(18 - decimals))
const formatted = computed(() => valueBN.value === undefined ? '' : Number(formatEther(unref(valueBN))).toLocaleString('en', unref(formattingOptions)))
</script>
<template>
    <div class="flex flex-col gap-1">
        <label>{{ label }}</label>
        <div class="flex items-stretch flex-auto">
            <span
                class="w-14 flex items-center justify-center border-y border-s border-surface-300 dark:border-surface-700 rounded-s-md overflow-hidden">{{
                    symbol }}</span>
            <InputText :value="formatted" readonly pt:root="flex-1 rounded-s-none rounded-e-none"
                aria-describedby="amount" :disabled="loading || disabled" />

            <span
                class="flex items-center justify-center border-y border-e border-surface-300 dark:border-surface-700 rounded-e-md overflow-hidden">
                <SecondaryButton icon="pi pi-refresh" variant="text" :disabled="disabled" pt:root="rounded-none"
                    @click=" emit('update')" :loading="loading" />

            </span>
        </div>
    </div>
</template>