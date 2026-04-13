import { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import StatusBadge from './StatusBadge';
import AdminModal from './AdminModal';
import OrderDetail from './OrderDetail';
import type { Order, OrderStatus } from '../../types';

const STATUS_TABS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'confirmado', label: 'Confirmados' },
  { value: 'preparando', label: 'Preparando' },
  { value: 'enviado', label: 'Enviados' },
  { value: 'entregado', label: 'Entregados' },
  { value: 'cancelado', label: 'Cancelados' },
];

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const { orders } = useAppContext();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(o => o.status === statusFilter);
  }, [orders, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Keep selected order in sync with context (status may change)
  const syncedOrder = selectedOrder ? orders.find(o => o.id === selectedOrder.id) ?? null : null;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-pudu-earth mb-6">Pedidos</h1>

      {/* Status Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-4">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(0); }}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              statusFilter === tab.value
                ? 'bg-pudu-earth text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {paginated.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Pedido</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Fecha</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Caja</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Total</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(order => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-pudu-earth">{order.id}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.boxTemplateName}</td>
                    <td className="px-4 py-3 font-medium text-pudu-earth">
                      {order.totalPrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                {filtered.length} pedido{filtered.length !== 1 ? 's' : ''} en total
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 text-sm text-gray-500">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-12">No hay pedidos{statusFilter !== 'all' ? ' con este estado' : ''}</p>
      )}

      {/* Order Detail Modal */}
      <AdminModal
        isOpen={!!syncedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Pedido ${syncedOrder?.id ?? ''}`}
      >
        {syncedOrder && (
          <OrderDetail order={syncedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </AdminModal>
    </div>
  );
}
