<script setup>
import Card from "@/volt/Card.vue";
import QueryAmount from "~/components/QueryAmount.vue";
import InputAddress from "@/components/InputAddress.vue";
import { useWeb3Store } from "@/stores/web3";

const web3Store = useWeb3Store();
const { RUBR, provider } = storeToRefs(web3Store);
const { isValidAddress } = web3Store;
const address = ref()
const balance = ref()
const loading = ref(false)
const isValid = computed(() => isValidAddress(address))

const update = async () => {
    const contract = unref(RUBR)
    if (contract && provider) {
        try {
            loading.value = true;
            await nextTick();
            balance.value = await contract.balanceOf(unref(address))
        } finally {
            loading.value = false;
        }
    }
}
</script>
<template>
    <div class="mx-auto w-full flex">
        <div class="border-s-4 border-green-500 opacity-50 my-5"/>
        <Card class="mx-auto w-full shadow-none">
            <template #subtitle>
                <div class="flex justify-between items-center gap-2">
                    <span>Balance of</span>
                </div>
            </template>
            <template #content>
                <div class="grid gap-x-4 gap-y-2 grid-cols-1 lg:grid-cols-2 text-sm">
                    <InputAddress v-model="address" :disabled="!RUBR || loading" label="Address" />
                    <QueryAmount
                        symbol="RUBR" label="Amount" :value="balance" :disabled="!isValid" :digits="8"
                        :loading="loading" @query="update" />
                </div>
            </template>
        </Card>
    </div>


</template>
