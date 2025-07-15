<script setup>
import { formatEther } from 'ethers';
import InputNumber from "@/volt/InputText.vue";
import Button from "@/volt/Button.vue";

const { label, value, symbol, decimals = 18, loading = false, disabled = false} = defineProps(['label', 'value', 'symbol', 'decimals', 'loading', 'disabled'])
const emit = defineEmits(['query'])
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
            <InputNumber :value="formatted" readonly pt:root="flex-1 rounded-s-none rounded-e-none"
                aria-describedby="balance" :disabled="loading" />

            <span
                class="flex items-center justify-center border-y border-e border-surface-300 dark:border-surface-700 rounded-e-md overflow-hidden">
                 <Button icon="pi pi-refresh"  :disabled="disabled" pt:root="rounded-none"
                    @click="emit('query')" :loading="loading" />
               
            </span>
        </div>
    </div>
</template>