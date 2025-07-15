<script setup>
import Card from "@/volt/Card.vue";
import Badge from "@/volt/Badge.vue";
import Button from "@/volt/Button.vue";
import DangerButton from "@/volt/DangerButton.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";
import Checkbox from "@/volt/Checkbox.vue";
import Address from "@/components/Address.vue";
import Transaction from "@/components/Transaction.vue";
import WriteAmount from "~/components/InputAmount.vue";
import Updatable from "@/components/Updatable.vue";
import InputAddress from "@/components/InputAddress.vue";
import Message from '@/volt/Message.vue';
import { useWeb3Store } from "@/stores/web3";


const web3Store = useWeb3Store();
const { RUBR, provider, signer, addresses } = storeToRefs(web3Store);
const { isValidAddress, explorerUrl } = web3Store;

const spender = ref()
const amount = ref()
const loading = ref(false)
const isValid = computed(() => isValidAddress(spender))
const tx = ref()
const messages = ref([]);
let count = ref(0);
const success = (tx) => ({ icon: 'pi pi-check-circle', severity: 'success', content: `TxHash: ${tx}`, id: count.value++, urll: explorerUrl(tx) })
const revert = (tx) => ({ icon: 'pi pi-times-circle', severity: 'error', content: `TxHash: ${tx}`, id: count.value++ })

const write = async () => {

    const contract = unref(RUBR)
    if (contract && provider) {
        try {
            loading.value = true;
            await nextTick();
            tx.value  = await contract.approve(unref(spender), unref(amount))
            messages.value = [
                revert('sdassdsdasd')
            ]
        } finally {
            loading.value = false;
        }
    }
}

</script>
<template>
    <div class="mx-auto w-full flex">
        <div class="border-s-4 border-red-500 opacity-50 my-5"></div>
        <Card class="mx-auto w-full shadow-none">
            <template #subtitle>
                <div class="flex justify-between items-center gap-2">
                    <span>Approve</span>
                    {{ amount }}
                </div>
            </template>
            <template #content>
                {{ tx }}
                signer: {{ signer }}
                <div class="grid grid-cols-1 gap-x-4 gap-y-2 text-sm">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2">

                        <InputAddress :disabled="!RUBR || loading" v-model="spender" label="Spender" />
                        <WriteAmount symbol="RUBR" label="Amount" v-model="amount" :digits="8" :disabled="loading " />

                    </div>
                    <div class="flex justify-normal gap-x-4 gap-y-2 text-sm">
                        <DangerButton label="Execute" class="min-w-32" :loading="loading" @click="write" :disabled="!signer" />

                        <Message v-for="msg of messages" closable class="w-full py-0" size="small" :icon="msg.icon"
                            :key="msg.id" :severity="msg.severity">
                            <span>{{
                                msg.content }}</span>
                            <SecondaryButton v-if="msg.url" icon="pi pi-external-link" size="small" variant="text"
                                :disabled="!url" pt:root="rounded-none" :href="msg.url" target="_blank" rel="noopener"
                                as="a" />
                        </Message>


                    </div>
                </div>
            </template>
        </Card>

    </div>


</template>
