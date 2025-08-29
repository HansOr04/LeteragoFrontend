'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  FolderPlus, 
  FileText, 
  Save, 
  X,
  Shield,
  Users,
  Database
} from 'lucide-react';
import { apiService } from '@/services/api';
import { Category, Technique, User } from '@/types';

interface AdminPageProps {}

const AdminPage: React.FC<AdminPageProps> = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'techniques' | 'users'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'category' | 'technique'>('category');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  // Form data para modales
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    color: '#3498db',
    icon: 'folder',
    parentCategory: '',
    order: 0
  });

  const [techniqueForm, setTechniqueForm] = useState({
    name: '',
    description: '',
    category: '',
    mitreid: '',
    tags: '',
    platforms: [],
    tactics: [],
    references: []
  });

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
        return;
      }
      
      const response = await apiService.getProfile();
      if (response.user.role !== 'admin' && response.user.role !== 'editor') {
        alert('No tienes permisos para acceder a esta página');
        window.location.href = '/';
        return;
      }
      
      setUser(response.user);
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      window.location.href = '/';
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, techniquesRes] = await Promise.all([
        apiService.getCategories(),
        apiService.getTechniques()
      ]);
      setCategories(categoriesRes.categories || []);
      setTechniques(techniquesRes.techniques || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: 'category' | 'technique', item?: any) => {
    setModalType(type);
    setEditingItem(item);
    
    if (type === 'category') {
      setCategoryForm(item ? {
        name: item.name,
        description: item.description,
        color: item.color || '#3498db',
        icon: item.icon || 'folder',
        parentCategory: item.parentCategory || '',
        order: item.order || 0
      } : {
        name: '',
        description: '',
        color: '#3498db',
        icon: 'folder',
        parentCategory: '',
        order: 0
      });
    } else {
      setTechniqueForm(item ? {
        name: item.name,
        description: item.description,
        category: item.category,
        mitreid: item.mitreid || '',
        tags: item.tags?.join(', ') || '',
        platforms: item.platforms || [],
        tactics: item.tactics || [],
        references: item.references || []
      } : {
        name: '',
        description: '',
        category: '',
        mitreid: '',
        tags: '',
        platforms: [],
        tactics: [],
        references: []
      });
    }
    
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (modalType === 'category') {
        const data = {
          ...categoryForm,
          order: Number(categoryForm.order)
        };
        
        if (editingItem) {
          await apiService.updateCategory(editingItem._id, data);
        } else {
          await apiService.createCategory(data);
        }
      } else {
        const data = {
          ...techniqueForm,
          tags: techniqueForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        };
        
        if (editingItem) {
          await apiService.updateTechnique(editingItem._id, data);
        } else {
          await apiService.createTechnique(data);
        }
      }
      
      setShowModal(false);
      setEditingItem(null);
      await loadData();
    } catch (error: any) {
      console.error('Error guardando:', error);
      alert(error.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: 'category' | 'technique', id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;
    
    try {
      setLoading(true);
      
      if (type === 'category') {
        await apiService.deleteCategory(id);
      } else {
        await apiService.deleteTechnique(id);
      }
      
      await loadData();
    } catch (error: any) {
      console.error('Error eliminando:', error);
      alert(error.response?.data?.message || 'Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTechniques = techniques.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600">Gestiona categorías, técnicas y usuarios del sistema</p>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          {[
            { id: 'categories', label: 'Categorías', icon: FolderPlus },
            { id: 'techniques', label: 'Técnicas', icon: FileText },
            { id: 'users', label: 'Usuarios', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-4 px-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Buscar ${activeTab === 'categories' ? 'categorías' : 'técnicas'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {activeTab !== 'users' && (
            <button
              onClick={() => openModal(activeTab === 'categories' ? 'category' : 'technique')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Crear {activeTab === 'categories' ? 'Categoría' : 'Técnica'}
            </button>
          )}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid gap-4">
                {filteredCategories.map((category) => (
                  <div key={category._id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                          <span className="text-sm text-gray-500">#{category.slug}</span>
                        </div>
                        <p className="text-gray-600 mb-3">{category.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Orden: {category.order}</span>
                          <span>Activa: {category.isActive ? 'Sí' : 'No'}</span>
                          <span>Creada: {new Date(category.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal('category', category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete('category', category._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'techniques' && (
            <motion.div
              key="techniques"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid gap-4">
                {filteredTechniques.map((technique) => (
                  <div key={technique._id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{technique.name}</h3>
                          {technique.mitreid && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                              {technique.mitreid}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{technique.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span>Versión: {technique.version}</span>
                          <span>Activa: {technique.isActive ? 'Sí' : 'No'}</span>
                          <span>Creada: {new Date(technique.createdAt).toLocaleDateString()}</span>
                        </div>
                        {technique.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {technique.tags.map((tag, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal('technique', technique)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        {(user?.role === 'admin' || technique.createdBy === user?._id) && (
                          <button
                            onClick={() => handleDelete('technique', technique._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal para crear/editar */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    {editingItem ? 'Editar' : 'Crear'} {modalType === 'category' ? 'Categoría' : 'Técnica'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {modalType === 'category' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Nombre de la categoría"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción *
                      </label>
                      <textarea
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Descripción de la categoría"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color
                        </label>
                        <input
                          type="color"
                          value={categoryForm.color}
                          onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})}
                          className="w-full h-10 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Orden
                        </label>
                        <input
                          type="number"
                          value={categoryForm.order}
                          onChange={(e) => setCategoryForm({...categoryForm, order: Number(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={techniqueForm.name}
                        onChange={(e) => setTechniqueForm({...techniqueForm, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Nombre de la técnica"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción *
                      </label>
                      <textarea
                        value={techniqueForm.description}
                        onChange={(e) => setTechniqueForm({...techniqueForm, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Descripción de la técnica"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Categoría *
                        </label>
                        <select
                          value={techniqueForm.category}
                          onChange={(e) => setTechniqueForm({...techniqueForm, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Selecciona una categoría</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          MITRE ID
                        </label>
                        <input
                          type="text"
                          value={techniqueForm.mitreid}
                          onChange={(e) => setTechniqueForm({...techniqueForm, mitreid: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="T1234"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (separados por coma)
                      </label>
                      <input
                        type="text"
                        value={techniqueForm.tags}
                        onChange={(e) => setTechniqueForm({...techniqueForm, tags: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="malware, persistence, windows"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                    <Save size={16} />
                    Guardar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;