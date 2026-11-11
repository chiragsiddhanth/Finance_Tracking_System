import React from 'react';
import { 
  Home, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ReceiptText, 
  Tags,
  ChevronLeft,
  ChevronRight,
  Wallet
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isExpanded,
  setIsExpanded,
}) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Overview' },
    { id: 'expenses', icon: ArrowDownCircle, label: 'Expenses' },
    { id: 'income', icon: ArrowUpCircle, label: 'Income' },
    { id: 'transactions', icon: ReceiptText, label: 'Transactions' },
    { id: 'categories', icon: Tags, label: 'Categories' },
  ];

  return (
    <aside
      className={`min-h-screen bg-white border-r border-slate-100 flex flex-col justify-between py-6 transition-all duration-300 ease-in-out flex-shrink-0 z-20 ${
        isExpanded ? 'w-60 px-4' : 'w-20 px-3'
      }`}
    >
      <div className="flex flex-col space-y-7 w-full">
        {/* Brand / Logo header with collapse toggle */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-3 overflow-hidden cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/25 flex-shrink-0">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            {isExpanded && (
              <div className="flex flex-col animate-in fade-in duration-200">
                <span className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                  FinanceTracker
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Personal Edition
                </span>
              </div>
            )}
          </div>

          {/* Toggle expand/collapse button */}
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col space-y-2 w-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                title={!isExpanded ? item.label : undefined}
                className={`relative flex items-center transition-all duration-200 rounded-2xl ${
                  isExpanded ? 'px-4 py-3 space-x-3.5 w-full text-left' : 'w-12 h-12 justify-center mx-auto'
                } ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-bold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {isExpanded && (
                  <span className="text-xs font-semibold whitespace-nowrap animate-in fade-in duration-150">
                    {item.label}
                  </span>
                )}
                {!isExpanded && (
                  <span className="absolute left-16 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md opacity-0 pointer-events-none hover:opacity-100 transition whitespace-nowrap shadow-md z-30">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom expand button when collapsed */}
      {!isExpanded && (
        <div className="flex justify-center w-full">
          <button
            onClick={() => setIsExpanded(true)}
            className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
