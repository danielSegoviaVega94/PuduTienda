import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import AdminModal from './AdminModal';
import ProductForm from './ProductForm';
import type { Product } from '../../types';

type CategoryFilter = 'all' | 'verdura' | 'fruta' | 'extra';

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAppContext();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const productList = useMemo(() => {
    return Object.values(products).filter(p => {
      if (category !== 'all' && p.category !== category) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, search, category]);

  const handleSave = (product: Product) => {
    if (editingProduct) {
      updateProduct(product.id, product);
    } else {
      addProduct(product);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleToggleSeason = (product: Product) => {
    updateProduct(product.id, { inSeason: !product.inSeason });
  };

  const TABS: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'verdura', label: 'Verduras' },
    { value: 'fruta', label: 'Frutas' },
    { value: 'extra', label: 'Extras' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-display font-bold text-pudu-earth">Productos</h1>
        <button
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-pudu-green hover:bg-pudu-green-dark text-white font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar producto
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pudu-green"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setCategory(tab.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                category === tab.value ? 'bg-white text-pudu-earth shadow-sm' : 'text-gray-500 hover:text-pudu-earth'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {productList.map(product => (
          <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-2xl">📦</div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium text-pudu-earth truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    {product.basePrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })} / {product.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  product.category === 'verdura' ? 'bg-green-100 text-green-700' :
                  product.category === 'fruta' ? 'bg-orange-100 text-orange-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {product.category}
                </span>
                <button
                  onClick={() => handleToggleSeason(product)}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                    product.inSeason ? 'bg-pudu-yellow text-pudu-earth' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {product.inSeason ? 'En temporada' : 'Fuera'}
                </button>
                <div className="flex gap-1 ml-auto">
                  <button onClick={() => handleEdit(product)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-pudu-earth">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteTarget(product)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {productList.length === 0 && (
        <p className="text-center text-gray-400 py-12">No se encontraron productos</p>
      )}

      {/* Product Form Modal */}
      <AdminModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingProduct(null); }}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <ProductForm
          product={editingProduct ?? undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingProduct(null); }}
        />
      </AdminModal>

      {/* Delete Confirmation */}
      <AdminModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Eliminar producto">
        <p className="text-gray-600 mb-6">
          ¿Seguro que quieres eliminar <strong>{deleteTarget?.name}</strong>? Esta acción no se puede deshacer.
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
