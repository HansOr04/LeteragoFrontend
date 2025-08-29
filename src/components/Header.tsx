'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Settings, Shield } from 'lucide-react';
import { User as UserType } from '@/types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowModal: (show: boolean) => void;
  isAuthenticated: boolean;
  user: UserType | null;
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

  const canAccess = (requiredRole: string) => {
    if (!user) return false;
    const roleHierarchy = { viewer: 1, editor: 2, admin: 3 };
    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
    return userLevel >= requiredLevel;
  };

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
          onClick={() => window.location.href = '/'}
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
              {/* Indicador de rol */}
              <div className="flex items-center gap-2 text-sm">
                <Shield 
                  size={16} 
                  className={`${
                    user?.role === 'admin' ? 'text-red-500' : 
                    user?.role === 'editor' ? 'text-orange-500' : 
                    'text-green-500'
                  }`}
                />
                <span className={`font-medium capitalize ${
                  user?.role === 'admin' ? 'text-red-600' : 
                  user?.role === 'editor' ? 'text-orange-600' : 
                  'text-green-600'
                }`}>
                  {user?.role}
                </span>
              </div>

              {/* Botón de administración */}
              {canAccess('editor') && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/admin'}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors text-sm"
                >
                  <Settings size={16} />
                  Admin
                </motion.button>
              )}

              <span className="text-sm text-gray-600">
                {user?.username}
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