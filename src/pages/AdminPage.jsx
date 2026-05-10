import { useCallback } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import Sidebar from '../admin/Sidebar.jsx';
import Overview from '../admin/Overview.jsx';
import ProductsManager from '../admin/ProductsManager.jsx';
import OrdersManager from '../admin/OrdersManager.jsx';
import FinanceManager from '../admin/FinanceManager.jsx';
import ReportViewer from '../admin/ReportViewer.jsx';
import { useState } from 'react';

const PAGES = [
  { key: 'overview', label: 'Overview' },
  { key: 'produk', label: 'Produk' },
  { key: 'orders', label: 'Orders' },
  { key: 'keuangan', label: 'Keuangan' },
  { key: 'laporan', label: 'Laporan' },
];

function AdminDashboard() {
  const [page, setPage] = useState('overview');
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    window.location.href = '/';
  }, [logout]);

  const currentLabel = PAGES.find(p => p.key === page)?.label || 'Overview';

  return (
    <div className="admin-layout">
      <Sidebar pages={PAGES} activePage={page} onPageChange={setPage} onLogout={handleLogout} />
      <div className="main-content">
        <header className="main-header">
          <h1>{currentLabel}</h1>
          <span className="admin-badge">Admin Panel</span>
        </header>
        <div className="page-content">
          {page === 'overview' && <Overview />}
          {page === 'produk' && <ProductsManager />}
          {page === 'orders' && <OrdersManager />}
          {page === 'keuangan' && <FinanceManager />}
          {page === 'laporan' && <ReportViewer />}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
