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
    <Card class="card-2" pt:body:class="px-0 pb-0 md:px-5 md:pb-5">
        <template #title>
            <div class="flex justify-between items-center gap-2 text-sm">
                <div>ERC20 Metadata</div>
                <SecondaryButton
icon="pi pi-refresh" size="small" :loading="metadataLoading" label="Refresh"
                    rounded @click="updateMetadata" />
            </div>
        </template>
        <template #content>
            
            <div class="grid gap-x-4 gap-y-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 text-sm">
                <Updatable
:value="decimals" label="Decimals" :loading="decimalsLoading"
                    @update="updateDecimals" />
                <Updatable :value="symbol" label="Symbol" :loading="symbolLoading" @update="updateSymbol" />
                <Updatable
class="md:col-span-2 xl:col-span-1" :value="name" label="Name" :loading="nameLoading"
                    @update="updateName" />

            </div>
        </template>
    </Card>
</template>
