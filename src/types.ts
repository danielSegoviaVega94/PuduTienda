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
