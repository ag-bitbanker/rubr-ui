<script setup>
import Message from "@/volt/Message.vue";
import { useWeb3Store } from "@/stores/web3";
import { TransactionReceipt } from "ethers";
const web3Store = useWeb3Store();
const { explorerTxUrl } = web3Store;

const count = ref(0);

const success = (hash) => ({
  id: count.value++,
  icon: "pi pi-check-circle",
  severity: "success",
  prefix: "TxHash:",
  content: hash,
  url: explorerTxUrl(hash),
});

const revert = (error) => ({
  id: count.value++,
  icon: "pi pi-times-circle",
  severity: "error",
  prefix: "Error:",
  content: error,
});

const { value = undefined } = defineProps({ value: [TransactionReceipt,Error, undefined] })
const msg = computed(() => {
  if (value instanceof TransactionReceipt) {
    return [success(value.hash)]
  } else if (value instanceof Error) {
    return [revert(value.message)]
  }
  return []
});

</script>
<template>

  <Message 
    v-for="m of msg" ref="msg" :key="m.id" closable class="w-full" size="small" :severity="m.severity" :life="50000">
    <span class="pr-1 font-bold">{{ m.prefix }}</span>
    <a v-if="m.url" :href="m.url">{{ m.content }}</a>
    <span v-else class="truncate">{{ m.content }}</span>
  </Message>
</template>
