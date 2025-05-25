import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency } from '../../utils/dateUtils';
import { Link } from 'react-router-dom';

const RecentTransactions: React.FC = () => {
  const { state } = useBudget();
  const { transactions } = state;

  // Get most recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
        <Link
          to="/transactions"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full mr-3 ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-xs text-gray-500">
                    {transaction.category} • {transaction.date}
                  </p>
                </div>
              </div>
              <span
                className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">No recent transactions</div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;