import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Product } from '../types';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentItem: Product;
  availableSwaps: Product[];
  onSwap: (newProduct: Product) => void;
}

export default function BottomSheet({ isOpen, onClose, title, currentItem, availableSwaps, onSwap }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-pudu-earth/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
              <h3 className="text-lg font-display font-semibold text-pudu-earth">{title}</h3>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-4 space-y-3 pb-safe">
              {availableSwaps.filter(p => p.id !== currentItem.id).map((product) => {
                const priceDiff = product.basePrice - currentItem.basePrice;
                const isMoreExpensive = priceDiff > 0;
                
                return (
                  <button
                    key={product.id}
                    onClick={() => {
                      onSwap(product);
                      onClose();
                    }}
                    className="w-full flex items-center gap-4 p-3 rounded-2xl border border-gray-100 hover:border-pudu-green hover:bg-pudu-green/5 transition-colors text-left"
                  >
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="font-medium text-pudu-earth">{product.name}</h4>
                      <p className="text-sm text-gray-500">por {product.unit}</p>
                    </div>
                    <div className="text-right">
                      {priceDiff === 0 ? (
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">Sin costo extra</span>
                      ) : (
                        <span className={`text-sm font-medium px-2 py-1 rounded-lg ${isMoreExpensive ? 'text-pudu-earth-light bg-orange-100' : 'text-pudu-green-dark bg-green-100'}`}>
                          {isMoreExpensive ? '+' : ''}{priceDiff.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
