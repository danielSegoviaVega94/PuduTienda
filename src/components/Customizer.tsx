import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, RefreshCw, Plus, Minus, MessageCircle } from 'lucide-react';
import { BoxTemplate, CartItem, Product } from '../types';
import { PRODUCTS, AVAILABLE_SWAPS, EXTRAS } from '../data';
import BottomSheet from './BottomSheet';

interface CustomizerProps {
  box: BoxTemplate;
  onBack: () => void;
}

export default function Customizer({ box, onBack }: CustomizerProps) {
  // Initialize cart with base items
  const [items, setItems] = useState<CartItem[]>(
    box.baseItems.map(item => ({
      product: PRODUCTS[item.productId],
      qty: item.defaultQty
    }))
  );
  const [extras, setExtras] = useState<CartItem[]>([]);
  
  // Swap state
  const [swapTargetIndex, setSwapTargetIndex] = useState<number | null>(null);
  const [pendingSwap, setPendingSwap] = useState<{ index: number, newProduct: Product } | null>(null);

  // Calculate totals
  const baseBoxPrice = box.basePrice;
  
  const priceDifference = useMemo(() => {
    let diff = 0;
    // Calculate difference from original box template
    items.forEach(item => {
      const originalItem = box.baseItems.find(bi => bi.productId === item.product.id);
      if (originalItem) {
        // Same product, changed quantity
        diff += (item.qty - originalItem.defaultQty) * item.product.basePrice;
      } else {
        // New product swapped in
        diff += item.qty * item.product.basePrice;
      }
    });
    
    // Subtract removed original items
    box.baseItems.forEach(bi => {
      const stillInCart = items.find(item => item.product.id === bi.productId);
      if (!stillInCart) {
        diff -= bi.defaultQty * PRODUCTS[bi.productId].basePrice;
      }
    });
    
    return diff;
  }, [items, box]);

  const extrasTotal = useMemo(() => {
    return extras.reduce((sum, item) => sum + (item.qty * item.product.basePrice), 0);
  }, [extras]);

  const totalPrice = baseBoxPrice + priceDifference + extrasTotal;
  const totalItemsQty = items.reduce((sum, item) => sum + item.qty, 0);

  const handleUpdateQty = (index: number, delta: number, isExtra = false) => {
    if (isExtra) {
      const newExtras = [...extras];
      const item = newExtras[index];
      const newQty = Math.max(0, item.qty + delta);
      if (newQty === 0) {
        newExtras.splice(index, 1);
      } else {
        item.qty = newQty;
      }
      setExtras(newExtras);
    } else {
      const newItems = [...items];
      const item = newItems[index];
      const newQty = Math.max(0, item.qty + delta);
      item.qty = newQty;
      setItems(newItems);
    }
  };

  const handleAddExtra = (product: Product) => {
    const existingIndex = extras.findIndex(e => e.product.id === product.id);
    if (existingIndex >= 0) {
      handleUpdateQty(existingIndex, product.step, true);
    } else {
      setExtras([...extras, { product, qty: product.step }]);
    }
  };

  const handleSwapSelection = (newProduct: Product) => {
    if (swapTargetIndex === null) return;
    setPendingSwap({ index: swapTargetIndex, newProduct });
    setSwapTargetIndex(null);
  };

  const confirmSwap = () => {
    if (!pendingSwap) return;
    
    const newItems = [...items];
    const oldItem = newItems[pendingSwap.index];
    
    // Replace the item, keeping the same relative quantity if possible, or defaulting to 1 unit
    newItems[pendingSwap.index] = {
      product: pendingSwap.newProduct,
      qty: pendingSwap.newProduct.step === 1 ? Math.ceil(oldItem.qty) : oldItem.qty
    };
    
    setItems(newItems);
    setPendingSwap(null);
  };

  const cancelSwap = () => {
    setPendingSwap(null);
  };

  const handleCheckout = () => {
    let text = `¡Hola amigos del Pudú! 🦌 Quiero pedir la *${box.name}*.\n\n`;
    text += `*Así armé mi cajita:*\n`;
    items.forEach(item => {
      if (item.qty > 0) text += `- ${item.qty} ${item.product.unit} de ${item.product.name}\n`;
    });
    
    if (extras.length > 0) {
      text += `\n*Y le agregué estos gustitos:*\n`;
      extras.forEach(item => {
        if (item.qty > 0) text += `- ${item.qty} ${item.product.unit} de ${item.product.name}\n`;
      });
    }
    
    text += `\n*Total a pagar:* ${totalPrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}\n\n`;
    text += `¡Quedo atento/a para coordinar el pago y despacho! 🌿`;
    
    window.open(`https://wa.me/56912345678?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 shadow-sm px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 bg-pudu-yellow rounded-full text-pudu-earth hover:bg-pudu-yellow-dark transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-semibold text-lg text-pudu-earth">Personalizar Caja</h1>
          <p className="text-sm text-gray-500">{box.name}</p>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-6">
        {/* Pudú Tip Banner */}
        <div className="flex gap-3 items-end mb-6">
          <div className="w-14 h-14 bg-pudu-yellow-dark rounded-full flex items-center justify-center text-3xl shadow-sm border-4 border-white z-10 shrink-0">
            🦌
          </div>
          <motion.div 
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className="bg-white p-4 rounded-3xl rounded-bl-none shadow-sm border border-pudu-yellow-dark/30 relative"
          >
            <p className="text-sm text-pudu-earth leading-relaxed">
              <strong>¡Armemos tu cajita!</strong> Toca el botón <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-pudu-green-dark bg-green-100 px-1.5 py-0.5 rounded-md"><RefreshCw className="w-2.5 h-2.5" /> Cambiar</span> si hay algo que no comas. ¡Yo te lo cambio por otra cosita rica!
            </p>
          </motion.div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {totalItemsQty === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 px-6 bg-white rounded-3xl border-2 border-dashed border-pudu-yellow-dark flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left"
            >
              <div className="relative w-24 h-24 shrink-0">
                <div className="absolute inset-0 bg-pudu-yellow rounded-full"></div>
                <div className="absolute inset-1 bg-pudu-yellow-dark rounded-full flex items-center justify-center text-5xl shadow-inner border-4 border-white">
                  🦌
                </div>
                <motion.div 
                  animate={{ rotate: [0, 15, -5, 0] }} 
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute -bottom-1 -right-1 text-3xl origin-bottom-left"
                >
                  🌿
                </motion.div>
                <div className="absolute top-0 -left-1 text-2xl opacity-70">
                  ✨
                </div>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-pudu-earth mb-2">¡Tu cajita está vacía!</h3>
                <p className="text-pudu-earth-light text-sm leading-relaxed">
                  Agrega algunos productos o extras para que pueda llevártelos a casa. ¡Yo te ayudo a cargarlos!
                </p>
              </div>
            </motion.div>
          )}
          {items.map((item, index) => (
            <motion.div 
              key={`${item.product.id}-${index}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 ${item.qty === 0 ? 'opacity-50 grayscale' : ''}`}
            >
              <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 rounded-xl object-cover" />
              
              <div className="flex-1">
                <h3 className="font-medium text-pudu-earth leading-tight">{item.product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.product.basePrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })} / {item.product.unit}</p>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                    <button onClick={() => handleUpdateQty(index, -item.product.step)} className="p-1.5 hover:bg-gray-200 text-pudu-earth">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{item.qty}</span>
                    <button onClick={() => handleUpdateQty(index, item.product.step)} className="p-1.5 hover:bg-gray-200 text-pudu-earth">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {item.product.isSwappable && (
                    <button 
                      onClick={() => setSwapTargetIndex(index)}
                      className="flex items-center gap-1 text-xs font-medium text-pudu-green-dark bg-green-50 px-2 py-1.5 rounded-lg hover:bg-green-100 transition-colors ml-auto"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Cambiar
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extras Section */}
        <div className="bg-pudu-green/10 rounded-3xl p-5 border border-pudu-green/20">
          <h2 className="font-display font-semibold text-pudu-earth mb-1 text-lg">¡Échale un gustito extra a tu cajita! 🍯</h2>
          <p className="text-sm text-pudu-earth-light mb-4">Productos de nuestros vecinos para complementar.</p>
          
          <div className="flex overflow-x-auto gap-3 pb-2 -mx-2 px-2 snap-x">
            {EXTRAS.map(extra => {
              const cartExtra = extras.find(e => e.product.id === extra.id);
              return (
                <div key={extra.id} className="min-w-[140px] bg-white rounded-2xl p-3 shadow-sm snap-start flex flex-col">
                  <img src={extra.imageUrl} alt={extra.name} className="w-full h-24 object-cover rounded-xl mb-2" />
                  <h4 className="font-medium text-sm text-pudu-earth line-clamp-1">{extra.name}</h4>
                  <p className="text-xs text-gray-500 mb-3">{extra.basePrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
                  
                  <div className="mt-auto">
                    {cartExtra ? (
                      <div className="flex items-center justify-between bg-pudu-yellow rounded-lg overflow-hidden border border-pudu-yellow-dark">
                        <button onClick={() => handleAddExtra({ ...extra, step: -extra.step })} className="p-1.5 hover:bg-pudu-yellow-dark text-pudu-earth">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">{cartExtra.qty}</span>
                        <button onClick={() => handleAddExtra(extra)} className="p-1.5 hover:bg-pudu-yellow-dark text-pudu-earth">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAddExtra(extra)}
                        className="w-full py-1.5 bg-pudu-green text-white text-sm font-medium rounded-lg hover:bg-pudu-green-dark transition-colors"
                      >
                        Agregar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-30">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              Total a pagar <span className="text-lg">🦌</span>
            </p>
            <p className="text-2xl font-display font-bold text-pudu-earth">
              {totalPrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
            </p>
          </div>
          <button 
            onClick={handleCheckout}
            className="flex-1 bg-pudu-green hover:bg-pudu-green-dark text-white py-3.5 px-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-pudu-green/30"
          >
            <MessageCircle className="w-5 h-5" />
            Hacer pedido
          </button>
        </div>
      </div>

      {/* Bottom Sheet for Swapping */}
      <BottomSheet 
        isOpen={swapTargetIndex !== null}
        onClose={() => setSwapTargetIndex(null)}
        title={`Cambiar ${swapTargetIndex !== null ? items[swapTargetIndex].product.name : ''} por...`}
        currentItem={swapTargetIndex !== null ? items[swapTargetIndex].product : PRODUCTS['prod_001']}
        availableSwaps={AVAILABLE_SWAPS}
        onSwap={handleSwapSelection}
      />

      {/* Confirmation Modal */}
      <AnimatePresence>
        {pendingSwap && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-pudu-earth/40 backdrop-blur-sm z-[60]"
              onClick={cancelSwap}
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl pointer-events-auto"
              >
                <div className="text-4xl mb-4 text-center">🦌❓</div>
                <h3 className="font-display font-bold text-xl text-pudu-earth mb-2 text-center">¿Estás seguro?</h3>
                <p className="text-pudu-earth-light text-center mb-6">
                  ¿Quieres cambiar <strong>{items[pendingSwap.index].product.name}</strong> por <strong>{pendingSwap.newProduct.name}</strong>?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={cancelSwap}
                    className="flex-1 py-3 px-4 rounded-xl font-medium text-pudu-earth bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmSwap}
                    className="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-pudu-green hover:bg-pudu-green-dark transition-colors"
                  >
                    Confirmar
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
