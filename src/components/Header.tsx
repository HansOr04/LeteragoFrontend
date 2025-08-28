'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowModal: (show: boolean) => void;
  isAuthenticated: boolean;
  user: any;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  setShowModal,
  isAuthenticated,
  user,
  onLogout,
}) => {
  const tabs = [
    { id: 'normas', label: 'Normas' },
    { id: 'arquitectura', label: 'Arquitectura' },
    { id: 'anexos', label: 'Anexos' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50"
    >
      <div className="px-8 py-4 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer"
        >
          <h1 className="text-3xl font-bold text-blue-800 italic">Leterago</h1>
          <p className="text-xs text-gray-600">
            Un aliado estratégico en distribución farmacéutica
          </p>
        </motion.div>

        <nav className="flex items-center gap-8">
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-6 py-2 rounded-lg cursor-pointer font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-800 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-800 rounded-lg -z-10"
                />
              )}
            </motion.div>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Bienvenido, {user?.username || user?.name}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <LogOut size={16} />
                Salir
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-800 text-white px-6 py-2 rounded-full hover:bg-blue-900 transition-colors"
            >
              <User size={16} />
              Login
            </motion.button>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;