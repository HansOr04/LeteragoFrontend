'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Category, Technique } from '@/types';

interface SelectedItem {
  _id?: string;
  title?: string;
  name?: string;
  description?: string;
  type?: string;
  categoryName?: string;
  category?: string;
  [key: string]: any;
}

interface ArquitecturaViewProps {
  showDetails: (item: SelectedItem) => void;
  categories: Category[];
  techniques: Technique[];
}

const ArquitecturaView: React.FC<ArquitecturaViewProps> = ({ 
  showDetails, 
  categories, 
  techniques 
}) => {
  // Nodos del SOC con posiciones fijas para el diseño
  const socNodes = [
    {
      id: 'checkpoint-1',
      name: 'CHECKPOINT',
      color: 'bg-pink-600',
      position: { top: '15%', left: '25%' },
      description: 'Checkpoint Security Gateway - Firewall y protección perimetral'
    },
    {
      id: 'trellix',
      name: 'TRELLIX',
      color: 'bg-gradient-to-r from-blue-600 to-blue-800',
      position: { top: '45%', left: '8%' },
      description: 'Trellix Security Solutions - EDR y detección de amenazas'
    },
    {
      id: 'threat-intel',
      name: 'Threat Intelligence\ny Hunting de\nAmenazas',
      color: 'bg-indigo-900',
      position: { top: '15%', right: '15%' },
      description: 'Threat Intelligence Platform - Análisis proactivo de amenazas'
    },
    {
      id: 'azure',
      name: 'Azure Sentinel',
      color: 'bg-sky-500',
      position: { top: '45%', right: '8%' },
      description: 'Microsoft Azure Sentinel SIEM - Gestión de eventos e incidentes'
    },
    {
      id: 'infinity',
      name: 'CHECKPOINT\nINFINITY PORTAL',
      color: 'bg-pink-600',
      position: { bottom: '15%', left: '20%' },
      description: 'Checkpoint Infinity Management Portal - Gestión centralizada'
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const nodeVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10
      }
    }
  };

  const connectionVariants: Variants = {
    hidden: { pathLength: 0 },
    visible: { 
      pathLength: 1,
      transition: { duration: 1, ease: "easeInOut" as const }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="max-w-7xl mx-auto p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          Arquitectura
        </h1>
        <h2 className="text-2xl text-gray-700">Security Operations Center</h2>
      </motion.div>

      <motion.div 
        className="relative bg-white rounded-xl shadow-2xl p-12 h-[700px] overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* SVG para líneas de conexión */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* Líneas de conexión animadas */}
          <motion.line
            variants={connectionVariants}
            x1="80%" y1="25%" 
            x2="55%" y2="45%"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
          <motion.line
            variants={connectionVariants}
            x1="85%" y1="50%" 
            x2="55%" y2="50%"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
          <motion.line
            variants={connectionVariants}
            x1="30%" y1="80%" 
            x2="48%" y2="58%"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
        </svg>

        {/* Nodo central SOC */}
        <motion.div
          variants={nodeVariants}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 20px 40px rgba(30, 58, 138, 0.4)"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-gradient-to-br from-blue-800 to-blue-900 text-white 
                     rounded-full w-48 h-48 flex items-center justify-center 
                     text-4xl font-bold cursor-pointer shadow-2xl z-20"
          onClick={() => showDetails({
            title: 'Security Operations Center',
            type: 'architecture',
            description: 'Centro neurálgico de operaciones de seguridad que coordina todas las herramientas y procesos de monitoreo, detección y respuesta a incidentes de ciberseguridad.',
            category: 'SOC Central'
          })}
        >
          SOC
        </motion.div>

        {/* Nodos del SOC */}
        {socNodes.map((node, index) => (
          <motion.div
            key={node.id}
            variants={nodeVariants}
            whileHover={{ 
              scale: 1.15, 
              boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
              zIndex: 30
            }}
            whileTap={{ scale: 0.95 }}
            className={`absolute ${node.color} text-white rounded-2xl px-6 py-4 
                       font-semibold text-center cursor-pointer shadow-xl 
                       transition-all duration-300 z-10 min-w-[140px]`}
            style={node.position}
            onClick={() => showDetails({
              title: node.name.replace(/\n/g, ' '),
              type: 'architecture',
              description: node.description,
              category: 'Security Tool'
            })}
          >
            <motion.div
              whileHover={{ y: -2 }}
              className="whitespace-pre-line text-sm leading-tight"
            >
              {node.name}
            </motion.div>
          </motion.div>
        ))}

        {/* Partículas flotantes animadas */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-30"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </motion.div>

      {/* Información adicional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center"
      >
        <p className="text-gray-600 text-sm">
          Haz clic en cualquier componente para ver más detalles sobre su función en el SOC
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ArquitecturaView;