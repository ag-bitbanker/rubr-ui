<script setup>
import Card from "@/volt/Card.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";
import Updatable from "@/components/Updatable.vue";

import { useRubrStore } from "@/stores/RUBR";

const rubrStore = useRubrStore();
const { symbol, name, decimals, symbolLoading, nameLoading, decimalsLoading, metadataLoading } = storeToRefs(rubrStore)
const { updateMetadata, updateName, updateSymbol, updateDecimals } = rubrStore;

</script>
<template>
    <Card class="card shadow-none">
        <template #title>
            <div class="flex justify-between items-center gap-2 text-sm">
                <span>ERC20 Metadata</span>
                <SecondaryButton icon="pi pi-refresh" size="small" :loading="metadataLoading" @click="updateMetadata"
                    label="Refresh" rounded />
            </div>
        </template>
        <template #content>
            
            <div class="grid gap-x-4 gap-y-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 text-sm">
                <Updatable :value="decimals" label="Decimals" @update="updateDecimals"
                    :loading="decimalsLoading" />
                <Updatable :value="symbol" label="Symbol" @update="updateSymbol" :loading="symbolLoading" />
                <Updatable class="md:col-span-2 xl:col-span-1" :value="name" label="Name" @update="updateName"
                    :loading="nameLoading" />

            </div>
        </template>
    </Card>
</template>
