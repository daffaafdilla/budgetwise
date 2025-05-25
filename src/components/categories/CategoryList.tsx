import React, { useState } from 'react';
import { Edit, Trash, Plus } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency } from '../../utils/dateUtils';
import CategoryForm from './CategoryForm';

const CategoryList: React.FC = () => {
  const { state, removeCategory } = useBudget();
  const { categories, transactions } = state;
  
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const filteredCategories = categories.filter((c) => c.type === activeTab);
  
  const getCategorySpent = (categoryName: string) => {
    return transactions
      .filter((t) => t.type === activeTab && t.category === categoryName)
      .reduce((total, t) => total + t.amount, 0);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: string, name: string) => {
    // Check if category is being used in any transactions
    const isUsed = transactions.some((t) => t.category === name);
    
    if (isUsed) {
      alert(`Cannot delete category "${name}" because it's used in transactions.`);
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the "${name}" category?`)) {
      removeCategory(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Budget Categories</h3>
          
          <div className="flex justify-between sm:justify-end space-x-3">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('expense')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  activeTab === 'expense'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('income')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  activeTab === 'income'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300 border-l-0`}
              >
                Income
              </button>
            </div>
            
            <button
              onClick={() => {
                setEditingCategory(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              New
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        {filteredCategories.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                {activeTab === 'expense' && (
                  <>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Budget
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Spent
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Remaining
                    </th>
                  </>
                )}
                {activeTab === 'income' && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Received
                  </th>
                )}
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => {
                const spent = getCategorySpent(category.name);
                const remaining = category.budget - spent;
                
                return (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="flex-shrink-0 w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </div>
                    </td>
                    
                    {activeTab === 'expense' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatCurrency(category.budget)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatCurrency(spent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-medium ${
                              remaining >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {formatCurrency(remaining)}
                          </span>
                        </td>
                      </>
                    )}
                    
                    {activeTab === 'income' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatCurrency(spent)}
                      </td>
                    )}
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3 justify-end">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No {activeTab} categories found</p>
            <button
              onClick={() => {
                setEditingCategory(null);
                setIsModalOpen(true);
              }}
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add {activeTab} category
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <CategoryForm
              onClose={() => {
                setIsModalOpen(false);
                setEditingCategory(null);
              }}
              editCategory={editingCategory}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;