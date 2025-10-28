import React, { useEffect, useState } from 'react';
import { useCurrentAccount, useWallets } from '@mysten/dapp-kit';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Menu, X } from 'lucide-react';
import { ADMIN_ADDRESS } from '../../lib/constants';
import { CustomConnectButton } from '../ui/CustomConnectButton';

export const Header: React.FC = () => {
  const account = useCurrentAccount();
  const wallets = useWallets();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = account?.address === ADMIN_ADDRESS;

  useEffect(() => {
    if (isAdmin && !location.pathname.startsWith('/admin')) {
      navigate('/admin/dashboard');
    }
  }, [account, isAdmin, navigate, location.pathname]);

  const handleHomeClick = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
    setIsMobileMenuOpen(false);
  };

  // Debug wallet detection
  useEffect(() => {
    console.log('Available wallets:', wallets.map(w => ({ name: w.name, installed: w.installed })));
  }, [wallets]);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-gradient-to-r from-[#e0f6ff] to-white shadow-sm border-b border-gray-100"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleHomeClick}
          >
            <GraduationCap className="w-8 h-8 text-[#85daff]" />
            <span className="text-xl font-bold text-[#1b1b1b]">DigiDegree</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => navigate('/')}
              className={`text-[#4b5563] hover:text-[#85daff] transition-colors ${location.pathname === '/' ? 'text-[#85daff] font-medium' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/verify')}
              className={`text-[#4b5563] hover:text-[#85daff] transition-colors ${location.pathname === '/verify' ? 'text-[#85daff] font-medium' : ''}`}
            >
              Verify
            </button>
            {isAdmin && (
              <>
                <button 
                  onClick={() => navigate('/admin/dashboard')}
                  className={`text-[#4b5563] hover:text-[#85daff] transition-colors ${location.pathname === '/admin/dashboard' ? 'text-[#85daff] font-medium' : ''}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => navigate('/admin/mint')}
                  className={`text-[#4b5563] hover:text-[#85daff] transition-colors ${location.pathname === '/admin/mint' ? 'text-[#85daff] font-medium' : ''}`}
                >
                  Mint Degree
                </button>
              </>
            )}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <CustomConnectButton />
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <nav className="flex flex-col space-y-3">
              <button 
                onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                className="text-left text-[#4b5563] hover:text-[#85daff] py-2"
              >
                Home
              </button>
              <button 
                onClick={() => { navigate('/verify'); setIsMobileMenuOpen(false); }}
                className="text-left text-[#4b5563] hover:text-[#85daff] py-2"
              >
                Verify
              </button>
              {isAdmin && (
                <>
                  <button 
                    onClick={() => { navigate('/admin/dashboard'); setIsMobileMenuOpen(false); }}
                    className="text-left text-[#4b5563] hover:text-[#85daff] py-2"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => { navigate('/admin/mint'); setIsMobileMenuOpen(false); }}
                    className="text-left text-[#4b5563] hover:text-[#85daff] py-2"
                  >
                    Mint Degree
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};