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
      console.log('Categorías cargadas:', response.categories); // Debug
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
      console.log('Técnicas cargadas:', response.techniques); // Debug
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

  // Filtrar categorías por tab - MEJORADO
  // Filtrar categorías por tab - CORREGIDO DEFINITIVAMENTE
  const getCategoriesForTab = (tab: string): Category[] => {
    console.log(`Filtrando categorías para tab: ${tab}`);
    console.log('Todas las categorías:', categories);
    
    const tabMappings: Record<string, string[]> = {
      normas: [
        // Coincidencias exactas primero
        'organización y contexto',
        'liderazgo',
        'planificación', 
        'soporte',
        'operación',
        'evolución desempeño',
        'mejoras',
        // Palabras individuales como respaldo
        'organización',
        'contexto',
        'liderazgo',
        'planificacion',
        'soporte',
        'operacion',
        'evolucion',
        'desempeño',
        'mejoras'
      ],
      arquitectura: [
        'security operations center',
        'soc',
        'arquitectura',
        'security',
        'operations', 
        'center'
      ],
      anexos: [
        'controles organizacionales',
        'controles de personas', 
        'controles físicos',
        'controles tecnológicos',
        'controles',
        'organizacionales',
        'personas',
        'físicos',
        'fisicos',
        'tecnológicos',
        'tecnologicos'
      ]
    };

    const keywords = tabMappings[tab] || [];
    
    const filteredCategories = categories.filter((cat: Category) => {
      const categoryName = cat.name.toLowerCase().trim();
      console.log(`Evaluando categoría: "${categoryName}" para tab: ${tab}`);
      
      // Primero buscar coincidencias exactas o muy cercanas
      const exactMatch = keywords.some((keyword: string) => {
        const keywordLower = keyword.toLowerCase().trim();
        return categoryName === keywordLower || 
               categoryName.includes(keywordLower) ||
               keywordLower.includes(categoryName);
      });
      
      // Si no hay coincidencia exacta, buscar palabras individuales
      const wordMatch = !exactMatch && keywords.some((keyword: string) => {
        const words = keyword.toLowerCase().split(' ');
        return words.some(word => categoryName.includes(word.trim()));
      });
      
      const matches = exactMatch || wordMatch;
      console.log(`¿Coincide "${categoryName}" con ${tab}?`, matches);
      return matches;
    });
    
    console.log(`Categorías filtradas para ${tab}:`, filteredCategories);
    return filteredCategories;
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