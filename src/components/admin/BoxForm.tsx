import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { BoxTemplate, BoxItem } from '../../types';

interface BoxFormProps {
  box?: BoxTemplate;
  onSave: (box: BoxTemplate) => void;
  onCancel: () => void;
}

export default function BoxForm({ box, onSave, onCancel }: BoxFormProps) {
  const { products } = useAppContext();
  const productList = Object.values(products).filter(p => p.category !== 'extra');

  const [form, setForm] = useState({
    name: box?.name ?? '',
    description: box?.description ?? '',
    basePrice: box?.basePrice ?? 0,
    imageUrl: box?.imageUrl ?? '',
  });

  const [items, setItems] = useState<BoxItem[]>(box?.baseItems ?? []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: box?.id ?? `caja_${Date.now()}`,
      name: form.name,
      description: form.description,
      basePrice: Number(form.basePrice),
      imageUrl: form.imageUrl,
      baseItems: items,
    });
  };

  const addItem = () => {
    const usedIds = items.map(i => i.productId);
    const available = productList.find(p => !usedIds.includes(p.id));
    if (available) {
      setItems([...items, { productId: available.id, defaultQty: 1, locked: false }]);
    }
  };

  const updateItem = (index: number, updates: Partial<BoxItem>) => {
    setItems(items.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la caja</label>
        <input
          required
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <input
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio base (CLP)</label>
          <input
            required
            type="number"
            min="0"
            value={form.basePrice}
            onChange={e => setForm({ ...form, basePrice: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
          <input
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
          />
        </div>
      </div>

      {/* Items Builder */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Productos incluidos</label>
          <button type="button" onClick={addItem} className="flex items-center gap-1 text-sm text-pudu-green-dark hover:text-pudu-green font-medium">
            <Plus className="w-3.5 h-3.5" /> Agregar
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5">
              <select
                value={item.productId}
                onChange={e => updateItem(index, { productId: e.target.value })}
                className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pudu-green"
              >
                {productList.map(p => {
                  const usedElsewhere = items.some((it, i) => i !== index && it.productId === p.id);
                  return (
                    <option key={p.id} value={p.id} disabled={usedElsewhere}>{p.name}{usedElsewhere ? ' (ya agregado)' : ''}</option>
                  );
                })}
              </select>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={item.defaultQty}
                onChange={e => updateItem(index, { defaultQty: Number(e.target.value) })}
                className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:border-pudu-green"
              />
              <button type="button" onClick={() => removeItem(index)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Sin productos. Agrega al menos uno.</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={items.length === 0} className="flex-1 py-2.5 rounded-xl font-medium text-white bg-pudu-green hover:bg-pudu-green-dark disabled:opacity-50 transition-colors">
          {box ? 'Guardar' : 'Crear caja'}
        </button>
      </div>
    </form>
  );
}
