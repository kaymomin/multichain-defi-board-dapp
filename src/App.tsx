import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { Blockchain, Nft } from '@ankr.com/ankr.js/dist/types';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import {
  chainsToNativeSymbols,
  getAllNativeCurrencyBalances,
  getNfts,
  getTotalMultichainBalance,
} from './api';

function App() {
  const [totalBalance, setTotalBalance] = useState<number>();
  const [allNativeBalances, setAllNativeBalances] = useState<{
    [key in Blockchain]?: number;
  }>({});
  const [nfts, setNfts] = useState<Nft[]>([]);

  const nativeBalancesSorted = useMemo(() => {
    // sort allNativeBalances by value, descending and convert it back to an object
    const res = Object.entries(allNativeBalances).sort(([, a], [, b]) => b - a);
    return res;
  }, [allNativeBalances]);

  const { address } = useAccount();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!address) {
        return;
      }
      const totalBal = await getTotalMultichainBalance(address);
      const nativeBalances = await getAllNativeCurrencyBalances(address);
      const nfts = await getNfts(address);
      setAllNativeBalances(nativeBalances);
      setTotalBalance(Math.round(totalBal));
      setNfts(nfts);
      setLoading(false);
    })();
  }, [address]);

  

  return (
    <div className="flex flex-col items-center py-8">

        <h1 className="flex justify-center text-sm sm:text-base md:text-3xl lg:text-4xl pb-10">
          DefiDashboard 🪙 What's in your Wallet?
        </h1>
        
        <div className="flex justify-center">
          <ConnectButton showBalance={false}/>
        </div>
        <div className="flex gap-6 mt-8">
        <div className='flex flex-col'>
          {/* Net worth */}
          {totalBalance && (
            <div className='bg-[#f1f5f9] py-4 px-8 rounded flex flex-col w-[300px] items-center mt-20'>
              <h3 className='text-blue-800 font-bold'>Net Worth</h3>
              <span className='text-3xl '>${totalBalance}</span>
            </div>
          )}

          {/* Native currency balances */}
          {nativeBalancesSorted.length > 0 && (
            <div className='bg-[#f1f5f9] py-4 px-8 rounded flex flex-col mt-4 w-[300px] items-center'>
              <h3 className='text-blue-800 font-bold'>Wallet</h3>
              <ul className='mt-4 flex flex-col gap-2'>
                {nativeBalancesSorted.map(([chain, bal], idx) => (
                  <li key={chain + idx} className='capitalize flex flex-col'>
                    <span>{chain}</span>
                    <span className='font-bold text-2xl'>
                      {/* @ts-expect-error */}
                      {bal.toFixed(2)} {chainsToNativeSymbols[chain]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* NFTs section */}
        {nfts.length > 0 && (
          <div className='mt-8'>
            <h3 className='font-bold text-3xl text-blue-800 text-center'>
              NFTs
            </h3>
            <div className='grid grid-cols-3 gap-6'>
              {nfts.map((nft) => {
                const id = `${nft.contractAddress}/${nft.tokenId}`;

                return (
                  <div
                    key={id}
                    className='bg-[#f1f5f9] py-4 px-8 rounded flex flex-col mt-4 w-[200px] items-center'
                  >
                    <img src={nft.imageUrl} className='w-32 h-32 rounded-lg' />
                    <h3 className='text-blue-800 font-bold mt-2'>{nft.name}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      
      
      
      
      
      </div>

    
     




    </div>
  );
}

export default App;
