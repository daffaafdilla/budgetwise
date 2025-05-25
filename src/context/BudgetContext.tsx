import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { formatDate } from '../utils/dateUtils';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  budget: number;
  type: 'income' | 'expense';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  color: string;
}

interface BudgetState {
  transactions: Transaction[];
  categories: Category[];
  savingsGoals: SavingsGoal[];
}

type BudgetAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'REMOVE_TRANSACTION'; payload: string }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'REMOVE_CATEGORY'; payload: string }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'ADD_SAVINGS_GOAL'; payload: SavingsGoal }
  | { type: 'REMOVE_SAVINGS_GOAL'; payload: string }
  | { type: 'UPDATE_SAVINGS_GOAL'; payload: SavingsGoal }
  | { type: 'CONTRIBUTE_TO_GOAL'; payload: { id: string; amount: number } };

// Initial state with example data
const initialState: BudgetState = {
  transactions: [
    {
      id: '1',
      amount: 3000,
      category: 'Salary',
      description: 'Monthly salary',
      date: formatDate(new Date()),
      type: 'income',
    },
    {
      id: '2',
      amount: 500,
      category: 'Rent',
      description: 'Monthly rent',
      date: formatDate(new Date()),
      type: 'expense',
    },
    {
      id: '3',
      amount: 100,
      category: 'Groceries',
      description: 'Weekly groceries',
      date: formatDate(new Date()),
      type: 'expense',
    },
  ],
  categories: [
    { id: '1', name: 'Salary', color: '#10B981', budget: 0, type: 'income' },
    { id: '2', name: 'Rent', color: '#EF4444', budget: 500, type: 'expense' },
    { id: '3', name: 'Groceries', color: '#F59E0B', budget: 300, type: 'expense' },
    { id: '4', name: 'Utilities', color: '#3B82F6', budget: 150, type: 'expense' },
    { id: '5', name: 'Entertainment', color: '#8B5CF6', budget: 100, type: 'expense' },
  ],
  savingsGoals: [
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 2500,
      targetDate: '2024-12-31',
      color: '#10B981',
    },
    {
      id: '2',
      name: 'Vacation',
      targetAmount: 2000,
      currentAmount: 500,
      targetDate: '2024-08-31',
      color: '#3B82F6',
    },
  ],
};

// Reducer
const budgetReducer = (state: BudgetState, action: BudgetAction): BudgetState => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case 'REMOVE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'REMOVE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'ADD_SAVINGS_GOAL':
      return {
        ...state,
        savingsGoals: [...state.savingsGoals, action.payload],
      };
    case 'REMOVE_SAVINGS_GOAL':
      return {
        ...state,
        savingsGoals: state.savingsGoals.filter((g) => g.id !== action.payload),
      };
    case 'UPDATE_SAVINGS_GOAL':
      return {
        ...state,
        savingsGoals: state.savingsGoals.map((g) =>
          g.id === action.payload.id ? action.payload : g
        ),
      };
    case 'CONTRIBUTE_TO_GOAL':
      return {
        ...state,
        savingsGoals: state.savingsGoals.map((g) =>
          g.id === action.payload.id
            ? { ...g, currentAmount: g.currentAmount + action.payload.amount }
            : g
        ),
      };
    default:
      return state;
  }
};

// Context
interface BudgetContextType {
  state: BudgetState;
  dispatch: React.Dispatch<BudgetAction>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (transaction: Transaction) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  removeCategory: (id: string) => void;
  updateCategory: (category: Category) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  removeSavingsGoal: (id: string) => void;
  updateSavingsGoal: (goal: SavingsGoal) => void;
  contributeToGoal: (id: string, amount: number) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Provider
export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: { ...transaction, id: uuidv4() },
    });
  };

  const removeTransaction = (id: string) => {
    dispatch({
      type: 'REMOVE_TRANSACTION',
      payload: id,
    });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({
      type: 'UPDATE_TRANSACTION',
      payload: transaction,
    });
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    dispatch({
      type: 'ADD_CATEGORY',
      payload: { ...category, id: uuidv4() },
    });
  };

  const removeCategory = (id: string) => {
    dispatch({
      type: 'REMOVE_CATEGORY',
      payload: id,
    });
  };

  const updateCategory = (category: Category) => {
    dispatch({
      type: 'UPDATE_CATEGORY',
      payload: category,
    });
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    dispatch({
      type: 'ADD_SAVINGS_GOAL',
      payload: { ...goal, id: uuidv4() },
    });
  };

  const removeSavingsGoal = (id: string) => {
    dispatch({
      type: 'REMOVE_SAVINGS_GOAL',
      payload: id,
    });
  };

  const updateSavingsGoal = (goal: SavingsGoal) => {
    dispatch({
      type: 'UPDATE_SAVINGS_GOAL',
      payload: goal,
    });
  };

  const contributeToGoal = (id: string, amount: number) => {
    dispatch({
      type: 'CONTRIBUTE_TO_GOAL',
      payload: { id, amount },
    });
  };

  const value = {
    state,
    dispatch,
    addTransaction,
    removeTransaction,
    updateTransaction,
    addCategory,
    removeCategory,
    updateCategory,
    addSavingsGoal,
    removeSavingsGoal,
    updateSavingsGoal,
    contributeToGoal,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};

// Custom hook
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};