import AnkrscanProvider from '@ankr.com/ankr.js';
import type { Blockchain } from '@ankr.com/ankr.js/dist/types';

const provider = new AnkrscanProvider('');

const listOfChains: Blockchain[] = [
  'eth',
  'arbitrum',
  'avalanche',
  'bsc',
  'fantom',
  'polygon',
];

export const chainsToNativeSymbols: { [key in Blockchain]: string } = {
  eth: 'ETH',
  arbitrum: 'ETH',
  avalanche: 'AVAX',
  bsc: 'BNB',
  fantom: 'FTM',
  polygon: 'MATIC',
};

export const getAccountBalance = async (
  walletAddress: string,
  blockchain: Blockchain
) => {
  return provider.getAccountBalance({
    walletAddress,
    blockchain,
  });
};

export const getTotalMultichainBalance = async (walletAddress: string) => {
  let total = 0;
  for await (const chain of listOfChains) {
    const { totalBalanceUsd, assets } = await getAccountBalance(
      walletAddress,
      chain
    );
    total += +totalBalanceUsd;
  }
  return total;
};

export const getNativeCurrencyBalance = async (
  walletAddress: string,
  chain: Blockchain
) => {
  const { assets } = await getAccountBalance(walletAddress, chain);
  const nativeCurrencySymbol = chainsToNativeSymbols[chain];
  const nativeCurrencyBalance = assets.find(
    (asset) => asset.tokenSymbol === nativeCurrencySymbol
  );
  return nativeCurrencyBalance ? +nativeCurrencyBalance.balance : 0;
};

export const getAllNativeCurrencyBalances = async (walletAddress: string) => {
  const balances: { [key in Blockchain]?: number } = {};
  for await (const chain of listOfChains) {
    const nativeCurrencyBalance = await getNativeCurrencyBalance(
      walletAddress,
      chain
    );
    balances[chain] = nativeCurrencyBalance;
  }
  return balances;
};

export const getNfts = async (walletAddress: string) => {
  const { assets } = await provider.getNFTsByOwner({
    walletAddress,
    // blockchain: 'eth',
  });
  return assets;
};
