import { LayoutDashboard, Package, Box, ClipboardList, Settings, Store, LogOut } from 'lucide-react';
import { navigate, type AdminSection } from '../../hooks/useHashRoute';

const NAV_ITEMS: { section: AdminSection; label: string; icon: typeof LayoutDashboard; hash: string }[] = [
  { section: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard, hash: '#/admin' },
  { section: 'products',  label: 'Productos',  icon: Package,         hash: '#/admin/productos' },
  { section: 'boxes',     label: 'Cajas',       icon: Box,             hash: '#/admin/cajas' },
  { section: 'orders',    label: 'Pedidos',     icon: ClipboardList,   hash: '#/admin/pedidos' },
  { section: 'settings',  label: 'Ajustes',     icon: Settings,        hash: '#/admin/ajustes' },
];

interface AdminSidebarProps {
  current: AdminSection;
  onClose?: () => void;
}

export default function AdminSidebar({ current, onClose }: AdminSidebarProps) {
  const handleNav = (hash: string) => {
    navigate(hash);
    onClose?.();
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦌</span>
          <div>
            <p className="font-display font-bold text-pudu-earth text-sm leading-tight">La Caja del Pudú</p>
            <p className="text-xs text-gray-400">Panel Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = current === item.section;
          return (
            <button
              key={item.section}
              onClick={() => handleNav(item.hash)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-pudu-yellow text-pudu-earth'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-pudu-earth'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        <button
          onClick={() => navigate('#/')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-pudu-earth transition-colors"
        >
          <Store className="w-5 h-5" />
          Ver tienda
        </button>
        <button
          onClick={() => {
            sessionStorage.removeItem('pudu_admin_auth');
            navigate('#/admin');
            window.location.reload();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
