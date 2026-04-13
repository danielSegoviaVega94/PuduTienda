import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import { Product, BoxTemplate, Order, OrderStatus, BusinessSettings } from '../types';
import * as storage from '../services/storage';

interface AppContextValue {
  products: Record<string, Product>;
  boxTemplates: BoxTemplate[];
  orders: Order[];
  settings: BusinessSettings;
  availableSwaps: Product[];
  extras: Product[];

  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addBoxTemplate: (template: BoxTemplate) => void;
  updateBoxTemplate: (id: string, updates: Partial<BoxTemplate>) => void;
  deleteBoxTemplate: (id: string) => void;

  createOrder: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  updateSettings: (updates: Partial<BusinessSettings>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Record<string, Product>>(() => storage.loadProducts());
  const [boxTemplates, setBoxTemplates] = useState<BoxTemplate[]>(() => storage.loadBoxTemplates());
  const [orders, setOrders] = useState<Order[]>(() => storage.loadOrders());
  const [settings, setSettings] = useState<BusinessSettings>(() => storage.loadSettings());

  useEffect(() => {
    storage.initAdminPin();
  }, []);

  const availableSwaps = useMemo(
    () => (Object.values(products) as Product[]).filter(p => p.isSwappable),
    [products]
  );

  const extras = useMemo(
    () => (Object.values(products) as Product[]).filter(p => p.category === 'extra'),
    [products]
  );

  // --- Product mutations ---

  const addProduct = (product: Product) => {
    setProducts(prev => {
      const next = { ...prev, [product.id]: product };
      storage.saveProducts(next);
      return next;
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => {
      if (!prev[id]) return prev;
      const next = { ...prev, [id]: { ...prev[id], ...updates } };
      storage.saveProducts(next);
      return next;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const next = { ...prev };
      delete next[id];
      storage.saveProducts(next);
      return next;
    });
  };

  // --- Box Template mutations ---

  const addBoxTemplate = (template: BoxTemplate) => {
    setBoxTemplates(prev => {
      const next = [...prev, template];
      storage.saveBoxTemplates(next);
      return next;
    });
  };

  const updateBoxTemplate = (id: string, updates: Partial<BoxTemplate>) => {
    setBoxTemplates(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      storage.saveBoxTemplates(next);
      return next;
    });
  };

  const deleteBoxTemplate = (id: string) => {
    setBoxTemplates(prev => {
      const next = prev.filter(t => t.id !== id);
      storage.saveBoxTemplates(next);
      return next;
    });
  };

  // --- Order mutations ---

  const createOrder = (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order => {
    const now = new Date().toISOString();
    const order: Order = {
      ...data,
      id: storage.generateOrderId(),
      createdAt: now,
      updatedAt: now,
      status: 'pendiente',
    };
    setOrders(prev => {
      const next = [order, ...prev];
      storage.saveOrders(next);
      return next;
    });
    return order;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => {
      const next = prev.map(o =>
        o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
      );
      storage.saveOrders(next);
      return next;
    });
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => {
      const next = prev.filter(o => o.id !== orderId);
      storage.saveOrders(next);
      return next;
    });
  };

  // --- Settings ---

  const updateSettings = (updates: Partial<BusinessSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      storage.saveSettings(next);
      return next;
    });
  };

  const value: AppContextValue = {
    products, boxTemplates, orders, settings,
    availableSwaps, extras,
    addProduct, updateProduct, deleteProduct,
    addBoxTemplate, updateBoxTemplate, deleteBoxTemplate,
    createOrder, updateOrderStatus, deleteOrder,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
