<script setup>
import InputNumber from "@/volt/InputNumber.vue";
import Message from "@/volt/Message.vue";
const { label='', decimals = 18, disabled = false, invalid = false } = defineProps({ 
    label: String, 
    decimals: Number, 
    disabled: Boolean, 
    invalid: Boolean 
})
const model = defineModel({ type: Number })

</script>
<template>
    <div class="flex flex-col gap-1">
        <label>{{ label }}</label>

        <InputNumber 
            v-model="model" :disabled="disabled" :min-fraction-digits="2" :max-fraction-digits="decimals" fluid />
        <Message v-if="invalid" size="small" severity="error" variant="simple">Invalid amount</Message>
    </div>
</template>