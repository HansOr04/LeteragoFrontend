'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import NormasView from '@/components/NormasView';
import ArquitecturaView from '@/components/ArquitecturaView';
import AnexosView from '@/components/AnexosView';
import LoginModal from '@/components/LoginModal';
import Sidebar from '@/components/Sidebar';
import { apiService } from '@/services/api';
import { Category, Technique, User } from '@/types';

interface SelectedItem {
  _id?: string;
  title?: string;
  name?: string;
  description?: string;
  type?: string;
  categoryName?: string;
  [key: string]: any;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('normas');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar categorías al iniciar
  useEffect(() => {
    loadCategories();
  }, []);

  // Cargar técnicas cuando cambie el tab activo
  useEffect(() => {
    if (categories.length > 0) {
      loadTechniques();
    }
  }, [activeTab, categories]);

  const loadCategories = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTechniques = async (): Promise<void> => {
    try {
      const response = await apiService.getTechniques();
      setTechniques(response.techniques || []);
    } catch (error) {
      console.error('Error cargando técnicas:', error);
    }
  };

  const showDetails = (item: SelectedItem): void => {
    setSelectedItem(item);
    setSidebarOpen(true);
  };

  const handleLogin = (userData: { user: User; token: string }): void => {
    setUser(userData.user);
    setIsAuthenticated(true);
    setShowModal(false);
    // Recargar datos después del login
    loadCategories();
    loadTechniques();
  };

  const handleLogout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  // Filtrar categorías por tab
  const getCategoriesForTab = (tab: string): Category[] => {
    const tabMappings: Record<string, string[]> = {
      normas: [
        'Organización y contexto',
        'Liderazgo', 
        'Planificación',
        'Soporte',
        'Operación',
        'Evolución desempeño',
        'Mejoras'
      ],
      arquitectura: ['Security Operations Center'],
      anexos: [
        'Controles Organizacionales',
        'Controles de Personas',
        'Controles Físicos',
        'Controles Tecnológicos'
      ]
    };

    return categories.filter((cat: Category) => 
      tabMappings[tab]?.some((mapped: string) => 
        cat.name.toLowerCase().includes(mapped.toLowerCase()) ||
        mapped.toLowerCase().includes(cat.name.toLowerCase())
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowModal={setShowModal}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {activeTab === 'normas' && (
            <NormasView 
              key="normas" 
              showDetails={showDetails}
              categories={getCategoriesForTab('normas')}
              techniques={techniques}
              loading={loading}
            />
          )}
          {activeTab === 'arquitectura' && (
            <ArquitecturaView 
              key="arquitectura" 
              showDetails={showDetails}
              categories={getCategoriesForTab('arquitectura')}
              techniques={techniques}
            />
          )}
          {activeTab === 'anexos' && (
            <AnexosView 
              key="anexos" 
              showDetails={showDetails}
              categories={getCategoriesForTab('anexos')}
              techniques={techniques}
              loading={loading}
            />
          )}
        </AnimatePresence>
      </main>

      <LoginModal
        showModal={showModal}
        setShowModal={setShowModal}
        onLogin={handleLogin}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedItem={selectedItem}
        isAuthenticated={isAuthenticated}
        user={user}
      />
    </div>
  );
}