import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 md:hidden"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:block">
              <h1 className="text-2xl font-semibold text-gray-800">BudgetWise</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="rounded-full bg-gray-100 p-2 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" />
            </button>
            <div className="relative">
              <button
                type="button"
                className="flex rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="sr-only">Open user menu</span>
                <User className="h-8 w-8 rounded-full p-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;