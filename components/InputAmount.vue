<script setup>
import InputNumber from "@/volt/InputNumber.vue";
import Message from "@/volt/Message.vue";
const { label, decimals = 18, disabled = false, invalid=false } = defineProps(['label', 'symbol', 'decimals', 'disabled', 'invalid'])
const model = defineModel()

</script>
<template>
    <div class="flex flex-col gap-1">
        <label>{{ label }}</label>
    
        <InputNumber v-model="model" :disabled="disabled" :minFractionDigits="2" :maxFractionDigits="decimals" fluid />
         <Message v-if="invalid" size="small" severity="error" variant="simple">Invalid amount</Message>
   </div>
</template>