export interface Product {
  id: string;
  name: string;
  category: 'verdura' | 'fruta' | 'extra';
  unit: string;
  step: number;
  basePrice: number;
  isSwappable: boolean;
  inSeason: boolean;
  imageUrl: string;
  tags: string[];
}

export interface BoxItem {
  productId: string;
  defaultQty: number;
  locked: boolean;
}

export interface BoxTemplate {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  baseItems: BoxItem[];
}

export interface CartItem {
  product: Product;
  qty: number;
}

// --- Admin / Order System ---

export type OrderStatus = 'pendiente' | 'confirmado' | 'preparando' | 'enviado' | 'entregado' | 'cancelado';

export interface OrderItem {
  productId: string;
  productName: string;
  qty: number;
  unit: string;
  unitPrice: number;
  isExtra: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  boxTemplateId: string;
  boxTemplateName: string;
  boxBasePrice: number;
  items: OrderItem[];
  extrasTotal: number;
  priceDifference: number;
  totalPrice: number;
  customerNote: string;
}

export interface BusinessSettings {
  businessName: string;
  whatsappPhone: string;
  heroImageUrl: string;
  footerTagline: string;
}
