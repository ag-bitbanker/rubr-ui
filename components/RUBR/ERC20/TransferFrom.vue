<script setup>
import { parseEther } from "ethers";
import Card from "@/volt/Card.vue";
import DangerButton from "@/volt/DangerButton.vue";
import InputAmount from "~/components/InputAmount.vue";
import InputAddress from "@/components/InputAddress.vue";
import TransactionResult from "@/components/TransactionResult.vue";
import { useWeb3Store } from "@/stores/web3";
import { useRubrStore } from "@/stores/RUBR";

const web3Store = useWeb3Store();
const rubrStore = useRubrStore();
const { isValidAddress } = web3Store;
const { transferFrom } = rubrStore;
const { contract } = storeToRefs(rubrStore);
const addressFrom = ref();
const addressTo = ref();
const amount = ref();
const running = ref(false);
const invalidAddressFrom = ref(false);
const invalidAddressTo = ref(false);
const invalidAmount = ref(false);
const decimals = ref(8);
const numerator = BigInt(10) ** BigInt(unref(decimals));
const denominator = BigInt(10) ** BigInt(18);
const txResult = ref();

const validate = () => {
  invalidAddressFrom.value = !isValidAddress(unref(addressFrom));
  invalidAddressTo.value = !isValidAddress(unref(addressTo));
  invalidAmount.value = isNaN(unref(amount)) || unref(amount) <= 0;
  return !(
    unref(invalidAddressFrom) ||
    unref(invalidAddressTo) ||
    invalidAmount.value
  );
};
const execute = async () => {
  if (unref(contract) && validate()) {
    try {
      running.value = true;
      await nextTick();
      const biAmount =
        (parseEther(unref(amount).toString()) * numerator) / denominator;
      txResult.value = await transferFrom(unref(addressFrom), unref(addressTo), biAmount);
    } finally {
      running.value = false;
    }
  }
};
const { disabled = false } = defineProps(['disabled'])
</script>
<template>
  <Card class="card shadow-none">
    <template #title>

      <span class="text-sm">Transfer From</span>

    </template>
    <template #content>
      <div class="flex flex-col  gap-2 text-sm">

        <InputAddress :disabled="!contract || running || disabled" v-model="addressFrom" label="From (address)"
          :invalid="invalidAddressFrom" />
        <InputAddress :disabled="!contract || running || disabled" v-model="addressTo" label="To (address)"
          :invalid="invalidAddressTo" />
        <InputAmount class="lg:col-span-2 xl:col-span-1" symbol="RUBR" label="Amount" v-model="amount" :decimals="8"
          :disabled="!contract || running || disabled" :invalid="invalidAmount" />

        <div class="flex justify-normal gap-x-4 gap-y-2 text-sm pt-2">
          <DangerButton class="min-w-32" icon="pi pi-play" label="Execute" :loading="running"
            :disabled="!contract || running || disabled" @click="execute" />

          <TransactionResult :value="txResult" />
        </div>
      </div>
    </template>
  </Card>
</template>
