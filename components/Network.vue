<script setup>
import Card from "@/volt/Card.vue";
import Badge from "@/volt/Badge.vue";
import InputText from "@/volt/InputText.vue";
import Address from "@/components/Address.vue";
import { useWeb3Store } from "@/stores/web3";
import { useWeb3AccountStore } from "@/stores/web3Account";
const web3Store = await useWeb3Store();
const { network } = storeToRefs(web3Store);
const web3AccountStore = await useWeb3AccountStore();
</script>
<template>
  <Card class="rounded-2xl max-w-7xl mx-auto border border-surface-200 dark:border-surface-700 w-full">
    <template #title>
      <div class="flex justify-between items-center gap-2 pb-4">
        <div class="flex justify-start items-center gap-2">
          Network
          <ClientOnly> <appkit-network-button /> </ClientOnly>
        </div>
        <div v-if="network.chainId">
          <Badge value="Testnet" severity="success" v-if="network.testnet" />
          <Badge value="Mainnet" severity="warn" v-else />
        </div>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!--
          <Address label="RUBR contract address" :address="addresses?.RUBR" />
          <Address label="Treasury wallet address" :address="addresses?.treasury" />-->
        </div>
      </div>

    </template>
  </Card>
</template>
