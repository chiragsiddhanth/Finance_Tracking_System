import axios from 'axios';
import {
  Category,
  CategoryType,
  PaymentMethod,
  Income,
  Expense,
  Transaction,
  DashboardAnalytics,
} from '../types';

const api = axios.create({
  baseURL: '/api',
});

// Category API
export const getCategories = (type?: CategoryType) =>
  api.get<Category[]>('/categories', { params: { type } }).then((res) => res.data);

export const createCategory = (data: Partial<Category>) =>
  api.post<Category>('/categories', data).then((res) => res.data);

export const updateCategory = (id: number, data: Partial<Category>) =>
  api.put<Category>(`/categories/${id}`, data).then((res) => res.data);

export const deleteCategory = (id: number) =>
  api.delete(`/categories/${id}`);

export const getPaymentMethods = () =>
  api.get<PaymentMethod[]>('/categories/payment-methods').then((res) => res.data);

// Income API
export const getIncomes = (params?: { startDate?: string; endDate?: string; categoryId?: number; search?: string }) =>
  api.get<Income[]>('/income', { params }).then((res) => res.data);

export const createIncome = (data: Omit<Income, 'id'>) =>
  api.post<Income>('/income', data).then((res) => res.data);

export const updateIncome = (id: number, data: Partial<Income>) =>
  api.put<Income>(`/income/${id}`, data).then((res) => res.data);

export const deleteIncome = (id: number) =>
  api.delete(`/income/${id}`);

// Expense API
export const getExpenses = (params?: { startDate?: string; endDate?: string; categoryId?: number; paymentMethodId?: number; search?: string }) =>
  api.get<Expense[]>('/expenses', { params }).then((res) => res.data);

export const createExpense = (data: Omit<Expense, 'id'>) =>
  api.post<Expense>('/expenses', data).then((res) => res.data);

export const updateExpense = (id: number, data: Partial<Expense>) =>
  api.put<Expense>(`/expenses/${id}`, data).then((res) => res.data);

export const deleteExpense = (id: number) =>
  api.delete(`/expenses/${id}`);

// Transactions API
export const getTransactions = (params?: {
  startDate?: string;
  endDate?: string;
  type?: string;
  categoryId?: number;
  paymentMethodId?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}) => api.get<Transaction[]>('/transactions', { params }).then((res) => res.data);

// Dashboard Analytics API
export const getDashboardAnalytics = (startDate?: string, endDate?: string) =>
  api.get<DashboardAnalytics>('/analytics/dashboard', { params: { startDate, endDate } }).then((res) => res.data);

// Demo Data API
export const populateDemoData = () =>
  api.post<{ message: string }>('/demo/populate').then((res) => res.data);

export const clearDemoData = () =>
  api.post<{ message: string }>('/demo/clear').then((res) => res.data);

export default api;

