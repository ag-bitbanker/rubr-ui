<script setup>
import Card from "@/volt/Card.vue";
import Badge from "@/volt/Badge.vue";
import Button from "@/volt/Button.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";
import Checkbox from "@/volt/Checkbox.vue";
import Address from "@/components/Address.vue";
import QueryAmount from "~/components/QueryAmount.vue";
import Updatable from "@/components/Updatable.vue";
import InputAddress from "@/components/InputAddress.vue";
import { useWeb3Store } from "@/stores/web3";
import { useRubrStore } from "@/stores/RUBR";

const web3Store = useWeb3Store();
const rubrStore = useRubrStore();
const { isValidAddress } = web3Store;
const {allowance} = rubrStore
const {contract} = storeToRefs(rubrStore)
const owner = ref()
const spender = ref()
const amount = ref()
const loading = ref(false)
const isValid = computed(() => isValidAddress(owner) && isValidAddress(spender))

const update = async () => {
    
    if (unref(contract) ) {
        try {
            loading.value = true;
            await nextTick();
            amount.value = await allowance(unref(owner),unref(spender))
        } finally {
            loading.value = false;
        }
    }
}
</script>

<template>
    
         <Card class="rounded-2xl mx-auto border border-surface-200 dark:border-surface-700 w-full shadow-none">
            <template #title>
                <div class="flex justify-between items-center gap-2 text-sm">
                    <span>Allowance</span>
                </div>
            </template>
            <template #content>
                <div class="flex flex-col gap-2 text-sm">
                    <InputAddress :disabled="!contract || loading" v-model="owner" label="Owner" />
                    <InputAddress :disabled="!contract || loading" v-model="spender" label="Spender" />
                    <QueryAmount class="lg:col-span-2 xl:col-span-1" symbol="RUBR" label="Amount" :value="amount" :disabled="!isValid"
                        :loading="loading" @query="update" :decimals="8" />
                </div>
            </template>
        </Card>
   


</template>
