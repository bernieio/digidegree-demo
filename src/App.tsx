import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { VerifyPage } from './pages/VerifyPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminMintPage } from './pages/AdminMintPage';
import { SUI_NETWORK } from './lib/constants';
import '@mysten/dapp-kit/dist/index.css';

// Create a client
const queryClient = new QueryClient();

// Network configuration
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider
          autoConnect={true}
          enableUnsafeBurner={false}
          storageKey="digidegree-wallet"
          theme="light"
          preferredWallets={[
            'Sui Wallet',
            'Suiet',
            'Slush',
            'Ethos Wallet',
            'Glass Wallet',
            'OneKey Wallet',
            'Nightly Wallet'
          ]}
          requiredFeatures={['sui:signAndExecuteTransactionBlock']}
          walletListConfig={{
            showAllWallets: true
          }}
        >
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/verify" element={<VerifyPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/mint" element={<AdminMintPage />} />
              </Routes>
            </Layout>
          </Router>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;