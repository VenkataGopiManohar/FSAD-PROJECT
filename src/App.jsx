import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { LibraryProvider } from './context/LibraryContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import UserBookmarks from './pages/UserBookmarks.jsx';
import UserHistory from './pages/UserHistory.jsx';
import UserFeedback from './pages/UserFeedback.jsx';
import UserProfile from './pages/UserProfile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminResources from './pages/AdminResources.jsx';
import AdminAnalytics from './pages/AdminAnalytics.jsx';
import AdminSettings from './pages/AdminSettings.jsx';
import ResourceDetail from './pages/ResourceDetail.jsx';
import Landing from './pages/Landing.jsx';

const ProtectedRoute = ({ children, role = null }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route 
        path="/dashboard/bookmarks" 
        element={
          <ProtectedRoute role="user">
            <UserBookmarks />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/history" 
        element={
          <ProtectedRoute role="user">
            <UserHistory />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/dashboard/feedback" 
        element={
          <ProtectedRoute role="user">
            <UserFeedback />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/dashboard/profile" 
        element={
          <ProtectedRoute role="user">
            <UserProfile />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute role="admin">
            <AdminUsers />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/resources" 
        element={
          <ProtectedRoute role="admin">
            <AdminResources />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/analytics" 
        element={
          <ProtectedRoute role="admin">
            <AdminAnalytics />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/settings" 
        element={
          <ProtectedRoute role="admin">
            <AdminSettings />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/resource/:id" 
        element={
          <ProtectedRoute>
            <ResourceDetail />
          </ProtectedRoute>
        } 
      />

      <Route path="/" element={<Landing />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <Router>
          <AppContent />
        </Router>
      </LibraryProvider>
    </AuthProvider>
  );
}
