<script setup>
import Card from "@/volt/Card.vue";
import Button from "@/volt/Button.vue";
import DangerButton from "@/volt/DangerButton.vue";
import ContrastButton from "@/volt/ContrastButton.vue";
import OverlayBadge from '@/volt/OverlayBadge.vue';
import TransactionResult from "@/components/TransactionResult.vue";
import FrozenAddress from "@/components/FrozenAddress.vue";
import { useWeb3Store } from "@/stores/web3";
import { useRubrStore } from "@/stores/RUBR";
import { useWeb3AccountStore } from "@/stores/web3Account";
const web3Store = useWeb3Store();
const rubrStore = useRubrStore();
const web3AccountStore = useWeb3AccountStore()
const { isValidAddress, openConnectModal } = web3Store;
const { contract } = storeToRefs(rubrStore);
const { isFrozen, freeze, unfreeze, wipeFrozenAddress } = rubrStore;
const {account} = storeToRefs(web3AccountStore);
const txResult = ref();
const running = ref(false);
const frozen = ref()
const address = ref();
const invalidAddress = ref(false)

const validate = () => {
  invalidAddress.value = !isValidAddress(unref(address));
  if ( unref(invalidAddress)) {
    frozen.value = undefined
  }
  return !(unref(invalidAddress));
};

const _isFrozen = async () => {

  if (unref(contract) && validate()) {
    try {
      running.value = true;
      await nextTick();
      frozen.value = await isFrozen(unref(address));
    } finally {
      running.value = false;
    }
  }

};

const _freeze = async () => {
  if (unref(contract) && validate()) {
    try {
      running.value = true;
      await nextTick();
      txResult.value = await freeze(unref(address));
      frozen.value = await isFrozen(unref(address));
    } finally {
      running.value = false;
    }
  }
};

const _unfreeze = async () => {
  if (unref(contract) && validate()) {
    try {
      running.value = true;
      await nextTick();
      txResult.value = await unfreeze(unref(address));
      frozen.value = await isFrozen(unref(address));
    } finally {
      running.value = false;
    }
  }
};

const _wipe = async () => {
  if (unref(contract) && validate()) {
    try {
      running.value = true;
      await nextTick();
      txResult.value = await wipeFrozenAddress(unref(address));
    } finally {
      running.value = false;
    }
  }
};

const canFreeze = computed(() => frozen?.value === false)
const canUnfreeze = computed(() => frozen?.value === true)
const canWipe = computed(() => frozen?.value === true)

const accountBadgeValue = computed(() =>
  unref(account)?.connected ? (unref(account)?.roles?.compliance ? "Role granted" : "Forbidden") : "Connect wallet"
);
const accountBadgeSeverity = computed(() =>
  unref(account)?.connected && unref(account)?.roles?.compliance ? "success" : "warn"
);
const accountBadgeClass = computed(() =>
  unref(account)?.connected ? 'translate-y-[-75%] whitespace-nowrap' : 'cursor-pointer translate-y-[-75%] whitespace-nowrap'
);
const connect = () => {
  if (!unref(account).connected) {
    openConnectModal()
  }
}
const disabled = computed(() => !unref(account)?.connected || !unref(account)?.roles?.compliance)

</script>
<template>
  <Card class="card-2" pt:body:class="px-0 pb-0 md:px-5 md:pb-5">
    
     <template #title>
      <div class="flex justify-between items-center gap-2 pb-4 pt-2">
        <OverlayBadge
        :value="accountBadgeValue" :severity="accountBadgeSeverity" size="small" :class="accountBadgeClass"
          @click="connect">
         Protocol compliance</OverlayBadge>

      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-2">
       
          <FrozenAddress
            v-model="address" :disabled="!contract || running" label="Address" class="w-full"
            :invalid="invalidAddress" :loading="running" :frozen="frozen" @query="_isFrozen"  />
       
        <div class="flex flex-col gap-2">
          <div class="flex flex-wrap gap-2">
            <DangerButton
              class="min-w-32" icon="pi pi-lock" label="Freeze" :loading="running"
              :disabled="frozen === undefined || running || disabled || !canFreeze" @click="_freeze" />
            <Button
              class="min-w-32" icon="pi pi-lock-open" label="Unfreeze" :loading="running"
              :disabled="frozen === undefined || running || disabled || !canUnfreeze" @click="_unfreeze" />
            <ContrastButton
              class="min-w-32" icon="pi pi-eraser" label="Wipe funds" :loading="running"
              :disabled="frozen === undefined || running || disabled || !canWipe" @click="_wipe" />
          </div>
          <TransactionResult :value="txResult" />
        </div>
      </div>
    </template>
  </Card>
</template>
