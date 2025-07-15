<script setup>
import Card from "@/volt/Card.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";
import Address from "@/components/Address.vue";
import Amount from "@/components/Amount.vue";
import Metadata from "@/components/RUBR/ERC20/Metadata.vue";
import Pauser from "./Pauser.vue";
import Compliance from "./Compliance.vue";
import Supplier from "./Supplier.vue";

import BalanceOf from "@/components/RUBR/ERC20/BalanceOf.vue";
import Allowance from "@/components/RUBR/ERC20/Allowance.vue";
import Approve from "@/components/RUBR/ERC20/Approve.vue";
import IncreaseApproval from "@/components/RUBR/ERC20/IncreaseApproval.vue";
import DecreaseApproval from "@/components/RUBR/ERC20/DecreaseApproval.vue";
import Transfer from "@/components/RUBR/ERC20/Transfer.vue";
import TransferFrom from "@/components/RUBR/ERC20/TransferFrom.vue";
import { useRubrStore } from "@/stores/RUBR";
const rubrStore = useRubrStore();
const { address, contract, totalSupply, totalSupplyLoading, metadataLoading } =
  storeToRefs(rubrStore);
const { updateTotalSupply, update } = rubrStore;
const loading = computed(
  () => unref(totalSupplyLoading) || unref(metadataLoading)
);
</script>
<template>
  <Card class="rounded-2xl max-w-7xl mx-auto border border-surface-200 dark:border-surface-700 w-full">
    <template #title>
      <div class="flex justify-between items-center gap-2 pb-4">
        <span>RUBR Contract</span>
        <SecondaryButton icon="pi pi-refresh" size="small" :disabled="!contract" label="Refresh" :loading="loading"
          rounded @click="update" />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 text-sm">
        <Address label="Contract address" :address="address" />
        <Amount :disabled="!contract || totalSupplyLoading" symbol="RUBR" :value="totalSupply" label="Total supply"
          :decimals="8" @update="updateTotalSupply" :loading="totalSupplyLoading" />
        <Metadata />
        <Card class="rounded-2xl mx-auto border border-surface-200 dark:border-surface-700 w-full shadow-none">
          <template #title>
            <div class="flex justify-between items-center gap-2 pb-4">
              <span class="text-green-700 dark:text-green-500">ERC20 Read Operations</span>
            </div>
          </template>
          <template #content>
            <div class="flex flex-col gap-4 text-sm">
              <BalanceOf />
              <Allowance />
            </div>
          </template>
        </Card>
        <Card class="rounded-2xl mx-auto border border-surface-200 dark:border-surface-700 w-full shadow-none">
          <template #title>
            <div class="flex justify-between items-center gap-2 pb-4">
              <span class="text-red-700 dark:text-red-500">ERC20 Write Operations</span>
            </div>
          </template>
          <template #content>
            <div class="flex flex-col gap-4 text-sm">
              <Approve />
              <IncreaseApproval />
              <DecreaseApproval />
              <Transfer />
              <TransferFrom />

            </div>
          </template>
        </Card>
        <Pauser />
        <Compliance />
        <Supplier />

      </div>
    </template>
  </Card>
</template>
