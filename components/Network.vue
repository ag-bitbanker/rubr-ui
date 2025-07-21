<script setup>
import Card from "@/volt/Card.vue";
import OverlayBadge from "@/volt/OverlayBadge.vue";
import InputText from "@/volt/InputText.vue";
import { useWeb3Store } from "@/stores/web3";
import Address from "@/components/Address.vue";
const web3Store = await useWeb3Store();
const { network, addresses } = storeToRefs(web3Store);
const badgeValue = computed(() => unref(network)?.testnet ? 'Testnet' : 'Mainnet')
const badgeSeverity = computed(() => unref(network)?.testnet ? 'success' : 'warn')

</script>
<template>
  <Card class="card">
    <template #title>
      <div class="flex justify-between items-center gap-2 pb-4 pt-2">
        <OverlayBadge :value="badgeValue" :severity="badgeSeverity" size="small" class="translate-y-[-75%]">Network
        </OverlayBadge>
        <ClientOnly> <appkit-network-button /> </ClientOnly>
      </div>
    </template>

    <template #content>
      <div class="grid gap-4 text-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex flex-col gap-1">
            <label for="network">Network ID</label>
            <InputText id="network" readonly :value="network.chainId" aria-describedby="network-id" />
          </div>
          <div class="flex flex-col gap-1">
            <label>Currency</label>
            <InputText readonly :value="network.currency?.name" aria-describedby="currency" />
          </div>
          <div class="flex flex-col gap-1">
            <label for="symbol">Symbol</label>
            <InputText readonly :value="network.currency?.symbol" aria-describedby="symbol" />
          </div>
          <div class="flex flex-col gap-1">
            <label for="symbol">Decimals</label>
            <InputText readonly :value="network.currency?.decimals" aria-describedby="decimals" />
          </div>
        </div>
        <Card class="card shadow-none">
          <template #title><div class="text-sm pb-2">Well known addresses</div></template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Address label="RUBR  address" :address="addresses?.RUBR" />
              <Address label="Treasury address" :address="addresses?.treasury" />
            </div>
          </template>
        </Card>
      </div>
    </template>
  </Card>
</template>
