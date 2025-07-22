<script setup>
import Card from "@/volt/Card.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";
import Button from "@/volt/Button.vue";
import DangerButton from "@/volt/DangerButton.vue";
import SelectButton from '@/volt/SelectButton.vue';
import OverlayBadge from '@/volt/OverlayBadge.vue';
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
const state = computed(() => unref(paused) ? 'Paused' : 'Running')
const options = ref(['Running', 'Paused']);
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
:value="accountBadgeValue" :severity="accountBadgeSeverity" size="small" :class="accountBadgeClass"
          @click="connect">
          Protocol pauser</OverlayBadge>
        <SecondaryButton
icon="pi pi-refresh" size="small" :loading="pausedLoading" label="Refresh"
          rounded @click="updatePaused" />
      </div>

    </template>
    <template #content>
      <div class="flex flex-col gap-y-1">
        <label>Protocol is</label>
        <div class="flex flex-col md:flex-row text-sm gap-y-2 gap-x-4 items-start md:items-center justify-items-start">
          <SelectButton v-model="state" :options="options" disabled />
          <div v-if="!paused" class="flex grow justify-normal gap-x-4 gap-y-2 text-sm">
            <DangerButton
class="min-w-32" icon="pi pi-pause-circle" label="Pause" :loading="pauseRunning"
              :disabled="disabled" @click="pauseProtocol" />
          </div>
          <div v-else class="flex justify-normal gap-x-4 gap-y-2 text-sm">
            <Button
class="min-w-32" icon="pi pi-play-circle" label="Resume" :loading="unpauseRunning"
              :disabled="disabled" @click="unpauseProtocol" />

          </div>
          <TransactionResult :value="txResult" />
        </div>

      </div>
    </template>
  </Card>
</template>
