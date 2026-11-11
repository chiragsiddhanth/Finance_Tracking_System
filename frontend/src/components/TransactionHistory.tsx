import React, { useEffect, useState } from 'react';
import { 
  Search, 
  ArrowDownRight, 
  ArrowUpRight, 
  CreditCard,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { getTransactions, getCategories } from '../services/api';
import { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Sorting
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  const fetchCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions({
        type: typeFilter,
        categoryId: selectedCategory ? Number(selectedCategory) : undefined,
        search: searchTerm || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy,
        sortOrder,
      });
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, selectedCategory, searchTerm, startDate, endDate, sortBy, sortOrder]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Transaction History</span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              {transactions.length} items
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Unified view of all income deposits and expenditures</p>
        </div>

        {/* Type Filter Pills */}
        <div className="flex bg-slate-50 p-1 rounded-full border border-slate-100">
          {(
            [
              { id: 'ALL', label: 'All' },
              { id: 'INCOME', label: 'Income' },
              { id: 'EXPENSE', label: 'Expenses' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition ${
                typeFilter === t.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-full pl-9 pr-4 py-2 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
              <option key={c.id} value={c.id}>
                {c.name} ({c.type})
              </option>
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

        {(searchTerm || selectedCategory || startDate || endDate || typeFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setStartDate('');
              setEndDate('');
              setTypeFilter('ALL');
            }}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-2"
          >
            Reset
          </button>
        )}
      </div>

      {/* Unified Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Layers className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600 text-xs">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/70 text-[11px] font-semibold text-slate-400 border-b border-slate-100">
                <tr>
                  <th 
                    className="px-5 py-3.5 cursor-pointer hover:text-slate-700"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="px-5 py-3.5 cursor-pointer hover:text-slate-700"
                    onClick={() => toggleSort('title')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Title</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Payment Method</th>
                  <th 
                    className="px-5 py-3.5 text-right cursor-pointer hover:text-slate-700"
                    onClick={() => toggleSort('amount')}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Amount</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((t) => {
                  const isIncome = t.type === 'INCOME';
                  return (
                    <tr key={`${t.type}-${t.id}`} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5 text-slate-400 font-medium">
                        {formatDate(t.date)}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">
                        <div>{t.title}</div>
                        {t.description && (
                          <div className="text-[11px] font-normal text-slate-400 mt-0.5">{t.description}</div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isIncome
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-rose-50 text-rose-500 border border-rose-100'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-3 h-3 mr-0.5" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 mr-0.5" />
                          )}
                          <span>{t.type}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{
                            backgroundColor: `${t.categoryColor || '#3b82f6'}15`,
                            color: t.categoryColor || '#3b82f6',
                            border: `1px solid ${t.categoryColor || '#3b82f6'}30`,
                          }}
                        >
                          {t.categoryName || 'Standard'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {t.paymentMethodName ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {t.paymentMethodName}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className={`px-5 py-3.5 text-right font-black ${
                        isIncome ? 'text-emerald-600' : 'text-rose-500'
                      }`}>
                        {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
