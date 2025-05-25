import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency } from '../../utils/dateUtils';

const BudgetProgress: React.FC = () => {
  const { state } = useBudget();
  const { transactions, categories } = state;

  const expenseCategories = categories.filter(
    (category) => category.type === 'expense' && category.budget > 0
  );

  const getCategorySpent = (categoryName: string) => {
    return transactions
      .filter((t) => t.type === 'expense' && t.category === categoryName)
      .reduce((total, t) => total + t.amount, 0);
  };

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressPercentage = (spent: number, budget: number) => {
    return Math.min(Math.round((spent / budget) * 100), 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Progress</h3>

      <div className="space-y-4">
        {expenseCategories.map((category) => {
          const spent = getCategorySpent(category.name);
          const progressPercentage = getProgressPercentage(spent, category.budget);
          const statusColor = getBudgetStatus(spent, category.budget);

          return (
            <div key={category.id}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(spent)} / {formatCurrency(category.budget)}
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${statusColor} transition-all duration-500 ease-in-out`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}

        {expenseCategories.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No budget categories set up. Create budget categories to track your spending.
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetProgress;