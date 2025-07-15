<script setup>
import Card from "@/volt/Card.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";
import Button from "@/volt/Button.vue";
import DangerButton from "@/volt/DangerButton.vue";
import SelectButton from '@/volt/SelectButton.vue';

import TransactionResult from "@/components/TransactionResult.vue";
import { useRubrStore } from "@/stores/RUBR";

const rubrStore = useRubrStore();
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

</script>
<template>
  <Card class="rounded-2xl mx-auto border border-surface-200 dark:border-surface-700 w-full shadow-none">
    <template #title>
      <div class="flex justify-between items-center gap-2 pb-4">
        <span>Protocol pauser</span>
        <SecondaryButton icon="pi pi-refresh" size="small" :loading="pausedLoading" @click="updatePaused"
          label="Refresh" rounded />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-y-1">
        <label>Protocol is</label>
        <div class="flex flex-col md:flex-row text-sm gap-y-2 gap-x-4 items-start md:items-center justify-items-start">
          <SelectButton v-model="state" :options="options" disabled />
          <div v-if="!paused" class="flex grow justify-normal gap-x-4 gap-y-2 text-sm">
            <DangerButton class="min-w-32" icon="pi pi-pause-circle" label="Pause" :loading="pauseRunning"
              @click="pauseProtocol" />
          </div>
          <div v-else class="flex justify-normal gap-x-4 gap-y-2 text-sm">
            <Button class="min-w-32" icon="pi pi-play-circle" label="Resume" :loading="unpauseRunning"
              @click="unpauseProtocol" />
           
          </div>
           <TransactionResult :value="txResult" />
        </div>

      </div>
    </template>
  </Card>
</template>
