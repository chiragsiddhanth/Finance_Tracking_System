import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ExpenseManagement } from './components/ExpenseManagement';
import { IncomeManagement } from './components/IncomeManagement';
import { TransactionHistory } from './components/TransactionHistory';
import { CategoryManagement } from './components/CategoryManagement';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isExternalAddExpenseOpen, setIsExternalAddExpenseOpen] = useState<boolean>(false);
  const [isExternalAddIncomeOpen, setIsExternalAddIncomeOpen] = useState<boolean>(false);

  const handleDataChanged = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleOpenAddExpenseFromDashboard = () => {
    setCurrentTab('expenses');
    setIsExternalAddExpenseOpen(true);
  };

  const handleOpenAddIncomeFromDashboard = () => {
    setCurrentTab('income');
    setIsExternalAddIncomeOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-[#f0f4f9] text-slate-800 font-sans">
      {/* Sidebar with toggle open/collapse */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              key={refreshKey}
              currentTab={currentTab}
              onNavigateTab={setCurrentTab}
              onOpenAddExpense={handleOpenAddExpenseFromDashboard}
              onOpenAddIncome={handleOpenAddIncomeFromDashboard}
            />
          )}
          {currentTab === 'expenses' && (
            <ExpenseManagement
              onDataChanged={handleDataChanged}
              isAddOpenExternally={isExternalAddExpenseOpen}
              onCloseAddModal={() => setIsExternalAddExpenseOpen(false)}
            />
          )}
          {currentTab === 'income' && (
            <IncomeManagement
              onDataChanged={handleDataChanged}
              isAddOpenExternally={isExternalAddIncomeOpen}
              onCloseAddModal={() => setIsExternalAddIncomeOpen(false)}
            />
          )}
          {currentTab === 'transactions' && <TransactionHistory key={refreshKey} />}
          {currentTab === 'categories' && <CategoryManagement onDataChanged={handleDataChanged} />}
        </div>
      </main>
    </div>
  );
};

export default App;
