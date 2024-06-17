"use client"

import Image from "next/image";
import { useChain } from '@cosmos-kit/react';
import { useEffect, useState } from "react";
import { getCosmWasmClient } from "@sei-js/cosmjs";
import axios from 'axios';

export default function Home() {
  const chainContext = useChain("sei");
  const { status, address, isWalletConnected, connect, openView } = chainContext;
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState([]);

  
  const RPC_URL = 'https://rpc.atlantic-2.seinetwork.io/';
  const CONTRACT_ADDRESS = "sei1esvtl7nrpyvunvuj5clan0vlgzeyyzdepacysplenrwxuha54gkq0waj2k";
  const USER_ADDRESS = "sei18he4l8um9c8pzyt2ycy95drvhkghnrewf0adt6";


  useEffect(() => {
    const setupClient = async () => {
      if(isWalletConnected){
        const cosmWasmClient = await getCosmWasmClient(RPC_URL);
        setClient(cosmWasmClient);
      }
    }

    setupClient();
  }, [isWalletConnected]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (client && address) {
        try {
          setLoading(true);
          const queryMsg = { tokens: { owner: USER_ADDRESS, limit: 12 } };
          const response = await client.queryContractSmart(CONTRACT_ADDRESS, queryMsg);
          const tokenIds = response.tokens;

          const nftPromises = tokenIds.map(async (tokenId) => {
            const tokenInfoMsg = { all_nft_info: { token_id: tokenId } };
            const tokenInfo = await client.queryContractSmart(CONTRACT_ADDRESS, tokenInfoMsg);
            const metadataUri = tokenInfo.info.token_uri;
            const metadata = await axios.get(metadataUri);
            return metadata.data;
          });

          const nftData = await Promise.all(nftPromises);
          setNfts(nftData);
          console.log(nftData);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        }
      }
    };

    fetchNFTs();
  }, [client, address]);

  useEffect(() => {
    console.log(status);
  }, [status])


  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {!isWalletConnected ? (
        <div className="flex items-center justify-center h-full w-full">
          <button
            onClick={connect}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-2xl"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="w-full flex justify-end p-8">
            <button 
              onClick={() => {
                openView()
              }} 
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
              {address}
            </button>
          </div>
          <div className="w-full max-w-6xl p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading
                ? Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-500 rounded-md shadow p-4 animate-pulse h-[230px]"
                    ></div>
                  ))
                : nfts.map((nft, index) => (
                    <div key={index} className="bg-black rounded-md border-2 border-gray-500 shadow p-4">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-[230px] object-cover rounded-lg"
                      />
                      <p className="text-center text-white">{nft.name}</p>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
