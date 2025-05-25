import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, DollarSign, PieChart, Target, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">BudgetWise</h2>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 md:hidden"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5 px-2 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Home className="mr-3 h-6 w-6 flex-shrink-0" />
            Dashboard
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <DollarSign className="mr-3 h-6 w-6 flex-shrink-0" />
            Transactions
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <PieChart className="mr-3 h-6 w-6 flex-shrink-0" />
            Categories
          </NavLink>
          <NavLink
            to="/goals"
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Target className="mr-3 h-6 w-6 flex-shrink-0" />
            Savings Goals
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;