import type { LucideIcon } from 'lucide-react';

interface AdminCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
}

export default function AdminCard({ icon: Icon, label, value, color = 'text-pudu-green-dark' }: AdminCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color} bg-gray-50`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-display font-bold text-pudu-earth">{value}</p>
    </div>
  );
}
