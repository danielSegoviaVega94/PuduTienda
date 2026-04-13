import type { OrderStatus } from '../../types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  pendiente:   { label: 'Pendiente',   bg: 'bg-yellow-100', text: 'text-yellow-800' },
  confirmado:  { label: 'Confirmado',  bg: 'bg-blue-100',   text: 'text-blue-800' },
  preparando:  { label: 'Preparando',  bg: 'bg-orange-100', text: 'text-orange-800' },
  enviado:     { label: 'Enviado',     bg: 'bg-purple-100', text: 'text-purple-800' },
  entregado:   { label: 'Entregado',   bg: 'bg-green-100',  text: 'text-green-800' },
  cancelado:   { label: 'Cancelado',   bg: 'bg-red-100',    text: 'text-red-800' },
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
