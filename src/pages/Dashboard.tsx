import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import SummaryCards from '../components/dashboard/SummaryCards';
import SpendingTrends from '../components/dashboard/SpendingTrends';
import BudgetProgress from '../components/dashboard/BudgetProgress';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import SavingsGoalsCard from '../components/dashboard/SavingsGoalsCard';
import TransactionForm from '../components/transactions/TransactionForm';

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Transaction
        </button>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SpendingTrends />
        <ExpenseChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BudgetProgress />
        <SavingsGoalsCard />
      </div>

      <RecentTransactions />

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <TransactionForm
              onClose={() => {
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;