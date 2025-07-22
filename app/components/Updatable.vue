<script setup>
import InputText from "@/volt/InputText.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";

const { value='', loading = false, disabled = false, label=''  } = defineProps({
    value:String, 
    loading: Boolean, 
    disabled:Boolean, 
    label:String
})
const emit = defineEmits(['update'])

</script>
<template>
    <div class="flex flex-col gap-1">
        <label>{{label}}</label>
        <div class="flex items-stretch flex-auto">
             <InputText
                :value="value" readonly pt:root="flex-1 rounded-s-md rounded-e-none"
                :disabled="loading || disabled" />

            <span
                class="flex items-center justify-center border-y border-e border-surface-300 dark:border-surface-700 rounded-e-md overflow-hidden">
                <SecondaryButton
                    icon="pi pi-refresh" variant="text" :disabled="disabled" pt:root="rounded-none"
                    :loading="loading" @click=" emit('update')"/>

            </span>
        </div>
    </div>
</template>