import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import DeanDashboard from './pages/DeanDashboard';
import HodDashboard from './pages/HodDashboard';
import MentorDashboard from './pages/MentorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Assessment from './pages/Assessment';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/super-admin" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <SuperAdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/dean" element={
        <ProtectedRoute allowedRoles={['dean']}>
          <DeanDashboard />
        </ProtectedRoute>
      } />
      <Route path="/hod" element={
        <ProtectedRoute allowedRoles={['hod']}>
          <HodDashboard />
        </ProtectedRoute>
      } />
      <Route path="/mentor" element={
        <ProtectedRoute allowedRoles={['mentor']}>
          <MentorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/assessment" element={
        <ProtectedRoute allowedRoles={['student']}>
          <Assessment />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;