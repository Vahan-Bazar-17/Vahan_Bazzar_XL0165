import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import ComparePage from './pages/ComparePage';
import EMICalculatorPage from './pages/EMICalculatorPage';
import SellVehiclePage from './pages/SellVehiclePage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/emi-calculator" element={<EMICalculatorPage />} />
              <Route path="/sell-vehicle" element={<SellVehiclePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
