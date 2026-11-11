import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  ArrowUpCircle,
  X
} from 'lucide-react';
import {
  getIncomes,
  createIncome,
  updateIncome,
  deleteIncome,
  getCategories
} from '../services/api';
import { Income, Category } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ConfirmModal } from './ConfirmModal';

interface IncomeManagementProps {
  onDataChanged?: () => void;
  isAddOpenExternally?: boolean;
  onCloseAddModal?: () => void;
}

export const IncomeManagement: React.FC<IncomeManagementProps> = ({
  onDataChanged,
  isAddOpenExternally,
  onCloseAddModal
}) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  // Delete Confirm Modal
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      const cats = await getCategories('INCOME');
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load income categories', err);
    }
  };

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const data = await getIncomes({
        search: searchTerm || undefined,
        categoryId: selectedCategory ? Number(selectedCategory) : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setIncomes(data);
    } catch (err) {
      console.error('Failed to load income records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchIncomes();
  }, [searchTerm, selectedCategory, startDate, endDate]);

  useEffect(() => {
    if (isAddOpenExternally) {
      handleOpenAdd();
    }
  }, [isAddOpenExternally]);

  const handleOpenAdd = () => {
    setEditingIncome(null);
    setFormData({
      title: '',
      amount: '',
      categoryId: categories[0]?.id ? String(categories[0].id) : '',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (income: Income) => {
    setEditingIncome(income);
    setFormData({
      title: income.title,
      amount: String(income.amount),
      categoryId: String(income.categoryId),
      date: income.date,
      description: income.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.categoryId || !formData.date) {
      return;
    }

    try {
      const payload = {
        title: formData.title,
        amount: Number(formData.amount),
        categoryId: Number(formData.categoryId),
        date: formData.date,
        description: formData.description,
      };

      if (editingIncome) {
        await updateIncome(editingIncome.id, payload);
      } else {
        await createIncome(payload);
      }
      setIsModalOpen(false);
      onCloseAddModal?.();
      fetchIncomes();
      onDataChanged?.();
    } catch (err) {
      console.error('Failed to save income', err);
      alert('Failed to save income. Please check the values.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId !== null) {
      try {
        await deleteIncome(deleteId);
        setDeleteId(null);
        fetchIncomes();
        onDataChanged?.();
      } catch (err) {
        console.error('Failed to delete income', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Income</span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              {incomes.length} records
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Track income sources, salary, investments, and payouts</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-full shadow-md shadow-emerald-500/25 transition text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Income</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-full pl-9 pr-4 py-2 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Category Filter */}
        <div className="min-w-[140px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-full px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center space-x-1.5">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
          />
          <span className="text-slate-400 text-xs">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
          />
        </div>

        {(searchTerm || selectedCategory || startDate || endDate) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setStartDate('');
              setEndDate('');
            }}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold px-2"
          >
            Reset
          </button>
        )}
      </div>

      {/* Income Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading income records...</div>
        ) : incomes.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <ArrowUpCircle className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600 text-xs">No income records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/70 text-[11px] font-semibold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Title</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Amount</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {incomes.map((income) => (
                  <tr key={income.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-800">
                      <div>{income.title}</div>
                      {income.description && (
                        <div className="text-[11px] font-normal text-slate-400 mt-0.5">{income.description}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${income.categoryColor || '#10b981'}15`,
                          color: income.categoryColor || '#10b981',
                          border: `1px solid ${income.categoryColor || '#10b981'}30`,
                        }}
                      >
                        {income.categoryName || 'Standard'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-medium">
                      {formatDate(income.date)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-black text-emerald-600">
                      +{formatCurrency(income.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(income)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(income.id)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingIncome ? 'Edit Income' : 'Add New Income'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  onCloseAddModal?.();
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Income Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salary, Stock Dividends"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="" disabled>Select</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    onCloseAddModal?.();
                  }}
                  className="px-4 py-2 rounded-full border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-full shadow-md shadow-emerald-500/25 transition"
                >
                  Save Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Income"
        message="Are you sure you want to delete this income record?"
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
