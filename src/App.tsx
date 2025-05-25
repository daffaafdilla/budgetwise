import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BudgetCategories from './pages/BudgetCategories';
import Goals from './pages/Goals';
import { BudgetProvider } from './context/BudgetContext';

function App() {
  return (
    <BudgetProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<BudgetCategories />} />
            <Route path="/goals" element={<Goals />} />
          </Routes>
        </Layout>
      </Router>
    </BudgetProvider>
  );
}

export default App;