import React, { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';

interface CategoryFormProps {
  onClose: () => void;
  editCategory?: any;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onClose, editCategory }) => {
  const { addCategory, updateCategory } = useBudget();
  const isEditing = !!editCategory;

  const [category, setCategory] = useState({
    name: editCategory ? editCategory.name : '',
    color: editCategory ? editCategory.color : '#3B82F6',
    budget: editCategory ? editCategory.budget : '',
    type: editCategory ? editCategory.type : 'expense',
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
    setCategory((prev) => ({ ...prev, [name]: value }));
    
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
    if (!category.name.trim()) {
      newErrors.name = 'Please enter a category name';
    }
    if (category.type === 'expense' && (!category.budget || isNaN(Number(category.budget)) || Number(category.budget) < 0)) {
      newErrors.budget = 'Please enter a valid budget amount';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (isEditing) {
      updateCategory({
        ...editCategory,
        name: category.name,
        color: category.color,
        budget: category.type === 'expense' ? Number(category.budget) : 0,
        type: category.type,
      });
    } else {
      addCategory({
        name: category.name,
        color: category.color,
        budget: category.type === 'expense' ? Number(category.budget) : 0,
        type: category.type,
      });
    }
    
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? 'Edit Category' : 'Add New Category'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category Type</label>
          <div className="mt-2 flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={category.type === 'expense'}
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
                checked={category.type === 'income'}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Income</span>
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            placeholder="e.g., Groceries"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        {category.type === 'expense' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Monthly Budget</label>
            <input
              type="number"
              name="budget"
              value={category.budget}
              onChange={handleChange}
              placeholder="0.00"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.budget ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              step="0.01"
              min="0"
            />
            {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Category Color</label>
          <select
            name="color"
            value={category.color}
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
              style={{ backgroundColor: category.color }}
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
            {isEditing ? 'Update Category' : 'Add Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;