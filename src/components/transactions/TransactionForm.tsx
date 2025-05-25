import React, { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { formatDate } from '../../utils/dateUtils';

interface TransactionFormProps {
  onClose: () => void;
  editTransaction?: any;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, editTransaction }) => {
  const { state, addTransaction, updateTransaction } = useBudget();
  const { categories } = state;
  const isEditing = !!editTransaction;

  const [transaction, setTransaction] = useState({
    amount: editTransaction ? editTransaction.amount : '',
    category: editTransaction ? editTransaction.category : '',
    description: editTransaction ? editTransaction.description : '',
    date: editTransaction ? editTransaction.date : formatDate(new Date()),
    type: editTransaction ? editTransaction.type : 'expense',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    if (!transaction.amount || isNaN(Number(transaction.amount)) || Number(transaction.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!transaction.category) {
      newErrors.category = 'Please select a category';
    }
    if (!transaction.description.trim()) {
      newErrors.description = 'Please enter a description';
    }
    if (!transaction.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (isEditing) {
      updateTransaction({
        ...editTransaction,
        amount: Number(transaction.amount),
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
        type: transaction.type,
      });
    } else {
      addTransaction({
        amount: Number(transaction.amount),
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
        type: transaction.type,
      });
    }
    
    onClose();
  };

  const filteredCategories = categories.filter((c) => c.type === transaction.type);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
          <div className="mt-2 flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={transaction.type === 'expense'}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Expense</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value="income"
                checked={transaction.type === 'income'}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Income</span>
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={transaction.amount}
            onChange={handleChange}
            placeholder="0.00"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            step="0.01"
            min="0"
          />
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={transaction.category}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="">Select a category</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            value={transaction.description}
            onChange={handleChange}
            placeholder="Enter description"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={transaction.date}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isEditing ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;