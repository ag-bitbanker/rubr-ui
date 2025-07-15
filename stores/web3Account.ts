import { useAppKitAccount } from "@reown/appkit/vue";
import type { AbstractProvider } from "ethers";
import { defineStore } from "pinia";
import { useWeb3Store } from "./web3";
import {
  useRubrStore,
  DEFAULT_ADMIN_ROLE,
  COMPLIANCE_ROLE,
  PAUSE_ROLE,
  SUPPLY_ROLE,
} from "./RUBR";

export type Roles = {
  admin?: boolean;
  pauser?: boolean;
  supplier?: boolean;
  compliance?: boolean;
};

export type Account = {
  balance?: bigint;
  balanceRUBR?: bigint;
  roles?: Roles;
  address?: string;
  connected: boolean;
};

export const useWeb3AccountStore = defineStore("web3AccountStore", () => {
  const accountData = useAppKitAccount();
  const web3store = useWeb3Store();
  const rubrStore = useRubrStore();
  const account = ref<Account>();
  const { runner } = storeToRefs(web3store);
  const { contract } = storeToRefs(rubrStore);
  const { balanceOf, hasRole } = rubrStore;
  const accountBalanceLoading = ref<boolean>(false);
  const accountBalanceRUBRLoading = ref<boolean>(false);
  const accountRolesLoading = ref<boolean>(false);
  const accountLoading = computed<boolean>(
    () =>
      unref(accountBalanceLoading) ||
      unref(accountBalanceRUBRLoading) ||
      unref(accountRolesLoading)
  );

  const readAccountRoles = async (address: string): Promise<Roles> => ({
    admin: await hasRole(DEFAULT_ADMIN_ROLE, address),
    supplier: await hasRole(SUPPLY_ROLE, address),
    pauser: await hasRole(PAUSE_ROLE, address),
    compliance: await hasRole(COMPLIANCE_ROLE, address),
  });

  const updateAccount = async () => {
    const provider = toRaw(unref(runner))?.provider;
    const { address, isConnected } = unref(accountData);

    if (provider && isConnected && address) {
      accountBalanceLoading.value = true;
      accountBalanceRUBRLoading.value = true;
      accountRolesLoading.value = true;
      await nextTick();
      try {
        const balance = await provider.getBalance(address);
        const balanceRUBR = await balanceOf(address);

        account.value = {
          balance,
          balanceRUBR,
          roles: await readAccountRoles(address),
          connected: true,
          address: address,
        };
      } finally {
        accountBalanceLoading.value = false;
        accountBalanceRUBRLoading.value = false;
        accountRolesLoading.value = false;
      }
    } else {
      account.value = {
        connected: false,
      };
    }
  };

  const updateAccountBalance = async () => {
    const provider = toRaw(unref(runner))?.provider;
    if (provider && account.value?.address) {
      accountBalanceLoading.value = true;
      await nextTick();
      try {
        account.value.balance = await provider.getBalance(
          account.value.address
        );
      } finally {
        accountBalanceLoading.value = false;
      }
    }
  };

  const updateAccountBalanceRUBR = async () => {
    const provider = toRaw(unref(runner))?.provider;
    if (provider && account.value?.address) {
      accountBalanceRUBRLoading.value = true;
      await nextTick();
      try {
        account.value.balanceRUBR = contract.value
          ? await contract.value.balanceOf(account.value.address)
          : undefined;
      } finally {
        accountBalanceRUBRLoading.value = false;
      }
    }
  };

  const updateAccountRoles = async () => {
    const provider = toRaw(unref(runner))?.provider;
    if (provider && account.value?.address) {
      accountRolesLoading.value = true;
      await nextTick();
      try {
        account.value.roles = await readAccountRoles(account.value.address);
      } finally {
        accountRolesLoading.value = false;
      }
    }
  };

  updateAccount().then(() => {
    watch(runner, async () => {
      await updateAccount();
    });
  });

  return {
    account,
    accountLoading,
    accountBalanceLoading,
    accountBalanceRUBRLoading,
    accountRolesLoading,
    readAccountRoles,
    updateAccountBalance,
    updateAccountBalanceRUBR,
    updateAccountRoles,
    updateAccount,
  };
});
