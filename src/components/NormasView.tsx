'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Category, Technique } from '@/types';

interface SelectedItem {
  _id?: string;
  title?: string;
  name?: string;
  description?: string;
  type?: string;
  categoryName?: string;
  [key: string]: any;
}

interface NormasViewProps {
  showDetails: (item: SelectedItem) => void;
  categories: Category[];
  techniques: Technique[];
  loading: boolean;
}

const NormasView: React.FC<NormasViewProps> = ({ 
  showDetails, 
  categories, 
  techniques, 
  loading 
}) => {
  // Headers fijos para Normas (las categorías principales)
  const headers = [
    'Organización y contexto',
    'Liderazgo', 
    'Planificación',
    'Soporte',
    'Operación',
    'Evolución desempeño',
    'Mejoras'
  ];

  // Obtener técnicas para cada categoría - CORREGIDO para ObjectId
  const getTechniquesForCategory = (categoryName: string): Technique[] => {
    console.log(`Buscando técnicas para: "${categoryName}"`);
    console.log('Categorías disponibles:', categories);
    console.log('Técnicas disponibles:', techniques);
    
    const category = categories.find((cat: Category) => 
      cat.name.toLowerCase().trim() === categoryName.toLowerCase().trim()
    );
    
    console.log('Categoría encontrada:', category);
    
    if (!category) {
      console.log(`No se encontró categoría para: ${categoryName}`);
      return [];
    }
    
    // Comparar usando el _id de la categoría (tanto string como ObjectId)
    const categoryTechniques = techniques.filter((tech: Technique) => {
      const techCategoryId = typeof tech.category === 'string' ? tech.category : tech.category._id;
      const categoryId = category._id;
      
      console.log(`Comparando técnica "${tech.name}": ${techCategoryId} === ${categoryId}`);
      return techCategoryId === categoryId;
    });
    
    console.log(`Técnicas encontradas para ${categoryName}:`, categoryTechniques);
    return categoryTechniques;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-blue-800 mb-8">Matriz Normativas</h1>
          <div className="bg-white rounded-xl shadow-2xl p-12">
            <div className="animate-pulse">
              <div className="grid grid-cols-7 gap-4 mb-6">
                {headers.map((_, index) => (
                  <div key={index} className="h-16 bg-blue-200 rounded"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-7 gap-4">
                    {[...Array(7)].map((_, colIndex) => (
                      <div key={colIndex} className="h-24 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="max-w-7xl mx-auto p-8"
    >
      <motion.h1 
        variants={itemVariants}
        className="text-4xl font-bold text-center text-blue-800 mb-8"
      >
        Matriz Normativas
      </motion.h1>

      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          {/* Headers - Categorías principales */}
          <div className="grid grid-cols-7 bg-gradient-to-r from-blue-800 to-blue-600">
            {headers.map((header, index) => (
              <motion.div
                key={header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 text-center font-semibold text-white border-r border-blue-700 last:border-r-0"
              >
                <div className="text-sm leading-tight">{header}</div>
              </motion.div>
            ))}
          </div>

          {/* Contenido - Técnicas dinámicas */}
          <div className="min-h-[400px]">
            <div className="grid grid-cols-7">
              {headers.map((header, colIndex) => {
                const categoryTechniques = getTechniquesForCategory(header);
                
                return (
                  <div key={header} className="border-r border-gray-200 last:border-r-0">
                    {categoryTechniques.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: colIndex * 0.1 }}
                        className="p-6 border-b border-gray-200 bg-gray-50 text-center min-h-[120px] flex items-center justify-center"
                      >
                        <div className="text-gray-400 text-sm">
                          <p>Sin técnicas</p>
                          <p className="text-xs mt-1">Agrega técnicas a esta categoría</p>
                        </div>
                      </motion.div>
                    ) : (
                      categoryTechniques.map((technique, techniqueIndex) => (
                        <motion.div
                          key={technique._id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            delay: (colIndex * 0.1) + (techniqueIndex * 0.05),
                            type: "spring",
                            stiffness: 100 
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                          }}
                          className="p-4 border-b border-gray-200 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white cursor-pointer hover:from-blue-700 hover:via-blue-600 hover:to-blue-500 transition-all duration-300"
                          onClick={() => showDetails({
                            ...technique,
                            type: 'norma',
                            categoryName: header
                          })}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="text-sm font-medium text-center leading-tight"
                          >
                            {technique.name}
                          </motion.div>
                          {technique.mitreid && (
                            <div className="text-xs text-blue-100 text-center mt-1">
                              {technique.mitreid}
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mensaje informativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-gray-600"
      >
        <p className="text-sm">
          Las técnicas aparecerán aquí una vez que las crees con tu usuario administrador
        </p>
      </motion.div>
    </motion.div>
  );
};

export default NormasView;