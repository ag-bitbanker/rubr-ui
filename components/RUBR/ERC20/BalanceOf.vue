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
const { balanceOf } = rubrStore
const { contract } = storeToRefs(rubrStore)
const address = ref()
const balance = ref()
const loading = ref(false)
const isValid = computed(() => isValidAddress(address))

const update = async () => {

    if (unref(contract)) {
        try {
            loading.value = true;
            await nextTick();
            balance.value = await balanceOf(unref(address))
        } finally {
            loading.value = false;
        }
    }
}
</script>
<template>
    <Card class="card-2" pt:body:class="px-0 pb-0 md:px-5 md:pb-5">
        <template #title>
            <div class="flex justify-between items-center gap-2 text-sm">
                <span>Balance of</span>
            </div>
        </template>
        <template #content>
            <div class="grid gap-2 grid-cols-1 text-sm">
                <InputAddress :disabled="!contract || loading" v-model="address" label="Address" />
                <QueryAmount symbol="RUBR" label="Amount" :value="balance" :disabled="!isValid" :decimals="8"
                    :loading="loading" @query="update" />
            </div>
        </template>
    </Card>
</template>