export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getCurrentMonth = (): string => {
  const date = new Date();
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getMonthYearFromDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

export const groupTransactionsByMonth = (transactions: any[]) => {
  const grouped = transactions.reduce((acc: Record<string, any[]>, transaction) => {
    const monthYear = getMonthYearFromDate(transaction.date);
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(transaction);
    return acc;
  }, {});
  
  return grouped;
};

export const calculateMonthProgress = (): number => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  return (dayOfMonth / daysInMonth) * 100;
};