/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TransactionReceipt} from "ethers";
import { Contract } from "ethers";
import { defineStore } from "pinia";
import { ABI } from "./abi/RUBR";

export const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
export const COMPLIANCE_ROLE =
  "0x442a94f1a1fac79af32856af2a64f63648cfa2ef3b98610a5bb7cbec4cee6985";
export const PAUSE_ROLE =
  "0x139c2898040ef16910dc9f44dc697df79363da767d8bc92f2e310312b816e46d";
export const SUPPLY_ROLE =
  "0xbc1f3f7c406085be62d227092f4fd5af86922a19f3a87e6199f14015341eb9d9";
export type TransactionResult = {
  success: boolean, 
  data: string
}

export const useRubrStore = defineStore("rubrStore", () => {
  const web3store = useWeb3Store();
  const { runner, addresses } = storeToRefs(web3store);

  const createContract = (): Contract | undefined =>
    addresses.value?.RUBR
      ? new Contract(addresses.value.RUBR, ABI, toRaw(unref(runner)))
      : undefined;

  const contract = ref<Contract | undefined>(createContract());
  const address = computed(() => unref(addresses)?.RUBR);

  ////////////////////////////////////////////////////////////
  //  Metadata
  ////////////////////////////////////////////////////////////
  const symbol = ref<string>();
  const name = ref<string>();
  const decimals = ref<number>();
  const symbolLoading = ref<boolean>(false);
  const nameLoading = ref<boolean>(false);
  const decimalsLoading = ref<boolean>(false);
  const metadataLoading = computed<boolean>(
    () => unref(symbolLoading) || unref(nameLoading) || unref(decimalsLoading)
  );

  const readSymbol = async (): Promise<string | undefined> =>
    contract.value ? await contract.value.symbol() : undefined;
  const readName = async (): Promise<string | undefined> =>
    contract.value ? await contract.value.name() : undefined;
  const readDecimals = async (): Promise<number | undefined> =>
    contract.value ? Number(await contract.value.decimals()) : undefined;

  const updateSymbol = async () => {
    symbolLoading.value = true;
    await nextTick();
    try {
      symbol.value = await readSymbol();
    } finally {
      symbolLoading.value = false;
    }
  };

  const updateName = async () => {
    nameLoading.value = true;
    await nextTick();
    try {
      name.value = await readName();
    } finally {
      nameLoading.value = false;
    }
  };

  const updateDecimals = async () => {
    decimalsLoading.value = true;
    await nextTick();
    try {
      decimals.value = await readDecimals();
    } finally {
      decimalsLoading.value = false;
    }
  };

  const updateMetadata = async () => {
    await Promise.all([updateSymbol(), updateName(), updateDecimals()]);
  };

  ////////////////////////////////////////////////////////////
  //  Total supply
  ////////////////////////////////////////////////////////////

  const totalSupply = ref<bigint | undefined>();
  const totalSupplyLoading = ref<boolean>(false);

  const readTotalSupply = async (): Promise<bigint | undefined> =>
    contract.value ? await contract.value.totalSupply() : undefined;

  const updateTotalSupply = async () => {
    totalSupplyLoading.value = true;
    await nextTick();
    try {
      totalSupply.value = await readTotalSupply();
    } finally {
      totalSupplyLoading.value = false;
    }
  };

  ////////////////////////////////////////////////////////////
  //  Pauser
  ////////////////////////////////////////////////////////////

  const paused = ref<boolean>()
  const pausedLoading = ref<boolean>(false);
  const readPaused= async (): Promise<boolean | undefined> =>
    contract.value ? await contract.value.paused() : undefined;

  const updatePaused = async () => {
    pausedLoading.value = true;
    await nextTick();
    try {
      paused.value = await readPaused();
    } finally {
      pausedLoading.value = false;
    }
  };

  const pause = async () : Promise<TransactionReceipt|Error|undefined> => {
    if (contract.value  ) {
        try {
            return await (await contract.value.pause()).wait()
        } catch (err:any ) {
            return new Error(err.shortMessage  || err.toString())
        } finally {
          await updatePaused()
        }
    }
  }

  const unpause = async () : Promise<TransactionReceipt|Error|undefined> => {
    if (contract.value  ) {
        try {
            return await (await contract.value.unpause()).wait()
        } catch (err: any ) {
            return new Error(err.shortMessage  || err.toString())
        } finally {
          await updatePaused()
        }
    }
  }

  ////////////////////////////////////////////////////////////
  //  Compliance
  ////////////////////////////////////////////////////////////

  const isFrozen = async (address:string): Promise<boolean | undefined> =>
    contract.value ? await contract.value.isFrozen(address) : undefined;

  const freeze = async (address:string) : Promise<TransactionReceipt|Error|undefined> => {
    if (contract.value  ) {
        try {
            return await (await contract.value.freeze(address)).wait()
        } catch (err: any ) {
            return new Error(err.shortMessage  || err.toString())
        } 
    }
  }

  const unfreeze = async (address:string) : Promise<TransactionReceipt|Error|undefined> => {
    if (contract.value  ) {
        try {
            return await (await contract.value.unfreeze(address)).wait()
        } catch (err: any ) {
            return new Error(err.shortMessage  || err.toString())
        } 
    }
  }

  const wipeFrozenAddress = async (address:string) : Promise<TransactionReceipt|Error|undefined> => {
    if (contract.value  ) {
        try {
            return await (await contract.value.wipeFrozenAddress(address)).wait()
        } catch (err: any ) {
            return new Error(err.shortMessage  || err.toString())
        } finally {
          await updateTotalSupply()
        }
    }
  }

  ////////////////////////////////////////////////////////////
  //  Supplier
  ////////////////////////////////////////////////////////////

  const issue = async (address:string, amount: bigint) : Promise<TransactionReceipt|Error|undefined> => {
    if (contract.value  ) {
        try {
            return await (await contract.value.issue(address, amount)).wait()
        } catch (err: any ) {
            return new Error(err.shortMessage  || err.toString())
        } finally {
          await updateTotalSupply()
        }
    }
  }

  const redeem = async (amount: bigint) : Promise<TransactionReceipt|Error|undefined> => {
    if (contract.value  ) {
        try {
            return await (await contract.value.redeem(amount)).wait()
        } catch (err: any ) {
            return new Error(err.shortMessage  || err.toString())
        } finally {
          await updateTotalSupply()
        }
    }
  }
  ////////////////////////////////////////////////////////////
  //  ERC20 Read methods
  ////////////////////////////////////////////////////////////

  const balanceOf = async (address: string) : Promise<bigint|undefined> => contract.value ? await contract.value.balanceOf(address) : undefined
  const allowance = async (owner: string, spender: string) : Promise<bigint|undefined> => contract.value ? await contract.value.allowance(owner,spender) : undefined
  
  const hasRole = async (role: string, address: string) : Promise<boolean|undefined> => contract.value ? await contract.value.hasRole(role, address) : undefined


  ////////////////////////////////////////////////////////////
  //  ERC20 methods
  ////////////////////////////////////////////////////////////

  const approve = async (spender: string, amount: bigint) : Promise<TransactionReceipt|Error|undefined> => {
    if (contract.value  ) {
        try {
            return await (await contract.value.approve(spender, amount)).wait()
        } catch (err: any ) {
            return new Error(err.shortMessage  || err.toString())
        } 
    }
  }

  const increaseApproval = async (spender: string, amount: bigint) : Promise<TransactionReceipt|Error|undefined> => {
    if (contract.value  ) {
        try {
            return await (await contract.value.increaseApproval(spender, amount)).wait()
        } catch (err: any ) {
            return new Error(err.shortMessage  || err.toString())
        } 
    }
  }

   const decreaseApproval = async (spender: string, amount: bigint) : Promise<TransactionReceipt|Error|undefined> => {
    if (contract.value  ) {
        try {
            return await (await contract.value.decreaseApproval(spender, amount)).wait()
        } catch (err: any ) {
            return new Error(err.shortMessage  || err.toString())
        } 
    }
  }

  const transfer = async (address: string, amount: bigint) : Promise<TransactionReceipt|Error|undefined> => {
    if (contract.value  ) {
        try {
            return await (await contract.value.transfer(address, amount)).wait()
        } catch (err: any ) {
            return new Error(err.shortMessage  || err.toString())
        } 
    }
  }
  const transferFrom = async (from: string, to: string, amount: bigint) : Promise<TransactionReceipt|Error|undefined> => {
    if (contract.value  ) {
        try {
            return await (await contract.value.transferFrom(from, to, amount)).wait()
        } catch (err: any ) {
            return new Error(err.shortMessage  || err.toString())
        } 
    }
  }
  ////////////////////////////////////////////////////////////
  //  Init/watcher
  ////////////////////////////////////////////////////////////

  const update = async () =>
    await Promise.all([await updateMetadata(), await updateTotalSupply(), await updatePaused()]);

  update().then(() => {
    watch(runner, async () => {
      contract.value = createContract();
      await update();
    });
  });


  return {
    contract,
    address,
    symbol,
    name,
    decimals,
    paused,
    symbolLoading,
    nameLoading,
    pausedLoading,
    decimalsLoading,
    metadataLoading,
    totalSupply,
    totalSupplyLoading,
    updateMetadata,
    updateSymbol,
    updateName,
    updateDecimals,
    updateTotalSupply,
    updatePaused,
    update,
    pause,
    unpause,
    balanceOf,
    allowance,
    hasRole,
    transfer,
    transferFrom,
    approve,
    increaseApproval,
    decreaseApproval,
    isFrozen,
    freeze,
    unfreeze,
    wipeFrozenAddress,
    issue,
    redeem
  };
});
