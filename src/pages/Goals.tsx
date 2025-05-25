import React from 'react';
import GoalList from '../components/goals/GoalList';

const Goals: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Savings Goals</h1>
        <p className="text-gray-600 mt-1">
          Track your progress toward financial goals and milestones.
        </p>
      </div>

      <GoalList />
    </div>
  );
};

export default Goals;