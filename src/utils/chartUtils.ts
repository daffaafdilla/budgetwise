export const generateChartColors = (count: number): string[] => {
  const baseColors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
  ];

  // If we have fewer items than colors, just return the needed colors
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  // Otherwise, repeat the colors as needed
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
};

export const calculateCategoryTotals = (
  transactions: any[],
  categories: any[],
  type: 'income' | 'expense'
) => {
  const filteredTransactions = transactions.filter((t) => t.type === type);
  
  const categoryTotals = categories
    .filter((c) => c.type === type)
    .map((category) => {
      const total = filteredTransactions
        .filter((t) => t.category === category.name)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: category.name,
        value: total,
        color: category.color,
      };
    })
    .filter((c) => c.value > 0);
  
  return categoryTotals;
};

export const generateMonthlyData = (transactions: any[], months = 6) => {
  const now = new Date();
  const data = [];

  for (let i = 0; i < months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
    });
    
    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    data.unshift({
      name: monthYear,
      income,
      expense,
      savings: income - expense,
    });
  }
  
  return data;
};