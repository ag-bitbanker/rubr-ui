<script setup>
import Card from "@/volt/Card.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";
import Address from "@/components/Address.vue";
import Amount from "@/components/Amount.vue";
import Metadata from "@/components/RUBR/ERC20/Metadata.vue";
import Pauser from "./Pauser.vue";
import Compliance from "./Compliance.vue";
import Supplier from "./Supplier.vue";
import OverlayBadge from "@/volt/OverlayBadge.vue";
import BalanceOf from "@/components/RUBR/ERC20/BalanceOf.vue";
import Allowance from "@/components/RUBR/ERC20/Allowance.vue";
import Approve from "@/components/RUBR/ERC20/Approve.vue";
import IncreaseApproval from "@/components/RUBR/ERC20/IncreaseApproval.vue";
import DecreaseApproval from "@/components/RUBR/ERC20/DecreaseApproval.vue";
import Transfer from "@/components/RUBR/ERC20/Transfer.vue";
import TransferFrom from "@/components/RUBR/ERC20/TransferFrom.vue";
import { useWeb3Store } from "@/stores/web3";
import { useRubrStore } from "@/stores/RUBR";
import { useWeb3AccountStore } from "@/stores/web3Account";
const web3Store = useWeb3Store()
const rubrStore = useRubrStore();
const accountStore = useWeb3AccountStore()
const {openConnectModal} = web3Store;
const { address, contract, totalSupply, totalSupplyLoading, metadataLoading } =
  storeToRefs(rubrStore);
const {account} = storeToRefs(accountStore)  
const { updateTotalSupply, update } = rubrStore;
const loading = computed(
  () => unref(totalSupplyLoading) || unref(metadataLoading)
);

const badgeERC20WriteValue = computed(() =>
    unref(account)?.connected ? "Enabled" : "Connect wallet"
);
const badgeERC20WriteSeverity = computed(() =>
    unref(account)?.connected ? "success" : "warn"
);
const badgeERC20WriteClass = computed(() =>
    unref(account)?.connected ? 'translate-y-[-100%] whitespace-nowrap' : 'cursor-pointer translate-y-[-100%] whitespace-nowrap'
);
const connect = () => {
   if ( !unref(account).connected) {
    openConnectModal()
   }
}

</script>
<template>
  <Card class="card">
    <template #title>
      <div class="flex justify-between items-center gap-2 pb-4">
        <span>RUBR Contract</span>
        <SecondaryButton
icon="pi pi-refresh" size="small" :disabled="!contract" label="Refresh" :loading="loading"
          rounded @click="update" />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 text-sm">
        <Address label="Contract address" :address="address" />
        <Amount
:disabled="!contract || totalSupplyLoading" symbol="RUBR" :value="totalSupply" label="Total supply"
          :decimals="8" :loading="totalSupplyLoading" @update="updateTotalSupply" />
        <Metadata />
        <Card class="card-2" pt:body:class="px-0 pb-0 md:px-5 md:pb-5">
          <template #title>
            <div class="text-green-700 dark:text-green-500 text-sm pb-2">ERC20 Read Operations</div>
          </template>
          <template #content>
            <div class="flex flex-col gap-4 text-sm">
              <BalanceOf />
              <Allowance />
            </div>
          </template>
        </Card>
        <Card class="card-2" pt:body:class="px-0 pb-0 md:px-5 md:pb-5">
          <template #title>
            <div class="flex justify-between items-center gap-2 pb-4 pt-3">
               <OverlayBadge :value="badgeERC20WriteValue" :severity="badgeERC20WriteSeverity" size="small" :class="badgeERC20WriteClass" @click="connect">
                    <div class="text-red-700 dark:text-red-500 text-sm">ERC20 Write Operations</div>
                </OverlayBadge>
             </div>
          </template>
          <template #content>
            <div class="flex flex-col gap-4 text-sm">
              <Approve :disabled="!account?.connected"/>
              <IncreaseApproval :disabled="!account?.connected"/>
              <DecreaseApproval :disabled="!account?.connected"/>
              <Transfer :disabled="!account?.connected"/>
              <TransferFrom :disabled="!account?.connected"/>

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
