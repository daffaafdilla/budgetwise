import React, { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { formatDate } from '../../utils/dateUtils';

interface GoalFormProps {
  onClose: () => void;
  editGoal?: any;
}

const GoalForm: React.FC<GoalFormProps> = ({ onClose, editGoal }) => {
  const { addSavingsGoal, updateSavingsGoal } = useBudget();
  const isEditing = !!editGoal;

  const [goal, setGoal] = useState({
    name: editGoal ? editGoal.name : '',
    targetAmount: editGoal ? editGoal.targetAmount : '',
    currentAmount: editGoal ? editGoal.currentAmount : '',
    targetDate: editGoal ? editGoal.targetDate : formatDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)),
    color: editGoal ? editGoal.color : '#3B82F6',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const colorOptions = [
    { value: '#3B82F6', label: 'Blue' },
    { value: '#10B981', label: 'Green' },
    { value: '#F59E0B', label: 'Amber' },
    { value: '#EF4444', label: 'Red' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#EC4899', label: 'Pink' },
    { value: '#06B6D4', label: 'Cyan' },
    { value: '#F97316', label: 'Orange' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGoal((prev) => ({ ...prev, [name]: value }));
    
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
    if (!goal.name.trim()) {
      newErrors.name = 'Please enter a goal name';
    }
    if (!goal.targetAmount || isNaN(Number(goal.targetAmount)) || Number(goal.targetAmount) <= 0) {
      newErrors.targetAmount = 'Please enter a valid target amount';
    }
    if (!goal.currentAmount || isNaN(Number(goal.currentAmount)) || Number(goal.currentAmount) < 0) {
      newErrors.currentAmount = 'Please enter a valid current amount';
    }
    if (Number(goal.currentAmount) > Number(goal.targetAmount)) {
      newErrors.currentAmount = 'Current amount cannot exceed target amount';
    }
    if (!goal.targetDate) {
      newErrors.targetDate = 'Please select a target date';
    } else if (new Date(goal.targetDate) < new Date()) {
      newErrors.targetDate = 'Target date cannot be in the past';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (isEditing) {
      updateSavingsGoal({
        ...editGoal,
        name: goal.name,
        targetAmount: Number(goal.targetAmount),
        currentAmount: Number(goal.currentAmount),
        targetDate: goal.targetDate,
        color: goal.color,
      });
    } else {
      addSavingsGoal({
        name: goal.name,
        targetAmount: Number(goal.targetAmount),
        currentAmount: Number(goal.currentAmount),
        targetDate: goal.targetDate,
        color: goal.color,
      });
    }
    
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? 'Edit Savings Goal' : 'Create New Savings Goal'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Goal Name</label>
          <input
            type="text"
            name="name"
            value={goal.name}
            onChange={handleChange}
            placeholder="e.g., Vacation Fund"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Target Amount</label>
          <input
            type="number"
            name="targetAmount"
            value={goal.targetAmount}
            onChange={handleChange}
            placeholder="0.00"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.targetAmount ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            step="0.01"
            min="0"
          />
          {errors.targetAmount && <p className="mt-1 text-sm text-red-600">{errors.targetAmount}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Current Amount</label>
          <input
            type="number"
            name="currentAmount"
            value={goal.currentAmount}
            onChange={handleChange}
            placeholder="0.00"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.currentAmount ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            step="0.01"
            min="0"
          />
          {errors.currentAmount && <p className="mt-1 text-sm text-red-600">{errors.currentAmount}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Target Date</label>
          <input
            type="date"
            name="targetDate"
            value={goal.targetDate}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.targetDate ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.targetDate && <p className="mt-1 text-sm text-red-600">{errors.targetDate}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <select
            name="color"
            value={goal.color}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {colorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="mt-2 flex items-center">
            <div
              className="w-6 h-6 rounded-full mr-2"
              style={{ backgroundColor: goal.color }}
            ></div>
            <span className="text-sm text-gray-600">Selected color preview</span>
          </div>
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
            {isEditing ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;