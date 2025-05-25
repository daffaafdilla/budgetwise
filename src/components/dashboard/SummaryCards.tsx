import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency, getCurrentMonth, calculateMonthProgress } from '../../utils/dateUtils';

const SummaryCards: React.FC = () => {
  const { state } = useBudget();
  const { transactions } = state;

  const currentMonth = getCurrentMonth();
  const monthProgress = calculateMonthProgress();

  // Calculate total income, expenses and balance
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((total, t) => total + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((total, t) => total + t.amount, 0);

  const balance = income - expenses;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(income),
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      color: 'bg-green-50 text-green-800',
      trend: '+12% from last month',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(expenses),
      icon: <TrendingDown className="h-6 w-6 text-red-500" />,
      color: 'bg-red-50 text-red-800',
      trend: '-5% from last month',
    },
    {
      title: 'Current Balance',
      value: formatCurrency(balance),
      icon: <Wallet className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-50 text-blue-800',
      trend: `${savingsRate}% savings rate`,
    },
    {
      title: 'Month Progress',
      value: `${Math.round(monthProgress)}%`,
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
      color: 'bg-purple-50 text-purple-800',
      trend: currentMonth,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm p-5 transition-all duration-200 hover:shadow-md"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
              <p className="text-xs mt-1 text-gray-500">{card.trend}</p>
            </div>
            <div className={`p-3 rounded-full ${card.color.split(' ')[0]}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;