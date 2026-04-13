import { Product, BoxTemplate, Order, OrderStatus, BusinessSettings } from '../types';
import { PRODUCTS, BOX_TEMPLATES } from '../data';

const KEYS = {
  products: 'pudu_products',
  boxTemplates: 'pudu_box_templates',
  orders: 'pudu_orders',
  settings: 'pudu_settings',
  adminPin: 'pudu_admin_pin',
} as const;

const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'La Caja del Pudú',
  whatsappPhone: '56912345678',
  heroImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
  footerTagline: 'Llevando amor, frescura y el trabajo de nuestros agricultores a las familias de la Cuarta Región.',
};

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Products ---

export function loadProducts(): Record<string, Product> {
  const stored = read<Record<string, Product>>(KEYS.products);
  if (stored) return stored;
  write(KEYS.products, PRODUCTS);
  return { ...PRODUCTS };
}

export function saveProducts(products: Record<string, Product>): void {
  write(KEYS.products, products);
}

// --- Box Templates ---

export function loadBoxTemplates(): BoxTemplate[] {
  const stored = read<BoxTemplate[]>(KEYS.boxTemplates);
  if (stored) return stored;
  write(KEYS.boxTemplates, BOX_TEMPLATES);
  return [...BOX_TEMPLATES];
}

export function saveBoxTemplates(templates: BoxTemplate[]): void {
  write(KEYS.boxTemplates, templates);
}

// --- Orders ---

export function loadOrders(): Order[] {
  return read<Order[]>(KEYS.orders) ?? [];
}

export function saveOrders(orders: Order[]): void {
  write(KEYS.orders, orders);
}

export function generateOrderId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const orders = loadOrders();
  const todayOrders = orders.filter(o => o.id.startsWith(`ORD-${date}`));
  const seq = String(todayOrders.length + 1).padStart(3, '0');
  const rand = Math.random().toString(36).slice(2, 5);
  return `ORD-${date}-${seq}${rand}`;
}

export function addOrder(order: Order): void {
  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const orders = loadOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    order.updatedAt = new Date().toISOString();
    saveOrders(orders);
  }
}

// --- Settings ---

export function loadSettings(): BusinessSettings {
  const stored = read<BusinessSettings>(KEYS.settings);
  if (stored) return stored;
  write(KEYS.settings, DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: BusinessSettings): void {
  write(KEYS.settings, settings);
}

// --- Admin PIN ---

export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function initAdminPin(): Promise<void> {
  const existing = localStorage.getItem(KEYS.adminPin);
  if (!existing) {
    const hashed = await hashPin('1234');
    localStorage.setItem(KEYS.adminPin, hashed);
  }
}

export async function verifyPin(pin: string): Promise<boolean> {
  const stored = localStorage.getItem(KEYS.adminPin);
  if (!stored) return false;
  const hashed = await hashPin(pin);
  return hashed === stored;
}

export async function changePin(newPin: string): Promise<void> {
  const hashed = await hashPin(newPin);
  localStorage.setItem(KEYS.adminPin, hashed);
}

// --- Export / Import ---

export function exportData(): string {
  return JSON.stringify({
    products: loadProducts(),
    boxTemplates: loadBoxTemplates(),
    orders: loadOrders(),
    settings: loadSettings(),
  }, null, 2);
}

export function importData(json: string): void {
  const data = JSON.parse(json);
  if (!data || typeof data !== 'object') throw new Error('Formato inválido');
  if (data.products && typeof data.products === 'object' && !Array.isArray(data.products)) saveProducts(data.products);
  if (data.boxTemplates && Array.isArray(data.boxTemplates)) saveBoxTemplates(data.boxTemplates);
  if (data.orders && Array.isArray(data.orders)) saveOrders(data.orders);
  if (data.settings && typeof data.settings === 'object' && !Array.isArray(data.settings)) saveSettings(data.settings);
}

export function resetToDefaults(): void {
  saveProducts({ ...PRODUCTS });
  saveBoxTemplates([...BOX_TEMPLATES]);
  saveSettings({ ...DEFAULT_SETTINGS });
}
