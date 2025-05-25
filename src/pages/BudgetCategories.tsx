import React from 'react';
import CategoryList from '../components/categories/CategoryList';

const BudgetCategories: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Budget Categories</h1>
        <p className="text-gray-600 mt-1">
          Manage your income and expense categories and set budget limits.
        </p>
      </div>

      <CategoryList />
    </div>
  );
};

export default BudgetCategories;