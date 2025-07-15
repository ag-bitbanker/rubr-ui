<script setup>
import Card from "@/volt/Card.vue";
import Badge from "@/volt/Badge.vue";
import Button from "@/volt/Button.vue";
import SecondaryButton from "@/volt/SecondaryButton.vue";
import Checkbox from "@/volt/Checkbox.vue";
import Address from "@/components/Address.vue";
import Amount from "~/components/Amount.vue";
import { useWeb3Store } from "@/stores/web3";
const { network } = storeToRefs(useWeb3Store());
import { useWeb3AccountStore } from "@/stores/web3Account";
const web3AccountStore = useWeb3AccountStore();
const { account, accountLoading, accountBalanceLoading, accountBalanceRUBRLoading, accountRolesLoading } = storeToRefs(web3AccountStore)
const { updateAccountBalance,
    updateAccountBalanceRUBR,
    updateAccountRoles,
    updateAccount } = web3AccountStore
</script>
<template>
    <Card class="rounded-2xl max-w-7xl mx-auto border border-surface-200 dark:border-surface-700 w-full">
        <template #title>
            <div class="flex justify-between items-center gap-2 pb-4">
                <span>Account</span>
                <div class="flex items-center gap-2">

                    <SecondaryButton icon="pi pi-refresh" size="small" @click="updateAccount" label="Refresh"
                        :loading="accountLoading" rounded />
                    <Badge value="Connected" severity="success" v-if="account?.connected" />
                    <Badge value="Not connected" severity="warn" v-else />
                </div>
            </div>
        </template>

        <template #content>
            <div v-if="account && account?.connected && account?.address" class="grid gap-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                    <Address class="md:col-span-2 xl:col-span-1" :address="account.address" label="Account address" />
                    <Amount :disabled="!account.connected" :symbol="network.currency.name"
                        :label="`Balance, ${network.currency.name}`" :value="account.balance"
                        @update="updateAccountBalance" :loading="accountBalanceLoading" />
                    <Amount :disabled="!account.connected" symbol="RUBR" :value="account.balanceRUBR"
                        label="Balance, RUBR" :decimals="8" @update="updateAccountBalanceRUBR"
                        :loading="accountBalanceRUBRLoading" />
                </div>
                <Card class="rounded-2xl mx-auto border border-surface-200 dark:border-surface-700 w-full shadow-none"> v-if="account.roles">
                     <template #title><div class="flex items-center justify-between gap-4 text-sm">
                        <span>Granted RUBR roles</span>
                        <SecondaryButton icon="pi pi-refresh" size="small" @click="updateAccountRoles"
                            :loading="accountRolesLoading" label="Refresh roles" rounded />

                    </div>
                    </template>
                    <template #content>
                    <div class="flex flex-wrap gap-4 text-sm">
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="account.roles.admin" binary readonly :disabled="accountRolesLoading" />
                            <label class="whitespace-nowrap">Admin role</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="account.roles.pauser" binary readonly :disabled="accountRolesLoading" />
                            <label class="whitespace-nowrap">Pauser role</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="account.roles.supplier" binary readonly
                                :disabled="accountRolesLoading" />
                            <label class="whitespace-nowrap">Supplier role</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="account.roles.compliance" binary readonly
                                :disabled="accountRolesLoading" />
                            <label class="whitespace-nowrap">Compliance role</label>
                        </div>
                    </div>
                    </template>
                </Card>
            </div>
        </template>

    </Card>
</template>
