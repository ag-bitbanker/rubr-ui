<script setup>
import Card from "@/volt/Card.vue";
import OverlayBadge from "@/volt/OverlayBadge.vue";
import Issue from "./Issue.vue";
import Redeem from "./Redeem.vue";
import { useRubrStore } from "@/stores/RUBR";
import { useWeb3Store } from "@/stores/web3";
import { useWeb3AccountStore } from "@/stores/web3Account";
const web3Store = useWeb3Store()
const web3AccountStore = useWeb3AccountStore()
const rubrStore = useRubrStore();
const { contract, totalSupply, totalSupplyLoading } = storeToRefs(rubrStore);
const { updateTotalSupply } = rubrStore;

const { account } = storeToRefs(web3AccountStore);
const { openConnectModal } = web3Store;

const accountBadgeValue = computed(() =>
  unref(account)?.connected ? (unref(account)?.roles?.supplier ? "Role granted" : "Forbidden") : "Connect wallet"
);
const accountBadgeSeverity = computed(() =>
  unref(account)?.connected && unref(account)?.roles?.supplier ? "success" : "warn"
);
const accountBadgeClass = computed(() =>
  unref(account)?.connected ? 'translate-y-[-75%] whitespace-nowrap' : 'cursor-pointer translate-y-[-75%] whitespace-nowrap'
);
const connect = () => {
  if (!unref(account).connected) {
    openConnectModal()
  }
}
const disabled = computed(() => !unref(account)?.connected || !unref(account)?.roles?.supplier)

</script>
<template>
  <Card class="card-2" pt:body:class="px-0 pb-0 md:px-5 md:pb-5">
    <template #title>
      <div class="flex justify-between items-center gap-2 pb-4 pt-2">
        <OverlayBadge
:value="accountBadgeValue" :severity="accountBadgeSeverity" size="small" :class="accountBadgeClass"
          @click="connect">
          Supply liquidity</OverlayBadge>

      </div>

    </template>
    <template #content>
      <div class="flex flex-col gap-4">
        <Amount
:disabled="!contract || totalSupplyLoading" symbol="RUBR" :value="totalSupply" label="Total supply"
          :decimals="8" :loading="totalSupplyLoading" @update="updateTotalSupply" />
        <Issue :disabled="disabled" />
        <Redeem :disabled="disabled" />
      </div>

    </template>
  </Card>
</template>
