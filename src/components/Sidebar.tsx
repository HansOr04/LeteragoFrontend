'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Tag, Monitor, Shield, FileText, ExternalLink } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: any;
  isAuthenticated: boolean;
  user: any;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  selectedItem,
  isAuthenticated,
  user,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'norma':
        return <FileText className="text-blue-500" size={20} />;
      case 'architecture':
        return <Monitor className="text-green-500" size={20} />;
      case 'anexo':
        return <Shield className="text-purple-500" size={20} />;
      default:
        return <FileText className="text-gray-500" size={20} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {selectedItem && getTypeIcon(selectedItem.type)}
                  <div>
                    <h3 className="font-bold text-lg">Detalles</h3>
                    <p className="text-blue-100 text-sm capitalize">
                      {selectedItem?.type || 'Información'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedItem ? (
                <div className="space-y-6">
                  {/* Título */}
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
                      {selectedItem.title || selectedItem.name}
                    </h4>
                    {selectedItem.mitreid && (
                      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        <Tag size={14} />
                        {selectedItem.mitreid}
                      </div>
                    )}
                  </div>

                  {/* Categoría */}
                  {selectedItem.categoryName && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="text-gray-600" size={16} />
                        <span className="font-medium text-gray-700">Categoría</span>
                      </div>
                      <p className="text-gray-800">{selectedItem.categoryName}</p>
                    </div>
                  )}

                  {/* Descripción */}
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-3">Descripción</h5>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedItem.description || 'No hay descripción disponible.'}
                    </p>
                  </div>

                  {/* Plataformas */}
                  {selectedItem.platforms && selectedItem.platforms.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-3">Plataformas</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.platforms.map((platform: string, index: number) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tácticas */}
                  {selectedItem.tactics && selectedItem.tactics.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-3">Tácticas</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.tactics.map((tactic: string, index: number) => (
                          <span
                            key={index}
                            className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {tactic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-3">Etiquetas</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mitigación */}
                  {selectedItem.mitigation && selectedItem.mitigation.description && (
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-3">Mitigación</h5>
                      <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                        <p className="text-gray-700">
                          {selectedItem.mitigation.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Detección */}
                  {selectedItem.detection && selectedItem.detection.description && (
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-3">Detección</h5>
                      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                        <p className="text-gray-700">
                          {selectedItem.detection.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Referencias */}
                  {selectedItem.references && selectedItem.references.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-3">Referencias</h5>
                      <div className="space-y-3">
                        {selectedItem.references.map((ref: any, index: number) => (
                          <div key={index} className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h6 className="font-medium text-blue-900">{ref.name}</h6>
                                {ref.description && (
                                  <p className="text-blue-700 text-sm mt-1">{ref.description}</p>
                                )}
                              </div>
                              {ref.url && (
                                <a
                                  href={ref.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-3 text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  <ExternalLink size={16} />
                                </a>
                              )}
                            </div>
                            {ref.url && (
                              <a
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-xs mt-2 block truncate"
                              >
                                {ref.url}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadatos si está autenticado */}
                  {isAuthenticated && (
                    <div className="border-t pt-6 space-y-4">
                      <h5 className="font-semibold text-gray-700 mb-3">Información del Sistema</h5>
                      
                      {selectedItem.createdAt && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>Creado: {formatDate(selectedItem.createdAt)}</span>
                        </div>
                      )}
                      
                      {selectedItem.updatedAt && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>Actualizado: {formatDate(selectedItem.updatedAt)}</span>
                        </div>
                      )}
                      
                      {selectedItem.createdBy && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User size={16} />
                          <span>Creado por: {selectedItem.createdBy.username || selectedItem.createdBy}</span>
                        </div>
                      )}
                      
                      {selectedItem.version && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Versión:</span> {selectedItem.version}
                        </div>
                      )}
                      
                      {selectedItem._id && user?.role === 'admin' && (
                        <div className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                          ID: {selectedItem._id}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Historial de revisiones si existe */}
                  {selectedItem.revisionHistory && selectedItem.revisionHistory.length > 0 && isAuthenticated && (
                    <div className="border-t pt-6">
                      <h5 className="font-semibold text-gray-700 mb-3">Historial de Cambios</h5>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedItem.revisionHistory.slice(0, 5).map((revision: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-gray-700">
                                v{revision.version}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {formatDate(revision.changedAt)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs leading-relaxed">
                              {revision.changes}
                            </p>
                            {revision.changedBy && (
                              <p className="text-gray-500 text-xs mt-2">
                                Por: {revision.changedBy.username || revision.changedBy}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Sin selección</p>
                    <p className="text-sm">Selecciona un elemento para ver sus detalles</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer con acciones si está autenticado */}
            {selectedItem && isAuthenticated && (user?.role === 'admin' || user?.role === 'editor') && (
              <div className="border-t p-6 bg-gray-50">
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      // Aquí irían las acciones de edición
                      console.log('Editar elemento:', selectedItem._id);
                    }}
                  >
                    Editar
                  </motion.button>
                  {user?.role === 'admin' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                      onClick={() => {
                        // Aquí irían las acciones de eliminación
                        console.log('Eliminar elemento:', selectedItem._id);
                      }}
                    >
                      Eliminar
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;