export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  color: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
}

export interface Income {
  id: number;
  title: string;
  amount: number;
  categoryId: number;
  categoryName?: string;
  categoryColor?: string;
  date: string;
  description?: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  categoryId: number;
  categoryName?: string;
  categoryColor?: string;
  paymentMethodId: number;
  paymentMethodName?: string;
  date: string;
  description?: string;
}

export interface Transaction {
  id: number;
  type: 'INCOME' | 'EXPENSE';
  title: string;
  amount: number;
  categoryId?: number;
  categoryName?: string;
  categoryColor?: string;
  paymentMethodId?: number;
  paymentMethodName?: string;
  date: string;
  description?: string;
}

export interface DailySavingsTrend {
  date: string;
  dailyIncome: number;
  dailyExpense: number;
  dailySavings: number;
  cumulativeSavings: number;
}

export interface MonthlyComparison {
  month: string;
  income: number;
  expense: number;
  savings: number;
}

export interface CategoryBreakdown {
  categoryId: number;
  categoryName: string;
  color: string;
  amount: number;
  percentage: number;
}

export interface MonthlySavingsTrend {
  month: string;
  savings: number;
  cumulativeSavings: number;
}

export interface DailyExpenditure {
  date: string;
  amount: number;
}

export interface DashboardAnalytics {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsPercentage: number;
  averageDailyExpenditure: number;
  totalDays: number;
  dailySavingsTrend: DailySavingsTrend[];
  monthlyComparison: MonthlyComparison[];
  expenseCategoryBreakdown: CategoryBreakdown[];
  monthlySavingsTrend: MonthlySavingsTrend[];
  dailyExpenditure: DailyExpenditure[];
}

