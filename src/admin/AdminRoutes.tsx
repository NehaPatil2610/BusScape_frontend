import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { BusListPage } from './pages/BusListPage';
import { BusDetailPage } from './pages/BusDetailPage';
import { BusFormPage } from './pages/BusFormPage';
import { BookingListPage } from './pages/BookingListPage';
import { BookingDetailPage } from './pages/BookingDetailPage';
import { ReviewListPage } from './pages/ReviewListPage';
import { UserListPage } from './pages/UserListPage';
import { UserDetailPage } from './pages/UserDetailPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import './admin.css';

function isAuthenticated() {
  return !!localStorage.getItem('adminKey');
}

function ProtectedLayout() {
  if (!isAuthenticated()) return <Navigate to="/admin/login" replace />;
  return <AdminLayout />;
}

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="buses" element={<BusListPage />} />
        <Route path="buses/new" element={<BusFormPage />} />
        <Route path="buses/:busId" element={<BusDetailPage />} />
        <Route path="buses/:busId/edit" element={<BusFormPage />} />
        <Route path="bookings" element={<BookingListPage />} />
        <Route path="bookings/:bookingId" element={<BookingDetailPage />} />
        <Route path="reviews" element={<ReviewListPage />} />
        <Route path="users" element={<UserListPage />} />
        <Route path="users/:userSub" element={<UserDetailPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
