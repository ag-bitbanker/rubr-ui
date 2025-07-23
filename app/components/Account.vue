<script setup>
import Card from "@/volt/Card.vue";
import Badge from "@/volt/Badge.vue";
import OverlayBadge from "@/volt/OverlayBadge.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";
import Address from "@/components/Address.vue";
import Amount from "~/components/Amount.vue";
import DataTable from "@/volt/DataTable.vue";
import Column from "primevue/column";
import { useWeb3Store } from "@/stores/web3";
import { useWeb3AccountStore } from "@/stores/web3Account";
const web3Store = useWeb3Store()
const { network } = storeToRefs(web3Store);
const {openConnectModal} = web3Store;
const web3AccountStore = useWeb3AccountStore();
const {
    account,
    accountLoading,
    accountBalanceLoading,
    accountBalanceRUBRLoading,
    accountRolesLoading,
} = storeToRefs(web3AccountStore);
const {
    updateAccountBalance,
    updateAccountBalanceRUBR,
    updateAccountRoles,
    updateAccount,
} = web3AccountStore;

const accountBadgeValue = computed(() =>
    unref(account)?.connected ? "Connected" : "Connect wallet"
);
const accountBadgeSeverity = computed(() =>
    unref(account)?.connected ? "success" : "warn"
);
const accountBadgeClass = computed(() =>
    unref(account)?.connected ? 'translate-y-[-75%] whitespace-nowrap' : 'cursor-pointer translate-y-[-75%] whitespace-nowrap'
);

const roles = computed(() => ([
    { name: 'Admin', status: unref(accountRolesLoading) ? undefined : unref(account)?.roles?.admin },
    { name: 'Pauser', status: unref(accountRolesLoading) ? undefined : unref(account)?.roles?.pauser },
    { name: 'Supplier', status: unref(accountRolesLoading) ? undefined : unref(account)?.roles?.supplier },
    { name: 'Compliance', status: unref(accountRolesLoading) ? undefined : unref(account)?.roles?.compliance },
])
)
const roleBadgeSeverity = (roleGranted) => {
    if (roleGranted === true) return 'success';
    if (roleGranted === false) return 'danger';
    return 'secondary'
}
const roleBadgeLabel = (roleGranted) => {
    if (roleGranted === true) return 'Granted';
    if (roleGranted === false) return 'Unauthorized';
    return 'Unknown'
}
const connect = () => {
   if ( !unref(account).connected) {
    openConnectModal()
   }
}
</script>
<template>
    <Card class="card">
        <template #title>
            <div class="flex justify-between items-center gap-2 pb-4 pt-2">
                <OverlayBadge :value="accountBadgeValue"  :severity="accountBadgeSeverity" size="small" :class="accountBadgeClass" @click="connect">
                    Account</OverlayBadge>
                <SecondaryButton
icon="pi pi-refresh" size="small" label="Refresh" :loading="accountLoading"
                    :disabled="!account?.connected" rounded @click="updateAccount" />
            </div>
        </template>

        <template #content>
            <div v-if="account && account?.connected && account?.address" class="grid gap-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                    <Address class="md:col-span-2 xl:col-span-1" :address="account.address" label="Account address" />
                    <Amount
:disabled="!account.connected" :symbol="network.currency.name"
                        :label="`Balance, ${network.currency.name}`" :value="account.balance"
                        :loading="accountBalanceLoading" @update="updateAccountBalance" />
                    <Amount
:disabled="!account.connected" symbol="RUBR" :value="account.balanceRUBR"
                        label="Balance, RUBR" :decimals="8" :loading="accountBalanceRUBRLoading"
                        @update="updateAccountBalanceRUBR" />
                </div>
                <Card v-if="account.roles" class="card-2" pt:body:class="px-0 pb-0 md:px-5 md:pb-5">
                    <template #title>
                        <div class="flex items-center justify-between gap-4 text-sm">
                            <span>RUBR roles</span>
                            <SecondaryButton
icon="pi pi-refresh" size="small" :loading="accountRolesLoading"
                                label="Refresh" rounded @click="updateAccountRoles" />
                        </div>
                    </template>
                    <template #content>
                        <DataTable :value="roles">
                            <Column field="name" header="Role"/>
                            <Column field="status" header="Access">
                                <template #body="slotProps">
                                    <Badge
:value="roleBadgeLabel(slotProps.data.status)"
                                        :severity="roleBadgeSeverity(slotProps.data.status)" class="whitespace-nowrap" />

                                </template>
                            </Column>

                        </DataTable>
                    </template>
                </Card>
            </div>
        </template>
    </Card>
</template>
