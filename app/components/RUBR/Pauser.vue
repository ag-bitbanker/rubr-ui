<script setup>
import Card from "@/volt/Card.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";
import Button from "@/volt/Button.vue";
import DangerButton from "@/volt/DangerButton.vue";
import OverlayBadge from '@/volt/OverlayBadge.vue';
import Badge from '@/volt/Badge.vue';
import TransactionResult from "@/components/TransactionResult.vue";
import { useRubrStore } from "@/stores/RUBR";
import { useWeb3Store } from "@/stores/web3";
import { useWeb3AccountStore } from "@/stores/web3Account";
const web3Store = useWeb3Store()
const web3AccountStore = useWeb3AccountStore()
const rubrStore = useRubrStore();
const { account } = storeToRefs(web3AccountStore);
const { openConnectModal } = web3Store;
const { contract, paused, pausedLoading } = storeToRefs(rubrStore);
const { updatePaused, pause, unpause } = rubrStore;
const txResult = ref();
const pauseRunning = ref(false);
const unpauseRunning = ref(false);

const pauseProtocol = async () => {
  if (unref(contract)) {
    try {
      pauseRunning.value = true;
      await nextTick();
      txResult.value = await pause();
    } finally {
      pauseRunning.value = false;
    }
  }
};

const unpauseProtocol = async () => {
  if (unref(contract)) {
    try {
      unpauseRunning.value = true;
      await nextTick();
      txResult.value = await unpause();
    } finally {
      unpauseRunning.value = false;
    }
  }
};
const badgeValue = computed(() => unref(pausedLoading) ? '...' : unref(paused) ? 'Paused' : 'Running')
const badgeSeverity = computed(() => unref(pausedLoading) ? 'secondary' : unref(paused) ? 'danger' : 'success')

const accountBadgeValue = computed(() =>
  unref(account)?.connected ? (unref(account)?.roles?.pauser ? "Role granted" : "Forbidden") : "Connect wallet"
);
const accountBadgeSeverity = computed(() =>
  unref(account)?.connected && unref(account)?.roles?.pauser ? "success" : "warn"
);
const accountBadgeClass = computed(() =>
  unref(account)?.connected ? 'translate-y-[-75%] whitespace-nowrap' : 'cursor-pointer translate-y-[-75%] whitespace-nowrap'
);
const connect = () => {
  if (!unref(account).connected) {
    openConnectModal()
  }
}
const disabled = computed(() => !unref(account)?.connected || !unref(account)?.roles?.pauser)

</script>
<template>
  <Card class="card-2" pt:body:class="px-0 pb-0 md:px-5 md:pb-5">
    <template #title>
      <div class="flex justify-between items-center gap-2 pb-4 pt-2">
        <OverlayBadge
          :value="accountBadgeValue" :severity="accountBadgeSeverity" size="small"
          :class="accountBadgeClass" @click="connect">
          Protocol pauser</OverlayBadge>
        <SecondaryButton
          icon="pi pi-refresh" size="small" :loading="pausedLoading" label="Refresh" rounded
          @click="updatePaused" />
      </div>

    </template>

    <template #content>
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap text-sm gap-y-2 gap-x-4">
          <div class="flex flex-row gap-2 items-center">
            <div class="text-md">Protocol is</div>
            <Badge :value="badgeValue" :severity="badgeSeverity" />
          </div>
          <DangerButton 
            class="min-w-32" icon="pi pi-pause-circle" label="Pause" :loading="pauseRunning"
            :disabled="disabled || !paused" @click="pauseProtocol" />

          <Button 
              class="min-w-32" icon="pi pi-play-circle" label="Resume" :loading="unpauseRunning"
            :disabled="disabled || paused" @click="unpauseProtocol" />

        </div>

        <TransactionResult :value="txResult" />
      </div>
    </template>
  </Card>
</template>
