<script setup>
import Card from "@/volt/Card.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";
import Button from "@/volt/Button.vue";
import DangerButton from "@/volt/DangerButton.vue";
import ContrastButton from "@/volt/ContrastButton.vue";
import Checkbox from '@/volt/Checkbox.vue';
import SelectButton from '@/volt/SelectButton.vue';
import TransactionResult from "@/components/TransactionResult.vue";
import InputAddress from "@/components/InputAddress.vue";
import QueryAddress from "@/components/QueryAddress.vue";
import { useWeb3Store } from "@/stores/web3";
import { useRubrStore } from "@/stores/RUBR";

const web3Store = useWeb3Store();
const rubrStore = useRubrStore();
const { isValidAddress } = web3Store;
const { contract } = storeToRefs(rubrStore);
const { isFrozen, freeze, unfreeze, wipeFrozenAddress } = rubrStore;
const txResult = ref();
const running = ref(false);
const frozen = ref()
const address = ref();
const invalidAddress = ref(false)

const validate = () => {
  invalidAddress.value = !isValidAddress(unref(address));
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

const state = computed(() => unref(frozen) === true ? 'Frozen' : unref(frozen) === false?'Not frozen' : undefined)
const options = ref(['Frozen', 'Not frozen']);
</script>
<template>
  <Card class="rounded-2xl mx-auto border border-surface-200 dark:border-surface-700 w-full shadow-none">
    <template #title>
      <div class="flex justify-between items-center gap-2 pb-4">
        <span>Protocol compliance</span>
        
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-2">
        <div class="flex flex-row">
          <QueryAddress :disabled="!contract || running" v-model="address" label="Address" class="w-full"
            :invalid="invalidAddress" @query="_isFrozen" :loading="running" />
       
        </div>
         <div class="flex flex-col gap-2 items-start xl:flex-row xl:items-center ">
        <div class="flex flex-row gap-2 items-center">
         
            <SelectButton :options="options" v-model="state" disabled/>
      
          
           <DangerButton v-if="canFreeze" @click="_freeze" class="min-w-32" icon="pi pi-lock" label="Freeze" :loading="running" :disabled="frozen===undefined || running"/>
           <Button v-if="canUnfreeze" @click="_unfreeze" class="min-w-32" icon="pi pi-lock-open" label="Unfreeze" :loading="running" :disabled="frozen===undefined || running"/>
           <ContrastButton v-if="canWipe" @click="_wipe" class="min-w-32" icon="pi pi-eraser" label="Wipe funds" :loading="running" :disabled="frozen===undefined || running"/>
        </div>
        <TransactionResult :value="txResult" />
        </div>
      </div>

    </template>
  </Card>
</template>
