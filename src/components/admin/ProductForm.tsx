import React, { useState } from 'react';
import type { Product } from '../../types';

interface ProductFormProps {
  product?: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    category: product?.category ?? 'verdura' as Product['category'],
    unit: product?.unit ?? 'kg',
    step: product?.step ?? 0.5,
    basePrice: product?.basePrice ?? 0,
    isSwappable: product?.isSwappable ?? true,
    inSeason: product?.inSeason ?? true,
    imageUrl: product?.imageUrl ?? '',
    tags: product?.tags.join(', ') ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = product?.id ?? `${form.category === 'extra' ? 'extra' : 'prod'}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    onSave({
      id,
      name: form.name,
      category: form.category,
      unit: form.unit,
      step: Number(form.step),
      basePrice: Number(form.basePrice),
      isSwappable: form.category !== 'extra' ? form.isSwappable : false,
      inSeason: form.inSeason,
      imageUrl: form.imageUrl,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  const set = (key: string, value: string | number | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          required
          value={form.name}
          onChange={e => set('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
          >
            <option value="verdura">Verdura</option>
            <option value="fruta">Fruta</option>
            <option value="extra">Extra</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
          <input
            required
            value={form.unit}
            onChange={e => set('unit', e.target.value)}
            placeholder="kg, un, docena..."
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio (CLP)</label>
          <input
            required
            type="number"
            min="0"
            value={form.basePrice}
            onChange={e => set('basePrice', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paso (step)</label>
          <input
            required
            type="number"
            min="0.1"
            step="0.1"
            value={form.step}
            onChange={e => set('step', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
        <input
          value={form.imageUrl}
          onChange={e => set('imageUrl', e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separados por coma)</label>
        <input
          value={form.tags}
          onChange={e => set('tags', e.target.value)}
          placeholder="local, fresco, premium..."
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
        />
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.inSeason}
            onChange={e => set('inSeason', e.target.checked)}
            className="w-4 h-4 rounded accent-pudu-green"
          />
          <span className="text-sm text-gray-700">De temporada</span>
        </label>
        {form.category !== 'extra' && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isSwappable}
              onChange={e => set('isSwappable', e.target.checked)}
              className="w-4 h-4 rounded accent-pudu-green"
            />
            <span className="text-sm text-gray-700">Intercambiable</span>
          </label>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
          Cancelar
        </button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl font-medium text-white bg-pudu-green hover:bg-pudu-green-dark transition-colors">
          {product ? 'Guardar' : 'Crear producto'}
        </button>
      </div>
    </form>
  );
}
