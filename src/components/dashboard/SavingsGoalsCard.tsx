import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency } from '../../utils/dateUtils';
import { Link } from 'react-router-dom';

const SavingsGoalsCard: React.FC = () => {
  const { state } = useBudget();
  const { savingsGoals } = state;

  // Show only top 3 savings goals
  const topGoals = savingsGoals.slice(0, 3);

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Savings Goals</h3>
        <Link
          to="/goals"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {topGoals.length > 0 ? (
          topGoals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: goal.color }}
                    ></div>
                    <span className="font-medium text-gray-800">{goal.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500 ease-in-out"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: goal.color,
                    }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{`${Math.round(progress)}% complete`}</span>
                  <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 text-gray-500">No savings goals set</div>
        )}
      </div>
    </div>
  );
};

export default SavingsGoalsCard;