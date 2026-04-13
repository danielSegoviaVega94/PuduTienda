import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import AdminModal from './AdminModal';
import BoxForm from './BoxForm';
import type { BoxTemplate } from '../../types';

export default function BoxesPage() {
  const { boxTemplates, products, addBoxTemplate, updateBoxTemplate, deleteBoxTemplate } = useAppContext();
  const [editingBox, setEditingBox] = useState<BoxTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BoxTemplate | null>(null);

  const handleSave = (box: BoxTemplate) => {
    if (editingBox) {
      updateBoxTemplate(box.id, box);
    } else {
      addBoxTemplate(box);
    }
    setShowForm(false);
    setEditingBox(null);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteBoxTemplate(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-pudu-earth">Cajas</h1>
        <button
          onClick={() => { setEditingBox(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-pudu-green hover:bg-pudu-green-dark text-white font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Nueva caja
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boxTemplates.map(box => (
          <div key={box.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {box.imageUrl && (
              <img src={box.imageUrl} alt={box.name} className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-display font-bold text-pudu-earth mb-1">{box.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{box.description}</p>

              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Contenido:</p>
                <div className="flex flex-wrap gap-1">
                  {box.baseItems.map((item, i) => {
                    const product = products[item.productId];
                    return product ? (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {item.defaultQty} {product.unit} {product.name}
                      </span>
                    ) : (
                      <span key={i} className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        Producto eliminado
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-pudu-green-dark">
                  {box.basePrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingBox(box); setShowForm(true); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-pudu-earth">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(box)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {boxTemplates.length === 0 && (
        <p className="text-center text-gray-400 py-12">No hay cajas configuradas</p>
      )}

      <AdminModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingBox(null); }}
        title={editingBox ? 'Editar Caja' : 'Nueva Caja'}
        wide
      >
        <BoxForm
          box={editingBox ?? undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingBox(null); }}
        />
      </AdminModal>

      <AdminModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Eliminar caja">
        <p className="text-gray-600 mb-6">
          ¿Seguro que quieres eliminar <strong>{deleteTarget?.name}</strong>?
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
            Cancelar
          </button>
          <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 transition-colors">
            Eliminar
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
