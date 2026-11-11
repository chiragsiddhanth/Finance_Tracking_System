import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Tags, 
  X
} from 'lucide-react';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../services/api';
import { Category, CategoryType } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface CategoryManagementProps {
  onDataChanged?: () => void;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({ onDataChanged }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<CategoryType>('EXPENSE');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'EXPENSE' as CategoryType,
    color: '#3b82f6',
  });

  // Delete Modal
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories(activeTab);
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [activeTab]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      type: activeTab,
      color: activeTab === 'INCOME' ? '#10b981' : '#f97316',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color || '#3b82f6',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      setIsModalOpen(false);
      fetchCategories();
      onDataChanged?.();
    } catch (err: any) {
      console.error('Failed to save category', err);
      alert(err.response?.data?.message || 'Failed to save category.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId !== null) {
      try {
        await deleteCategory(deleteId);
        setDeleteId(null);
        fetchCategories();
        onDataChanged?.();
      } catch (err) {
        console.error('Failed to delete category', err);
      }
    }
  };

  const PRESET_COLORS = [
    '#3b82f6', '#f97316', '#10b981', '#06b6d4', '#eab308',
    '#ec4899', '#8b5cf6', '#6366f1', '#14b8a6', '#f43f5e',
    '#64748b'
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Category Management</span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              {categories.length} categories
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Customize tags and color codes for spending and income sources</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-full shadow-md shadow-blue-500/25 transition text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-50 p-1 rounded-full border border-slate-100 w-fit">
        <button
          onClick={() => setActiveTab('EXPENSE')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
            activeTab === 'EXPENSE'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Expense Categories
        </button>
        <button
          onClick={() => setActiveTab('INCOME')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
            activeTab === 'INCOME'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Income Categories
        </button>
      </div>

      {/* Category Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center text-slate-400 space-y-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <Tags className="w-8 h-8 mx-auto text-slate-300" />
          <p className="font-semibold text-slate-600 text-xs">No categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color || '#3b82f6' }}
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">{cat.name}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{cat.type}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(cat.id)}
                  className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-rose-500 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subscriptions, Groceries, Consulting"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as CategoryType })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="EXPENSE">Expense Category</option>
                  <option value="INCOME">Income Category</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Color Badge</label>
                <div className="flex items-center space-x-3 mb-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-500">{formData.color}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: hex })}
                      className="w-5 h-5 rounded-full border border-slate-200 transition hover:scale-110"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full shadow-md shadow-blue-500/25 transition"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
