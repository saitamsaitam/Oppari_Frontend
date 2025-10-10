// src/types/Product.ts

// (?) tell TypeScript they may be undefined.
export interface Product {
  id: number;
  name: string;
  quantity: number;
  expirationDate: string; // or Date if parsed
  price: number;
  category: string | { name: string }; // support both string and object
  leftovers?: number;
  dateOfPurchase?: string;
  opened: boolean;
}
