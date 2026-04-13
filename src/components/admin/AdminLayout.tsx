import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { AdminSection } from '../../hooks/useHashRoute';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';
import DashboardPage from './DashboardPage';
import ProductsPage from './ProductsPage';
import BoxesPage from './BoxesPage';
import OrdersPage from './OrdersPage';
import SettingsPage from './SettingsPage';

interface AdminLayoutProps {
  section?: AdminSection;
}

const PAGES: Record<AdminSection, () => React.JSX.Element> = {
  dashboard: DashboardPage,
  products:  ProductsPage,
  boxes:     BoxesPage,
  orders:    OrdersPage,
  settings:  SettingsPage,
};

export default function AdminLayout({ section = 'dashboard' }: AdminLayoutProps) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('pudu_admin_auth') === 'true'
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  const PageComponent = PAGES[section];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-60 flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <AdminSidebar current={section} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 z-50 md:hidden">
            <AdminSidebar current={section} onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-60">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-display font-semibold text-pudu-earth">Panel Admin</span>
        </header>

        <main className="p-4 md:p-8 max-w-6xl">
          <PageComponent />
        </main>
      </div>
    </div>
  );
}
