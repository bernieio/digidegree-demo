import React, { useState } from 'react';
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { motion } from 'framer-motion';
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react';
import { Button } from './Button';
import { WalletSelector } from './WalletSelector';

export const CustomConnectButton: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const handleCopyAddress = () => {
    if (currentAccount?.address) {
      navigator.clipboard.writeText(currentAccount.address);
      // You could add a toast notification here
      console.log('Address copied to clipboard');
    }
  };

  const handleViewOnExplorer = () => {
    if (currentAccount?.address) {
      window.open(`https://suiscan.xyz/testnet/account/${currentAccount.address}`, '_blank');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (currentAccount) {
    return (
      <div className="relative">
        <Button
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          className="flex items-center space-x-2"
        >
          <Wallet className="w-4 h-4" />
          <span>{formatAddress(currentAccount.address)}</span>
        </Button>

        {showAccountMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-2 min-w-[200px] z-50"
          >
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-sm text-[#4b5563]">Địa chỉ ví</p>
              <p className="font-mono text-sm text-[#1b1b1b]">
                {formatAddress(currentAccount.address)}
              </p>
            </div>

            <div className="py-1">
              <button
                onClick={handleCopyAddress}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-[#4b5563] hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Sao chép địa chỉ</span>
              </button>

              <button
                onClick={handleViewOnExplorer}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-[#4b5563] hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Xem trên Explorer</span>
              </button>

              <button
                onClick={() => {
                  disconnect();
                  setShowAccountMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Ngắt kết nối</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Click outside to close menu */}
        {showAccountMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowAccountMenu(false)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowWalletSelector(true)}
        className="flex items-center space-x-2"
      >
        <Wallet className="w-4 h-4" />
        <span>Kết nối ví</span>
      </Button>

      <WalletSelector
        isOpen={showWalletSelector}
        onClose={() => setShowWalletSelector(false)}
      />
    </>
  );
};