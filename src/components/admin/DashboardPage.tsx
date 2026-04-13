import { useMemo } from 'react';
import { ShoppingCart, DollarSign, Package, TrendingUp } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import AdminCard from './AdminCard';
import StatusBadge from './StatusBadge';
import { navigate } from '../../hooks/useHashRoute';

export default function DashboardPage() {
  const { orders, products } = useAppContext();

  const today = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD in local timezone

  const stats = useMemo(() => {
    const todayOrders = orders.filter(o => new Date(o.createdAt).toLocaleDateString('sv-SE') === today);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const activeProducts = Object.values(products).filter(p => p.inSeason).length;
    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      todayRevenue,
      activeProducts,
    };
  }, [orders, products, today]);

  const recentOrders = orders.slice(0, 5);

  const topProducts = useMemo(() => {
    const counts: Record<string, { name: string; count: number }> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!counts[item.productId]) {
          counts[item.productId] = { name: item.productName, count: 0 };
        }
        counts[item.productId].count += item.qty;
      });
    });
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  const maxCount = topProducts.length > 0 ? topProducts[0].count : 1;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-pudu-earth mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AdminCard icon={ShoppingCart} label="Pedidos totales" value={stats.totalOrders} />
        <AdminCard icon={TrendingUp} label="Pedidos hoy" value={stats.todayOrders} color="text-blue-600" />
        <AdminCard
          icon={DollarSign}
          label="Ingresos hoy"
          value={stats.todayRevenue.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
          color="text-pudu-green-dark"
        />
        <AdminCard icon={Package} label="Productos activos" value={stats.activeProducts} color="text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-pudu-earth">Últimos pedidos</h2>
            <button
              onClick={() => navigate('#/admin/pedidos')}
              className="text-sm text-pudu-green-dark hover:text-pudu-green font-medium"
            >
              Ver todos
            </button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-pudu-earth">{order.id}</p>
                    <p className="text-xs text-gray-400">{order.boxTemplateName} — {new Date(order.createdAt).toLocaleDateString('es-CL')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-pudu-earth">
                      {order.totalPrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Aún no hay pedidos</p>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-display font-semibold text-pudu-earth mb-4">Productos más pedidos</h2>

          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-pudu-earth font-medium">{item.name}</span>
                    <span className="text-gray-500">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-pudu-green rounded-full h-2 transition-all"
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Sin datos aún</p>
          )}
        </div>
      </div>
    </div>
  );
}
