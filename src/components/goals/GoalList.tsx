import React, { useState } from 'react';
import { Edit, Trash, Plus, DollarSign } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency } from '../../utils/dateUtils';
import GoalForm from './GoalForm';
import ContributionForm from './ContributionForm';

const GoalList: React.FC = () => {
  const { state, removeSavingsGoal } = useBudget();
  const { savingsGoals } = state;
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);

  const handleEdit = (goal: any) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };
  
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the "${name}" goal?`)) {
      removeSavingsGoal(id);
    }
  };

  const handleContribute = (goal: any) => {
    setSelectedGoal(goal);
    setIsContributeModalOpen(true);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysLeft = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const timeDiff = target.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return Math.max(0, daysDiff);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Savings Goals</h3>
          
          <button
            onClick={() => {
              setEditingGoal(null);
              setIsGoalModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Goal
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savingsGoals.length > 0 ? (
            savingsGoals.map((goal) => {
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              const daysLeft = getDaysLeft(goal.targetDate);
              
              return (
                <div
                  key={goal.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-gray-800 flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: goal.color }}
                      ></div>
                      {goal.name}
                    </h4>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleContribute(goal)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Add contribution"
                      >
                        <DollarSign className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id, goal.name)}
                        className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className="h-2.5 rounded-full transition-all duration-500 ease-in-out"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: goal.color,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{`${Math.round(progress)}% complete`}</span>
                      <span>{daysLeft} days left</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Current</p>
                      <p className="font-semibold text-gray-800">
                        {formatCurrency(goal.currentAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Target</p>
                      <p className="font-semibold text-gray-800">
                        {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Remaining</p>
                      <p className="font-semibold text-blue-600">
                        {formatCurrency(goal.targetAmount - goal.currentAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Target Date</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              <p className="mb-2">You don't have any savings goals yet</p>
              <button
                onClick={() => {
                  setEditingGoal(null);
                  setIsGoalModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create your first goal
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <GoalForm
              onClose={() => {
                setIsGoalModalOpen(false);
                setEditingGoal(null);
              }}
              editGoal={editingGoal}
            />
          </div>
        </div>
      )}

      {/* Contribution Modal */}
      {isContributeModalOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <ContributionForm
              goalId={selectedGoal.id}
              goalName={selectedGoal.name}
              onClose={() => {
                setIsContributeModalOpen(false);
                setSelectedGoal(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalList;