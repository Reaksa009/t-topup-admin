import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Admin App Routes */}
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/register" element={<AdminRegister />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
