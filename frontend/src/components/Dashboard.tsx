import React, { useEffect, useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Plus, 
  ChevronRight,
  Database,
  Trash,
  RefreshCw
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { getDashboardAnalytics, getExpenses, populateDemoData, clearDemoData } from '../services/api';
import { DashboardAnalytics, Expense, Income } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface DashboardProps {
  onNavigateTab?: (tab: string) => void;
  onOpenAddExpense?: () => void;
  onOpenAddIncome?: () => void;
  currentTab: string;
}

type FilterPeriod = '7d' | '30d' | 'this_month' | 'last_month' | 'custom';

export const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigateTab, 
  onOpenAddExpense,
  onOpenAddIncome,
  currentTab
}) => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('30d');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isDemoLoading, setIsDemoLoading] = useState<boolean>(false);

  const handlePopulateDemo = async () => {
    setIsDemoLoading(true);
    try {
      await populateDemoData();
      const { start, end } = computeDateRange(filterPeriod);
      await loadData(start, end);
    } catch (err) {
      console.error('Failed to populate demo data', err);
      alert('Failed to populate demo data');
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleClearDemo = async () => {
    if (!window.confirm('Are you sure you want to clear all income and expense transactions?')) return;
    setIsDemoLoading(true);
    try {
      await clearDemoData();
      const { start, end } = computeDateRange(filterPeriod);
      await loadData(start, end);
    } catch (err) {
      console.error('Failed to clear data', err);
      alert('Failed to clear data');
    } finally {
      setIsDemoLoading(false);
    }
  };

  const computeDateRange = (period: FilterPeriod) => {
    const today = new Date();
    const formatDateStr = (d: Date) => d.toISOString().split('T')[0];

    let start = '';
    let end = formatDateStr(today);

    if (period === '7d') {
      const d = new Date();
      d.setDate(today.getDate() - 6);
      start = formatDateStr(d);
    } else if (period === '30d') {
      const d = new Date();
      d.setDate(today.getDate() - 29);
      start = formatDateStr(d);
    } else if (period === 'this_month') {
      start = formatDateStr(new Date(today.getFullYear(), today.getMonth(), 1));
      end = formatDateStr(new Date(today.getFullYear(), today.getMonth() + 1, 0));
    } else if (period === 'last_month') {
      start = formatDateStr(new Date(today.getFullYear(), today.getMonth() - 1, 1));
      end = formatDateStr(new Date(today.getFullYear(), today.getMonth(), 0));
    }
    return { start, end };
  };

  const loadData = async (sDate?: string, eDate?: string) => {
    setLoading(true);
    try {
      const [analyticsData, expList] = await Promise.all([
        getDashboardAnalytics(sDate, eDate),
        getExpenses({ startDate: sDate, endDate: eDate })
      ]);
      setAnalytics(analyticsData);
      setRecentExpenses(expList.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterPeriod !== 'custom') {
      const { start, end } = computeDateRange(filterPeriod);
      setStartDate(start);
      setEndDate(end);
      loadData(start, end);
    }
  }, [filterPeriod]);

  const DONUT_COLORS = ['#3b82f6', '#f97316', '#06b6d4', '#eab308', '#ec4899', '#8b5cf6', '#10b981'];

  // Smooth line chart data
  const lineChartData = analytics?.dailySavingsTrend?.map((d) => ({
    date: d.date.slice(5),
    Income: d.dailyIncome,
    Expenses: d.dailyExpense,
    Savings: d.cumulativeSavings
  })) || [];

  // Monthly comparison data for modern pillar utilization bars (from second UI)
  const monthlyBarData = analytics?.monthlyComparison?.map((m) => ({
    month: m.month,
    Income: m.income,
    Expense: m.expense,
    Savings: m.savings
  })) || [];

  return (
    <div className="space-y-6">
      {/* Top Header matching Second UI (Pill Nav + Search + Actions) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Horizontal Navigation Pills (Finexa style from UI 2) */}
        <div className="flex items-center space-x-1.5 bg-white px-2 py-1.5 rounded-full border border-slate-100 shadow-sm overflow-x-auto max-w-full">
          {[
            { id: 'dashboard', label: 'Overview' },
            { id: 'expenses', label: 'Expenses' },
            { id: 'income', label: 'Income' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'categories', label: 'Categories' },
          ].map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateTab?.(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Search & Quick Actions */}
        <div className="flex items-center space-x-2.5 w-full lg:w-auto justify-end flex-wrap gap-y-2">
          {/* Fill Mock Data & Clear DB Demo Buttons */}
          <button
            onClick={handlePopulateDemo}
            disabled={isDemoLoading}
            title="Populate mock income & expenses for demonstration"
            className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3.5 py-2 rounded-full text-xs transition border border-indigo-200"
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isDemoLoading ? 'Loading...' : 'Fill Mock Data'}</span>
          </button>

          <button
            onClick={handleClearDemo}
            disabled={isDemoLoading}
            title="Clear all transactions"
            className="flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3.5 py-2 rounded-full text-xs transition border border-rose-200"
          >
            <Trash className="w-3.5 h-3.5 text-rose-500" />
            <span>Clear DB</span>
          </button>

          {/* Rounded Search pill */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-white border border-slate-200/80 rounded-full pl-9 pr-4 py-2 text-xs font-medium text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            onClick={onOpenAddExpense}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-full shadow-sm text-xs transition whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>Add Expense</span>
          </button>
          
          <button
            onClick={onOpenAddIncome}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-full shadow-md shadow-blue-500/25 text-xs transition whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      {/* Title & Subtitle Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Financial Overview</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Plan, track, and monitor your personal cash flow with ease.
          </p>
        </div>

        {/* Period Filter Dropdown Pill */}
        <div className="flex bg-white p-1 rounded-full border border-slate-100 shadow-sm w-fit">
          {(
            [
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: 'this_month', label: 'This Month' },
              { id: 'last_month', label: 'Last Month' },
            ] as const
          ).map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterPeriod(btn.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                filterPeriod === btn.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 KPI Cards (Income, Expenses, Net Savings/Balance) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Income</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              {analytics && analytics.totalIncome > 0 ? 'Active' : '0%'}
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(analytics?.totalIncome || 0)}
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Total revenue earned in period</p>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Expenses</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-500 border border-rose-100">
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
              {analytics && analytics.totalExpenses > 0 ? 'Outflow' : '0%'}
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(analytics?.totalExpenses || 0)}
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Total expenditure recorded</p>
          </div>
        </div>

        {/* Balance / Net Savings Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Net Balance</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              {analytics?.savingsPercentage?.toFixed(0) || 0}% Savings
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(analytics?.netSavings || 0)}
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Net accumulated savings</p>
          </div>
        </div>
      </div>

      {/* Middle Row 1: Line Chart (Income vs Expense Curves) & Donut Chart (Cash flow) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Line Spline Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900">Income & Expense Trajectory</h4>
              <div className="flex items-center space-x-4 mt-2">
                <span className="flex items-center text-xs font-semibold text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-2"></span>
                  Income
                </span>
                <span className="flex items-center text-xs font-semibold text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-2"></span>
                  Expenses
                </span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  formatter={(val: any) => formatCurrency(Number(val))}
                />
                <Line
                  type="natural"
                  dataKey="Income"
                  stroke="#2563eb"
                  strokeWidth={2.8}
                  dot={false}
                  activeDot={{ r: 5, stroke: '#2563eb', strokeWidth: 2, fill: '#ffffff' }}
                />
                <Line
                  type="natural"
                  dataKey="Expenses"
                  stroke="#f97316"
                  strokeWidth={2.8}
                  dot={false}
                  activeDot={{ r: 5, stroke: '#f97316', strokeWidth: 2, fill: '#ffffff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart (Cash flow) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900">Cash Flow Allocation</h4>
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
              Categories
            </span>
          </div>

          {analytics?.expenseCategoryBreakdown && analytics.expenseCategoryBreakdown.length > 0 ? (
            <div className="h-64 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.expenseCategoryBreakdown}
                    dataKey="amount"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                  >
                    {analytics.expenseCategoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                    formatter={(val: any) => formatCurrency(Number(val))}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    layout="horizontal"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs space-y-1">
              <span>No category outflow data yet</span>
              <span className="text-[10px] text-slate-300">Add an expense to populate distribution</span>
            </div>
          )}
        </div>
      </div>

      {/* Middle Row 2: Pillar Utilization & Spending Rate from UI 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Pillar Bar Chart (from Second UI "Budget Utilization") */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900">Monthly Comparison</h4>
              <p className="text-xs text-slate-400 mt-0.5">Comparative bar analysis of earnings vs spending</p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mr-1.5"></span>
                Income
              </span>
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 mr-1.5"></span>
                Expenses
              </span>
            </div>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  formatter={(val: any) => formatCurrency(Number(val))}
                />
                <Bar dataKey="Income" fill="#6366f1" radius={[8, 8, 8, 8]} barSize={24} />
                <Bar dataKey="Expense" fill="#e2e8f0" radius={[8, 8, 8, 8]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spend Rhythm Card (from UI 2 "Recurring Payments" card) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900">Spending Burn Rate</h4>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Daily Avg
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Average daily expenditure tracked</p>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-slate-900">
              {formatCurrency(analytics?.averageDailyExpenditure || 0)}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              across {analytics?.totalDays || 0} active days
            </div>

            {/* Visual utilization progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 mt-4 overflow-hidden">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, analytics?.savingsPercentage || 0))}%`
                }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 mt-1.5">
              <span>Savings retention</span>
              <span className="text-indigo-600">{analytics?.savingsPercentage?.toFixed(0) || 0}%</span>
            </div>
          </div>

          {/* Quick breakdown rows */}
          <div className="pt-2 border-t border-slate-50 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Recorded Expenses</span>
              <span className="font-bold text-slate-800">{recentExpenses.length} entries</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Status</span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                (analytics?.netSavings ?? 0) >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
              }`}>
                {(analytics?.netSavings ?? 0) >= 0 ? 'Surplus' : 'Deficit'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Expenses Table matching UI 1 */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-slate-900">Recent expenses</h4>
          <button
            onClick={() => onNavigateTab?.('expenses')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>See all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No recent expenses found. Click &ldquo;Add Expense&rdquo; above to record your first transaction.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="text-[11px] font-semibold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Pay</th>
                  <th className="py-3 px-4">Classify</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {exp.title}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {formatCurrency(exp.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {exp.paymentMethodName || 'Cash'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${exp.categoryColor || '#3b82f6'}15`,
                          color: exp.categoryColor || '#3b82f6',
                          border: `1px solid ${exp.categoryColor || '#3b82f6'}30`,
                        }}
                      >
                        {exp.categoryName || 'Standard'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">
                      {formatDate(exp.date)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onNavigateTab?.('expenses')}
                        className="text-[11px] font-semibold text-slate-400 hover:text-blue-600 transition"
                      >
                        Details &gt;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
