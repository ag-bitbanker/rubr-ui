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
const { decreaseApproval } = rubrStore;
const { contract } = storeToRefs(rubrStore);
const address = ref();
const amount = ref();
const running = ref(false);
const invalidAddress = ref(false);
const invalidAmount = ref(false);
const decimals = ref(8);
const numerator = BigInt(10) ** BigInt(unref(decimals));
const denominator = BigInt(10) ** BigInt(18);
const txResult = ref();

const validate = () => {
  invalidAddress.value = !isValidAddress(unref(address));
  invalidAmount.value = isNaN(unref(amount)) || unref(amount) <= 0;
  return !(unref(invalidAddress) || unref(invalidAmount));
};

const execute = async () => {
  if (unref(contract) && validate()) {
    try {
      running.value = true;
      await nextTick();
      const biAmount =
        (parseEther(unref(amount).toString()) * numerator) / denominator;
      txResult.value = await decreaseApproval(unref(address), biAmount);
    } finally {
      running.value = false;
    }
  }
};
const { disabled = false } = defineProps({disabled:Boolean})
</script>
<template>
  <Card class="card-2" pt:body:class="px-0 pb-0 md:px-5 md:pb-5">
    <template #title>

      <div class="text-sm">Decrease Approval</div>

    </template>
    <template #content>
      <div class="flex flex-col gap-2 text-sm">

        <InputAddress
v-model="address" :disabled="!contract || running || disabled" label="Spender (address)"
          :invalid="invalidAddress" />
        <InputAmount
v-model="amount" symbol="RUBR" label="Substracted amount" :decimals="8"
          :disabled="!contract || running || disabled" :invalid="invalidAmount" />

        <div class="flex justify-normal gap-x-4 gap-y-2 text-sm pt-2">
          <DangerButton
class="min-w-32" icon="pi pi-play" label="Execute" :loading="running" :disabled="!contract || running || disabled"
            @click="execute" />

          <TransactionResult :value="txResult" />
        </div>
      </div>
    </template>
  </Card>
</template>
