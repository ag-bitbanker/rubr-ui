<script setup>
import Card from "@/volt/Card.vue";
import QueryAmount from "~/components/QueryAmount.vue";
import InputAddress from "@/components/InputAddress.vue";
import { useWeb3Store } from "@/stores/web3";
import { useRubrStore } from "@/stores/RUBR";

const web3Store = useWeb3Store();
const rubrStore = useRubrStore();
const { isValidAddress } = web3Store;
const { allowance } = rubrStore
const { contract } = storeToRefs(rubrStore)
const owner = ref()
const spender = ref()
const amount = ref()
const loading = ref(false)
const isValid = computed(() => isValidAddress(owner) && isValidAddress(spender))

const update = async () => {

    if (unref(contract)) {
        try {
            loading.value = true;
            await nextTick();
            amount.value = await allowance(unref(owner), unref(spender))
        } finally {
            loading.value = false;
        }
    }
}
</script>

<template>
    <Card class="card-2" pt:body:class="px-0 pb-0 md:px-5 md:pb-5">
        <template #title>
            <div class="text-sm">Allowance</div>
        </template>
        <template #content>
            <div class="flex flex-col gap-2 text-sm">
                <InputAddress 
                    v-model="owner" :disabled="!contract || loading" label="Owner" />
                <InputAddress 
                    v-model="spender" :disabled="!contract || loading" label="Spender" />
                <QueryAmount
                    class="lg:col-span-2 xl:col-span-1" symbol="RUBR" label="Amount" :value="amount"
                    :disabled="!isValid" :loading="loading" :decimals="8" @query="update" />
            </div>
        </template>
    </Card>



</template>
