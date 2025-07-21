<script setup>
import { parseEther } from "ethers";
import Card from "@/volt/Card.vue";
import DangerButton from "@/volt/DangerButton.vue";
import InputAmount from "~/components/InputAmount.vue";
import TransactionResult from "@/components/TransactionResult.vue";
import { useRubrStore } from "@/stores/RUBR";
const rubrStore = useRubrStore();
const { redeem, updateTotalSupply } = rubrStore;
const { contract } = storeToRefs(rubrStore);
const amount = ref();
const running = ref(false);
const invalidAmount = ref(false);
const decimals = ref(8);
const numerator = BigInt(10) ** BigInt(unref(decimals));
const denominator = BigInt(10) ** BigInt(18);
const txResult = ref();
const validate = () => {
  invalidAmount.value = isNaN(unref(amount)) || unref(amount) <= 0;
  return !unref(invalidAmount);
};

const execute = async () => {
  if (unref(contract) && validate()) {
    try {
      running.value = true;
      await nextTick();
      const biAmount =
        (parseEther(unref(amount).toString()) * numerator) / denominator;
      txResult.value = await redeem(biAmount);
      await updateTotalSupply()
    } finally {
      running.value = false;
    }
  }
};
const { disabled = false } = defineProps(['disabled'])
</script>
<template>
  <Card
    class="rounded-2xl mx-auto border border-surface-200 dark:border-surface-700 w-full shadow-none"
  >
    <template #title>
      <div class="flex justify-between items-center gap-2 text-sm">
        <span>Redeem</span>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-2 text-sm">
        
          <InputAmount
            symbol="RUBR"
            label="Amount"
            v-model="amount"
            :decimals="8"
            :disabled="!contract || running || disabled"
            :invalid="invalidAmount"
          />

       
        <div class="flex justify-normal gap-x-4 gap-y-2 pt-2">
          <DangerButton
            class="min-w-32"
            icon="pi pi-play"
            label="Execute"
             :disabled="!contract || running || disabled"
            :loading="running"
            @click="execute"
          />
         
          <TransactionResult :value="txResult" />
        </div>
      </div>
    </template>
  </Card>
</template>
