import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useBudget } from '../../context/BudgetContext';
import { generateMonthlyData } from '../../utils/chartUtils';

const SpendingTrends: React.FC = () => {
  const { state } = useBudget();
  const { transactions } = state;
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const data = generateMonthlyData(transactions);
    setChartData(data);
  }, [transactions]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 flex items-center justify-center h-80">
        <p className="text-gray-500">No data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Spending Trends</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value) => [`$${value}`, null]}
              contentStyle={{
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: 'none',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar
              name="Income"
              dataKey="income"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              barSize={20}
              animationDuration={1000}
            />
            <Bar
              name="Expenses"
              dataKey="expense"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
              barSize={20}
              animationDuration={1000}
            />
            <Bar
              name="Savings"
              dataKey="savings"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              barSize={20}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingTrends;