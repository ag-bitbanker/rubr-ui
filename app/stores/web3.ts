import { defineStore } from "pinia";
import {
  useAppKit,
  useAppKitNetwork,
  useAppKitProvider,
  useAppKitState,
  type Provider,
} from "@reown/appkit/vue";
import { createAppKit } from "@reown/appkit/vue";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { bscTestnet, bsc } from "@reown/appkit/networks";
import { isAddress, BrowserProvider, JsonRpcProvider } from "ethers";
import type { ContractRunner } from "ethers";
const config = useRuntimeConfig()


export type UsefullAddresses = {
  RUBR: string;
  treasury?: string;
};

const BNBSmartChainTestnet: UsefullAddresses = {
  RUBR: "0x628c08a3678554548c730A05fF3C9f9b4Be7De7B",
  treasury: "0x259c6fec7f81630c7626859B38B3FDaAb2393a81",
};

const BNBSmartChain: UsefullAddresses = {
  RUBR: "0xee295F8330b9325dAb36D25FA158D773D6569640",
  treasury: "0x025B5Bd2Bf4069191d4c1718c600Cd10B7517AeB",
};

export type NativeCurrency = {
  name?: string;
  symbol?: string;
  decimals?: number;
};

export type Network = {
  chainId?: string | number;
  testnet?: boolean;
  currency: NativeCurrency;
  blockExplorer?: string;
};

const projectId = config.public.projectId;

const metadata = {
  name: "RUBR",
  description: "RUBR Service Coin",
  url: "https://rubr.tokenify.it", // origin must match your domain & subdomain
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

const appKit = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [bscTestnet, bsc],
  metadata,
  projectId,
  themeMode: "light",
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

const getAddresses = (
  chainId: number | string | undefined
): UsefullAddresses | undefined => {
  switch (chainId) {
    case 97: // BNB Smart Chain Testnet
      return BNBSmartChainTestnet;
    case 56: // BNB Smart Chain
      return BNBSmartChain;
  }
};

export const useWeb3Store = defineStore("web3Store", () => {
  const networkData = useAppKitNetwork();
  const state = useAppKitState();

  const runner = ref<ContractRunner>();
  const addresses = ref<UsefullAddresses>();

  const network = ref<Network>({
    chainId: unref(networkData)?.chainId,
    testnet: !!unref(networkData).caipNetwork?.testnet,
    blockExplorer:
      unref(networkData)?.caipNetwork?.blockExplorers?.default?.url,
    currency: {
      name: unref(networkData).caipNetwork?.nativeCurrency?.name,
      symbol: unref(networkData).caipNetwork?.nativeCurrency?.symbol,
      decimals: unref(networkData).caipNetwork?.nativeCurrency?.decimals,
    },
  });

  const blockExplorer = computed(
    () => unref(networkData)?.caipNetwork?.blockExplorers?.default?.url
  );

  const isValidAddress = (address: string | Ref<string>) =>
    isAddress(unref(address));

  const explorerUrl = (address: string | Ref<string>) =>
    unref(blockExplorer) && unref(address)
      ? `${unref(blockExplorer)}/address/${unref(address)}`
      : undefined;

  const explorerTxUrl = (tx: string | Ref<string>) =>
    unref(blockExplorer) && unref(tx)
      ? `${unref(blockExplorer)}/tx/${unref(tx)}`
      : undefined;

  const init = async () => {
    await appKit.ready();
    const { walletProvider } = useAppKitProvider<Provider>("eip155");

    if (walletProvider) {
      const browserProvider = new BrowserProvider(walletProvider);
      runner.value = await browserProvider.getSigner();
    } else {
      runner.value = new JsonRpcProvider(
        appKit.getCaipNetwork()?.rpcUrls.default.http.at(0)
      );
    }

    network.value = {
      chainId: unref(networkData)?.chainId,
      testnet: unref(networkData).caipNetwork?.testnet,
      blockExplorer:
        unref(networkData)?.caipNetwork?.blockExplorers?.default?.url,
      currency: {
        name: unref(networkData).caipNetwork?.nativeCurrency?.name,
        symbol: unref(networkData).caipNetwork?.nativeCurrency?.symbol,
        decimals: unref(networkData).caipNetwork?.nativeCurrency?.decimals,
      },
    };
    addresses.value = getAddresses(networkData.value.chainId);
  };

  const openConnectModal = () => {
    const { open } = useAppKit();
    open({ view: "Connect" });
  };

  const ready = async () => await appKit.ready();

  init().then(() => {
    watch(state, async () => {
      await init();
    });
  });

  return {
    addresses,
    network,
    runner,
    ready,
    explorerUrl,
    explorerTxUrl,
    isValidAddress,
    openConnectModal,
  };
});
