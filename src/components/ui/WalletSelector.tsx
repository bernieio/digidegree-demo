import React from 'react';
import { useWallets, useConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { motion } from 'framer-motion';
import { Wallet, Check, Download, ExternalLink } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface WalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({ isOpen, onClose }) => {
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const currentAccount = useCurrentAccount();

  if (!isOpen) return null;

  const handleConnect = (walletName: string) => {
    connect(
      { wallet: wallets.find(w => w.name === walletName)! },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error('Wallet connection failed:', error);
        }
      }
    );
  };

  const getWalletIcon = (walletName: string) => {
    const iconMap: Record<string, string> = {
      'Sui Wallet': '🔵',
      'Suiet': '🟣',
      'Slush': '🔷',
      'Ethos Wallet': '⚡',
      'Glass Wallet': '🪟',
      'OneKey Wallet': '🔑',
      'Nightly Wallet': '🌙'
    };
    return iconMap[walletName] || '💼';
  };

  const getInstallUrl = (walletName: string) => {
    const urlMap: Record<string, string> = {
      'Sui Wallet': 'https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
      'Suiet': 'https://chrome.google.com/webstore/detail/suiet-sui-wallet/khpkpbbcccdmmclmpigdgddabeilkdpd',
      'Slush': 'https://chrome.google.com/webstore/detail/slush-wallet/gkdlkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj',
      'Ethos Wallet': 'https://chrome.google.com/webstore/detail/ethos-sui-wallet/mcbigmjiafegjnnogedioegffbooigli'
    };
    return urlMap[walletName] || '#';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1b1b1b]">Chọn ví để kết nối</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <Card key={wallet.name} className="p-4 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getWalletIcon(wallet.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1b1b1b]">{wallet.name}</h3>
                    <p className="text-sm text-[#4b5563]">
                      {wallet.installed ? 'Đã cài đặt' : 'Chưa cài đặt'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {currentAccount && wallet.name === 'Connected' ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Đã kết nối</span>
                    </div>
                  ) : wallet.installed ? (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(wallet.name)}
                      className="min-w-[80px]"
                    >
                      Kết nối
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(getInstallUrl(wallet.name), '_blank')}
                      className="min-w-[80px]"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Cài đặt
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {wallets.length === 0 && (
          <div className="text-center py-8">
            <Wallet className="w-16 h-16 text-[#4b5563] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-[#1b1b1b] mb-2">
              Không tìm thấy ví nào
            </h3>
            <p className="text-[#4b5563] mb-4">
              Vui lòng cài đặt một trong các ví Sui được hỗ trợ
            </p>
            <Button
              variant="secondary"
              onClick={() => window.open('https://sui.io/wallets', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Xem danh sách ví
            </Button>
          </div>
        )}

        <div className="mt-6 p-4 bg-[#e0f6ff] rounded-xl">
          <p className="text-sm text-[#4b5563] text-center">
            💡 <strong>Lưu ý:</strong> Hãy đảm bảo bạn đã cài đặt extension ví trên trình duyệt Chrome/Edge
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};