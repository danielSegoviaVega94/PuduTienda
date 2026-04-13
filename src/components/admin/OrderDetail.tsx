import { useAppContext } from '../../context/AppContext';
import StatusBadge from './StatusBadge';
import type { Order, OrderStatus } from '../../types';

const ALL_STATUSES: OrderStatus[] = ['pendiente', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado'];

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetail({ order, onClose }: OrderDetailProps) {
  const { updateOrderStatus } = useAppContext();

  const baseItems = order.items.filter(i => !i.isExtra);
  const extraItems = order.items.filter(i => i.isExtra);

  const handleStatusChange = (status: OrderStatus) => {
    updateOrderStatus(order.id, status);
  };

  return (
    <div className="space-y-5">
      {/* Header info */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Pedido</p>
          <p className="font-display font-bold text-pudu-earth">{order.id}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-gray-400 mb-0.5">Caja</p>
          <p className="font-medium text-pudu-earth">{order.boxTemplateName}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-gray-400 mb-0.5">Fecha</p>
          <p className="font-medium text-pudu-earth">{new Date(order.createdAt).toLocaleDateString('es-CL')}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-gray-400 mb-0.5">Hora</p>
          <p className="font-medium text-pudu-earth">{new Date(order.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-gray-400 mb-0.5">Total</p>
          <p className="font-bold text-pudu-green-dark">{order.totalPrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
        </div>
      </div>

      {/* Items */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Productos de la caja</p>
        <div className="space-y-1.5">
          {baseItems.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-pudu-earth">{item.qty} {item.unit} — {item.productName}</span>
              <span className="text-gray-500">{(item.qty * item.unitPrice).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
            </div>
          ))}
        </div>
      </div>

      {extraItems.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Extras</p>
          <div className="space-y-1.5">
            {extraItems.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-pudu-earth">{item.qty} {item.unit} — {item.productName}</span>
                <span className="text-gray-500">{(item.qty * item.unitPrice).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Caja base</span>
          <span>{order.boxBasePrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
        </div>
        {order.priceDifference !== 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">Diferencia</span>
            <span className={order.priceDifference > 0 ? 'text-orange-600' : 'text-green-600'}>
              {order.priceDifference > 0 ? '+' : ''}{order.priceDifference.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
            </span>
          </div>
        )}
        {order.extrasTotal > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">Extras</span>
            <span>+{order.extrasTotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-pudu-earth pt-1 border-t border-gray-100">
          <span>Total</span>
          <span>{order.totalPrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
        </div>
      </div>

      {/* Status Change */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Cambiar estado</p>
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map(status => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={order.status === status}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                order.status === status
                  ? 'bg-pudu-earth text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button onClick={onClose} className="w-full py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
        Cerrar
      </button>
    </div>
  );
}
