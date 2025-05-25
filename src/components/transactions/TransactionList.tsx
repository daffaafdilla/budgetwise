import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Edit, Trash, Search } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency, groupTransactionsByMonth } from '../../utils/dateUtils';
import TransactionForm from './TransactionForm';

const TransactionList: React.FC = () => {
  const { state, removeTransaction } = useBudget();
  const { transactions } = state;
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      removeTransaction(id);
    }
  };
  
  // Filter and search transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  // Group transactions by month
  const groupedTransactions = groupTransactionsByMonth(filteredTransactions);
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-5 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Search transactions..."
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction list */}
      <div className="divide-y divide-gray-200">
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.entries(groupedTransactions).map(([monthYear, monthTransactions]) => (
            <div key={monthYear} className="px-5 py-4">
              <h4 className="text-sm font-medium text-gray-500 mb-3">{monthYear}</h4>
              
              <div className="space-y-3">
                {monthTransactions.map((transaction) => (
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
                    
                    <div className="flex items-center">
                      <span
                        className={`font-semibold mr-4 ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </span>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-gray-500">
            <p>No transactions found</p>
          </div>
        )}
      </div>
      
      {/* Edit Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <TransactionForm
              onClose={() => {
                setIsModalOpen(false);
                setEditingTransaction(null);
              }}
              editTransaction={editingTransaction}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;