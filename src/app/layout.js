"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import '@interchain-ui/react/styles';
import { ChainProvider } from '@cosmos-kit/react';
import { chains, assets } from 'chain-registry';
import { wallets as keplrWallets  } from '@cosmos-kit/keplr';
import { wallets as compassWallets } from "@cosmos-kit/compass";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { SignerOptions, wallets } from 'cosmos-kit';

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChainProvider
          chains={chains} // supported chains
          assetLists={assets} // supported asset lists
          wallets={[...keplrWallets, ...compassWallets, ...leapWallets]} // supported wallets
          throwErrors={false}
          walletConnectOptions={{
            signClient: {
              projectId: 'a8510432ebb71e6948cfd6cde54b70f7',
              relayUrl: 'wss://relay.walletconnect.org',
              metadata: {
                name: 'CosmosKit Template',
                description: 'CosmosKit dapp template',
                url: 'https://docs.cosmology.zone/cosmos-kit/',
                icons: [
                  "https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/packages/docs/public/favicon-96x96.png",
                ]
              },
            },
          }}
          >
          {children}
        </ChainProvider>
      </body>
    </html>
  );
}
