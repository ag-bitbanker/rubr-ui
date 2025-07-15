<script setup>
import Card from "@/volt/Card.vue";
import Issue from "./Issue.vue";
import Redeem from "./Redeem.vue";
import { useRubrStore } from "@/stores/RUBR";
const rubrStore = useRubrStore();
const { contract, totalSupply, totalSupplyLoading } = storeToRefs(rubrStore);
const {updateTotalSupply} = rubrStore;
</script>
<template>
  <Card class="rounded-2xl mx-auto border border-surface-200 dark:border-surface-700 w-full shadow-none">
    <template #title>
      <div class="flex justify-between items-center gap-2 pb-4">
        <span>Supply liquidity</span>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4">
        <Amount :disabled="!contract || totalSupplyLoading" symbol="RUBR" :value="totalSupply" label="Total supply"
          :decimals="8" @update="updateTotalSupply" :loading="totalSupplyLoading" />
        <Issue />
        <Redeem />
      </div>

    </template>
  </Card>
</template>
